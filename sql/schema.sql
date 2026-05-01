-- ============================================================
-- Re-Mmogo Motshelo Management System
-- SQL Server Database Schema
-- INFS 202 Group Project
-- ============================================================

-- Drop tables in reverse dependency order (for clean resets)
IF OBJECT_ID('dbo.PaymentApprovals',  'U') IS NOT NULL DROP TABLE dbo.PaymentApprovals;
IF OBJECT_ID('dbo.LoanApprovals',     'U') IS NOT NULL DROP TABLE dbo.LoanApprovals;
IF OBJECT_ID('dbo.Payments',          'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID('dbo.Loans',             'U') IS NOT NULL DROP TABLE dbo.Loans;
IF OBJECT_ID('dbo.Contributions',     'U') IS NOT NULL DROP TABLE dbo.Contributions;
IF OBJECT_ID('dbo.GroupMembers',      'U') IS NOT NULL DROP TABLE dbo.GroupMembers;
IF OBJECT_ID('dbo.Members',           'U') IS NOT NULL DROP TABLE dbo.Members;
IF OBJECT_ID('dbo.MotsheloGroups',    'U') IS NOT NULL DROP TABLE dbo.MotsheloGroups;
GO

-- ── MotsheloGroups ────────────────────────────────────────
-- Stores each registered motshelo group
CREATE TABLE dbo.MotsheloGroups (
    id              INT           IDENTITY(1,1) PRIMARY KEY,
    name            NVARCHAR(100) NOT NULL UNIQUE,
    description     NVARCHAR(500),
    -- Business rules (configurable per group)
    monthly_contribution DECIMAL(10,2) NOT NULL DEFAULT 1000.00,  -- P1000/month
    loan_interest_rate   DECIMAL(5,2)  NOT NULL DEFAULT 20.00,    -- 20% per month
    interest_target      DECIMAL(10,2) NOT NULL DEFAULT 5000.00,  -- P5000 per member per year
    year_end_date        DATE,
    is_active       BIT           NOT NULL DEFAULT 1,
    created_at      DATETIME2     NOT NULL DEFAULT GETDATE()
);
GO

-- ── Members ───────────────────────────────────────────────
-- All registered users of the system
CREATE TABLE dbo.Members (
    id              INT           IDENTITY(1,1) PRIMARY KEY,
    full_name       NVARCHAR(100) NOT NULL,
    email           NVARCHAR(150) NOT NULL UNIQUE,
    phone           NVARCHAR(20),
    password_hash   NVARCHAR(255) NOT NULL,              -- bcrypt hash
    national_id     NVARCHAR(20),
    role            NVARCHAR(20)  NOT NULL DEFAULT 'member'
                    CHECK (role IN ('member', 'signatory', 'admin')),
    is_active       BIT           NOT NULL DEFAULT 1,
    created_at      DATETIME2     NOT NULL DEFAULT GETDATE()
);
GO

-- ── GroupMembers ──────────────────────────────────────────
-- Junction table: which members belong to which group
-- Also tracks signatory status within a group
CREATE TABLE dbo.GroupMembers (
    id              INT       IDENTITY(1,1) PRIMARY KEY,
    group_id        INT       NOT NULL REFERENCES dbo.MotsheloGroups(id) ON DELETE CASCADE,
    member_id       INT       NOT NULL REFERENCES dbo.Members(id)        ON DELETE CASCADE,
    is_signatory    BIT       NOT NULL DEFAULT 0,        -- signatories approve loans & payments
    joined_at       DATETIME2 NOT NULL DEFAULT GETDATE(),
    -- Each member can only appear once per group
    CONSTRAINT UQ_GroupMember UNIQUE (group_id, member_id)
);
GO

-- ── Contributions ─────────────────────────────────────────
-- Monthly P1000 contributions from each member
CREATE TABLE dbo.Contributions (
    id              INT           IDENTITY(1,1) PRIMARY KEY,
    group_id        INT           NOT NULL REFERENCES dbo.MotsheloGroups(id),
    member_id       INT           NOT NULL REFERENCES dbo.Members(id),
    amount          DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    contribution_month DATE       NOT NULL,              -- which month this is for (YYYY-MM-01)
    status          NVARCHAR(20)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected')),
    proof_of_payment NVARCHAR(500),                      -- optional file URL
    submitted_at    DATETIME2     NOT NULL DEFAULT GETDATE(),
    -- One contribution record per member per month per group
    CONSTRAINT UQ_Contribution UNIQUE (group_id, member_id, contribution_month)
);
GO

-- ── Loans ─────────────────────────────────────────────────
-- Loans taken by members from the group pool
CREATE TABLE dbo.Loans (
    id              INT           IDENTITY(1,1) PRIMARY KEY,
    group_id        INT           NOT NULL REFERENCES dbo.MotsheloGroups(id),
    member_id       INT           NOT NULL REFERENCES dbo.Members(id),
    principal       DECIMAL(10,2) NOT NULL,              -- amount borrowed
    interest_rate   DECIMAL(5,2)  NOT NULL DEFAULT 20.00, -- 20% per month
    outstanding_balance DECIMAL(10,2) NOT NULL,          -- updated as payments come in
    status          NVARCHAR(20)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'settled')),
    -- Approval tracking (needs 2 signatories)
    approvals_count INT           NOT NULL DEFAULT 0,
    requested_at    DATETIME2     NOT NULL DEFAULT GETDATE(),
    approved_at     DATETIME2,
    disbursed_at    DATETIME2,
    settled_at      DATETIME2,
    notes           NVARCHAR(500)
);
GO

-- ── LoanApprovals ─────────────────────────────────────────
-- Tracks which signatories approved each loan
CREATE TABLE dbo.LoanApprovals (
    id              INT          IDENTITY(1,1) PRIMARY KEY,
    loan_id         INT          NOT NULL REFERENCES dbo.Loans(id) ON DELETE CASCADE,
    signatory_id    INT          NOT NULL REFERENCES dbo.Members(id),
    decision        NVARCHAR(10) NOT NULL CHECK (decision IN ('approved', 'rejected')),
    notes           NVARCHAR(300),
    decided_at      DATETIME2    NOT NULL DEFAULT GETDATE(),
    -- Each signatory can only vote once per loan
    CONSTRAINT UQ_LoanApproval UNIQUE (loan_id, signatory_id)
);
GO

-- ── Payments ──────────────────────────────────────────────
-- Loan repayment payments made by members
CREATE TABLE dbo.Payments (
    id              INT           IDENTITY(1,1) PRIMARY KEY,
    loan_id         INT           NOT NULL REFERENCES dbo.Loans(id),
    member_id       INT           NOT NULL REFERENCES dbo.Members(id),
    amount          DECIMAL(10,2) NOT NULL,
    payment_month   DATE          NOT NULL,              -- which month this repayment covers
    status          NVARCHAR(20)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected')),
    proof_of_payment NVARCHAR(500),                      -- optional file URL
    submitted_at    DATETIME2     NOT NULL DEFAULT GETDATE(),
    approved_at     DATETIME2
);
GO

-- ── PaymentApprovals ──────────────────────────────────────
-- Tracks which signatories approved each loan payment
CREATE TABLE dbo.PaymentApprovals (
    id              INT          IDENTITY(1,1) PRIMARY KEY,
    payment_id      INT          NOT NULL REFERENCES dbo.Payments(id) ON DELETE CASCADE,
    signatory_id    INT          NOT NULL REFERENCES dbo.Members(id),
    decision        NVARCHAR(10) NOT NULL CHECK (decision IN ('approved', 'rejected')),
    notes           NVARCHAR(300),
    decided_at      DATETIME2    NOT NULL DEFAULT GETDATE(),
    -- Each signatory can only vote once per payment
    CONSTRAINT UQ_PaymentApproval UNIQUE (payment_id, signatory_id)
);
GO

-- ============================================================
-- INDEXES — for fast query performance
-- ============================================================
CREATE INDEX IX_GroupMembers_GroupId    ON dbo.GroupMembers  (group_id);
CREATE INDEX IX_GroupMembers_MemberId   ON dbo.GroupMembers  (member_id);
CREATE INDEX IX_Contributions_GroupId   ON dbo.Contributions (group_id);
CREATE INDEX IX_Contributions_MemberId  ON dbo.Contributions (member_id);
CREATE INDEX IX_Contributions_Month     ON dbo.Contributions (contribution_month);
CREATE INDEX IX_Loans_GroupId           ON dbo.Loans         (group_id);
CREATE INDEX IX_Loans_MemberId          ON dbo.Loans         (member_id);
CREATE INDEX IX_Loans_Status            ON dbo.Loans         (status);
CREATE INDEX IX_Payments_LoanId         ON dbo.Payments      (loan_id);
CREATE INDEX IX_Payments_MemberId       ON dbo.Payments      (member_id);
CREATE INDEX IX_Members_Email           ON dbo.Members       (email);
GO

-- ============================================================
-- VIEWS — useful for reports and dashboard queries
-- ============================================================

-- Member balance summary (contributions paid vs target)
CREATE OR ALTER VIEW dbo.vw_MemberContributionSummary AS
SELECT
    gm.group_id,
    m.id            AS member_id,
    m.full_name,
    m.email,
    gm.is_signatory,
    COUNT(c.id)                          AS months_contributed,
    COALESCE(SUM(c.amount), 0)           AS total_contributed,
    g.monthly_contribution * 12          AS annual_target,
    g.monthly_contribution * 12
        - COALESCE(SUM(c.amount), 0)     AS amount_remaining
FROM dbo.GroupMembers gm
JOIN dbo.Members       m ON m.id = gm.member_id
JOIN dbo.MotsheloGroups g ON g.id = gm.group_id
LEFT JOIN dbo.Contributions c
    ON c.member_id = gm.member_id
    AND c.group_id = gm.group_id
    AND c.status   = 'approved'
GROUP BY gm.group_id, m.id, m.full_name, m.email, gm.is_signatory,
         g.monthly_contribution;
GO

-- Loan summary per member
CREATE OR ALTER VIEW dbo.vw_LoanSummary AS
SELECT
    l.id            AS loan_id,
    l.group_id,
    l.member_id,
    m.full_name     AS borrower_name,
    l.principal,
    l.interest_rate,
    l.outstanding_balance,
    l.status,
    l.approvals_count,
    l.requested_at,
    l.approved_at,
    l.disbursed_at,
    COALESCE(SUM(p.amount), 0) AS total_repaid
FROM dbo.Loans l
JOIN dbo.Members m ON m.id = l.member_id
LEFT JOIN dbo.Payments p
    ON p.loan_id = l.id
    AND p.status = 'approved'
GROUP BY l.id, l.group_id, l.member_id, m.full_name, l.principal,
         l.interest_rate, l.outstanding_balance, l.status,
         l.approvals_count, l.requested_at, l.approved_at, l.disbursed_at;
GO

-- Year-end report: interest generated per member
CREATE OR ALTER VIEW dbo.vw_YearEndReport AS
SELECT
    gm.group_id,
    g.name           AS group_name,
    m.id             AS member_id,
    m.full_name,
    -- Loan interest generated by this member's loans
    COALESCE(SUM(
        CASE WHEN l.status IN ('active','settled')
        THEN l.principal * (l.interest_rate / 100)
        ELSE 0 END
    ), 0)            AS interest_generated,
    g.interest_target,
    -- Contributions
    COALESCE(SUM(DISTINCT c_sum.total), 0) AS total_contributed,
    -- Year-end payout estimate (total pool / members)
    NULL             AS estimated_payout        -- calculated in app layer
FROM dbo.GroupMembers gm
JOIN dbo.Members        m ON m.id  = gm.member_id
JOIN dbo.MotsheloGroups g ON g.id  = gm.group_id
LEFT JOIN dbo.Loans     l ON l.member_id = gm.member_id AND l.group_id = gm.group_id
LEFT JOIN (
    SELECT member_id, group_id, SUM(amount) AS total
    FROM dbo.Contributions
    WHERE status = 'approved'
    GROUP BY member_id, group_id
) c_sum ON c_sum.member_id = gm.member_id AND c_sum.group_id = gm.group_id
GROUP BY gm.group_id, g.name, m.id, m.full_name, g.interest_target;
GO

-- ============================================================
-- SEED DATA — sample group and members for testing
-- ============================================================

-- Sample group
INSERT INTO dbo.MotsheloGroups (name, description, year_end_date)
VALUES ('Thusano Motshelo', 'A sample savings group for testing', '2025-12-31');

-- Sample members (passwords are bcrypt of 'Password123')
INSERT INTO dbo.Members (full_name, email, phone, password_hash, national_id, role) VALUES
('Admin User',      'admin@remmogo.com',   '+267 71 000 001', '$2b$10$examplehashADMIN',   '123456789', 'admin'),
('Signatory One',   'sig1@remmogo.com',    '+267 71 000 002', '$2b$10$examplehashSIG1',    '223456789', 'signatory'),
('Signatory Two',   'sig2@remmogo.com',    '+267 71 000 003', '$2b$10$examplehashSIG2',    '323456789', 'signatory'),
('Amara Diallo',    'amara@remmogo.com',   '+267 71 111 111', '$2b$10$examplehashAMARA',   '423456789', 'member'),
('Kgosi Morapedi',  'kgosi@remmogo.com',   '+267 72 222 222', '$2b$10$examplehashKGOSI',   '523456789', 'member'),
('Tebogo Sekgoma',  'tebogo@remmogo.com',  '+267 73 333 333', '$2b$10$examplehashTEBOGO',  '623456789', 'member');

-- Enroll all members into the group
INSERT INTO dbo.GroupMembers (group_id, member_id, is_signatory)
SELECT 1, id,
    CASE WHEN role = 'signatory' THEN 1 ELSE 0 END
FROM dbo.Members;
GO

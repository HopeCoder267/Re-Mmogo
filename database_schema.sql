-- RE-MMOGO PostgreSQL Database Schema
-- Complete setup script for moving from mock data to PostgreSQL
-- Ensures consistent data types and relationships throughout the application

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- ENUM TYPES FOR CONSISTENT VALUES
-- ========================================

-- Member roles
CREATE TYPE member_role AS ENUM ('Member', 'Signatory', 'Treasurer');

-- Signatory approval status
CREATE TYPE signatory_status AS ENUM ('approved', 'pending', 'rejected');

-- Loan status
CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'completed', 'defaulted');

-- Contribution and repayment status
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'rejected');

-- ========================================
-- CORE TABLES
-- ========================================

-- Groups table - Main entity for savings groups
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    max_members INTEGER NOT NULL DEFAULT 10,
    monthly_contribution DECIMAL(12,2) NOT NULL DEFAULT 1000.00,
    target_goal_per_member DECIMAL(12,2) NOT NULL DEFAULT 5000.00,
    interest_rate DECIMAL(5,4) NOT NULL DEFAULT 0.2000, -- 20% monthly interest rate
    target_interest_per_member DECIMAL(12,2) NOT NULL DEFAULT 5000.00,
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Members table - Core member information
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    id_number VARCHAR(50) UNIQUE NOT NULL,
    occupation VARCHAR(255),
    monthly_income DECIMAL(12,2),
    contribution_day VARCHAR(20) NOT NULL, -- "1st", "5th", "10th", etc.
    role member_role NOT NULL DEFAULT 'Member',
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    monthly_paid BOOLEAN NOT NULL DEFAULT false,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    signatory_status signatory_status DEFAULT 'pending',
    balance DECIMAL(12,2) DEFAULT 0.00,
    total_contributed DECIMAL(12,2) DEFAULT 0.00,
    interest_earned DECIMAL(12,2) DEFAULT 0.00,
    date_joined DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group signatories relationship table
CREATE TABLE group_signatories (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    appointed_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(group_id, member_id)
);

-- Group treasurer relationship table
CREATE TABLE group_treasurers (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    appointed_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(group_id, member_id)
);

-- ========================================
-- FINANCIAL TRANSACTIONS
-- ========================================

-- Loans table
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    repayment_months INTEGER NOT NULL,
    interest_rate DECIMAL(5,4) NOT NULL DEFAULT 0.2000, -- 20% monthly interest rate
    monthly_payment DECIMAL(12,2) NOT NULL,
    total_repayment DECIMAL(12,2) NOT NULL,
    remaining_balance DECIMAL(12,2) NOT NULL,
    status loan_status NOT NULL DEFAULT 'pending',
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    approval_date DATE,
    disbursement_date DATE,
    due_date DATE,
    completed_date DATE,
    notes TEXT,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contributions table
CREATE TABLE contributions (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    contribution_date DATE NOT NULL,
    payment_date DATE NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    proof_of_payment VARCHAR(500), -- File path or URL
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan repayments table
CREATE TABLE loan_repayments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    proof_of_payment VARCHAR(500), -- File path or URL
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- APPROVAL SYSTEM
-- ========================================

-- Signatory approvals for loans
CREATE TABLE loan_signatory_approvals (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    signatory_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    approved BOOLEAN NOT NULL DEFAULT false,
    approval_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(loan_id, signatory_id)
);

-- Signatory approvals for contributions
CREATE TABLE contribution_signatory_approvals (
    id SERIAL PRIMARY KEY,
    contribution_id INTEGER NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
    signatory_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    approved BOOLEAN NOT NULL DEFAULT false,
    approval_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contribution_id, signatory_id)
);

-- Signatory approvals for loan repayments
CREATE TABLE repayment_signatory_approvals (
    id SERIAL PRIMARY KEY,
    repayment_id INTEGER NOT NULL REFERENCES loan_repayments(id) ON DELETE CASCADE,
    signatory_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    approved BOOLEAN NOT NULL DEFAULT false,
    approval_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(repayment_id, signatory_id)
);

-- ========================================
-- REPORTING AND ANALYTICS
-- ========================================

-- Year-end reports table
CREATE TABLE year_end_reports (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    total_pool DECIMAL(12,2) NOT NULL,
    total_contributions DECIMAL(12,2) NOT NULL,
    total_loans_disbursed DECIMAL(12,2) NOT NULL,
    total_interest_earned DECIMAL(12,2) NOT NULL,
    generated_date DATE DEFAULT CURRENT_DATE,
    generated_by INTEGER REFERENCES members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, group_id)
);

-- Member year-end reports
CREATE TABLE member_year_end_reports (
    id SERIAL PRIMARY KEY,
    year_end_report_id INTEGER NOT NULL REFERENCES year_end_reports(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    total_contributed DECIMAL(12,2) NOT NULL,
    total_interest_earned DECIMAL(12,2) NOT NULL,
    total_borrowed DECIMAL(12,2) NOT NULL,
    total_repaid DECIMAL(12,2) NOT NULL,
    outstanding_balance DECIMAL(12,2) NOT NULL,
    net_return DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year_end_report_id, member_id)
);

-- ========================================
-- SYSTEM CONFIGURATION
-- ========================================

-- Application configuration
CREATE TABLE app_config (
    id SERIAL PRIMARY KEY,
    app_name VARCHAR(255) NOT NULL DEFAULT 'RE-MMOGO',
    primary_color VARCHAR(7) DEFAULT '#1e1b4b',
    success_color VARCHAR(7) DEFAULT '#10b981',
    pending_color VARCHAR(7) DEFAULT '#f59e0b',
    min_loan_amount DECIMAL(12,2) DEFAULT 500.00,
    max_loan_percentage DECIMAL(5,2) DEFAULT 50.00, -- Percentage of total pool
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Members indexes
CREATE INDEX idx_members_group_id ON members(group_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_id_number ON members(id_number);
CREATE INDEX idx_members_is_active ON members(is_active);

-- Groups indexes
CREATE INDEX idx_groups_is_active ON groups(is_active);

-- Loans indexes
CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_group_id ON loans(group_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_application_date ON loans(application_date);

-- Contributions indexes
CREATE INDEX idx_contributions_member_id ON contributions(member_id);
CREATE INDEX idx_contributions_group_id ON contributions(group_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_contribution_date ON contributions(contribution_date);

-- Loan repayments indexes
CREATE INDEX idx_loan_repayments_loan_id ON loan_repayments(loan_id);
CREATE INDEX idx_loan_repayments_member_id ON loan_repayments(member_id);
CREATE INDEX idx_loan_repayments_group_id ON loan_repayments(group_id);
CREATE INDEX idx_loan_repayments_status ON loan_repayments(status);

-- Approval indexes
CREATE INDEX idx_loan_signatory_approvals_loan_id ON loan_signatory_approvals(loan_id);
CREATE INDEX idx_loan_signatory_approvals_signatory_id ON loan_signatory_approvals(signatory_id);
CREATE INDEX idx_contribution_signatory_approvals_contribution_id ON contribution_signatory_approvals(contribution_id);
CREATE INDEX idx_contribution_signatory_approvals_signatory_id ON contribution_signatory_approvals(signatory_id);
CREATE INDEX idx_repayment_signatory_approvals_repayment_id ON repayment_signatory_approvals(repayment_id);
CREATE INDEX idx_repayment_signatory_approvals_signatory_id ON repayment_signatory_approvals(signatory_id);

-- ========================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON contributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_repayments_updated_at BEFORE UPDATE ON loan_repayments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON app_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Member summary view
CREATE VIEW member_summary AS
SELECT 
    m.id,
    m.full_name,
    m.email,
    m.phone,
    m.role,
    m.balance,
    m.total_contributed,
    m.interest_earned,
    m.progress_percent,
    m.monthly_paid,
    m.signatory_status,
    m.is_active,
    g.name as group_name,
    g.monthly_contribution as group_monthly_contribution
FROM members m
JOIN groups g ON m.group_id = g.id;

-- Loan summary view
CREATE VIEW loan_summary AS
SELECT 
    l.id,
    l.amount,
    l.purpose,
    l.status,
    l.application_date,
    l.remaining_balance,
    l.monthly_payment,
    l.total_repayment,
    m.full_name as member_name,
    g.name as group_name
FROM loans l
JOIN members m ON l.member_id = m.id
JOIN groups g ON l.group_id = g.id;

-- Group financial summary view
CREATE VIEW group_financial_summary AS
SELECT 
    g.id,
    g.name,
    g.monthly_contribution,
    COUNT(DISTINCT m.id) as member_count,
    COALESCE(SUM(m.balance), 0) as total_pool,
    COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.remaining_balance ELSE 0 END), 0) as active_loans_balance,
    COALESCE(SUM(CASE WHEN c.status = 'approved' THEN c.amount ELSE 0 END), 0) as total_approved_contributions,
    COUNT(DISTINCT CASE WHEN l.status = 'active' THEN l.id END) as active_loans_count
FROM groups g
LEFT JOIN members m ON g.id = m.group_id AND m.is_active = true
LEFT JOIN loans l ON g.id = l.group_id
LEFT JOIN contributions c ON g.id = c.group_id
WHERE g.is_active = true
GROUP BY g.id, g.name, g.monthly_contribution;

-- ========================================
-- CONSTRAINTS AND VALIDATIONS
-- ========================================

-- Check constraints for positive values
ALTER TABLE groups ADD CONSTRAINT chk_monthly_contribution_positive CHECK (monthly_contribution > 0);
ALTER TABLE groups ADD CONSTRAINT chk_target_goal_per_member_positive CHECK (target_goal_per_member > 0);
ALTER TABLE groups ADD CONSTRAINT chk_interest_rate_positive CHECK (interest_rate >= 0);
ALTER TABLE members ADD CONSTRAINT chk_monthly_income_positive CHECK (monthly_income IS NULL OR monthly_income > 0);
ALTER TABLE members ADD CONSTRAINT chk_progress_percent_range CHECK (progress_percent >= 0 AND progress_percent <= 100);
ALTER TABLE loans ADD CONSTRAINT chk_loan_amount_positive CHECK (amount > 0);
ALTER TABLE loans ADD CONSTRAINT chk_repayment_months_positive CHECK (repayment_months > 0);
ALTER TABLE loans ADD CONSTRAINT chk_monthly_payment_positive CHECK (monthly_payment > 0);
ALTER TABLE contributions ADD CONSTRAINT chk_contribution_amount_positive CHECK (amount > 0);
ALTER TABLE loan_repayments ADD CONSTRAINT chk_repayment_amount_positive CHECK (amount > 0);

-- ========================================
-- INITIAL DATA SETUP
-- ========================================

-- Insert default app configuration
INSERT INTO app_config (app_name, primary_color, success_color, pending_color) 
VALUES ('RE-MMOGO', '#1e1b4b', '#10b981', '#f59e0b');

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Note: This section can be uncommented for testing purposes
-- In production, you would use proper migration scripts

/*
-- Sample group
INSERT INTO groups (id, name, description, max_members, monthly_contribution, target_goal_per_member, interest_rate, target_interest_per_member, created_date)
VALUES 
(1, 'Hope Coders Savings Group', 'A community savings group for financial growth and mutual support', 10, 1000.00, 5000.00, 0.2000, 5000.00, '2024-01-01');

-- Sample members
INSERT INTO members (id, full_name, email, phone, id_number, occupation, monthly_income, contribution_day, role, emergency_contact_name, emergency_contact_phone, monthly_paid, progress_percent, signatory_status, balance, total_contributed, interest_earned, date_joined, is_active, group_id)
VALUES 
(1, 'Hope Kenosi', 'hope.kenosi@example.com', '+267 71234567', '123456789', 'Software Developer', 15000.00, '1st', 'Member', 'Emergency Contact', '+267 71111111', true, 75, 'approved', 25000.00, 15000.00, 750.00, '2024-01-01', true, 1),
(2, 'Eugune Member', 'eugune@example.com', '+267 72345678', '234567890', 'Teacher', 12000.00, '5th', 'Signatory', 'Mary Member', '+267 72222222', false, 60, 'pending', 12000.00, 8000.00, 400.00, '2024-02-15', true, 1),
(3, 'Bokao Member', 'bokao@example.com', '+267 73456789', '345678901', 'Nurse', 14000.00, '10th', 'Signatory', 'Mary Member', '+267 72222222', false, 80, 'approved', 18000.00, 12000.00, 800.00, '2024-03-01', true, 1);

-- Set up group signatories
INSERT INTO group_signatories (group_id, member_id)
VALUES 
(1, 1),
(1, 2);

-- Set up group treasurer
INSERT INTO group_treasurers (group_id, member_id)
VALUES (1, 3);
*/

-- ========================================
-- SECURITY AND PERMISSIONS
-- ========================================

-- Create roles for different user types (optional, uncomment if needed)
/*
CREATE ROLE app_read;
CREATE ROLE app_write;
CREATE ROLE app_admin;

-- Grant permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_read;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_write;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
*/

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

-- Database schema setup complete
-- All tables, indexes, views, triggers, and constraints have been created
-- The schema supports all features from the mock data with proper data types and relationships

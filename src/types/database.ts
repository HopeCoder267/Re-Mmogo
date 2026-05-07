// Database types that map directly to PostgreSQL schema
// These types ensure consistency between frontend and backend

// ========================================
// ENUM TYPES
// ========================================

export type MemberRole = 'Member' | 'Signatory' | 'Treasurer';
export type SignatoryStatus = 'approved' | 'pending' | 'rejected';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

// ========================================
// CORE DATABASE ENTITIES
// ========================================

export interface Group {
    id: number;
    name: string;
    description?: string;
    max_members: number;
    monthly_contribution: number;
    target_goal_per_member: number;
    interest_rate: number; // Decimal (5,4) - e.g., 0.2000 for 20%
    target_interest_per_member: number;
    created_date: string; // Date string in YYYY-MM-DD format
    is_active: boolean;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
}

export interface Member {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    id_number: string;
    occupation?: string;
    monthly_income?: number;
    contribution_day: string; // "1st", "5th", "10th", etc.
    role: MemberRole;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    monthly_paid: boolean;
    progress_percent: number; // 0-100
    signatory_status?: SignatoryStatus;
    balance: number;
    total_contributed: number;
    interest_earned: number;
    date_joined: string; // Date string in YYYY-MM-DD format
    is_active: boolean;
    group_id: number;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
}

export interface GroupSignatory {
    id: number;
    group_id: number;
    member_id: number;
    appointed_date: string; // Date string in YYYY-MM-DD format
    is_active: boolean;
}

export interface GroupTreasurer {
    id: number;
    group_id: number;
    member_id: number;
    appointed_date: string; // Date string in YYYY-MM-DD format
    is_active: boolean;
}

// ========================================
// FINANCIAL ENTITIES
// ========================================

export interface Loan {
    id: number;
    member_id: number;
    amount: number;
    purpose: string;
    repayment_months: number;
    interest_rate: number; // Decimal (5,4) - e.g., 0.2000 for 20%
    monthly_payment: number;
    total_repayment: number;
    remaining_balance: number;
    status: LoanStatus;
    application_date: string; // Date string in YYYY-MM-DD format
    approval_date?: string; // Date string in YYYY-MM-DD format
    disbursement_date?: string; // Date string in YYYY-MM-DD format
    due_date?: string; // Date string in YYYY-MM-DD format
    completed_date?: string; // Date string in YYYY-MM-DD format
    notes?: string;
    group_id: number;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
}

export interface Contribution {
    id: number;
    member_id: number;
    amount: number;
    contribution_date: string; // Date string in YYYY-MM-DD format
    payment_date: string; // Date string in YYYY-MM-DD format
    status: TransactionStatus;
    proof_of_payment?: string; // File path or URL
    group_id: number;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
}

export interface LoanRepayment {
    id: number;
    loan_id: number;
    member_id: number;
    amount: number;
    payment_date: string; // Date string in YYYY-MM-DD format
    status: TransactionStatus;
    proof_of_payment?: string; // File path or URL
    group_id: number;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
}

// ========================================
// APPROVAL SYSTEM
// ========================================

export interface SignatoryApproval {
    id: number;
    approved: boolean;
    approval_date?: string; // ISO timestamp
    notes?: string;
    created_at: string; // ISO timestamp
}

export interface LoanSignatoryApproval extends SignatoryApproval {
    loan_id: number;
    signatory_id: number;
}

export interface ContributionSignatoryApproval extends SignatoryApproval {
    contribution_id: number;
    signatory_id: number;
}

export interface RepaymentSignatoryApproval extends SignatoryApproval {
    repayment_id: number;
    signatory_id: number;
}

// ========================================
// REPORTING ENTITIES
// ========================================

export interface YearEndReport {
    id: number;
    year: number;
    group_id: number;
    total_pool: number;
    total_contributions: number;
    total_loans_disbursed: number;
    total_interest_earned: number;
    generated_date: string; // Date string in YYYY-MM-DD format
    generated_by?: number; // Member ID
    created_at: string; // ISO timestamp
}

export interface MemberYearEndReport {
    id: number;
    year_end_report_id: number;
    member_id: number;
    total_contributed: number;
    total_interest_earned: number;
    total_borrowed: number;
    total_repaid: number;
    outstanding_balance: number;
    net_return: number;
    created_at: string; // ISO timestamp
}

// ========================================
// SYSTEM CONFIGURATION
// ========================================

export interface AppConfig {
    id: number;
    app_name: string;
    primary_color: string; // Hex color
    success_color: string; // Hex color
    pending_color: string; // Hex color
    min_loan_amount: number;
    max_loan_percentage: number; // Percentage of total pool
    updated_at: string; // ISO timestamp
}

// ========================================
// VIEW ENTITIES (For reporting and summaries)
// ========================================

export interface MemberSummary {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    role: MemberRole;
    balance: number;
    total_contributed: number;
    interest_earned: number;
    progress_percent: number;
    monthly_paid: boolean;
    signatory_status?: SignatoryStatus;
    is_active: boolean;
    group_name: string;
    group_monthly_contribution: number;
}

export interface LoanSummary {
    id: number;
    amount: number;
    purpose: string;
    status: LoanStatus;
    application_date: string; // Date string in YYYY-MM-DD format
    remaining_balance: number;
    monthly_payment: number;
    total_repayment: number;
    member_name: string;
    group_name: string;
}

export interface GroupFinancialSummary {
    id: number;
    name: string;
    monthly_contribution: number;
    member_count: number;
    total_pool: number;
    active_loans_balance: number;
    total_approved_contributions: number;
    active_loans_count: number;
}

// ========================================
// API REQUEST/RESPONSE TYPES
// ========================================

// Request types for API endpoints
export interface CreateGroupRequest {
    name: string;
    description?: string;
    max_members: number;
    monthly_contribution: number;
    target_goal_per_member: number;
    interest_rate: number;
    target_interest_per_member: number;
}

export interface UpdateGroupRequest {
    name?: string;
    description?: string;
    max_members?: number;
    monthly_contribution?: number;
    target_goal_per_member?: number;
    interest_rate?: number;
    target_interest_per_member?: number;
    is_active?: boolean;
}

export interface CreateMemberRequest {
    full_name: string;
    email: string;
    phone: string;
    id_number: string;
    occupation?: string;
    monthly_income?: number;
    contribution_day: string;
    role: MemberRole;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    group_id: number;
}

export interface UpdateMemberRequest {
    full_name?: string;
    email?: string;
    phone?: string;
    occupation?: string;
    monthly_income?: number;
    contribution_day?: string;
    role?: MemberRole;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    is_active?: boolean;
}

export interface CreateLoanRequest {
    member_id: number;
    amount: number;
    purpose: string;
    repayment_months: number;
    notes?: string;
}

export interface UpdateLoanRequest {
    amount?: number;
    purpose?: string;
    repayment_months?: number;
    status?: LoanStatus;
    notes?: string;
}

export interface CreateContributionRequest {
    member_id: number;
    amount: number;
    contribution_date: string;
    payment_date: string;
    proof_of_payment?: string;
}

export interface CreateLoanRepaymentRequest {
    loan_id: number;
    member_id: number;
    amount: number;
    payment_date: string;
    proof_of_payment?: string;
}

export interface SignatoryApprovalRequest {
    approved: boolean;
    notes?: string;
}

// Response types for API endpoints
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// ========================================
// DATABASE QUERY TYPES
// ========================================

export interface DatabaseQuery {
    sql: string;
    params?: any[];
}

export interface TransactionResult {
    success: boolean;
    affectedRows?: number;
    insertId?: number;
    error?: string;
}

// ========================================
// MIGRATION TYPES
// ========================================

export interface Migration {
    id: string;
    name: string;
    up: string; // SQL to run for upgrade
    down: string; // SQL to run for rollback
    created_at: string; // ISO timestamp
}

// ========================================
// UTILITY TYPES
// ========================================

export type OmitId<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type CreateEntity<T> = OmitId<T>;
export type UpdateEntity<T> = Partial<OmitId<T>>;

// Type guards for validation
export const isValidMemberRole = (role: string): role is MemberRole => {
    return ['Member', 'Signatory', 'Treasurer'].includes(role);
};

export const isValidSignatoryStatus = (status: string): status is SignatoryStatus => {
    return ['approved', 'pending', 'rejected'].includes(status);
};

export const isValidLoanStatus = (status: string): status is LoanStatus => {
    return ['pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'].includes(status);
};

export const isValidTransactionStatus = (status: string): status is TransactionStatus => {
    return ['pending', 'approved', 'rejected'].includes(status);
};

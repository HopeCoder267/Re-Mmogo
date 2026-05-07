// Centralized type definitions for RE-MMOGO application

// Core entity types
export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  occupation: string;
  monthlyIncome: number;
  contributionDay: string;
  role: 'Member' | 'Signatory' | 'Treasurer';
  emergencyContactName: string;
  emergencyContactPhone: string;
  monthlyPaid: boolean;
  progressPercent: number;
  signatoryStatus?: 'approved' | 'pending' | 'rejected';
  balance?: number;
  totalContributed?: number;
  interestEarned?: number;
  dateJoined?: string;
  isActive: boolean;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  maxMembers: number;
  monthlyContribution: number;
  targetGoalPerMember: number;
  interestRate: number; // Monthly interest rate (as decimal, e.g., 0.20 for 20%)
  targetInterestPerMember: number;
  createdDate: string;
  isActive: boolean;
  signatories: number[]; // Member IDs of signatories
  treasurer: number; // Member ID of treasurer
}

export interface Loan {
  id: number;
  memberId: number;
  amount: number;
  purpose: string;
  repaymentMonths: number;
  interestRate: number; // Monthly interest rate
  monthlyPayment: number;
  totalRepayment: number;
  remainingBalance: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  dueDate?: string;
  completedDate?: string;
  notes: string;
  signatoryApprovals: {
    signatoryId: number;
    approved: boolean;
    approvalDate?: string;
  }[];
}

export interface Contribution {
  id: number;
  memberId: number;
  amount: number;
  contributionDate: string;
  paymentDate: string;
  status: 'pending' | 'approved' | 'rejected';
  proofOfPayment?: string; // File path or URL
  signatoryApprovals: {
    signatoryId: number;
    approved: boolean;
    approvalDate?: string;
  }[];
}

export interface LoanRepayment {
  id: number;
  loanId: number;
  memberId: number;
  amount: number;
  paymentDate: string;
  status: 'pending' | 'approved' | 'rejected';
  proofOfPayment?: string; // File path or URL
  signatoryApprovals: {
    signatoryId: number;
    approved: boolean;
    approvalDate?: string;
  }[];
}

// UI Component types
export interface SummaryCard {
  id: number;
  label: string;
  value: string;
  icon: string;
}

export interface ActionButton {
  id: number;
  label: string;
  icon: string;
  feature: string;
  route?: string;
}

// Form types
export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface EnrollFormData {
  fullName: string;
  phone: string;
  idNumber: string;
  email: string;
  occupation: string;
  monthlyIncome: string;
  contributionDay: string;
  role: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  declaration: boolean;
}

export interface LoanFormData {
  memberId: string;
  amount: string;
  purpose: string;
  repaymentMonths: string;
  notes: string;
}

// Configuration types
export interface AppConfig {
  appName: string;
  theme: {
    primary: string;
    success: string;
    pending: string;
  };
}

// Report types
export interface YearEndReport {
  year: number;
  groupId: number;
  totalPool: number;
  totalContributions: number;
  totalLoansDisbursed: number;
  totalInterestEarned: number;
  memberReports: MemberReport[];
}

export interface MemberReport {
  memberId: number;
  memberName: string;
  totalContributed: number;
  totalInterestEarned: number;
  totalBorrowed: number;
  totalRepaid: number;
  outstandingBalance: number;
  netReturn: number;
}

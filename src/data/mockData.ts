// Centralized mock data for RE-MMOGO application
// This file contains all sample data and will be replaced by API calls

import { Member, Group, Loan, Contribution, LoanRepayment, SummaryCard, ActionButton, AppConfig, YearEndReport } from '../types';

// Application Configuration
export const APP_CONFIG: AppConfig = {
  appName: "RE-MMOGO",
  theme: {
    primary: "#1e1b4b",
    success: "#10b981",
    pending: "#f59e0b",
  },
};

// Group Configuration
export const GROUP_CONFIG: Group = {
  id: 1,
  name: "Hope Coders Savings Group",
  description: "A community savings group for financial growth and mutual support",
  maxMembers: 10,
  monthlyContribution: 1000, // P1,000 per member
  targetGoalPerMember: 5000, // P5,000 target per member
  interestRate: 0.20, // 20% monthly interest rate (as per requirements)
  targetInterestPerMember: 5000, // P5,000 interest target per member
  createdDate: "2024-01-01",
  isActive: true,
  signatories: [1, 2], // First two members are signatories
  treasurer: 3, // Third member is treasurer
};

// Additional mock groups for testing
export const MOCK_GROUPS: Group[] = [
  GROUP_CONFIG,
  {
    id: 2,
    name: "Botswana Business Circle",
    description: "Professional business networking and savings group",
    maxMembers: 15,
    monthlyContribution: 1500,
    targetGoalPerMember: 7500,
    interestRate: 0.20,
    targetInterestPerMember: 7500,
    createdDate: "2024-02-01",
    isActive: true,
    signatories: [4, 5],
    treasurer: 6,
  },
  {
    id: 3,
    name: "Gaborone Investment Club",
    description: "Agricultural and small business investment group",
    maxMembers: 12,
    monthlyContribution: 800,
    targetGoalPerMember: 4000,
    interestRate: 0.20,
    targetInterestPerMember: 4000,
    createdDate: "2024-03-01",
    isActive: true,
    signatories: [7, 8],
    treasurer: 9,
  }
];

// Members Data
export const MEMBERS: Member[] = [
  {
    id: 1,
    fullName: "Hope Kenosi",
    email: "hope.kenosi@example.com",
    phone: "+267 71234567",
    idNumber: "123456789",
    occupation: "Software Developer",
    monthlyIncome: 15000,
    contributionDay: "1st",
    role: "Member",
    emergencyContactName: "Emergency Contact",
    emergencyContactPhone: "+267 71111111",
    monthlyPaid: true,
    progressPercent: 75,
    signatoryStatus: "approved",
    balance: 25000,
    totalContributed: 15000,
    interestEarned: 750,
    dateJoined: "2024-01-01",
    isActive: true
  },
  {
    id: 2,
    fullName: "Eugune Member",
    email: "eugune@example.com",
    phone: "+267 72345678",
    idNumber: "234567890",
    occupation: "Teacher",
    monthlyIncome: 12000,
    contributionDay: "5th",
    role: "Signatory",
    emergencyContactName: "Mary Member",
    emergencyContactPhone: "+267 72222222",
    monthlyPaid: false,
    progressPercent: 60,
    signatoryStatus: "pending",
    balance: 12000,
    totalContributed: 8000,
    interestEarned: 400,
    dateJoined: "2024-02-15",
    isActive: true,
  },
  {
    id: 3,
    fullName: "Bokao Member",
    email: "bokao@example.com",
    phone: "+267 73456789",
    idNumber: "345678901",
    occupation: "Nurse",
    monthlyIncome: 14000,
    contributionDay: "10th",
    role: "Signatory",
    emergencyContactName: "Mary Member",
    emergencyContactPhone: "+267 72222222",
    monthlyPaid: false,
    progressPercent: 80,
    signatoryStatus: "approved",
    balance: 18000,
    totalContributed: 12000,
    interestEarned: 800,
    dateJoined: "2024-03-01",
    isActive: true,
  },
  {
    id: 4,
    fullName: "Victor Coder",
    email: "victor@example.com",
    phone: "+267 74567890",
    idNumber: "456789012",
    occupation: "Business Owner",
    monthlyIncome: 20000,
    contributionDay: "15th",
    role: "Treasurer",
    emergencyContactName: "Emergency Contact",
    emergencyContactPhone: "+267 73333333",
    monthlyPaid: true,
    progressPercent: 95,
    signatoryStatus: "approved",
    balance: 22000,
    totalContributed: 18000,
    interestEarned: 1500,
    dateJoined: "2024-01-15",
    isActive: true,
  },
  {
    id: 5,
    fullName: "Joseph Kgosing",
    email: "joseph@example.com",
    phone: "+267 75678901",
    idNumber: "567890123",
    occupation: "Trader",
    monthlyIncome: 18000,
    contributionDay: "20th",
    role: "Member",
    emergencyContactName: "Emergency Contact",
    emergencyContactPhone: "+267 74444444",
    monthlyPaid: true,
    progressPercent: 45,
    signatoryStatus: "pending",
    balance: 9000,
    totalContributed: 9000,
    interestEarned: 300,
    dateJoined: "2024-04-01",
    isActive: true
  },
  {
    id: 6,
    fullName: "Boipelo Sekao",
    email: "boipelo@example.com",
    phone: "+267 76789012",
    idNumber: "678901234",
    occupation: "Accountant",
    monthlyIncome: 16000,
    contributionDay: "25th",
    role: "Member",
    emergencyContactName: "David Sekao",
    emergencyContactPhone: "+267 76789013",
    monthlyPaid: false,
    progressPercent: 30,
    signatoryStatus: "pending",
    balance: 6000,
    totalContributed: 15000,
    interestEarned: 300,
    dateJoined: "2024-01-01",
    isActive: true,
  },
  {
    id: 7,
    fullName: "Anna Kgosing",
    email: "anna@example.com",
    phone: "+267 78901234",
    idNumber: "890123456",
    occupation: "Business Owner",
    monthlyIncome: 22000,
    contributionDay: "30th",
    role: "Member",
    emergencyContactName: "Emergency Contact",
    emergencyContactPhone: "+267 76666666",
    monthlyPaid: true,
    progressPercent: 70,
    signatoryStatus: "approved",
    balance: 14000,
    totalContributed: 14000,
    interestEarned: 900,
    dateJoined: "2024-06-01",
    isActive: true
  },
];

// Loans Data
export const LOANS: Loan[] = [
  {
    id: 1,
    memberId: 1,
    amount: 10000,
    purpose: "Business Investment",
    repaymentMonths: 6,
    interestRate: 0.20, // 20% monthly
    monthlyPayment: 2000,
    totalRepayment: 12000,
    remainingBalance: 8000,
    status: "active",
    applicationDate: "2024-06-01",
    approvalDate: "2024-06-02",
    disbursementDate: "2024-06-03",
    dueDate: "2024-12-01",
    notes: "Business expansion funding",
    signatoryApprovals: [
      { signatoryId: 1, approved: true, approvalDate: "2024-06-02" },
      { signatoryId: 2, approved: true, approvalDate: "2024-06-02" },
    ],
  },
  {
    id: 2,
    memberId: 3,
    amount: 5000,
    purpose: "Medical Emergency",
    repaymentMonths: 3,
    interestRate: 0.20, // 20% monthly
    monthlyPayment: 2000,
    totalRepayment: 6000,
    remainingBalance: 2000,
    status: "active",
    applicationDate: "2024-07-01",
    approvalDate: "2024-07-02",
    disbursementDate: "2024-07-03",
    dueDate: "2024-10-01",
    notes: "Emergency medical treatment",
    signatoryApprovals: [
      { signatoryId: 1, approved: true, approvalDate: "2024-07-02" },
      { signatoryId: 2, approved: true, approvalDate: "2024-07-02" },
    ],
  },
  {
    id: 3,
    memberId: 5,
    amount: 8000,
    purpose: "School Fees",
    repaymentMonths: 4,
    interestRate: 0.20, // 20% monthly
    monthlyPayment: 3000,
    totalRepayment: 9600,
    remainingBalance: 6000,
    status: "active",
    applicationDate: "2024-08-01",
    approvalDate: "2024-08-02",
    disbursementDate: "2024-08-03",
    dueDate: "2024-12-01",
    notes: "Children's school fees",
    signatoryApprovals: [
      { signatoryId: 1, approved: true, approvalDate: "2024-08-02" },
      { signatoryId: 2, approved: true, approvalDate: "2024-08-02" },
    ],
  },
];

// Contributions Data
export const CONTRIBUTIONS: Contribution[] = [
  {
    id: 1,
    memberId: 1,
    amount: 1000,
    contributionDate: "2024-08-01",
    paymentDate: "2024-08-01",
    status: "approved",
    proofOfPayment: "/uploads/receipt_001.pdf",
    signatoryApprovals: [
      { signatoryId: 1, approved: true, approvalDate: "2024-08-01" },
      { signatoryId: 2, approved: true, approvalDate: "2024-08-01" },
    ],
  },
  {
    id: 2,
    memberId: 2,
    amount: 1000,
    contributionDate: "2024-08-05",
    paymentDate: "2024-08-05",
    status: "approved",
    proofOfPayment: "/uploads/receipt_002.pdf",
    signatoryApprovals: [
      { signatoryId: 1, approved: true, approvalDate: "2024-08-05" },
      { signatoryId: 2, approved: true, approvalDate: "2024-08-05" },
    ],
  },
  {
    id: 3,
    memberId: 3,
    amount: 1000,
    contributionDate: "2024-08-10",
    paymentDate: "2024-08-10",
    status: "pending",
    proofOfPayment: "/uploads/receipt_003.pdf",
    signatoryApprovals: [
      { signatoryId: 1, approved: false },
      { signatoryId: 2, approved: false },
    ],
  },
];

// Loan Repayments Data
export const LOAN_REPAYMENTS: LoanRepayment[] = [
  {
    id: 1,
    loanId: 1,
    memberId: 1,
    amount: 2000,
    paymentDate: "2024-09-01",
    status: "approved",
    proofOfPayment: "/uploads/loan_repayment_001.pdf",
    signatoryApprovals: [
      { signatoryId: 1, approved: true, approvalDate: "2024-09-01" },
      { signatoryId: 2, approved: true, approvalDate: "2024-09-01" },
    ],
  },
];

// UI Data
export const SUMMARY_DATA: SummaryCard[] = [
  { id: 1, label: "Total Group Pool", value: "P 45,000", icon: "wallet" },
  { id: 2, label: "My Balance", value: "P 8,500", icon: "coins" },
  { id: 3, label: "Active Loans", value: "3", icon: "handshake" },
];

export const ACTION_BUTTONS: ActionButton[] = [
  { id: 1, label: "Register Group", icon: "users", feature: "Register Group", route: "/register-group" },
  { id: 2, label: "Record Contribution", icon: "plus", feature: "Record Contribution", route: "/record-contribution" },
  { id: 3, label: "Request Loan", icon: "handCoins", feature: "Request Loan", route: "/loan-request" },
  { id: 4, label: "Approve (Signatory)", icon: "checkCircle", feature: "Approve Signatory", route: "/signatory-approvals" },
  { id: 5, label: "Loan Repayment", icon: "creditCard", feature: "Loan Repayment", route: "/loan-repayment" },
  { id: 6, label: "Year End Report", icon: "fileText", feature: "Year End Report", route: "/year-end-report" },
  { id: 7, label: "Enroll Member", icon: "users", feature: "Enroll Member", route: "/enroll" },
];

export const TABLE_COLUMNS = {
  name: "Name",
  monthlyPaid: "P1,000 Monthly",
  progress: "P5,000 Goal Progress",
  status: "Signatory Status",
};

// Reports Data
export const YEAR_END_REPORT: YearEndReport = {
  year: 2024,
  groupId: 1,
  totalPool: 45000,
  totalContributions: 180000,
  totalLoansDisbursed: 23000,
  totalInterestEarned: 3200,
  memberReports: [
    {
      memberId: 1,
      memberName: "Hope Kenosi",
      totalContributed: 42500,
      totalInterestEarned: 850,
      totalBorrowed: 10000,
      totalRepaid: 2000,
      outstandingBalance: 8000,
      netReturn: -7150,
    },
    {
      memberId: 2,
      memberName: "Eugune Member",
      totalContributed: 46000,
      totalInterestEarned: 920,
      totalBorrowed: 0,
      totalRepaid: 0,
      outstandingBalance: 0,
      netReturn: 46920,
    },
  ],
};

// Constants
export const LOAN_PURPOSE_OPTIONS = [
  "Medical Emergency",
  "School Fees", 
  "Business Investment",
  "Home Repair",
  "Funeral / Burial",
  "Other",
];

export const REPAYMENT_PERIOD_OPTIONS = [
  { label: "1 month", value: "1" },
  { label: "2 months", value: "2" },
  { label: "3 months", value: "3" },
  { label: "6 months", value: "6" },
];

export const ROLE_OPTIONS = ["Member", "Signatory", "Treasurer"];

export const CONTRIBUTION_DAY_OPTIONS = ["1st", "5th", "10th", "15th", "20th", "25th", "Last day"];

// Calculated values
export const POOL_TOTAL = MEMBERS.reduce((sum, member) => sum + member.balance, 0);
export const MAX_LOAN_AMOUNT = POOL_TOTAL * 0.5; // 50% of total pool
export const MIN_LOAN_AMOUNT = 500;

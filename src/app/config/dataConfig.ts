/* DATA CONFIG - Backend team replaces this with API calls */

export const APP_CONFIG = {
  appName: "RE-MMOGO",
  theme: {
    primary: "#1e1b4b",
    success: "#10b981",
    pending: "#f59e0b",
  },
};

export const SUMMARY_DATA = [
  { id: 1, label: "Total Group Pool", value: "P 45,000", icon: "wallet" },
  { id: 2, label: "My Balance", value: "P 8,500", icon: "coins" },
  { id: 3, label: "Active Loans", value: "3", icon: "handshake" },
];

export const MEMBER_DATA = [
  { id: 1, name: "Hope Kenosi", monthlyPaid: true, progressPercent: 85, signatoryStatus: "approved" },
  { id: 2, name: "Eugune Member", monthlyPaid: true, progressPercent: 92, signatoryStatus: "approved" },
  { id: 3, name: "Bokao Member", monthlyPaid: false, progressPercent: 45, signatoryStatus: "pending" },
  { id: 4, name: "Victor Coder", monthlyPaid: true, progressPercent: 100, signatoryStatus: "approved" },
  { id: 5, name: "Joseph Kgosing", monthlyPaid: true, progressPercent: 68, signatoryStatus: "approved" },
  { id: 6, name: "Boipelo Sekao", monthlyPaid: false, progressPercent: 30, signatoryStatus: "pending" },
];

export const ACTION_BUTTONS = [
  { id: 1, label: "Record Contribution", icon: "plus", feature: "Record Contribution" },
  { id: 2, label: "Request Loan", icon: "handCoins", feature: "Request Loan" },
  { id: 3, label: "Approve (Signatory)", icon: "checkCircle", feature: "Approve Signatory" },
];

export const TABLE_COLUMNS = {
  name: "Name",
  monthlyPaid: "P1,000 Monthly",
  progress: "P5,000 Goal Progress",
  status: "Signatory Status",
};

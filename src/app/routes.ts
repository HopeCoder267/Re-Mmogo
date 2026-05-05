import { createBrowserRouter } from "react-router";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import LoanRequestPage from "./components/LoanRequestPage";
import MemberEnrollmentPage from "./components/MemberEnrollmentPage";
import GroupRegistrationPage from "./components/GroupRegistrationPage";
import ContributionRecordingPage from "./components/ContributionRecordingPage";
import LoanRepaymentPage from "./components/LoanRepaymentPage";
import SignatoryApprovalPage from "./components/SignatoryApprovalPage";
import YearEndReportPage from "./components/YearEndReportPage";
import GroupDetailsPage from "./components/GroupDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/loan-request",
    Component: LoanRequestPage,
  },
  {
    path: "/enroll",
    Component: MemberEnrollmentPage,
  },
  {
    path: "/register-group",
    Component: GroupRegistrationPage,
  },
  {
    path: "/signatory-approvals",
    Component: SignatoryApprovalPage,
  },
  {
    path: "/record-contribution",
    Component: ContributionRecordingPage,
  },
  {
    path: "/loan-repayment",
    Component: LoanRepaymentPage,
  },
  {
    path: "/year-end-report",
    Component: YearEndReportPage,
  },
  {
    path: "/group/:groupId",
    Component: GroupDetailsPage,
  },
]);
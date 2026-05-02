import { createBrowserRouter } from "react-router";
import Dashboard from "./components/Dashboard";
import RegisterPage from "./components/RegisterPage";
import LoanRequestPage from "./components/LoanRequestPage";
import MemberEnrollmentPage from "./components/MemberEnrollmentPage";
 
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
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
]);
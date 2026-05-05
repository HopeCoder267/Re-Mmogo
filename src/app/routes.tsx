import { createBrowserRouter } from "react-router";
import Dashboard from "./components/Dashboard";
import RegisterPage from "./components/RegisterPage";
import LoanRequestPage from "./components/LoanRequestPage";
import MemberEnrollmentPage from "./components/MemberEnrollmentPage";
import SignInPage from "./components/SignInPage";
import { RequireAuth } from "./components/RequireAuth";
 
export const router = createBrowserRouter([
  {
    path: "/",
    Component: SignInPage,
  },
  {
    path: "/dashboard",
    element: <RequireAuth><Dashboard /></RequireAuth>,
  },
  {
    path: "/register",
    Component: RegisterPage,   // public — accessible before login
  },
  {
    path: "/loan-request",
    element: <RequireAuth><LoanRequestPage /></RequireAuth>,
  },
  {
    path: "/enroll",
    element: <RequireAuth><MemberEnrollmentPage /></RequireAuth>,
  },
]);
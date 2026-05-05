/**
 * AUTH CONTEXT
 * Provides session data + role-based permission helpers across the app.
 * Backend team: replace sessionStorage reads with real JWT/session logic.
 */
 
import { createContext, useContext, ReactNode } from "react";
 
export type UserRole = "member" | "signatory";
 
export interface SessionUser {
  name: string;
  email: string;
  role: UserRole;
}
 
/**
 * PERMISSION MAP
 * Keys are feature identifiers. Values list which roles CAN use the feature.
 * Add new features here as the app grows.
 */
export const PERMISSIONS: Record<string, UserRole[]> = {
  "record-contribution": ["member", "signatory"],
  "request-loan":        ["member", "signatory"],
  "approve-signatory":   ["signatory"],
  "enroll-member":       ["signatory"],
  "register-nav":        ["signatory"],
  "view-all-members":    ["signatory"],   // members only see their own row
};
 
export function can(role: UserRole, feature: string): boolean {
  return PERMISSIONS[feature]?.includes(role) ?? false;
}
 
/* ------------------------------------------------------------------ */
 
interface AuthContextValue {
  user: SessionUser | null;
  can: (feature: string) => boolean;
}
 
const AuthContext = createContext<AuthContextValue>({
  user: null,
  can: () => false,
});
 
export function AuthProvider({ children }: { children: ReactNode }) {
  const raw = (() => {
    try { return JSON.parse(sessionStorage.getItem("rm_user") || "null"); }
    catch { return null; }
  })();
 
  const user: SessionUser | null = raw?.role ? raw : null;
 
  return (
    <AuthContext.Provider value={{ user, can: (f) => user ? can(user.role, f) : false }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  return useContext(AuthContext);
}
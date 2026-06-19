import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { canAccessPath, getAccountRole, type AccountRole } from "@/lib/accountRole";

export function RoleAccessRoute({ children, required }: { children: ReactNode; required?: AccountRole }) {
  const loc = useLocation();
  const role = getAccountRole();
  const allowed = required ? role === required : canAccessPath(role, loc.pathname);
  if (!allowed) {
    return <Navigate to={role === "supplier" ? "/supplier/dashboard" : "/seller/dashboard"} replace />;
  }
  return <>{children}</>;
}

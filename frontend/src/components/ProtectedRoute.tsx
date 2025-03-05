import { Navigate, Outlet } from "react-router";
import getCookie from "../utils/GetCookie";
import parseJwt from "../utils/ParseJWT";

export function MemberRoute() {
  const tokenStr = getCookie("Access-Token");
  return tokenStr === undefined ? <Navigate to="/login" /> : <Outlet />;
}

export function AdminRoute() {
  const tokenStr = getCookie("Access-Token");
  if (tokenStr === undefined) {
    return <Navigate to="/login" />;
  }
  const token: { userType: number } = parseJwt(tokenStr);
  return token.userType === 1 ? <Outlet /> : <Navigate to="/login" />;
}

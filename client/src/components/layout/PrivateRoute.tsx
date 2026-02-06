import { useAuthStore } from "@/store/auth/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
interface PrivateRouteProps {
  children: React.ReactNode;
}
function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, profile } = useAuthStore();
  const { pathname } = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!profile) {
    if (pathname !== "/set-profile") {
      return <Navigate to="/set-profile" replace />;
    }
    return <>{children}</>;
  }
  if (!profile.teamId) {
    if (pathname !== "/create-or-join-team") {
      return <Navigate to="/create-or-join-team" replace />;
    }
    return <>{children}</>;
  }


  return <Layout>{children}</Layout>;
}

export default PrivateRoute;

import { useAuthStore } from "@/store/auth/useAuthStore";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}
function PublicRoute({ children }: PublicRouteProps) {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default PublicRoute;

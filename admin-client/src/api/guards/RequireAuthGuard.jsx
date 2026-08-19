import { Navigate, useLocation } from "react-router";
import { useAuth } from "../auth/useAuth.js";

export default function RequireAuthGuard({children}) {
    const { user, isBootstrapping } = useAuth();
    const location = useLocation();

    if (isBootstrapping) return <div>Загрузка...</div>;

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    
    return children;
}
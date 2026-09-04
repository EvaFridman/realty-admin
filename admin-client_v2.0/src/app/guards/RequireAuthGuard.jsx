import { Navigate, useLocation } from "react-router";
import { useAuth } from "../auth/useAuth.js";
import PageLoader from '../../widgets/PageLoader.jsx'

export default function RequireAuthGuard({children}) {
    const { user, isBootstrapping } = useAuth();
    const location = useLocation();

    if (isBootstrapping) return <PageLoader />;

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    
    return children;
}
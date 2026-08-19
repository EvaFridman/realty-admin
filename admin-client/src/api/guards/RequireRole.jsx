import { useAuth } from "../auth/useAuth.js";
import ForbiddenPage from "../../pages/ForbiddenPage"

export default function RequireRole({ roles, children }) {
    const { user } = useAuth();
    if(!roles.includes(user.role)) return <ForbiddenPage />;
    return children;
}
import { useAuth } from "../auth/useAuth.js";
import ForbiddenPage from "../../pages/ForbiddenPage.jsx"

export default function RequireRoleGuard({ roles, children }) {
    const { user } = useAuth();
    if(!roles.includes(user.role)) return <ForbiddenPage />;
    return children;
}
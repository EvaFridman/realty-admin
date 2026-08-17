import { Navigate, useLocation } from "react-router";
import { useModerator } from '../../features/moderator/ModeratorContext.jsx';

export default function RequireModeratorGuard({children}) {
    const location = useLocation();
    const { currentModeratorId } = useModerator();

    if(!currentModeratorId) return <Navigate to='/select-moderator' replace state={{from: location}}/>
    
    return children;
}
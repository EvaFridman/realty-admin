import { Navigate, useLocation } from "react-router";
import { useModerator } from '../../features/moderator/ModeratorProvider.jsx';

export default function RequireModerator({children}) {
    const location = useLocation();
    const { currentModeratorId } = useModerator();

    if(!currentModeratorId) return <Navigate to='/select-moderator' replace state={{from: location}}/>
    
    return children;
}
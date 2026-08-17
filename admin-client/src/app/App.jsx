import { Routes, Route } from "react-router";
import Layout from "./routes/Layout.jsx";
import SelectModeratorPage from "../pages/SelectModeratorPage.jsx";
import RequireModeratorGuard from "./guards/RequireModeratorGuard.jsx";
import QueuePage from "../pages/QueuePage.jsx";
import ListingsPage from "../pages/ListingsPage.jsx";
import ListingPage from "../pages/ListingPage.jsx";
import ViewingsPage from "../pages/ViewingsPage.jsx";
import DistrictsPage from "../pages/DistrictsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/select-moderator" element={<SelectModeratorPage />} />

            <Route path="/" element={<RequireModeratorGuard><Layout /></RequireModeratorGuard>}>
                <Route index element={<QueuePage />} />
                <Route path="listings" element={<ListingsPage />} />
                <Route path="listings/:id" element={<ListingPage />} />
                <Route path="viewings" element={<ViewingsPage />} />
                <Route path="districts" element={<DistrictsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
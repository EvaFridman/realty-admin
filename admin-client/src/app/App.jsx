import { Routes, Route } from "react-router";
import QueuePage from "../pages/QueuePage.jsx";
import ListingsPage from "../pages/ListingsPage.jsx";
import ViewingsPage from "../pages/ViewingsPage.jsx";
import DistrictsPage from "../pages/DistrictsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<QueuePage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/viewings" element={<ViewingsPage />} />
                <Route path="/districts" element={<DistrictsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
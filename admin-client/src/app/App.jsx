import { Routes, Route } from "react-router";
import Layout from "./Layout.jsx";
import QueuePage from "../pages/QueuePage.jsx";
import ListingsPage from "../pages/ListingsPage.jsx";
import ListingPage from "../pages/ListingPage.jsx";
import ViewingsPage from "../pages/ViewingsPage.jsx";
import DistrictsPage from "../pages/DistrictsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<QueuePage />} />
                <Route path="listings" element={<ListingsPage />} />
                <Route path="listings/:id" element={<ListingPage />} />
                <Route path="viewings" element={<ViewingsPage />} />
                <Route path="districts" element={<DistrictsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import CreateVenuePage from "./pages/CreateVenuePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import VenuePage from "./pages/VenuePage.jsx";
import Layout from "./components/Layout.jsx"; // Ensure Layout exists

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="create-venue" element={<CreateVenuePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="venue/:id" element={<VenuePage />} />
      </Route>
    </Routes>
  );
}

export default App;

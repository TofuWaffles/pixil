import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout";
import Settings from "./pages/Settings";
import { Home } from "./pages/Home";
import MediaView from "./pages/MediaView";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/media" element={<MediaView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout";
import Settings from "./pages/Settings";
import { Home } from "./pages/Home";
import MediaView from "./pages/MediaView";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import { AdminRoute, MemberRoute } from "./components/ProtectedRoute";
import { SearchPage } from "./pages/SearchPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumView from "./pages/AlbumView";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MemberRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="" element={<Home />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="album" element={<AlbumView />} />
          </Route>
          <Route path="/media" element={<MediaView />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

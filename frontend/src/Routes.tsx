import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout";
import Settings from "./pages/Settings";
import { Home } from "./pages/Home";
import ImageView from "./components/ImageView";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/image" element={<ImageView />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

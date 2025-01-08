import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import MainLayout from "./components/Layout";
import Settings from "./pages/Settings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="nest" element={<Settings />} />
        </Route>
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import Layout from "./components/Layout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout children={<Home />} />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

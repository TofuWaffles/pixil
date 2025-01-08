import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/home";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

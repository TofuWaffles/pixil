import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./app";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

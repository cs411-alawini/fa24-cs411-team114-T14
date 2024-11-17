import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const login = "/login";
const all = "*";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={all} element={<Navigate to={login} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

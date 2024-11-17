import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { selectAuthUser } from "./services/auth/AuthSelectors";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import MainNavbar from "./pages/components/MainNavbar";

const login = "/login";
const dashboard = "/dashboard";
const dashboardHome = "/dashboard/home";
const all = "*";

function AppRouter() {
  const user = useAppSelector(selectAuthUser);
  const loggedIn = user ? true : false;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={login}
          element={!loggedIn ? <Login /> : <Navigate to={dashboardHome} />}
        />
        <Route
          path={dashboard}
          element={
            user !== null ? <MainNavbar user={user} /> : <Navigate to={login} />
          }
        >
          <Route path={dashboardHome} element={<Dashboard />} />
        </Route>
        <Route path={all} element={<Navigate to={login} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

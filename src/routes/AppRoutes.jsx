import { Routes, Route } from "react-router";
import MainLayOut from "../layouts/MainLayOut";
import HomePage from "../pages/HomePage";
import MovieDetailsPage from "../pages/MovieDetailsPage";
import SessionsPage from "../pages/SessionsPage";
import ProfilePage from "../pages/ProfilePage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayOut />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

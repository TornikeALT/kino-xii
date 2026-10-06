import { Routes, Route } from "react-router";
import MainLayOut from "../layouts/MainLayOut";
import HomePage from "../pages/HomePage";
import MovieDetailsPage from "../pages/MovieDetailsPage";
import SessionsPage from "../pages/SessionsPage";
import ProfilePage from "../pages/ProfilePage";
import PersonalInfo from "../components/PersonalInfo";
import MyTickets from "../components/MyTickets";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayOut />}>
        <Route index element={<HomePage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="movie/:id" element={<MovieDetailsPage />} />

        <Route path="profile" element={<ProfilePage />}>
          <Route index element={<PersonalInfo />} />
          <Route path="tickets" element={<MyTickets />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;

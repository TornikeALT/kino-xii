import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import LoginModal from "../modals/LoginModal";

function MainLayOut() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>

      <Footer />

      <LoginModal />
    </>
  );
}

export default MainLayOut;

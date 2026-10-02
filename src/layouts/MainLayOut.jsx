import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import LoginModal from "../modals/LoginModal";
import SignUpModal from "../modals/SignUpModal";

function MainLayOut() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>

      <Footer />

      <LoginModal />
      <SignUpModal />
    </>
  );
}

export default MainLayOut;

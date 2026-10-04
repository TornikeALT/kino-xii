import { Outlet } from "react-router";

import Footer from "../components/Footer";
import LoginModal from "../modals/LoginModal";
import SignUpModal from "../modals/SignUpModal";
import NavBar from "../components/NavBar";

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

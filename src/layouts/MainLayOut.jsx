import { Outlet } from "react-router";

import Footer from "../components/Footer";
import LoginModal from "../modals/LoginModal";
import SignUpModal from "../modals/SignUpModal";

function MainLayOut() {
  return (
    <>
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

import { useState } from "react";
import { ModalContext } from "./ModalContext.jsx";

export default function ModalProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [pendingSession, setPendingSession] = useState(null);

  function openSeats(hall) {
    setSelectedHall(hall);
  }

  function closeSeats() {
    setSelectedHall(null);
  }

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };
  const openSignUp = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeLogin = () => setIsLoginOpen(false);
  const closeRegister = () => setIsRegisterOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isLoginOpen,
        openLogin,
        closeLogin,
        isRegisterOpen,
        openSignUp,
        closeRegister,
        openSeats,
        closeSeats,
        selectedHall,
        pendingSession,
        setPendingSession,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

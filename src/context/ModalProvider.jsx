import { useState } from "react";
import { ModalContext } from "./ModalContext.jsx";

export default function ModalProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <ModalContext.Provider value={{ isLoginOpen, openLogin, closeLogin }}>
      {children}
    </ModalContext.Provider>
  );
}

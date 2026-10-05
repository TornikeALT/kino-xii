import { useCallback, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useModal } from "./ModalContext";

import { clearToken, loginRequest, registerRequest, setToken } from "../api";

export default function AuthProvider({ children }) {
  const { closeLogin, closeRegister } = useModal();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // LOGIN
  const login = useCallback(
    async (email, password) => {
      const { token, user } = await loginRequest(email, password);

      setToken(token);

      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      closeLogin();
    },
    [closeLogin],
  );

  // REGISTER
  const register = useCallback(
    async (fields) => {
      const { token, user } = await registerRequest(fields);

      setToken(token);

      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      closeRegister();
    },
    [closeRegister],
  );

  // LOGOUT
  const logout = useCallback(() => {
    clearToken();

    localStorage.removeItem("user");

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

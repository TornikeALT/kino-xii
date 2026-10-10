import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useModal } from "./ModalContext";

import {
  apiFetch,
  clearToken,
  getToken,
  loginRequest,
  registerRequest,
  setToken,
  updateProfileRequest,
} from "../api";

export default function AuthProvider({ children }) {
  const { closeLogin, closeRegister } = useModal();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // REFRESH USER FROM SERVER (once, on app load)
  useEffect(() => {
    if (!getToken()) return;

    let cancelled = false;

    async function refreshUser() {
      try {
        const res = await apiFetch("/me");

        if (res.status === 401) {
          localStorage.removeItem("user");
          if (!cancelled) setUser(null);
          return;
        }

        if (!res.ok) return;

        const body = await res.json();
        const fresh = body.data?.user ?? body.data;

        if (!cancelled && fresh) {
          localStorage.setItem("user", JSON.stringify(fresh));
          setUser(fresh);
        }
      } catch {
        // network error: keep the saved user, try again on next load
      }
    }

    refreshUser();

    return () => {
      cancelled = true;
    };
  }, []);

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
  const logout = useCallback(async () => {
    try {
      await apiFetch("/logout", { method: "POST" }); // revoke token on server
    } catch {
      // network error: still log out locally
    } finally {
      clearToken();
      localStorage.removeItem("user");
      localStorage.removeItem("recentlyViewed");
      setUser(null);
    }
  }, []);

  // UPDATE PROFILE
  const updateProfile = useCallback(async (data) => {
    const updated = await updateProfileRequest(data);

    setUser((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });

    return updated;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

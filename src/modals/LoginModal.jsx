import { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import close from "../images/icons/close.png";
import styles from "../styles/loginModal.module.css";

function LoginModal() {
  const { isLoginOpen, closeLogin, openSignUp } = useModal();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        resetForm();
        closeLogin();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeLogin]);

  // Each time the modal opens: clear the old error and password
  // useEffect(() => {
  //   if (isLoginOpen) {
  //     setError("");
  //     setPassword("");
  //   }
  // }, [isLoginOpen]);

  function resetForm() {
    setEmail("");
    setPassword("");
    setError("");
  }

  function handleClose() {
    resetForm();
    closeLogin();
  }
  function handleSignUpClick() {
    resetForm();
    openSignUp();
  }

  if (!isLoginOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      console.log(email, password);
      await login(email, password); // closes the modal itself on success
      setEmail("");
      setPassword("");
    } catch (err) {
      // 401 = wrong credentials: stay open, keep the email, show the message
      setError(
        err.status === 401
          ? "Wrong email or password."
          : err.message || "Something went wrong. Try again.",
      );
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <form
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.login}>
          <h2>Login</h2>
          <img
            src={close}
            alt="close"
            onClick={handleClose}
            className={styles.close}
          />
        </div>
        <p className={styles.welcome_back}>Welcome back to Kino XII</p>
        <div className={styles.inputs}>
          <div className={styles.mail}>
            <label htmlFor="user-email">Email</label>
            <input
              type="email"
              id="user-email"
              name="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.password}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="●●●●●●●●"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={styles.login_btn}
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>
        <div className={styles.sign_up}>
          <p>Don't have an account?</p>
          <span onClick={handleSignUpClick}>Sign Up</span>
        </div>
      </form>
    </div>
  );
}

export default LoginModal;

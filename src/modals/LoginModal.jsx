import { useEffect, useState } from "react";

import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import close from "../images/icons/close.png";
import accepted from "../images/icons/green.png";
import reject from "../images/icons/reject.png";
import styles from "../styles/loginModal.module.css";

function LoginModal() {
  const { isLoginOpen, closeLogin, openSignUp } = useModal();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 3;
  const isFormValid = isEmailValid && isPasswordValid;

  const showEmailError = emailTouched && !isEmailValid;
  const showPasswordError = passwordTouched && !isPasswordValid;

  function resetForm() {
    setEmail("");
    setPassword("");
    setError("");
    setEmailTouched(false);
    setPasswordTouched(false);
  }

  function handleClose() {
    resetForm();
    closeLogin();
  }

  function handleSignUpClick() {
    resetForm();
    openSignUp();
  }

  useEffect(() => {
    if (!isLoginOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isLoginOpen]);

  if (!isLoginOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      resetForm();
    } catch (err) {
      setError(
        err.status === 401
          ? "Wrong email or password."
          : err.message || "Something went wrong. Try again.",
      );
      setPassword("");
      setPasswordTouched(false);
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
        noValidate
      >
        <div className={styles.login}>
          <h2>Log in</h2>
          <img
            src={close}
            alt="close"
            onClick={handleClose}
            className={styles.close}
          />
        </div>
        <p className={styles.welcome_back}>Welcome back to Kino XII</p>

        <div className={styles.inputs}>
          {/* EMAIL */}
          <div className={styles.field}>
            <label
              htmlFor="user-email"
              className={showEmailError ? styles.label_error : ""}
            >
              Email
            </label>
            <div className={styles.input_wrap}>
              <input
                id="user-email"
                name="email"
                placeholder="example@gmail.com"
                value={email}
                className={showEmailError ? styles.error_border : ""}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                required
              />
              {isEmailValid && (
                <img src={accepted} alt="valid" className={styles.icon} />
              )}
              {showEmailError && (
                <img src={reject} alt="invalid" className={styles.icon} />
              )}
            </div>
            {showEmailError && (
              <p className={styles.error}>Enter a valid email</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className={styles.field}>
            <label
              htmlFor="password"
              className={showPasswordError ? styles.label_error : ""}
            >
              Password
            </label>
            <div className={styles.input_wrap}>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="●●●●●●●●"
                value={password}
                className={showPasswordError ? styles.error_border : ""}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordTouched(true);
                }}
                onBlur={() => setPasswordTouched(true)}
                required
              />
              {showPasswordError && (
                <img src={reject} alt="invalid" className={styles.icon} />
              )}
              {isPasswordValid && (
                <img src={accepted} alt="valid" className={styles.icon} />
              )}
            </div>
            {showPasswordError && (
              <p className={styles.error}>At least 3 characters</p>
            )}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.login_btn}
          disabled={!isFormValid || submitting}
        >
          Log in
        </button>

        <div className={styles.sign_up}>
          <p>Don't have an account?</p>
          <span onClick={handleSignUpClick}>Sign up</span>
        </div>
      </form>
    </div>
  );
}

export default LoginModal;

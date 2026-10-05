import { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";

import close from "../images/icons/close.png";
import upload from "../images/icons/upload.png";
import styles from "../styles/signUpModal.module.css";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB, limit size

function FieldError({ messages }) {
  if (!messages?.length) return null;
  return <p className={styles.error}>{messages[0]}</p>; //es error satestoa
}

function SignUpModal() {
  const { isRegisterOpen, closeRegister, openLogin } = useModal();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeRegister();
        // handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeRegister]);

  function resetForm() {
    setUsername("");
    setEmail("");
    setFieldErrors({});
    setFormError("");
    setPassword("");
    setPasswordConfirmation("");
    setAvatar(null);
  }
  function handleClose() {
    resetForm();
    closeRegister();
  }

  if (!isRegisterOpen) return null;

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatar(null);
      e.target.value = "";
      setFieldErrors((prev) => ({
        ...prev,
        avatar: ["Image must be 2MB or smaller."],
      }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, avatar: undefined }));
    setAvatar(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      await register({
        username,
        email,
        password,
        passwordConfirmation,
        avatar,
      });

      setUsername("");
      setEmail("");
      resetForm();
    } catch (err) {
      if (err.status === 422) {
        setFieldErrors(err.errors);
        console.log(fieldErrors);
      } else {
        setFormError(err.message || "Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleLoginClick(e) {
    e.preventDefault();
    openLogin();
    resetForm();
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="signup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modal__header}>
          <div>
            <h1 id="signup-title">Sign up</h1>
            <p className={styles.subtitle}>Welcome to Kino XII</p>
          </div>
          <img
            src={close}
            alt="close"
            className={styles.close}
            onClick={handleClose}
          />
        </header>

        <form className={styles.form} id="signup-form" onSubmit={handleSubmit}>
          <div className={styles.avatar}>
            <label className={styles.avatar__btn} htmlFor="avatar">
              <img src={upload} alt="upload" />
            </label>
            <input
              type="file"
              id="avatar"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleAvatarChange}
              hidden
            />
            <div>
              <p className={styles.avatar__title}>Upload avatar (optional)</p>
              <p className={styles.avatar__hint}>
                {avatar ? avatar.name : "JPG, PNG or WEBP"}
              </p>
              <FieldError messages={fieldErrors.avatar} />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FieldError messages={fieldErrors.username} />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FieldError messages={fieldErrors.email} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FieldError messages={fieldErrors.password} />
            </div>
            <div className={styles.field}>
              <label htmlFor="confirm">Confirm password</label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                placeholder="••••••••"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />

              <FieldError messages={fieldErrors.password_confirmation} />
            </div>
          </div>

          {formError && (
            <p className={styles.error} role="alert">
              {formError}
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className={styles.login}>
          Already have an account?{" "}
          <a href="#" onClick={handleLoginClick}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpModal;

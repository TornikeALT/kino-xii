import { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";

import close from "../images/icons/close.png";
import upload from "../images/icons/upload.png";
import accepted from "../images/icons/green.png";
import reject from "../images/icons/reject.png";
import styles from "../styles/signUpModal.module.css";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB, limit size
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MIN_LENGTH = 3;

function FieldError({ message }) {
  if (!message) return null;
  return <p className={styles.error}>{message}</p>;
}

// one input with its label, icon and message
function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  onBlur,
  message,
  isValid,
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={message ? styles.label_error : ""}>
        {label}
      </label>

      <div className={styles.input_wrap}>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={message ? styles.input_error : ""}
        />

        {isValid && <img src={accepted} alt="" className={styles.icon} />}
        {message && <img src={reject} alt="" className={styles.icon} />}
      </div>

      <FieldError message={message} />
    </div>
  );
}

function SignUpModal() {
  const { isRegisterOpen, closeRegister, openLogin } = useModal();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [touched, setTouched] = useState({}); // fields the user already left
  const [fieldErrors, setFieldErrors] = useState({}); // errors from the server
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isRegisterOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        resetForm();
        closeRegister();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isRegisterOpen, closeRegister]);

  function resetForm() {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setAvatar(null);
    setTouched({});
    setFieldErrors({});
    setFormError("");
  }

  function handleClose() {
    resetForm();
    closeRegister();
  }

  if (!isRegisterOpen) return null;

  // ---------- validation ----------

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function getConfirmationError() {
    if (passwordConfirmation === "") return "Confirm your password";
    if (passwordConfirmation !== password) return "Passwords do not match";
    return "";
  }

  // what is wrong with each field right now ("" means fine)
  const clientErrors = {
    username:
      username.trim().length < MIN_LENGTH
        ? `At least ${MIN_LENGTH} characters`
        : "",
    email: isEmailValid ? "" : "Enter a valid email",
    password:
      password.length < MIN_LENGTH ? `At least ${MIN_LENGTH} characters` : "",
    passwordConfirmation: getConfirmationError(),
  };

  const isFormValid = Object.values(clientErrors).every((err) => err === "");

  // the message under a field: the server's one first, then ours (after the user left the field)
  function getMessage(name, serverKey = name) {
    const serverMessage = fieldErrors[serverKey]?.[0];

    if (serverMessage) return serverMessage;
    if (touched[name]) return clientErrors[name];
    return "";
  }

  // green tick: the user left the field, nothing is wrong
  function isFieldValid(name, serverKey = name) {
    return (
      touched[name] &&
      clientErrors[name] === "" &&
      !fieldErrors[serverKey]?.length
    );
  }

  function handleBlur(name) {
    setTouched({ ...touched, [name]: true });
  }

  // typing in a field removes the server's error for it
  function clearServerError(key) {
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ---------- avatar ----------

  function rejectAvatar(input, text) {
    setAvatar(null);
    input.value = "";
    setFieldErrors((prev) => ({ ...prev, avatar: [text] }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      rejectAvatar(e.target, "Only JPG, PNG or WEBP images.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      rejectAvatar(e.target, "Image must be 2MB or smaller.");
      return;
    }

    clearServerError("avatar");
    setAvatar(file);
  }

  // ---------- submit ----------

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid || submitting) return;

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

      resetForm();
    } catch (err) {
      if (err.status === 422) {
        setFieldErrors(err.errors);
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

        <form
          className={styles.form}
          id="signup-form"
          onSubmit={handleSubmit}
          noValidate
        >
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
              <FieldError message={fieldErrors.avatar?.[0]} />
            </div>
          </div>

          <Field
            id="username"
            label="Username"
            placeholder="User"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearServerError("username");
            }}
            onBlur={() => handleBlur("username")}
            message={getMessage("username")}
            isValid={isFieldValid("username")}
          />

          <Field
            id="email"
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearServerError("email");
            }}
            onBlur={() => handleBlur("email")}
            message={getMessage("email")}
            isValid={isFieldValid("email")}
          />

          <div className={styles.row}>
            <Field
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearServerError("password");
              }}
              onBlur={() => handleBlur("password")}
              message={getMessage("password")}
              isValid={isFieldValid("password")}
            />

            <Field
              id="confirm"
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                clearServerError("password_confirmation");
              }}
              onBlur={() => handleBlur("passwordConfirmation")}
              message={getMessage(
                "passwordConfirmation",
                "password_confirmation",
              )}
              isValid={isFieldValid(
                "passwordConfirmation",
                "password_confirmation",
              )}
            />
          </div>

          {formError && (
            <p className={styles.error} role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className={styles.submit}
            disabled={!isFormValid || submitting}
          >
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

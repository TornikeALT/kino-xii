import { useModal } from "../context/ModalContext";
import close from "../images/icons/close.png";
import upload from "../images/icons/upload.png";
import styles from "../styles/signUpModal.module.css";

function SignUpModal() {
  const { isRegisterOpen, closeRegister, openLogin } = useModal();

  if (!isRegisterOpen) return null;
  return (
    <div className={styles.overlay} onClick={closeRegister}>
      <div
        className={styles.modal}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modal__header}>
          <div>
            <h1 id="signup-title">Sign up</h1>
            <p className={styles.subtitle}>Welcome to Kino XII</p>
          </div>
          <img src={close} className={styles.close} onClick={closeRegister} />
        </header>
        <form className={styles.form} id="signup-form">
          <div className={styles.avatar}>
            <label className={styles.avatar__btn} htmlFor="avatar">
              <img src={upload} alt="upload" />
            </label>
            <input
              type="file"
              id="avatar"
              accept=".jpg,.jpeg,.png,.webp"
              hidden
            />
            <div>
              <p className={styles.avatar__title}>Upload avatar (optional)</p>
              <p className={styles.avatar__hint}>JPG, PNG or WEBP</p>
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
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              autoComplete="email"
              required
            />
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
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="confirm">Confirm password</label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled>
            Sign up
          </button>
        </form>
        <p className={styles.login}>
          Already have an account?{" "}
          <a href="#" onClick={openLogin}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpModal;

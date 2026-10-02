import close from "../images/icons/close.png";
import upload from "../images/icons/upload.png";
import styles from "../styles/signUpModal.module.css";

function SignUpModal() {
  return (
    <div className={styles.modal} role="dialog">
      <header className={styles.modal__header}>
        <div>
          <h1 id="signup-title">Sign up</h1>
          <p className={styles.subtitle}>Welcome to Kino XII</p>
        </div>
        <img src={close} className={styles.close} />
      </header>
      <form className={styles.form} id="signup-form">
        <div className={styles.avatar}>
          <label className={styles.avatar__btn} for="avatar">
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
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="User"
            autocomplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            autocomplete="email"
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autocomplete="new-password"
              required
            />
          </div>
          <div className={styles.field}>
            <label for="confirm">Confirm password</label>
            <input
              type="password"
              id="confirm"
              name="confirm"
              placeholder="••••••••"
              autocomplete="new-password"
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submit} disabled>
          Sign up
        </button>
      </form>
      <p className={styles.login}>
        Already have an account? <a href="#">Log in</a>
      </p>
    </div>
  );
}

export default SignUpModal;

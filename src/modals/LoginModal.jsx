import { useModal } from "../context/ModalContext";
import close from "../images/icons/close.png";
import styles from "../styles/loginModal.module.css";

function LoginModal() {
  const { isLoginOpen, closeLogin } = useModal();

  if (!isLoginOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <h2>Login</h2>
        <img
          src={close}
          alt="close "
          onClick={closeLogin}
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
          />
        </div>
      </div>
      <button className={styles.login_btn}>Log In</button>
      <div className={styles.sign_up}>
        <p>Don't have an account?</p>
        <span>Sign Up</span>
      </div>
    </div>
  );
}

export default LoginModal;

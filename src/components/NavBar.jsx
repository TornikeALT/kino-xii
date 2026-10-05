import { Link } from "react-router";
import styles from "../styles/navbar.module.css";
import searchIcon from "../images/icons/search.png";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { openLogin, openSignUp } = useModal();

  // Aqedan testia
  const { user } = useAuth();
  // amis zemot testia testamde
  return (
    <header className="container">
      <div className={styles.navigation}>
        <div className={styles.logo_sessions}>
          <div className={styles.main_logo}>
            <h2 className={styles.kino}>KINO</h2>
            <h2 className={styles.xii}>XII</h2>
          </div>
          <Link to="/sessions" className={styles.link}>
            SESSIONS
          </Link>
        </div>
        <div className={styles.search_signup_login}>
          <div className={styles.search_input}>
            <img src={searchIcon} alt="search" className={styles.search_icon} />
            <input type="text" placeholder="Search films and live events" />
          </div>
          <button className={styles.sign_up} onClick={openSignUp}>
            Sign Up
          </button>
          <button className={styles.login} onClick={openLogin}>
            Log In
          </button>
          {/* testia qveda spani useris gamosachened */}
          {user ? <span>{user.username}</span> : ""}
        </div>
      </div>
    </header>
  );
}

export default NavBar;

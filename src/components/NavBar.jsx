import { Link } from "react-router";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/navbar.module.css";
import searchIcon from "../images/icons/search.png";
import UserMenu from "./UserMenu";
import Search from "./Search";
import { useState, useRef } from "react";

function NavBar() {
  const { openLogin, openSignUp } = useModal();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef(null);
  const { user } = useAuth();

  function closeSearch() {
    setSearch("");
    setIsSearchFocused(false);
    inputRef.current?.blur();
  }

  return (
    <header className="container">
      <div className={styles.navigation}>
        <div className={styles.logo_sessions}>
          <Link to="/" className={styles.main_logo}>
            <h2 className={styles.kino}>KINO</h2>
            <h2 className={styles.xii}>XII</h2>
          </Link>
          <Link to="/sessions" className={styles.link}>
            SESSIONS
          </Link>
        </div>
        <div className={styles.search_signup_login}>
          <div className={styles.search_input}>
            <img src={searchIcon} alt="search" className={styles.search_icon} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search films and live events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
            />

            {search && (
              <button
                type="button"
                className={styles.clear_btn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}

            <Search
              query={search}
              isFocused={isSearchFocused}
              onClose={closeSearch}
            />
          </div>
          {user ? (
            <UserMenu />
          ) : (
            <>
              <button
                type="button"
                className={styles.sign_up}
                onClick={openSignUp}
              >
                Sign Up
              </button>
              <button
                type="button"
                className={styles.login}
                onClick={openLogin}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;

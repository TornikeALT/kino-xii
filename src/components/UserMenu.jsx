import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import arrowDown from "../images/icons/arrow.png";
import profileIcon from "../images/icons/user.png";
import ticket from "../images/icons/ticket.png";
import logoutIcon from "../images/icons/logout.png";
import green from "../images/icons/green.png";
import styles from "../styles/userMenu.module.css";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!user) return null;

  const fullName = user.fullName || user.username;
  const firstName = fullName.split(" ")[0];

  const isProfileIncomplete = user.profileComplete;

  const avatar = (
    <div className={styles.avatar}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.avatar} />
      ) : (
        <span>{getInitials(fullName)}</span>
      )}
      {!isProfileIncomplete && <i className={styles.dot} />}
      {isProfileIncomplete && <i className={styles.dot_green} />}
    </div>
  );

  function handleLogout() {
    setOpen(false);
    logout();
  }

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        {avatar}
        <span className={styles.name}>{firstName}</span>
        <img
          src={arrowDown}
          alt="arrow down"
          className={`${styles.arrow} ${open ? styles.arrow_open : ""}`}
        />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.user_info}>
            {avatar}
            <div>
              <p className={styles.full_name}>{fullName}</p>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>

          {!isProfileIncomplete && (
            <div className={styles.notice}>
              <p className={styles.notice_title}>Profile incomplete</p>
              <p className={styles.notice_text}>
                Please complete your profile to enable booking
              </p>
            </div>
          )}
          {isProfileIncomplete && (
            <div className={styles.notice_completed}>
              <span>Profile Complete</span>
              <img src={green} alt="green accept" />
            </div>
          )}

          <Link
            to="/profile"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            <img src={profileIcon} alt="user" />
            My Profile
          </Link>
          <Link
            to="/profile/tickets"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            <img src={ticket} alt="ticket" />
            My Tickets
          </Link>

          <div className={styles.divider} />

          <button
            type="button"
            className={`${styles.item} ${styles.logout}`}
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="logout" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;

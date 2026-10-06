import { NavLink, Outlet } from "react-router";
import styles from "../styles/profilePage.module.css";

function ProfilePage() {
  const ticketCount = 2; // placeholder until the tickets tab has data

  const tabClass = ({ isActive }) =>
    `${styles.tab} ${isActive ? styles.tab_active : ""}`;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>

      <nav className={styles.tabs}>
        <NavLink to="/profile" end className={tabClass}>
          Personal Information
        </NavLink>
        <NavLink to="/profile/tickets" className={tabClass}>
          My Tickets
          {ticketCount > 0 && (
            <span className={styles.badge}>{ticketCount}</span>
          )}
        </NavLink>
      </nav>

      <section className={styles.content}>
        <Outlet />
      </section>
    </div>
  );
}

export default ProfilePage;

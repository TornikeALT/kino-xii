import { NavLink, Outlet } from "react-router";
import styles from "../styles/profilePage.module.css";
import { getTickets } from "../api";
import { useEffect, useState } from "react";

function ProfilePage() {
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await getTickets();

        const count = response.reduce((total, order) => {
          if (order.isUpcoming) {
            return total + order.tickets.length;
          }

          return total;
        }, 0);

        setTicketCount(count);
      } catch (error) {
        console.error(error);
      }
    }

    loadTickets();
  }, []);

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

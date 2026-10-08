import styles from "../styles/myTickets.module.css";
import { getTickets } from "../api.js";
import { useEffect, useState } from "react";

function MyTickets() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadTickets() {
      try {
        const all = await getTickets("");
        console.log("all", all);
        setData(all);
      } catch (error) {
        console.log("error:", error);
      }
    }

    loadTickets();
  }, []);

  // console.log(data);

  return (
    <section>
      <div className="nav">
        <span>Upcoming</span>
        <span>Past</span>
      </div>
      <div className={styles.card}>
        <div className="details">Details on Left</div>
        <div className="order"> Order On right</div>
      </div>
    </section>
  );
}

export default MyTickets;

import styles from "../styles/sessionCard.module.css";
import green_ticket from "../images/icons/green_ticket.png";

const LOW_SEATS = 5;

function SessionCard({ session, onSelect }) {
  const { time, format, language, seatsLeft, isSoldOut, venue, hall, price } =
    session;

  const low = seatsLeft <= LOW_SEATS;

  return (
    <button
      type="button"
      className={`${styles.card} ${isSoldOut ? styles.sold : ""}`}
      disabled={isSoldOut}
      onClick={() => onSelect?.(session)}
    >
      <div className={styles.top}>
        <span className={styles.time}>{time}</span>
        <span className={styles.format}>{format.name}</span>
      </div>

      <div className={styles.middle}>
        <span className={styles.language}>{language.name}</span>

        {isSoldOut ? (
          <span className={styles.sold_label}>Sold out</span>
        ) : (
          <span className={`${styles.seats} ${low ? styles.seats_low : ""}`}>
            <img src={green_ticket} alt="green ticket" /> {seatsLeft} left
          </span>
        )}
      </div>

      <div className={styles.bottom}>
        <span className={styles.venue}>
          {venue.name} · Hall {hall.name}
        </span>
        <b>₾{price}</b>
      </div>
    </button>
  );
}

export default SessionCard;

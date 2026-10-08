import styles from "../styles/sessionTicket.module.css";
import ticket from "../images/icons/ticket_gray.png";

function SessionTicket({ session, onSelect }) {
  const lowSeats = session.seatsLeft <= 5;

  return (
    <button
      type="button"
      className={
        session.isSoldOut ? `${styles.ticket} ${styles.sold}` : styles.ticket
      }
      disabled={session.isSoldOut}
      onClick={() => onSelect(session)}
    >
      <div className={styles.left}>
        <span className={styles.time}>{session.time}</span>

        <div className={styles.tags}>
          <small>{session.language.code}</small>
          <span>{session.format.name}</span>
        </div>
      </div>

      <div className={styles.right}>
        <b>₾{session.price}</b>

        {session.isSoldOut ? (
          <small>Sold out</small>
        ) : (
          <small className={lowSeats ? styles.low : ""}>
            <img src={ticket} alt="ticket" />
            {session.seatsLeft} left
          </small>
        )}
      </div>
    </button>
  );
}

export default SessionTicket;

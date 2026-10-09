import SessionTicket from "./SessionTicket";
import styles from "../styles/movieSessions.module.css";

function groupByHall(sessions) {
  const halls = {};

  sessions.forEach((session) => {
    const hallName = session.hall.name;

    if (!halls[hallName]) {
      halls[hallName] = [];
    }
    halls[hallName].push(session);
  });

  return halls;
}

function MovieSessions({
  days,
  date,
  onDateChange,
  venues,
  loading,
  error,
  isComingSoon,
  onSelect,
}) {
  if (isComingSoon) {
    return (
      <section className={styles.sessions}>
        <h2>Sessions</h2>
        <p className={styles.status}>
          This title isn't showing yet. Sessions will appear once it opens.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.sessions}>
      <h2>Sessions</h2>

      <div className={styles.dates}>
        {days.map((day) => (
          <button
            key={day.iso}
            type="button"
            className={
              day.iso === date
                ? `${styles.day} ${styles.day_active}`
                : styles.day
            }
            onClick={() => onDateChange(day.iso)}
          >
            <span>{day.weekday}</span>
            <b>{day.number}</b>
          </button>
        ))}
      </div>

      {loading && <p className={styles.status}>Loading...</p>}
      {error && <p className={styles.status}>Could not load sessions.</p>}
      {!loading && !error && venues.length === 0 && (
        <p className={styles.status}>No sessions on this day.</p>
      )}

      {!loading &&
        !error &&
        venues.map((item) => {
          const halls = groupByHall(item.sessions);

          return (
            <div key={item.venue.id} className={styles.venue}>
              <h3>{item.venue.name}</h3>

              <div className={styles.halls}>
                {Object.entries(halls).map(([hallName, hallSessions]) => (
                  <div key={hallName} className={styles.hall}>
                    <p>Hall {hallName}</p>

                    <div className={styles.tickets}>
                      {hallSessions.map((session) => (
                        <SessionTicket
                          key={session.id}
                          session={session}
                          onSelect={(s) =>
                            onSelect({ ...s, venue: item.venue })
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </section>
  );
}

export default MovieSessions;

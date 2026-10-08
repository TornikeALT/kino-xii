import { useEffect, useState } from "react";
import { apiFetch, getTickets } from "../api";
import styles from "../styles/myTickets.module.css";

// get formated date weekday day month
function formatDay(date) {
  const d = new Date(date);

  const weekday = d.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
  const month = d.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

  return `${weekday} ${d.getUTCDate()} ${month}`;
}

// refund deadline format 2 hours
function refundDeadline(session) {
  const start = new Date(`${session.date}T${session.time}:00Z`);
  start.setUTCHours(start.getUTCHours() - 2);

  const iso = start.toISOString(); // 2026-09-15T14:30:00.000Z

  return `${iso.slice(11, 16)}, ${formatDay(iso.slice(0, 10))}`;
}

function MyTickets() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [tab, setTab] = useState("upcoming");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [refundingId, setRefundingId] = useState(null);

  useEffect(() => {
    async function loadTickets() {
      try {
        setLoading(true);
        setError("");

        const [upcomingData, pastData] = await Promise.all([
          getTickets("upcoming"),
          getTickets("past"),
        ]);

        setUpcoming(upcomingData);
        setPast(pastData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, [reloadKey]);

  async function handleRefund(order) {
    if (!window.confirm("Refund this order?")) return;

    try {
      setRefundingId(order.id);

      const res = await apiFetch(`/orders/${order.id}/refund`, {
        method: "POST",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Refund failed");
      }

      setReloadKey((key) => key + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setRefundingId(null);
    }
  }

  const orders = tab === "upcoming" ? upcoming : past;

  return (
    <section>
      <nav className={styles.nav}>
        <button
          type="button"
          className={tab === "upcoming" ? styles.isActive : ""}
          onClick={() => setTab("upcoming")}
        >
          Upcoming <small>{upcoming.length}</small>
        </button>
        <button
          type="button"
          className={tab === "past" ? styles.isActive : ""}
          onClick={() => setTab("past")}
        >
          Past <small>{past.length}</small>
        </button>
      </nav>

      {loading && <p className={styles.status}>Loading...</p>}
      {error && <p className={styles.status}>{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className={styles.status}>No {tab} tickets.</p>
      )}

      {!loading &&
        !error &&
        orders.map((order) => {
          const session = order.session;
          const movie = session.movie;

          return (
            <article className={styles.card} key={order.id}>
              <div className={styles.main}>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className={styles.poster}
                />

                <div className={styles.info}>
                  <div className={styles.title_row}>
                    <h2>{movie.title}</h2>
                    <span className={styles.age}>{movie.ageRating.code}</span>
                    <span className={styles.runtime}>
                      {movie.runtimeMinutes} min
                    </span>
                  </div>

                  <div className={styles.facts}>
                    <div>
                      <span>DATE</span>
                      <p>
                        {formatDay(session.date)} · {session.time}
                      </p>
                    </div>
                    <div>
                      <span>VENUE</span>
                      <p>
                        {session.venue.name} · Hall {session.hall.name}
                      </p>
                    </div>
                    <div>
                      <span>FORMAT</span>
                      <p>
                        {session.format.name} · {session.language.name}
                      </p>
                    </div>
                  </div>

                  <div className={styles.seats}>
                    <span>SEATS</span>
                    {order.tickets.map((ticket) => (
                      <span key={ticket.id} className={styles.seat}>
                        {ticket.seatCode} · {ticket.ticketType.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.order}>
                <div>
                  <span className={styles.label}>ORDER</span>
                  <p className={styles.order_number}>#{order.reference}</p>
                </div>

                <div className={styles.total}>
                  <span>Total paid</span>
                  <b>₾{order.totalPrice}</b>
                </div>

                {tab === "upcoming" && (
                  <>
                    <div
                      title={
                        order.isRefundable
                          ? ""
                          : "Refunds are no longer available for this order"
                      }
                    >
                      <button
                        type="button"
                        className={styles.refund_btn}
                        disabled={
                          !order.isRefundable || refundingId === order.id
                        }
                        onClick={() => handleRefund(order)}
                      >
                        {refundingId === order.id ? "Refunding..." : "Refund"}
                      </button>
                    </div>

                    <small className={styles.hint}>
                      {order.isRefundable
                        ? `Refundable until ${refundDeadline(session)}`
                        : "Refund is no longer available"}
                    </small>
                  </>
                )}

                {tab === "past" && order.refundedAt && (
                  <small className={styles.hint}>Refunded</small>
                )}
              </div>
            </article>
          );
        })}
    </section>
  );
}

export default MyTickets;

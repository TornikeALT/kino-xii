import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../api";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import CheckoutForm from "./CheckoutForm";
import styles from "../styles/bookingModal.module.css";

// "2026-09-15" -> "Tuesday 15 September"
function formatLongDate(date) {
  const d = new Date(date);

  const weekday = d.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const month = d.toLocaleDateString("en-US", {
    month: "long",
    timeZone: "UTC",
  });

  return `${weekday} ${d.getUTCDate()} ${month}`;
}

// "2026-09-15" -> "Tue 15 Sep"
function formatShortDate(date) {
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

// 468 -> "7:48"
function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  return `${minutes}:${rest}`;
}

// 15.000000001 -> 15
function showPrice(price) {
  return Number(price.toFixed(2));
}

// ["Adult", "Adult", "Child"] -> "2 x Adult, 1 x Child"
function summarizeTickets(names) {
  const counts = {};

  names.forEach((name) => {
    counts[name] = (counts[name] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => `${count} x ${name}`)
    .join(", ");
}

// errors can be a string or an array of strings
function firstMessage(value) {
  return Array.isArray(value) ? value[0] : value;
}

function BookingModal({ session, movie, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openLogin } = useModal();

  const [options, setOptions] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [selected, setSelected] = useState([]); // [{ id, code, typeSlug }]
  const [message, setMessage] = useState(""); // small error under the seats
  const [warning, setWarning] = useState(""); // banner: expired, seat taken...

  const [step, setStep] = useState("seats"); // "seats", "checkout" or "done"
  const [holding, setHolding] = useState(false);
  const [hold, setHold] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);

  // the contact details come from the profile
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    mobileNumber: user.mobileNumber || "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [order, setOrder] = useState(null);

  // load the options (ticket types, max seats) and the seat map
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setLoadError("");

        const optionsRes = await apiFetch("/filter-options");
        const seatsRes = await apiFetch(`/sessions/${session.id}/seats`);

        if (!optionsRes.ok || !seatsRes.ok) {
          throw new Error("Could not load the seat map");
        }

        const optionsBody = await optionsRes.json();
        const seatsBody = await seatsRes.json();

        setOptions(optionsBody.data);
        setSections(seatsBody.data.sections);

        // seats that are already part of your hold: restore them as selected (first load only)
        if (reloadKey === 0) {
          const mine = [];

          seatsBody.data.sections.forEach((section) => {
            section.rows.forEach((row) => {
              row.seats.forEach((seat) => {
                if (seat.isMine) {
                  mine.push({
                    id: seat.id,
                    code: seat.code,
                    typeSlug: "adult",
                  });
                }
              });
            });
          });

          if (mine.length > 0) setSelected(mine);
        }
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session.id, reloadKey]);

  // countdown: always calculated from expiresAt
  useEffect(() => {
    if (!expiresAt) return;

    function tick() {
      const left = Math.round((expiresAt - Date.now()) / 1000);

      if (left <= 0) {
        handleReset("Your hold expired. Please re-select your seats.");
        return;
      }

      setSecondsLeft(left);
    }

    tick();
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // the token is no longer valid: log out, close this modal, ask to log in
  function handleLoggedOut() {
    logout();
    onClose();
    openLogin();
  }

  // Child tickets are hidden for 16+ and 18+ titles, cheapest first
  let ticketTypes = [];

  if (options) {
    ticketTypes = options.ticketTypes
      .filter((type) => {
        const blocked = type.blockedFromRatingAge;
        return !(blocked && movie.ageRating.minAge >= blocked);
      })
      .sort((a, b) => a.priceRatio - b.priceRatio);
  }

  // price preview while choosing seats
  function getSeatPrice(item) {
    const type = options.ticketTypes.find((t) => t.slug === item.typeSlug);
    return session.price * type.priceRatio;
  }

  let subtotal = 0;
  if (options) {
    selected.forEach((item) => {
      subtotal += getSeatPrice(item);
    });
  }

  function toggleSeat(seat) {
    const alreadySelected = selected.some((item) => item.id === seat.id);

    if (alreadySelected) {
      setSelected(selected.filter((item) => item.id !== seat.id));
      setMessage("");
      return;
    }

    if (selected.length >= options.maxSeatsPerOrder) {
      setMessage(`You can pick up to ${options.maxSeatsPerOrder} seats.`);
      return;
    }

    setSelected([
      ...selected,
      { id: seat.id, code: seat.code, typeSlug: "adult" },
    ]);
    setMessage("");
  }

  function changeType(seatId, typeSlug) {
    setSelected(
      selected.map((item) =>
        item.id === seatId ? { ...item, typeSlug: typeSlug } : item,
      ),
    );
  }

  function removeSeat(seatId) {
    setSelected(selected.filter((item) => item.id !== seatId));
    setMessage("");
  }

  // the hold is gone: back to step 1 with an empty selection
  function handleReset(text) {
    setHold(null);
    setExpiresAt(null);
    setSecondsLeft(null);
    setSelected([]);
    setStep("seats");
    setMessage("");
    setWarning(text);
    setReloadKey((key) => key + 1); // refetch the seat map
  }

  // someone else took some of the seats: drop those, keep the rest
  function handleContested(codes) {
    const names = codes.length > 0 ? codes.join(", ") : "A seat";

    setSelected(selected.filter((item) => !codes.includes(item.code)));
    setHold(null);
    setExpiresAt(null);
    setSecondsLeft(null);
    setStep("seats");
    setMessage("");
    setWarning(`${names} was just taken. Your other seats are still selected.`);
    setReloadKey((key) => key + 1);
  }

  // "Next: Checkout" holds the seats
  async function handleNext() {
    try {
      setHolding(true);
      setMessage("");
      setWarning("");

      const res = await apiFetch(`/sessions/${session.id}/holds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seats: selected.map((item) => ({
            seatId: item.id,
            ticketType: item.typeSlug,
          })),
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 409) {
        handleContested(body.contested || []);
        return;
      }

      if (res.status === 422) {
        // with "errors" it is a normal validation problem, otherwise a booking rule
        if (body.errors) {
          setMessage(firstMessage(Object.values(body.errors)[0]));
        } else {
          setMessage(body.message);
        }
        return;
      }

      if (res.status === 401) {
        handleLoggedOut();
        return;
      }

      if (!res.ok) {
        throw new Error(body.message || "Could not hold the seats");
      }

      setHold(body.data);
      setExpiresAt(new Date(body.data.expiresAt).getTime());
      setStep("checkout");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setHolding(false);
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: undefined });
  }

  // "Pay" turns the hold into an order
  async function handlePay() {
    try {
      setPaying(true);
      setMessage("");
      setFieldErrors({});

      const res = await apiFetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdId: hold.holdId, ...form }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 409) {
        handleContested(body.contested || []);
        return;
      }

      if (res.status === 403) {
        handleReset(
          "These seats belong to another account. Please choose again.",
        );
        return;
      }

      if (res.status === 422) {
        if (body.errors) {
          setFieldErrors(body.errors); // each key goes under its own input
        } else {
          handleReset(body.message); // "Your hold time expired..."
        }
        return;
      }

      if (res.status === 401) {
        handleLoggedOut();
        return;
      }

      if (!res.ok) {
        throw new Error(body.message || "Payment failed");
      }

      console.log(body.data); // the whole order, check the field names

      setOrder(body.data);
      setHold(null);
      setExpiresAt(null);
      setSecondsLeft(null);
      setStep("done");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setPaying(false);
    }
  }

  // closing without paying releases the seats
  function handleClose() {
    if (hold) {
      apiFetch(`/holds/${hold.holdId}`, { method: "DELETE" });
    }
    onClose();
  }

  function goToProfile() {
    onClose();
    navigate("/profile");
  }

  function goToTickets() {
    onClose();
    navigate("/profile/tickets");
  }

  function goToHome() {
    onClose();
    navigate("/");
  }

  function getSeatClass(seat, isSelected) {
    let className = styles.seat;

    if (isSelected) {
      className += ` ${styles.selected}`;
    } else if (seat.state === "held" && !seat.isMine) {
      className += ` ${styles.held}`;
    } else if (seat.state !== "available" && !seat.isMine) {
      className += ` ${styles.sold}`;
    }

    if (seat.aisleAfter) {
      className += ` ${styles.aisle}`;
    }

    return className;
  }

  // the Pay button turns red when every field has something in it
  const formFilled = Object.values(form).every((value) => value.trim() !== "");

  const subtitle = `${session.venue.name} · Hall ${session.hall.name} · ${formatLongDate(session.date)} · ${session.time} · ${session.format.name} · ${session.language.name}`;

  // SUCCESS SCREEN: drawn from the order the server sent back
  if (step === "done" && order) {
    const s = order.session;

    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.success}>
            <div className={styles.success_icon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>

            <h2>Booking confirmed!</h2>
            <p className={styles.success_text}>
              Your tickets are ready. We've sent the confirmation to your email.
            </p>

            <span className={styles.reference}>ORDER #{order.reference}</span>

            <div className={styles.receipt}>
              <div className={styles.receipt_top}>
                <img src={s.movie.posterUrl} alt={s.movie.posterUrl} />
                <div>
                  <h3>{s.movie.title}</h3>
                  <p>
                    {s.venue.name} · Hall {s.hall.name} ·{" "}
                    {formatShortDate(s.date)} · {s.time}
                  </p>
                </div>
              </div>

              <div className={styles.summary_row}>
                <span>Seats</span>
                <b>{order.tickets.map((t) => t.seatCode).join(", ")}</b>
              </div>
              <div className={styles.summary_row}>
                <span>Tickets</span>
                <b>
                  {summarizeTickets(
                    order.tickets.map((t) => t.ticketType.name),
                  )}
                </b>
              </div>

              <div className={styles.receipt_total}>
                <span>TOTAL PAID</span>
                <b>₾ {order.totalPrice}</b>
              </div>
            </div>

            <div className={styles.success_buttons}>
              <button
                type="button"
                className={styles.primary}
                onClick={goToTickets}
              >
                View my tickets
              </button>
              <button type="button" onClick={goToHome}>
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <h2>{movie.title}</h2>
            <p>{subtitle}</p>
          </div>

          {secondsLeft !== null && (
            <div className={styles.timer}>
              <span>SEATS HELD</span>
              <b>{formatTimer(secondsLeft)}</b>
            </div>
          )}
        </header>

        {warning && <p className={styles.warning}>{warning}</p>}

        {loading && <p className={styles.status}>Loading...</p>}
        {loadError && <p className={styles.status}>{loadError}</p>}

        {!loading && !loadError && options && (
          <div className={styles.body}>
            <div className={styles.left}>
              <div className={styles.tabs}>
                <span
                  className={
                    step === "seats" ? styles.tab_active : styles.tab_link
                  }
                  onClick={() => setStep("seats")}
                >
                  SEATS
                </span>
                <span className={step === "checkout" ? styles.tab_active : ""}>
                  CHECKOUT
                </span>
              </div>

              {step === "seats" && (
                <>
                  <div className={styles.screen}>SCREEN</div>

                  <div className={styles.map}>
                    {sections.map((section) => (
                      <div key={section.name}>
                        <p className={styles.section}>
                          {section.name.toUpperCase()} · ROWS{" "}
                          {section.rows[0].label}-
                          {section.rows[section.rows.length - 1].label}
                        </p>

                        {section.rows.map((row) => (
                          <div key={row.label} className={styles.row}>
                            <span className={styles.row_name}>{row.label}</span>

                            <div className={styles.row_seats}>
                              {row.seats.map((seat, index) => {
                                // no seat there at all: keep the space so the grid stays aligned
                                if (seat.state === "unavailable") {
                                  return (
                                    <span
                                      key={`${row.label}-${index}`}
                                      className={
                                        seat.aisleAfter
                                          ? `${styles.gap} ${styles.aisle}`
                                          : styles.gap
                                      }
                                    />
                                  );
                                }

                                const isSelected = selected.some(
                                  (item) => item.id === seat.id,
                                );
                                const canClick =
                                  seat.state === "available" ||
                                  seat.isMine ||
                                  isSelected;

                                return (
                                  <button
                                    key={`${row.label}-${index}`}
                                    type="button"
                                    className={getSeatClass(seat, isSelected)}
                                    disabled={!canClick}
                                    onClick={() => toggleSeat(seat)}
                                  >
                                    {seat.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className={styles.legend}>
                    <span>
                      <i className={styles.dot_available} /> Available
                    </span>
                    <span>
                      <i className={styles.dot_selected} /> Selected
                    </span>
                    <span>
                      <i className={styles.dot_sold} /> Sold
                    </span>
                    <span>
                      <i className={styles.dot_held} /> Held by another user
                    </span>
                  </div>
                </>
              )}

              {step === "checkout" && (
                <CheckoutForm
                  form={form}
                  errors={fieldErrors}
                  onChange={handleFormChange}
                />
              )}
            </div>

            {/* right side, step 1: the chosen seats */}
            {step === "seats" && (
              <aside className={styles.panel}>
                <h3>Your seats · Max {options.maxSeatsPerOrder}</h3>

                {selected.length === 0 && (
                  <p className={styles.hint}>
                    Pick up to {options.maxSeatsPerOrder} seats from the map.
                    Each seat can carry its own ticket type.
                  </p>
                )}

                <div className={styles.cards}>
                  {selected.map((item) => (
                    <div key={item.id} className={styles.card}>
                      <div className={styles.card_top}>
                        <span>
                          Seat <b>{item.code}</b>
                        </span>
                        <span className={styles.card_price}>
                          ₾{showPrice(getSeatPrice(item))}
                        </span>
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => removeSeat(item.id)}
                        >
                          ✕
                        </button>
                      </div>

                      <div className={styles.types}>
                        {ticketTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            className={
                              type.slug === item.typeSlug
                                ? `${styles.type} ${styles.type_active}`
                                : styles.type
                            }
                            onClick={() => changeType(item.id, type.slug)}
                          >
                            {type.name} {Math.round(type.priceRatio * 100)}%
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {message && <p className={styles.error}>{message}</p>}

                {message.toLowerCase().includes("profile") && (
                  <button
                    type="button"
                    className={styles.profile_link}
                    onClick={goToProfile}
                  >
                    Go to my profile
                  </button>
                )}

                <div className={styles.footer}>
                  <div className={styles.subtotal}>
                    <span>SUBTOTAL</span>
                    <b>₾{showPrice(subtotal)}</b>
                  </div>

                  <button
                    type="button"
                    className={styles.next_btn}
                    disabled={selected.length === 0 || holding}
                    onClick={handleNext}
                  >
                    {holding ? "Holding seats..." : "Next: Checkout"}
                  </button>
                </div>
              </aside>
            )}

            {/* right side, step 2: summary of what the server is holding */}
            {step === "checkout" && hold && (
              <aside className={styles.panel}>
                <h3>Summary</h3>

                <div className={styles.summary_card}>
                  <h4>{movie.title}</h4>
                  <p>
                    Hall {session.hall.name} · {formatShortDate(session.date)} ·{" "}
                    {session.time}
                  </p>

                  <div className={styles.summary_row}>
                    <span>Seats</span>
                    <b>{hold.seats.map((s) => s.code).join(", ")}</b>
                  </div>
                  <div className={styles.summary_row}>
                    <span>Tickets</span>
                    <b>
                      {summarizeTickets(
                        hold.seats.map((s) => s.ticketType.name),
                      )}
                    </b>
                  </div>
                </div>

                {message && <p className={styles.error}>{message}</p>}

                <div className={styles.footer}>
                  <div className={styles.subtotal}>
                    <span>SUBTOTAL</span>
                    <b>₾{showPrice(hold.subtotal)}</b>
                  </div>

                  <button
                    type="button"
                    className={styles.next_btn}
                    disabled={!formFilled || paying}
                    onClick={handlePay}
                  >
                    {paying ? "Paying..." : "Pay: Complete order"}
                  </button>
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;

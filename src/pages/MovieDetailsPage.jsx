import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiFetch, getMovie } from "../api";
import MovieSessions from "../components/MovieSessions";
import MovieDetailsSidebar from "../components/MovieDetailsSidebar";
import styles from "../styles/movieDetailsPage.module.css";
import ProfileRequiredModal from "../modals/ProfileRequiredModal";
import timer from "../images/icons/timer.png";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import BookingModal from "../modals/BookingModal";

// the next 7 days, for the date buttons
function getNextDays(count) {
  const days = [];

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    days.push({
      iso: `${year}-${month}-${day}`,
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      number: d.getDate(),
    });
  }

  return days;
}

function MovieDetailsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openLogin } = useModal();
  const [selectedSession, setSelectedSession] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { slug } = useParams();

  const days = getNextDays(7);

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(days[0].iso); // starts on today
  const [venues, setVenues] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(false);

  // load the movie
  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError("");
        const data = await getMovie(slug);
        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [slug]);

  // load the sessions of the selected date
  useEffect(() => {
    if (!movie || movie.isComingSoon) return;

    let ignore = false; // so an old response can't overwrite a newer one

    async function loadSessions() {
      try {
        setSessionsLoading(true);
        setSessionsError(false);

        const res = await apiFetch(`/movies/${slug}/sessions?date=${date}`);
        if (!res.ok) throw new Error("Failed to load sessions");

        const body = await res.json();

        if (!ignore) setVenues(body.data);
      } catch {
        if (!ignore) setSessionsError(true);
      } finally {
        if (!ignore) setSessionsLoading(false);
      }
    }

    loadSessions();

    return () => {
      ignore = true;
    };
  }, [movie, slug, date]);

  // remember this movie for the "Recently viewed" section on the home page
  useEffect(() => {
    if (!movie) return;

    const item = {
      slug: movie.slug,
      title: movie.title,
      posterUrl: movie.posterUrl,
      genre: movie.genres?.[0]?.name,
      runtimeMinutes: movie.runtimeMinutes,
      ageRating: movie.ageRating?.code,
    };

    let old = [];
    try {
      old = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    } catch {
      old = [];
    }

    // newest first, no duplicates, keep the last 6
    const others = old.filter((m) => m.slug !== item.slug);
    const updated = [item, ...others].slice(0, 6);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [movie]);

  function handleSelectSession(session) {
    if (!user) {
      openLogin(); // booking needs a logged in user
      return;
    }

    if (!user.profileComplete) {
      setShowProfileModal(true);
      return;
    }

    setSelectedSession(session);
  }

  if (loading) {
    return <p>...loading</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (!movie) {
    return <p>Movie not found</p>;
  }

  return (
    <>
      <section
        className={styles.hero}
        style={{
          backgroundImage: `url(${movie.backdropUrl})`,
        }}
      >
        <div className={`container ${styles.hero_content}`}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className={styles.poster}
          />

          <div className={styles.movie_info}>
            <span className={styles.now_playing}>
              {movie.isComingSoon ? "COMING SOON" : "NOW PLAYING"}
            </span>

            <h1>{movie.title}</h1>

            <p>{movie.synopsis}</p>

            <div className={styles.movie_meta}>
              <span className={styles.age}>{movie.ageRating.code}</span>
              <span className={styles.chip}>
                <img src={timer} alt="timer" />
                {movie.runtimeMinutes} Min
              </span>
              <span className={styles.chip}>{movie.formats[0]?.name}</span>
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <MovieSessions
          days={days}
          date={date}
          onDateChange={setDate}
          venues={venues}
          loading={sessionsLoading}
          error={sessionsError}
          isComingSoon={movie.isComingSoon}
          onSelect={handleSelectSession}
        />

        <MovieDetailsSidebar movie={movie} />
      </div>
      {selectedSession && (
        <BookingModal
          session={selectedSession}
          movie={movie}
          onClose={() => setSelectedSession(null)}
        />
      )}
      {showProfileModal && (
        <ProfileRequiredModal
          onClose={() => setShowProfileModal(false)}
          onConfirm={() => navigate("/profile")}
        />
      )}
    </>
  );
}

export default MovieDetailsPage;

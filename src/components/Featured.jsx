import { useState, useEffect } from "react";
import styles from "../styles/featured.module.css";
import ticket from "../images/icons/ticket.png";

function Featured() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("https://api.kinoxii.redberryinternship.ge/api/movies/featured")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        return response.json();
      })
      .then((data) => {
        setMovies(data.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const nextMovie = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const previousMovie = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1,
    );
  };
  useEffect(() => {
    if (movies.length < 2) return;
    const id = setTimeout(nextMovie, 5000);
    return () => clearTimeout(id);
  }, [currentIndex, movies.length]);

  const movie = movies[currentIndex];

  if (loading) {
    return (
      <div className={styles.featured}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading movies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div
      className={styles.featured}
      style={{
        "--bg-image": `url(${movies[currentIndex].backdropUrl})`,
      }}
    >
      <div className={styles.featured_content}>
        <span className={styles.badge}>Premiere · {movie.releaseDate}</span>

        <h2>{movie.title}</h2>

        <div className={styles.details}>
          <span className={styles.age}>{movie.ageRating.code}</span>
          <span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2 2M9 2h6" />
            </svg>
            {movie.runtimeMinutes} Min
          </span>
          {movie.formats.map((format) => (
            <span key={format.id}>{format.name}</span>
          ))}
        </div>

        <p className={styles.synopsis}>{movie.synopsis}</p>

        <div className={styles.actions}>
          <div className={styles.buy}>
            <img src={ticket} alt="ticket" />
            <span>Buy tickets</span>
          </div>
          <button className={styles.secondary}>All sessions</button>
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.lines}>
          {movies.map((movie, i) => (
            <button
              key={movie.id}
              className={`${styles.line} ${i === currentIndex ? styles.active : ""}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to ${movie.title}`}
            />
          ))}
        </div>

        <button
          className={styles.arrow}
          onClick={previousMovie}
          aria-label="Previous"
        >
          &#10094;
        </button>
        <button className={styles.arrow} onClick={nextMovie} aria-label="Next">
          &#10095;
        </button>
      </div>
    </div>
  );
}
export default Featured;

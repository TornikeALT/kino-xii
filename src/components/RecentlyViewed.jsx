import { useState } from "react";
import { Link } from "react-router";
import styles from "../styles/recentlyViewed.module.css";

function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  } catch {
    return [];
  }
}

function RecentlyViewed() {
  // read once when the home page opens
  const [movies] = useState(getRecentlyViewed);

  // nothing viewed yet: hide the whole section
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className={`container ${styles.section}`}>
      <h2>Recently viewed</h2>

      <div className={styles.list}>
        {movies.map((movie) => (
          <Link
            key={movie.slug}
            to={`/movies/${movie.slug}`}
            className={styles.card}
          >
            <img
              src={movie.posterUrl}
              alt={movie.posterUrl}
              className={styles.poster}
            />

            <div className={styles.info}>
              <h3>{movie.title}</h3>
              <p>
                {[movie.genre, `${movie.runtimeMinutes} min`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {movie.ageRating && (
                <span className={styles.age}>{movie.ageRating}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;

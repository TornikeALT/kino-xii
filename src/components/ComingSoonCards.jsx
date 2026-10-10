import { useState, useEffect } from "react";
import styles from "../styles/comingSoonCard.module.css";
import bell from "../images/icons/bell.png";
import { getNotification } from "../api";
import { useNavigate } from "react-router";

function ComingSoonCards() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.kinoxii.redberryinternship.ge/api/movies/coming-soon")
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

  async function handleNotify(slug) {
    try {
      await getNotification(slug);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div>
        <span>Loading movies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <section className={styles.coming_soon}>
        <div className={styles.navigation}>
          <h2>COMING SOON...</h2>
          <h3 className={styles.see_all}>See all</h3>
        </div>

        <div className={styles.card_wrapper}>
          {movies.map((movie) => (
            <div className={styles.card} key={movie.id}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className={styles.poster}
                onClick={() => navigate(`/movies/${movie.slug}`)}
              />
              <div className={styles.details}>
                <h4 className={styles.release}>
                  In cinemas{" "}
                  {new Date(movie.releaseDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                  })}
                </h4>
                <h3 className={styles.title}>{movie.title}</h3>
                <p className={styles.meta}>
                  {movie.genres[0]?.name} · {movie.runtimeMinutes} min
                </p>
                <span className={styles.age}>{movie.ageRating.code}</span>
                <div
                  className={styles.notify}
                  onClick={() => handleNotify(movie.slug)}
                >
                  <img src={bell} alt="bell" />
                  <span>Notify Me</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ComingSoonCards;

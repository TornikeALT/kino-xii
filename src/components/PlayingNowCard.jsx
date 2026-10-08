import { useEffect, useState } from "react";
import styles from "../styles/playingNow.module.css";
import { useNavigate } from "react-router";

function PlayingNowCard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.kinoxii.redberryinternship.ge/api/movies/now-playing")
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
      <div className={styles.navigation}>
        <h2>NOW PLAYING</h2>
        <h3 className={styles.see_all} onClick={() => navigate("/sessions")}>
          See All
        </h3>
      </div>
      <div className={styles.card_wrapper}>
        {movies.map((movie) => {
          return (
            <div className={styles.card} key={movie.id}>
              <img src={movie.posterUrl} alt={movie.posterUrl} />
              <h4 className={styles.title}>{movie.title}</h4>
              <p className={styles.meta}>
                {movie.genres[0]?.name} · {movie.runtimeMinutes} min
              </p>
              <span className={styles.age}>{movie.ageRating.code}</span>
              <div className={styles.price_buy}>
                <span className={styles.price}>From ₾ {movie.fromPrice}</span>
                <button onClick={() => navigate(`movies/${movie.slug}`)}>
                  Buy Ticket
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PlayingNowCard;

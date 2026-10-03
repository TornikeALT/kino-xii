import { useState, useEffect } from "react";
import styles from "../styles/featured.module.css";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  console.log(movies[0]);
  return (
    <div
      className={styles.featured}
      style={{
        backgroundImage: `url(${movies[currentIndex].backdropUrl})`,
      }}
    >
      <div className={styles.featured_content}>
        <p>{movies[currentIndex].releaseDate}</p>

        <h2>{movies[currentIndex].title}</h2>

        <div className={styles.details}>
          <span>{movies[currentIndex].runtimeMinutes} min</span>
          <span>{movies[currentIndex].ageRating.code}</span>

          {movies[currentIndex].formats.map((format) => (
            <span key={format.id}>{format.name}</span>
          ))}
        </div>

        <p>{movies[currentIndex].synopsis}</p>

        <button onClick={previousMovie}>PREV</button>
        <button onClick={nextMovie}>NEXT</button>
      </div>
    </div>
  );
}
export default Featured;

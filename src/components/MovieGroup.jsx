import SessionCard from "./SessionCard";
import styles from "../styles/movieGroup.module.css";

function MovieGroup({ group, onSelect }) {
  const { movie, sessions } = group;

  return (
    <article className={styles.group}>
      <header className={styles.header}>
        <img src={movie.posterUrl} alt="" className={styles.poster} />

        <div>
          <div className={styles.title_row}>
            <h3>{movie.title}</h3>
            <span className={styles.age}>{movie.ageRating?.code}</span>
          </div>
          {movie.runtimeMinutes && <p>{movie.runtimeMinutes} min</p>}
        </div>
      </header>

      <div className={styles.cards}>
        {sessions.map((s) => (
          <SessionCard key={s.id} session={s} onSelect={onSelect} />
        ))}
      </div>
    </article>
  );
}

export default MovieGroup;

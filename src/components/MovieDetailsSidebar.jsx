import styles from "../styles/movieDetailsSidebar.module.css";

function toText(value) {
  if (Array.isArray(value)) {
    return value.map((item) => item.name ?? item).join(", ");
  }
  return value;
}

function Row({ label, value }) {
  if (!value) return null;

  return (
    <div className={styles.row}>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function MovieDetailsSidebar({ movie }) {
  const releaseDate = new Date(movie.releaseDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const formats = movie.formats.map((format) => format.name).join(", ");

  return (
    <aside className={styles.sidebar}>
      <h2>Details</h2>

      <Row label="DIRECTOR" value={toText(movie.director)} />
      <Row label="MAIN CAST" value={toText(movie.cast)} />
      <Row label="DURATION" value={`${movie.runtimeMinutes} minutes`} />
      <Row label="RELEASE DATE" value={releaseDate} />
      <Row label="FORMATS" value={formats} />
      <Row label="FROM" value={`₾${movie.fromPrice}`} />

      <div className={styles.note}>
        <span>RATING NOTE</span>
        <p>
          <b>{movie.ageRating.code}</b> {movie.ageRating.description}
        </p>
      </div>
    </aside>
  );
}

export default MovieDetailsSidebar;

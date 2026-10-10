import { useEffect, useState } from "react";
import { Link } from "react-router";
import { searchMovies } from "../api.js";
import { useNavigate } from "react-router";
import popcorn from "../images/icons/popcorn.png";
import searchIcon from "../images/icons/search.png";
import styles from "../styles/search.module.css";

function Search({ query, isFocused, onClose }) {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  const trimmed = query.trim();
  const visibleResults = trimmed ? results : [];

  useEffect(() => {
    if (!trimmed) {
      return;
    }

    const controller = new AbortController(); 

    const timer = setTimeout(async () => {
      setStatus("loading");

      try {
        const body = await searchMovies(query, {
          signal: controller.signal,
        });
        const list = Array.isArray(body) ? body : (body?.results ?? []);
        setResults(list);
        setStatus("done");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err);
          setStatus("error");
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  if (!query && !isFocused) return null;

  function browseAll() {
    navigate("/sessions");
    onClose();
  }

  const browseButton = (
    <button type="button" className={styles.btn} onClick={browseAll}>
      Browse all sessions
    </button>
  );

  let content;

  if (!trimmed) {
    // STATE for search
    content = (
      <div className={styles.empty}>
        <div className={styles.icon_circle}>
          <img src={popcorn} alt="popcorn" />
        </div>
        <h3>What do you want to watch?</h3>
        <p>Search by title, director or cast</p>
        {browseButton}
      </div>
    );
  } else if (status === "loading") {
    content = <p className={styles.status}>Searching...</p>;
  } else if (status === "error") {
    content = <p className={styles.status}>Something went wrong. Try again.</p>;
  } else if (visibleResults.length === 0) {
    //   no results
    content = (
      <div className={styles.empty}>
        <div className={styles.icon_circle}>
          <img src={searchIcon} alt="search" />
        </div>
        <h3>No results for “{trimmed}”</h3>
        <p>Check the spelling or try another film or live event.</p>
        {browseButton}
      </div>
    );
  } else {
    //  results
    content = (
      <>
        <div className={styles.results_header}>
          <span>FILMS EVENTS</span>
          <span>
            {visibleResults.length}{" "}
            {visibleResults.length === 1 ? "result" : "results"}
          </span>
        </div>

        <ul className={styles.list}>
          {visibleResults.map((movie) => (
            <li key={movie.id}>
              <Link
                to={`/movies/${movie.slug}`}
                className={styles.row}
                onClick={onClose}
              >
                <img
                  src={movie.posterUrl}
                  alt="poster"
                  className={styles.poster}
                />

                <div className={styles.info}>
                  <p className={styles.title}>{movie.title}</p>
                  <p className={styles.meta}>
                    {[
                      movie.kind,
                      movie.ageRating.code,
                      movie.runtimeMinutes && "min",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                {movie.isComingSoon ? (
                  <span className={styles.soon}>Coming Soon</span>
                ) : (
                  movie.fromPrice != null && (
                    <span className={styles.price}>
                      from ₾{movie.fromPrice}
                    </span>
                  )
                )}
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div className={styles.search} onMouseDown={(e) => e.preventDefault()}>
      {content}
    </div>
  );
}

export default Search;

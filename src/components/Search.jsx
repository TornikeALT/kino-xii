import popcorn from "../images/icons/popcorn.png";
import searchIcon from "../images/icons/search.png";
import styles from "../styles/search.module.css";

function Search({ search, isSearchFocused }) {
  const showSearch = search.length > 0 || isSearchFocused;
  return (
    <>
      {showSearch && (
        <div className={styles.search}>
          <img src={popcorn} alt="popcorn" />
          <h3>What Do you want to watch ?</h3>
          <p>Search by title, director or cast</p>
          <button
            className={styles.btn}
            onMouseDown={(e) => e.preventDefault()}
          >
            Browse all sessions
          </button>
        </div>
      )}
    </>
  );
}

export default Search;

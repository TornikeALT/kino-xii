import { useEffect, useState } from "react";
import { searchMovies } from "../api.js";
import popcorn from "../images/icons/popcorn.png";
// import searchIcon from "../images/icons/search.png";
import styles from "../styles/search.module.css";

function Search() {
  return (
    <>
      <div className={styles.search} onMouseDown={(e) => e.preventDefault()}>
        <img src={popcorn} alt="popcorn" />
        <h3>What Do you want to watch ?</h3>
        <p>Search by title, director or cast</p>
        <button className={styles.btn}>Browse all sessions</button>
      </div>
    </>
  );
}

export default Search;

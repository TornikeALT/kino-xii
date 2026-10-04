import styles from "../styles/footer.module.css";

function Footer() {
  return (
    <footer>
      <div className={styles.main_logo}>
        <h2 className={styles.kino}>KINO</h2>
        <h2 className={styles.xii}>XII</h2>
      </div>
      <p className={styles.rights}>© 2026 Kino XII. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

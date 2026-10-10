import styles from "../styles/returnModal.module.css";

function ReturnModal({ onClose, onConfirm }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Refun this order ?</h2>
        <div className={styles.buttons}>
          <button type="button" className={styles.primary} onClick={onConfirm}>
            Yes
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReturnModal;

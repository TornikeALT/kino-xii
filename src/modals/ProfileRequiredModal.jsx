import styles from "../styles/profileRequiredModal.module.css";

function ProfileRequiredModal({ onClose, onConfirm }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="profile-required-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="profile-required-title">Complete your profile</h2>
        <p>Add your name, mobile number and date of birth to book tickets.</p>

        <div className={styles.buttons}>
          <button type="button" className={styles.primary} onClick={onConfirm}>
            Go to profile
          </button>
          <button type="button" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileRequiredModal;

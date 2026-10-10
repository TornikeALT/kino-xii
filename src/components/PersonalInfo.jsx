import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import styles from "../styles/personalInfo.module.css";

const firstMessage = (m) => (Array.isArray(m) ? m[0] : m);

function PersonalInfo() {
  const { user, updateProfile } = useAuth();

  const [edits, setEdits] = useState({});
  const [venues, setVenues] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saved = {
    fullName: user?.fullName || "",
    mobileNumber: user?.mobileNumber || "",
    dateOfBirth: user?.dateOfBirth || "",
    preferredVenueId: user?.preferredVenue?.id ?? "",
  };

  const form = { ...saved, ...edits };

  // load the venues for the dropdown
  useEffect(() => {
    apiFetch("/filter-options")
      .then((res) => res.json())
      .then((body) => setVenues(body.data?.venues ?? []))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setEdits({ ...edits, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage("");

    try {
      await updateProfile(form);
      setEdits({});
      setMessage("Changes saved");
    } catch (err) {
      setErrors(err.errors || {});

      if (!err.errors || Object.keys(err.errors).length === 0) {
        setMessage(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  const inputProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: handleChange,
    className: errors[name] ? styles.input_error : "",
  });

  const fieldError = (name) =>
    errors[name] ? (
      <p className={styles.error}>{firstMessage(errors[name])}</p>
    ) : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="fullName">Full name</label>
        <input {...inputProps("fullName")} />
        {fieldError("fullName")}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={user?.email || ""}
          readOnly
          className={styles.readonly}
        />
        <small>Set at registration and cannot be changed</small>
      </div>

      <div className={styles.field}>
        <label htmlFor="mobileNumber">Mobile number</label>
        <input {...inputProps("mobileNumber")} type="tel" />
        {fieldError("mobileNumber")}
      </div>

      <div className={styles.field}>
        <label htmlFor="dateOfBirth">Date of birth</label>
        <input {...inputProps("dateOfBirth")} type="date" />
        {fieldError("dateOfBirth")}
      </div>

      <div className={styles.field}>
        <label htmlFor="preferredVenueId">Preferred Venue (Optional)</label>
        <select {...inputProps("preferredVenueId")}>
          <option value="">e.g. Text</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        {fieldError("preferredVenueId")}
      </div>

      <button type="submit" className={styles.save_btn} disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}

export default PersonalInfo;

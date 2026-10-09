import { Fragment } from "react";
import accepted from "../images/icons/green.png";
import styles from "../styles/bookingModal.module.css";

const FIELDS = [
  {
    name: "fullName",
    label: "Full name",
    placeholder: "e.g. Text",
    wide: true,
  },
  { name: "email", label: "Email", placeholder: "e.g. Text" },
  { name: "mobileNumber", label: "Mobile number", placeholder: "e.g. Text" },
  {
    name: "cardNumber",
    label: "Card number",
    placeholder: "e.g. 1234 4567 8901 2345",
    wide: true,
    divider: true, // a line above this field
  },
  { name: "expiry", label: "Expiry", placeholder: "e.g. 12/34" },
  { name: "cvv", label: "CVV", placeholder: "e.g. 123" },
];

// only used for the green tick, the server does the real validation
const looksValid = {
  fullName: (value) => value.trim().length > 0,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  mobileNumber: (value) => /^5\d{8}$/.test(value.replace(/\s/g, "")),
  cardNumber: (value) => /^\d{16}$/.test(value.replace(/\s/g, "")),
  expiry: (value) => /^\d{2}\/\d{2}$/.test(value),
  cvv: (value) => /^\d{3,4}$/.test(value),
};

// errors can be a string or an array of strings
function firstMessage(value) {
  return Array.isArray(value) ? value[0] : value;
}

function CheckoutForm({ form, errors, onChange }) {
  return (
    <div className={styles.form}>
      {FIELDS.map((field) => {
        const value = form[field.name];
        const hasError = Boolean(errors[field.name]);
        const showTick = looksValid[field.name](value) && !hasError;

        return (
          <Fragment key={field.name}>
            {field.divider && <hr className={styles.divider} />}

            <div
              className={
                field.wide ? `${styles.field} ${styles.wide}` : styles.field
              }
            >
              <label htmlFor={field.name}>{field.label}</label>

              <div className={styles.input_wrap}>
                <input
                  id={field.name}
                  name={field.name}
                  value={value}
                  placeholder={field.placeholder}
                  onChange={onChange}
                  className={hasError ? styles.input_error : ""}
                />
                {showTick && (
                  <img src={accepted} alt="" className={styles.tick} />
                )}
              </div>

              {hasError && (
                <p className={styles.field_error}>
                  {firstMessage(errors[field.name])}
                </p>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default CheckoutForm;

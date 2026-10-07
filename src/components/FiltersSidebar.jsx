import { nextDays, toISODate } from "../sessionsApi";
import styles from "../styles/filtersSidebar.module.css";

const optValue = (o) => o.slug ?? o.id; // slug for venues/formats/languages, id for timeBands
const optLabel = (o) => o.name ?? o.label;

// "Morning (before 12:00)" -> ["Morning", "before 12:00"]
function splitLabel(label) {
  const m = label.match(/^(.*?)\s*\((.*)\)$/);
  return m ? [m[1], m[2]] : [label, ""];
}

function CheckboxGroup({ title, items, selected, onToggle, hint }) {
  return (
    <section className={styles.group}>
      <h4>{title}</h4>
      {items.map((item) => {
        const value = optValue(item);
        const hintText = hint?.(item);

        return (
          <label key={value} className={styles.check}>
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => onToggle(value)}
            />
            <span className={styles.box} />
            <span className={styles.label}>{optLabel(item)}</span>
            {hintText && <small>{hintText}</small>}
          </label>
        );
      })}
    </section>
  );
}

function FiltersSidebar({
  options,
  availableFormats,
  venues,
  formats,
  languages,
  bands,
  date,
  activeFilters,
  onToggle, // (paramKey, value)
  onDate,
  onClear,
}) {
  if (!options) return <aside className={styles.sidebar} />;

  const timeBands = options.timeBands.map((b) => {
    const [name, hint] = splitLabel(b.label);
    return { ...b, label: name, hint };
  });

  return (
    <aside className={styles.sidebar}>
      <h3>Filters</h3>

      <CheckboxGroup
        title="VENUE"
        items={options.venues}
        selected={venues}
        onToggle={(v) => onToggle("venues[]", v)}
        hint={(venue) => venue.city}
      />

      <section className={styles.group}>
        <h4>DATE</h4>
        <div className={styles.dates}>
          {nextDays(14).map((d) => {
            const iso = toISODate(d);
            return (
              <button
                key={iso}
                type="button"
                className={`${styles.day} ${iso === date ? styles.day_active : ""}`}
                onClick={() => onDate(iso)}
              >
                <span>
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <b>{d.getDate()}</b>
              </button>
            );
          })}
        </div>
      </section>

      <CheckboxGroup
        title="FORMAT"
        items={availableFormats}
        selected={formats}
        onToggle={(v) => onToggle("formats[]", v)}
      />

      <CheckboxGroup
        title="LANGUAGE"
        items={options.languages}
        selected={languages}
        onToggle={(v) => onToggle("languages[]", v)}
      />

      <CheckboxGroup
        title="TIME OF DAY"
        items={timeBands}
        selected={bands}
        onToggle={(v) => onToggle("bands[]", v)}
        hint={(band) => band.hint}
      />

      <button
        type="button"
        className={styles.clear}
        onClick={onClear}
        disabled={activeFilters === 0}
      >
        Clear Filters
      </button>
      <p className={styles.active_Filters}> {activeFilters} filters active</p>
    </aside>
  );
}

export default FiltersSidebar;

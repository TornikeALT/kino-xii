import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import FiltersSidebar from "../components/FiltersSidebar";
import MovieGroup from "../components/MovieGroup";
import {
  getFilterOptions,
  getSessionsRequest,
  toISODate,
} from "../sessionsApi";
import styles from "../styles/sessionsPage.module.css";

const VENUES = "venues[]";
const FORMATS = "formats[]";
const LANGUAGES = "languages[]";
const BANDS = "bands[]";

// [1, 2, 3, "...", 10]
function pageList(current, last) {
  const set = new Set([1, last, current - 1, current, current + 1]);
  const pages = [...set]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);

  const result = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) result.push("...");
    result.push(p);
  });
  return result;
}

function SessionsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState(null);
  const [groups, setGroups] = useState([]); // [{ movie, sessions }]
  const [meta, setMeta] = useState({});
  const [status, setStatus] = useState("loading"); // loading | done | error

  // URL -> filters
  const venues = params.getAll(VENUES);
  const formats = params.getAll(FORMATS);
  const languages = params.getAll(LANGUAGES);
  const bands = params.getAll(BANDS);
  const date = params.get("date") || toISODate(new Date());
  const sort = params.get("sort") || "";
  const page = Number(params.get("page")) || 1;

  // the design shows "0 filters active" with a date selected, so the date isn't counted
  const activeFilters =
    venues.length + formats.length + languages.length + bands.length;

  // sidebar options: fetched once for the whole app
  useEffect(() => {
    getFilterOptions()
      .then((body) => setOptions(body.data))
      .catch(() => {});
  }, []);

  // sessions: reload whenever the URL changes
  const query = params.toString();

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    getSessionsRequest(query, controller.signal)
      .then((body) => {
        setGroups(body.data ?? []);
        setMeta(body.meta ?? {});
        setStatus("done");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [query]);

  // formats to offer: top-level list (design order), narrowed to the selected venues
  const availableFormats = useMemo(() => {
    if (!options) return [];
    if (!venues.length) return options.formats;

    const allowed = new Set(
      options.venues
        .filter((v) => venues.includes(v.slug))
        .flatMap((v) => v.formats.map((f) => f.slug)),
    );

    return options.formats.filter((f) => allowed.has(f.slug));
  }, [options, venues.join(",")]);

  // checkbox filters (venues, formats, languages, bands)
  function toggleValue(key, value) {
    const next = new URLSearchParams(params);

    const current = next.getAll(key);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    next.delete(key);
    updated.forEach((v) => next.append(key, v));

    // selecting venues narrows formats: drop selected formats those venues don't have
    if (key === VENUES && options) {
      const selected = options.venues.filter((v) => updated.includes(v.slug));

      if (selected.length) {
        const allowed = new Set(
          selected.flatMap((v) => v.formats.map((f) => f.slug)),
        );
        const kept = next.getAll(FORMATS).filter((f) => allowed.has(f));

        next.delete(FORMATS);
        kept.forEach((f) => next.append(FORMATS, f));
      }
    }

    next.delete("page"); // any filter change goes back to page 1
    setParams(next);
  }

  // single-value params: date, sort, page
  function setParam(key, value) {
    const next = new URLSearchParams(params);

    if (value) next.set(key, value);
    else next.delete(key);

    if (key !== "page") next.delete("page"); // date and sort also reset the page
    setParams(next);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    if (params.get("date")) next.set("date", params.get("date"));
    setParams(next);
  }
  function handleSelectSession(session) {
    navigate(`/movies/${session.movie.slug}`);
  }
  const lastPage = meta.lastPage ?? 1;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sessions</h1>
      <p className={styles.subtitle}>Browse showtimes across all venues</p>

      <div className={styles.layout}>
        <FiltersSidebar
          options={options}
          availableFormats={availableFormats}
          venues={venues}
          formats={formats}
          languages={languages}
          bands={bands}
          date={date}
          activeFilters={activeFilters}
          onToggle={toggleValue}
          onDate={(iso) => setParam("date", iso)}
          onClear={clearFilters}
        />

        <section className={styles.results}>
          <div className={styles.header}>
            <p className={styles.showing}>
              Showing {meta.totalSessions ?? 0} sessions
            </p>

            <label className={styles.sort}>
              <span>Sort:</span>
              <select
                value={sort || "time_asc"}
                onChange={(e) =>
                  setParam(
                    "sort",
                    e.target.value === "time_asc" ? "" : e.target.value,
                  )
                }
              >
                {options?.sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {status === "loading" && <p className={styles.status}>Loading...</p>}
          {status === "error" && (
            <p className={styles.status}>Could not load sessions. Try again.</p>
          )}
          {status === "done" && groups.length === 0 && (
            <p className={styles.status}>No sessions match these filters.</p>
          )}

          {status === "done" &&
            groups.map((g) => (
              <MovieGroup
                key={g.movie.id}
                group={g}
                onSelect={handleSelectSession}
              />
            ))}

          {lastPage > 1 && (
            <nav className={styles.pager} aria-label="Pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setParam("page", String(page - 1))}
                aria-label="Previous page"
              >
                ‹
              </button>

              {pageList(page, lastPage).map((p, i) =>
                p === "..." ? (
                  <span key={`gap-${i}`} className={styles.gap}>
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={p === page ? styles.page_active : ""}
                    onClick={() => setParam("page", String(p))}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={page >= lastPage}
                onClick={() => setParam("page", String(page + 1))}
                aria-label="Next page"
              >
                ›
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

export default SessionsPage;

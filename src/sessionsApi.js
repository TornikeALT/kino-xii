import { apiFetch } from "./api";

async function handleResponse(res, fallback) {
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || fallback);
    error.status = res.status;
    error.errors = body.errors || {};
    throw error;
  }

  return body; // keep the whole body: data and meta
}

// FILTER OPTIONS: "fetch once and cache"
let optionsPromise = null;

export function getFilterOptions() {
  if (!optionsPromise) {
    optionsPromise = apiFetch("/filter-options")
      .then((res) => handleResponse(res, "Could not load filters"))
      .catch((err) => {
        optionsPromise = null; // allow a retry after a failure
        throw err;
      });
  }
  return optionsPromise;
}

// SESSIONS: the query string is the page's own URL params
export async function getSessionsRequest(queryString, signal) {
  const res = await apiFetch(`/sessions?${queryString}`, { signal });
  return handleResponse(res, "Could not load sessions");
}

// date helpers (local time; toISOString() would shift the day in Tbilisi)
export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nextDays(count = 14) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api";

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// LOGIN
export async function loginRequest(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || "Login failed");

    error.status = res.status;
    error.errors = body.errors || {};

    throw error;
  }

  return body.data;
}

// REGISTER
export async function registerRequest({
  username,
  email,
  password,
  passwordConfirmation,
  avatar,
}) {
  const form = new FormData();

  form.append("username", username);
  form.append("email", email);
  form.append("password", password);
  form.append("password_confirmation", passwordConfirmation);

  if (avatar) {
    form.append("avatar", avatar);
  }

  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: form,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || "Registration failed");

    error.status = res.status;
    error.errors = body.errors || {};

    throw error;
  }

  return body.data;
}

// UPDATE PROFILE
export async function updateProfileRequest({
  fullName,
  mobileNumber,
  dateOfBirth,
  preferredVenueId,
  avatar,
}) {
  const form = new FormData();

  form.append("fullName", fullName);
  form.append("mobileNumber", mobileNumber);
  form.append("dateOfBirth", dateOfBirth);

  if (preferredVenueId) {
    form.append("preferredVenueId", preferredVenueId);
  }

  if (avatar) {
    form.append("avatar", avatar);
  }

  const res = await apiFetch("/profile", {
    method: "PUT",
    body: form,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || "Profile update failed");

    error.status = res.status;
    error.errors = body.errors || {};

    throw error;
  }

  return body.data;
}

// SEARCH MOVIES
export async function searchMovies(query, options = {}) {
  const res = await apiFetch(`/search?q=${encodeURIComponent(query)}`, options);

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || "Search failed");

    error.status = res.status;
    error.errors = body.errors || {};

    throw error;
  }

  return body.data;
}
// GET MOVIE

export async function getMovie(slug) {
  const response = await fetch(`${BASE_URL}/movies/${slug}`);

  if (!response.ok) {
    throw new Error("Failed To load movie");
  }

  const data = await response.json();

  return data.data;
}

//GET NOTIFICATION

export async function getNotification(slug) {
  const response = await apiFetch(`/movies/${slug}/notify`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed To get notification");
  }

  const data = await response.json();

  return data;
}

// GET MY TICKETS
export async function getTickets(filter) {
  const query = filter ? `?filter=${filter}` : "";

  const res = await apiFetch(`/tickets${query}`);

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || "Could not load tickets");

    error.status = res.status;
    error.errors = body.errors || {};

    throw error;
  }

  return body.data;
}

// PROTECTED REQUESTS
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearToken();
  }

  return res;
}

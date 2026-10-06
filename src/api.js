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

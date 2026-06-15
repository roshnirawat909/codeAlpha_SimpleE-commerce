const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const opts = { method, headers: { ...headers } };

  if (body !== undefined) {
    opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
    opts.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, opts);
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.msg || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

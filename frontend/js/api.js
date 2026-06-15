const API_BASE = 'http://localhost:5001';

export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!res.ok) {
    const msg = data?.msg || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('token', token);
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  const u = localStorage.getItem('user');
  if (!u) return null;
  try { return JSON.parse(u); } catch { return null; }
}

export function storeUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}


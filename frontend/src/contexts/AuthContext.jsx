import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, getAuthToken, getStoredUser, clearAuth } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async ({ email, password }) => {
    const data = await apiFetch('/api/users/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async ({ name, email, password }) => {
    const data = await apiFetch('/api/users/register', {
      method: 'POST',
      body: { name, email, password },
    });
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuth();
  };

  const value = useMemo(
    () => ({ token, user, login, register, logout, isAuthenticated: Boolean(token), error }),
    [token, user, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

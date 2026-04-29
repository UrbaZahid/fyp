// src/api/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'https://fyp-production-83ba.up.railway.app/api',
});

// ── Request interceptor: attach JWT token ────────────────────────
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ── Response interceptor: on 401, clear stale auth ─────────────
// Fixes "navbar wrong on project run" — expired/invalid token gets
// wiped so navbar shows Login/Register correctly without manual clear.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const publicPaths = ['/', '/login', '/register', '/services'];
      const isPublic = publicPaths.some((p) =>
        window.location.pathname === p ||
        window.location.pathname.startsWith('/services/')
      );
      if (!isPublic) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;

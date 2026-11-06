import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

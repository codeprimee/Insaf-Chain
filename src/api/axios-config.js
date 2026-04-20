import axios from 'axios';

// Use same hostname as the browser (works on both localhost and network IP)
const API_HOST = window.location.hostname;

const api = axios.create({
  baseURL: `http://${API_HOST}:5000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('insafchain_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('insafchain_token');
      localStorage.removeItem('insafchain_user');
    }
    return Promise.reject(error);
  }
);

export default api;

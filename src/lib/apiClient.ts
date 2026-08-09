import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject auth tokens if available
apiClient.interceptors.request.use((config) => {
  // Example: Get token from localStorage
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Optionally handle logout or token refresh here
    console.error('Unauthorized! Token might be invalid or expired.');
  }
  return Promise.reject(error);
});

export default apiClient;

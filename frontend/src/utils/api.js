import axios from 'axios';

// Create an axios instance with a base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);

    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page if needed
      // window.location.href = '/login';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      error.response = {
        data: {
          error: 'Request timed out. Please check your internet connection and try again.'
        }
      };
    }

    // Handle network errors
    if (!error.response) {
      error.response = {
        data: {
          error: 'Network error. Please check your internet connection and try again.'
        }
      };
    }

    // Handle server errors (500)
    if (error.response && error.response.status >= 500) {
      if (!error.response.data.error) {
        error.response.data = {
          error: 'Server error. Please try again later or contact support if the problem persists.'
        };
      }
    }

    return Promise.reject(error);
  }
);

export default api;

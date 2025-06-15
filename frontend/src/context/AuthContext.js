import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import api from '../utils/api';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Token is handled by api interceptor in utils/api.js
  // No need to set headers manually

  // Logout user
  const logout = useCallback(() => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Redirect to login
    navigate('/login');
  }, [navigate]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired, logout user
            logout();
            return;
          }

          // Token valid, get user data
          const res = await api.get('/users/profile');
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          // Token invalid or server error
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication error. Please login again.');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token, logout]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/users/register', userData);

      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);

      navigate('/');
      return true;
    } catch (err) {
      // Provide more specific error messages based on the error
      if (err.response && err.response.data.error) {
        // If the server provides an error message, use it
        setError(err.response.data.error);
      } else if (err.message === 'Network Error') {
        // Handle network errors
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        // Fallback to a more helpful generic message
        setError('An error occurred during registration. Please try again later or contact support if the problem persists.');
      }
      console.error('Registration error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/users/login', userData);

      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);

      navigate('/');
      return true;
    } catch (err) {
      // Provide more specific error messages based on the error
      if (err.response && err.response.data.error) {
        // If the server provides an error message, use it
        setError(err.response.data.error);
      } else if (err.message === 'Network Error') {
        // Handle network errors
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        // Fallback to a more helpful generic message
        setError('An error occurred during login. Please try again later or contact support if the problem persists.');
      }
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };


  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

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
          const res = await axios.get('/api/users/profile');
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
  }, [token]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post('/api/users/register', userData);
      
      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      navigate('/');
      return true;
    } catch (err) {
      setError(
        err.response && err.response.data.error
          ? err.response.data.error
          : 'Registration failed. Please try again.'
      );
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
      const res = await axios.post('/api/users/login', userData);
      
      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      navigate('/');
      return true;
    } catch (err) {
      setError(
        err.response && err.response.data.error
          ? err.response.data.error
          : 'Login failed. Please check your credentials.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login
    navigate('/login');
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
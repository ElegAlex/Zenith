import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { register, error, clearError, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Clear any previous errors when component mounts
    clearError();
  }, [isAuthenticated, navigate, clearError]);
  
  // Update form error when context error changes
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Simple validation
    if (!username || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (username.length < 3) {
      setFormError('Username must be at least 3 characters long');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Attempt registration
    await register({ username, email, password });
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join Zenith to manage your AI prompts</p>
        </div>
        
        {formError && (
          <div className="error-message">
            <FiAlertCircle />
            <span>{formError}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <small className="form-text text-muted">
              Password must be at least 6 characters long
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Add styles for the register page */}
      <style jsx="true">{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--bg-secondary);
          padding: var(--spacing-md);
        }
        
        .auth-card {
          width: 100%;
          max-width: 400px;
          background-color: var(--white-color);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-md);
          padding: var(--spacing-xl);
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .auth-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .auth-subtitle {
          color: var(--text-secondary);
        }
        
        .error-message {
          display: flex;
          align-items: center;
          background-color: rgba(220, 53, 69, 0.1);
          color: var(--danger-color);
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-md);
          margin-bottom: var(--spacing-md);
        }
        
        .error-message svg {
          margin-right: var(--spacing-xs);
        }
        
        .auth-form {
          margin-bottom: var(--spacing-lg);
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: var(--spacing-sm);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }
        
        .input-with-icon input {
          padding-left: calc(var(--spacing-md) * 2);
        }
        
        .form-text {
          display: block;
          margin-top: var(--spacing-xs);
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }
        
        .auth-button {
          width: 100%;
          padding: var(--spacing-md);
          background-color: var(--primary-color);
          color: var(--white-color);
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .auth-button:hover {
          background-color: #0056b3;
        }
        
        .auth-footer {
          text-align: center;
          color: var(--text-secondary);
        }
        
        .auth-link {
          color: var(--primary-color);
          font-weight: var(--font-weight-medium);
          text-decoration: none;
        }
        
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Register;
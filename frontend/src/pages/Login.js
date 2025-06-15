import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { login, error, clearError, isAuthenticated } = useContext(AuthContext);
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
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    // Attempt login
    await login({ email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome to Zenith</h1>
          <p className="auth-subtitle">Log in to manage your AI prompts</p>
        </div>

        {formError && (
          <div className="error-message">
            <FiAlertCircle />
            <span>{formError}</span>
            {formError.includes('Invalid credentials') && (
              <p className="error-help-text">
                Please check your email and password. If you don't have an account, <Link to="/register" className="auth-link">sign up</Link>.
              </p>
            )}
            {formError.includes('Unable to connect') && (
              <p className="error-help-text">
                Please check your internet connection and try again. If the problem persists, the server might be down.
              </p>
            )}
            {formError.includes('An error occurred during login') && (
              <p className="error-help-text">
                We're experiencing some technical difficulties. Please try again in a few moments or contact our support team at <a href="mailto:support@zenith.com" className="auth-link">support@zenith.com</a> if the problem persists.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Add styles for the login page */}
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
          flex-shrink: 0;
        }

        .error-message span {
          font-weight: var(--font-weight-medium);
        }

        .error-help-text {
          margin-top: var(--spacing-xs);
          margin-left: calc(var(--spacing-md) + var(--spacing-xs));
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.4;
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

export default Login;

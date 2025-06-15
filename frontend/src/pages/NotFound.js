import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FiAlertTriangle />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-button">
          Go to Dashboard
        </Link>
      </div>
      
      {/* Add styles for the not found page */}
      <style jsx="true">{`
        .not-found-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--bg-secondary);
          padding: var(--spacing-md);
        }
        
        .not-found-content {
          text-align: center;
          max-width: 500px;
        }
        
        .not-found-icon {
          font-size: 5rem;
          color: var(--warning-color);
          margin-bottom: var(--spacing-md);
        }
        
        .not-found-title {
          font-size: 4rem;
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin: 0;
        }
        
        .not-found-subtitle {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
          margin: var(--spacing-sm) 0 var(--spacing-md);
        }
        
        .not-found-message {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
        }
        
        .not-found-button {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-lg);
          background-color: var(--primary-color);
          color: var(--white-color);
          border-radius: var(--border-radius-md);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: background-color var(--transition-fast);
        }
        
        .not-found-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
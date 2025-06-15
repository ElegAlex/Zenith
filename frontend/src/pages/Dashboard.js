import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiFolder, FiMessageSquare, FiCpu, FiBarChart2, FiClock } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPrompts: 0,
    totalProjects: 0,
    totalAIModels: 0
  });
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const promptsRes = await axios.get('/api/prompts');
        const projectsRes = await axios.get('/api/projects');
        const aiModelsRes = await axios.get('/api/ai-models');
        
        setStats({
          totalPrompts: promptsRes.data.count,
          totalProjects: projectsRes.data.count,
          totalAIModels: aiModelsRes.data.data.length
        });
        
        // Fetch recent prompts (limited to 5)
        setRecentPrompts(promptsRes.data.data.slice(0, 5));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.username}!</h1>
        <p className="dashboard-subtitle">Here's an overview of your prompt management</p>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon prompt-icon">
            <FiMessageSquare />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Prompts</h3>
            <p className="stat-value">{stats.totalPrompts}</p>
          </div>
          <Link to="/prompts" className="stat-link">View all</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon project-icon">
            <FiFolder />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Projects</h3>
            <p className="stat-value">{stats.totalProjects}</p>
          </div>
          <Link to="/projects" className="stat-link">View all</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon ai-model-icon">
            <FiCpu />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">AI Models</h3>
            <p className="stat-value">{stats.totalAIModels}</p>
          </div>
          <Link to="/ai-models" className="stat-link">View all</Link>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-container">
          <Link to="/prompts/new" className="action-card">
            <div className="action-icon">
              <FiPlus />
            </div>
            <span className="action-text">New Prompt</span>
          </Link>
          
          <Link to="/projects/new" className="action-card">
            <div className="action-icon">
              <FiPlus />
            </div>
            <span className="action-text">New Project</span>
          </Link>
          
          <Link to="/ai-models/new" className="action-card">
            <div className="action-icon">
              <FiPlus />
            </div>
            <span className="action-text">New AI Model</span>
          </Link>
        </div>
      </div>
      
      {/* Recent Prompts */}
      <div className="recent-prompts">
        <div className="section-header">
          <h2 className="section-title">Recent Prompts</h2>
          <Link to="/prompts" className="view-all-link">View all</Link>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading recent prompts...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : recentPrompts.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any prompts yet.</p>
            <Link to="/prompts/new" className="create-prompt-button">
              Create your first prompt
            </Link>
          </div>
        ) : (
          <div className="prompts-list">
            {recentPrompts.map(prompt => (
              <div key={prompt._id} className="prompt-card">
                <h3 className="prompt-title">{prompt.title}</h3>
                <div className="prompt-meta">
                  <span className="prompt-model">
                    <FiCpu /> {prompt.aiModel.name}
                  </span>
                  {prompt.project && (
                    <span className="prompt-project">
                      <FiFolder /> {prompt.project.name}
                    </span>
                  )}
                </div>
                <p className="prompt-content">{prompt.content.substring(0, 100)}...</p>
                <div className="prompt-footer">
                  <span className="prompt-usage">
                    <FiBarChart2 /> Used {prompt.usageCount} times
                  </span>
                  <span className="prompt-date">
                    <FiClock /> {new Date(prompt.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Link to={`/prompts/${prompt._id}`} className="prompt-link">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add styles for the dashboard */}
      <style jsx="true">{`
        .dashboard {
          padding-bottom: var(--spacing-xl);
        }
        
        .dashboard-header {
          margin-bottom: var(--spacing-lg);
        }
        
        .dashboard-title {
          font-size: var(--font-size-xxl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }
        
        .dashboard-subtitle {
          color: var(--text-secondary);
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }
        
        .stat-card {
          background-color: var(--white-color);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-right: var(--spacing-md);
        }
        
        .prompt-icon {
          background-color: rgba(0, 112, 243, 0.1);
          color: var(--primary-color);
        }
        
        .project-icon {
          background-color: rgba(40, 167, 69, 0.1);
          color: var(--success-color);
        }
        
        .ai-model-icon {
          background-color: rgba(23, 162, 184, 0.1);
          color: var(--info-color);
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-title {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
          margin: 0;
        }
        
        .stat-value {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin: 0;
        }
        
        .stat-link {
          position: absolute;
          bottom: var(--spacing-sm);
          right: var(--spacing-sm);
          font-size: var(--font-size-sm);
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .section-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
        }
        
        .quick-actions {
          margin-bottom: var(--spacing-xl);
        }
        
        .actions-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }
        
        .action-card {
          background-color: var(--white-color);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          color: var(--text-primary);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        
        .action-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        
        .action-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(0, 112, 243, 0.1);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: var(--spacing-sm);
        }
        
        .action-text {
          font-weight: var(--font-weight-medium);
        }
        
        .recent-prompts {
          margin-top: var(--spacing-xl);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .view-all-link {
          color: var(--primary-color);
          text-decoration: none;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
        }
        
        .loading-message, .error-message {
          padding: var(--spacing-lg);
          text-align: center;
          color: var(--text-secondary);
        }
        
        .empty-state {
          background-color: var(--white-color);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-xl);
          text-align: center;
        }
        
        .create-prompt-button {
          display: inline-block;
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-lg);
          background-color: var(--primary-color);
          color: var(--white-color);
          border-radius: var(--border-radius-md);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
        }
        
        .prompts-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-md);
        }
        
        .prompt-card {
          background-color: var(--white-color);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-lg);
          position: relative;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        
        .prompt-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        
        .prompt-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--spacing-sm);
        }
        
        .prompt-meta {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
        }
        
        .prompt-model, .prompt-project {
          display: flex;
          align-items: center;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }
        
        .prompt-model svg, .prompt-project svg {
          margin-right: var(--spacing-xs);
        }
        
        .prompt-content {
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .prompt-footer {
          display: flex;
          justify-content: space-between;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
        }
        
        .prompt-usage, .prompt-date {
          display: flex;
          align-items: center;
        }
        
        .prompt-usage svg, .prompt-date svg {
          margin-right: var(--spacing-xs);
        }
        
        .prompt-link {
          display: inline-block;
          color: var(--primary-color);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
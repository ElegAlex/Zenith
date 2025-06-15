import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiFolder, FiMessageSquare, FiCpu, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="app-logo">Zenith</h1>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiHome /> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiFolder /> <span>Projects</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/prompts" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiMessageSquare /> <span>Prompts</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/ai-models" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiCpu /> <span>AI Models</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <FiUser />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.username}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button className="logout-button" onClick={logout}>
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Add styles for the layout */}
      <style jsx="true">{`
        .app-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          width: 250px;
          background-color: var(--white-color);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-normal);
          overflow-y: auto;
        }

        .sidebar.closed {
          width: 70px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .app-logo {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--primary-color);
          margin: 0;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--spacing-xs);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-toggle:hover {
          color: var(--text-primary);
          background: none;
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--spacing-md) 0;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          margin-bottom: var(--spacing-xs);
        }

        .sidebar-nav a {
          display: flex;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          border-radius: 0;
          text-decoration: none;
        }

        .sidebar-nav a:hover {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }

        .sidebar-nav a.active {
          background-color: var(--bg-tertiary);
          color: var(--primary-color);
          font-weight: var(--font-weight-medium);
        }

        .sidebar-nav a svg {
          margin-right: var(--spacing-sm);
          font-size: var(--font-size-lg);
        }

        .sidebar.closed .sidebar-nav a span {
          display: none;
        }

        .sidebar-footer {
          padding: var(--spacing-md);
          border-top: 1px solid var(--border-color);
        }

        .user-info {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-sm);
        }

        .user-details {
          overflow: hidden;
        }

        .user-name {
          font-weight: var(--font-weight-medium);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar.closed .user-details {
          display: none;
        }

        .logout-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: var(--spacing-sm);
          background-color: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          transition: all var(--transition-fast);
        }

        .logout-button:hover {
          background-color: var(--bg-secondary);
          color: var(--danger-color);
        }

        .logout-button svg {
          margin-right: var(--spacing-sm);
        }

        .sidebar.closed .logout-button span {
          display: none;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          background-color: var(--bg-secondary);
          transition: margin-left var(--transition-normal);
        }

        .content-wrapper {
          padding: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(0);
          }

          .sidebar.closed {
            transform: translateX(-100%);
          }

          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages (to be created)
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import Prompts from './pages/Prompts';
import AIModels from './pages/AIModels';
import NotFound from './pages/NotFound';

// Components (to be created)
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Context (to be created)
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="ai-models" element={<AIModels />} />
        </Route>
        
        {/* 404 and redirects */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
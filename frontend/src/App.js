// App.js - Main application component and routing configuration
// This file serves as the entry point for the React application and implements:
// 1. Client-side routing with react-router-dom
// 2. Authentication state management via Context API
// 3. Protected routes for authenticated users
// 4. Role-based access control for admin features
// 5. Responsive layout structure

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import CurrencyConverter from './components/CurrencyConverter';
import AdminDashboard from './components/AdminDashboard';

/**
 * ProtectedRoute Component
 * Higher-order component that handles route protection and authorization
 * 
 * Features:
 * 1. Redirects unauthenticated users to login
 * 2. Handles role-based access control
 * 3. Protects admin routes from unauthorized access
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {boolean} props.requireAdmin - Flag indicating if admin access is required
 * @returns {React.ReactNode} Protected route content or redirect
 */
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, isAdmin } = useAuth();

  // Authentication check - Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Authorization check - Redirect to home if admin access required but not authorized
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

/**
 * AppContent Component
 * Main application structure and routing configuration
 * 
 * Features:
 * 1. Responsive layout with Bootstrap classes
 * 2. Navigation bar integration
 * 3. Route definitions with protection
 * 4. Role-based route access
 * 
 * @returns {React.ReactNode} Application layout and routes
 */
const AppContent = () => {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            {/* Home route - Currency converter, requires authentication */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <CurrencyConverter />
                </ProtectedRoute>
              }
            />
            {/* Login route - Public access */}
            <Route path="/login" element={<Login />} />
            {/* Admin route - Protected, requires admin privileges */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Root App Component - Provides authentication context to the entire application
// Wraps the entire app with AuthProvider to make authentication state available globally
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

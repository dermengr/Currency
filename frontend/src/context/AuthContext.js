// AuthContext.js - Authentication context provider for the application
// This file implements React Context API to manage authentication state globally
// It provides login, logout, and admin check functionality across the app

import { createContext, useContext, useState } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to access auth context from any component
// Usage: const { user, token, login, logout, isAdmin } = useAuth();
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component - Wraps the app to provide authentication state
// Props:
// - children: Components that will have access to auth context
export const AuthProvider = ({ children }) => {
    // State management for user data and authentication token
    const [user, setUser] = useState(null);  // Stores user information
    const [token, setToken] = useState(localStorage.getItem('token'));  // Persists token in localStorage

    // Login handler - Updates user data and stores token
    // Parameters:
    // - userData: User information object
    // - authToken: JWT or session token
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);  // Persist token for session management
    };

    // Logout handler - Clears user data and removes token
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');  // Clean up stored token
    };

    // Admin check helper - Verifies if current user has admin role
    // Returns: boolean indicating admin status
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    // Context value object containing auth state and functions
    const value = {
        user,       // Current user data
        token,      // Authentication token
        login,      // Login function
        logout,     // Logout function
        isAdmin     // Admin check function
    };

    // Provide auth context to child components
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

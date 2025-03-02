/**
 * @fileoverview Authentication Context Module
 * 
 * This module implements React's Context API for global authentication state management.
 * It demonstrates several important React patterns and concepts:
 * 
 * Key Concepts:
 * 1. Context API Usage
 *    - Context creation and provider pattern
 *    - Custom hook implementation
 *    - Global state management
 * 
 * 2. Authentication Management
 *    - User session handling
 *    - Token-based authentication
 *    - Role-based access control
 * 
 * 3. State Management
 *    - useState hook for state
 *    - Persistent storage with localStorage
 *    - State updates and propagation
 * 
 * 4. Security Considerations
 *    - Token storage
 *    - Session management
 *    - Role verification
 */

import { createContext, useContext, useState } from 'react';

/**
 * Authentication Context
 * Creates a new context for authentication state
 * 
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Custom Hook: useAuth
 * Provides easy access to authentication context
 * 
 * @returns {Object} Authentication context value
 * @property {Object} user - Current user information
 * @property {string} token - Authentication token
 * @property {Function} login - Login handler
 * @property {Function} logout - Logout handler
 * @property {Function} isAdmin - Admin role checker
 * 
 * @example
 * const { user, token, login, logout, isAdmin } = useAuth();
 */
export const useAuth = () => {
    return useContext(AuthContext);
};

/**
 * Authentication Provider Component
 * Manages authentication state and provides it to the application
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * 
 * @example
 * return (
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 * )
 */
export const AuthProvider = ({ children }) => {
    // State management for user data and authentication token
    const [user, setUser] = useState(null);  // Stores user information
    const [token, setToken] = useState(localStorage.getItem('token'));  // Persists token in localStorage

    /**
     * Login Handler
     * Updates authentication state with user data and token
     * 
     * @param {Object} userData - User information
     * @param {string} authToken - JWT or session token
     * 
     * Features:
     * 1. Updates user state
     * 2. Stores authentication token
     * 3. Persists session in localStorage
     */
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);  // Persist token for session management
    };

    /**
     * Logout Handler
     * Clears authentication state and session data
     * 
     * Features:
     * 1. Clears user state
     * 2. Removes authentication token
     * 3. Cleans up localStorage
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');  // Clean up stored token
    };

    /**
     * Admin Role Checker
     * Verifies if current user has administrator privileges
     * 
     * @returns {boolean} True if user has admin role
     * 
     * Features:
     * 1. Safe object access with optional chaining
     * 2. Role-based authorization check
     * 3. Boolean type consistency
     */
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    /**
     * Context Value Object
     * Contains all authentication state and functions
     * 
     * Properties:
     * @property {Object} user - Current user data
     * @property {string} token - Authentication token
     * @property {Function} login - Login handler
     * @property {Function} logout - Logout handler
     * @property {Function} isAdmin - Admin role checker
     */
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

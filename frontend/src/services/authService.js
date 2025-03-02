/**
 * @fileoverview Authentication Service Module
 * 
 * This module handles all authentication-related API calls.
 * It demonstrates several important concepts in frontend development:
 * 
 * Key Concepts:
 * 1. API Integration
 *    - Axios for HTTP requests
 *    - RESTful API endpoints
 *    - Error handling patterns
 * 
 * 2. Authentication Flow
 *    - Login/Register operations
 *    - Token management
 *    - User profile handling
 * 
 * 3. Error Handling
 *    - Consistent error format
 *    - Detailed error messages
 *    - Error propagation
 * 
 * 4. Promise-based Architecture
 *    - Async/await usage
 *    - Promise error handling
 *    - Response formatting
 */

import axios from 'axios';

// Base URL for authentication endpoints
const API_URL = 'http://localhost:5000/api/auth';

/**
 * Authentication Service Object
 * Provides methods for user authentication and profile management
 */
const authService = {
    /**
     * User Login
     * Authenticates a user with username and password
     * 
     * @async
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object>} Authentication result with user data and token
     * @throws {Error} Login failure with error message
     * 
     * @example
     * try {
     *   const result = await authService.login('user123', 'password123');
     *   // Handle successful login
     * } catch (error) {
     *   // Handle login error
     * }
     */
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Login failed');
            }
            
            return {
                success: true,
                user: response.data.user,
                token: response.data.token
            };
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during login' };
        }
    },

    /**
     * User Registration
     * Creates a new user account
     * 
     * @async
     * @param {string} username - Desired username
     * @param {string} password - Desired password
     * @param {string} [role='user'] - User role (defaults to 'user')
     * @returns {Promise<Object>} Registration result with user data and token
     * @throws {Error} Registration failure with error message
     * 
     * @example
     * try {
     *   const result = await authService.register('newuser', 'password123');
     *   // Handle successful registration
     * } catch (error) {
     *   // Handle registration error
     * }
     */
    register: async (username, password, role = 'user') => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                username,
                password,
                role
            });
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Registration failed');
            }
            
            return {
                success: true,
                user: response.data.user,
                token: response.data.token
            };
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during registration' };
        }
    },

    /**
     * Get User Profile
     * Retrieves the authenticated user's profile
     * 
     * @async
     * @param {string} token - JWT authentication token
     * @returns {Promise<Object>} User profile data
     * @throws {Error} Profile fetch failure with error message
     * 
     * @example
     * try {
     *   const profile = await authService.getProfile('jwt-token-here');
     *   // Handle profile data
     * } catch (error) {
     *   // Handle profile fetch error
     * }
     */
    getProfile: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch profile');
            }
            
            return {
                success: true,
                user: response.data.user
            };
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred fetching profile' };
        }
    }
};

export default authService;

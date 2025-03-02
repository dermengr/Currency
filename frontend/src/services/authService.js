import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authService = {
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

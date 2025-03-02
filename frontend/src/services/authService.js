import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            return response.data;
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
            return response.data;
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
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred fetching profile' };
        }
    }
};

export default authService;

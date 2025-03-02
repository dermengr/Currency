import axios from 'axios';

const API_URL = 'http://localhost:5000/api/currency';

const currencyService = {
    // Get all currency pairs
    getAllPairs: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error fetching currency pairs' };
        }
    },

    // Convert currency
    convertCurrency: async (fromCurrency, toCurrency, amount) => {
        try {
            const response = await axios.post(`${API_URL}/convert`, {
                fromCurrency,
                toCurrency,
                amount
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error converting currency' };
        }
    },

    // Admin Operations
    createPair: async (pairData, token) => {
        try {
            const response = await axios.post(API_URL, pairData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error creating currency pair' };
        }
    },

    updatePair: async (id, pairData, token) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, pairData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error updating currency pair' };
        }
    },

    deletePair: async (id, token) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error deleting currency pair' };
        }
    }
};

export default currencyService;

// currencyService.js - API service for currency operations
// This service handles all currency-related API calls to the backend
// Key features:
// 1. Currency pair fetching
// 2. Currency conversion
// 3. Rate management (admin only)
// 4. Error handling and validation
// 5. Authentication token management

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/currency';

const currencyService = {
    /**
     * Fetches all available currency pairs from the server
     * 
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response containing currency pairs data
     * @throws {Error} If the request fails or returns an error
     */
    getAllPairs: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch currency pairs');
            }
            return {
                success: true,
                data: response.data.data || []
            };
        } catch (error) {
            console.error('Error fetching pairs:', error);
            throw {
                success: false,
                message: error.response?.data?.message || error.message || 'Error fetching currency pairs'
            };
        }
    },

    /**
     * Converts an amount from one currency to another
     * 
     * @param {string} baseCurrency - Source currency code (e.g., USD)
     * @param {string} targetCurrency - Target currency code (e.g., EUR)
     * @param {number} amount - Amount to convert
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Conversion result with rate and converted amount
     * @throws {Error} If validation fails or conversion fails
     */
    convertCurrency: async (baseCurrency, targetCurrency, amount, token) => {
        try {
            if (!amount || amount <= 0) {
                throw new Error('Please enter a valid amount');
            }

            if (!baseCurrency || !targetCurrency) {
                throw new Error('Please select both currencies');
            }

            const response = await axios.post(`${API_URL}/convert`, {
                baseCurrency,
                targetCurrency,
                amount: parseFloat(amount)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Conversion failed');
            }

            return {
                success: true,
                data: {
                    convertedAmount: response.data.data.convertedAmount,
                    rate: response.data.data.rate
                }
            };
        } catch (error) {
            console.error('Error converting:', error);
            throw {
                success: false,
                message: error.response?.data?.message || error.message || 'Error converting currency'
            };
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
            throw new Error(error.response?.data?.message || 'Error creating currency pair');
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
            throw new Error(error.response?.data?.message || 'Error updating currency pair');
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
            throw new Error(error.response?.data?.message || 'Error deleting currency pair');
        }
    }
};

export default currencyService;

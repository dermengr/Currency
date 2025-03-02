/**
 * @fileoverview Currency Service Module
 * 
 * This module handles all currency-related API operations.
 * It demonstrates several advanced frontend development patterns:
 * 
 * Key Concepts:
 * 1. API Integration
 *    - RESTful endpoints
 *    - Authentication headers
 *    - Request/response handling
 * 
 * 2. Data Management
 *    - Currency pair operations
 *    - Conversion calculations
 *    - Rate management
 * 
 * 3. Error Handling
 *    - Input validation
 *    - API error handling
 *    - Consistent error formatting
 * 
 * 4. Security
 *    - Token-based authentication
 *    - Role-based access control
 *    - Data validation
 */

import axios from 'axios';

// Base URL for currency operations
const API_URL = 'http://localhost:5000/api/currency';

/**
 * Currency Service Object
 * Provides methods for currency operations and management
 */
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

    /**
     * Admin Operations Section
     * These methods are restricted to admin users only
     */

    /**
     * Create Currency Pair
     * Creates a new currency pair with exchange rate
     * 
     * @async
     * @param {Object} pairData - Currency pair information
     * @param {string} pairData.baseCurrency - Base currency code
     * @param {string} pairData.targetCurrency - Target currency code
     * @param {number} pairData.rate - Exchange rate
     * @param {string} token - Admin authentication token
     * @returns {Promise<Object>} Created currency pair data
     * @throws {Error} Creation failure with error message
     */
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

    /**
     * Update Currency Pair
     * Updates an existing currency pair's information
     * 
     * @async
     * @param {string} id - Currency pair ID
     * @param {Object} pairData - Updated pair information
     * @param {string} token - Admin authentication token
     * @returns {Promise<Object>} Updated currency pair data
     * @throws {Error} Update failure with error message
     */
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

    /**
     * Delete Currency Pair
     * Removes a currency pair from the system
     * 
     * @async
     * @param {string} id - Currency pair ID to delete
     * @param {string} token - Admin authentication token
     * @returns {Promise<Object>} Deletion confirmation
     * @throws {Error} Deletion failure with error message
     */
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

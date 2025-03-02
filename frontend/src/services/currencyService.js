import axios from 'axios';

const API_URL = 'http://localhost:5000/api/currency';

const currencyService = {
    // Get all currency pairs
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

    // Convert currency
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

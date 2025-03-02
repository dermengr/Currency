import React, { useState, useEffect } from 'react';
import currencyService from '../services/currencyService';
import { useAuth } from '../context/AuthContext';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currencyPairs, setCurrencyPairs] = useState([]);

    const { token } = useAuth();

    useEffect(() => {
        const initializeCurrencyPairs = async () => {
            if (!token) {
                setError('Please log in to use the currency converter');
                return;
            }
            try {
                const response = await currencyService.getAllPairs(token);
                if (response.success) {
                    setCurrencyPairs(response.data);
                    // Only set initial currencies if none are selected
                    if ((!fromCurrency || !toCurrency) && response.data.length > 0) {
                        const firstPair = response.data[0];
                        setFromCurrency(firstPair.baseCurrency);
                        setToCurrency(firstPair.targetCurrency);
                    }
                }
            } catch (err) {
                setError('Failed to fetch currency pairs');
                console.error('Error fetching pairs:', err);
            }
        };

        // Initial fetch
        initializeCurrencyPairs();
        
        // Set up event listeners
        const handleCurrencyPairUpdate = () => initializeCurrencyPairs();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                initializeCurrencyPairs();
            }
        };

        // Poll for updates every 30 seconds
        const interval = setInterval(initializeCurrencyPairs, 30000);
        
        // Add event listeners
        window.addEventListener('currencyPairUpdate', handleCurrencyPairUpdate);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Cleanup on unmount
        return () => {
            clearInterval(interval);
            window.removeEventListener('currencyPairUpdate', handleCurrencyPairUpdate);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fromCurrency, toCurrency, token]);


    const handleConvert = async () => {
        setError('');
        setResult(null);
        setLoading(true);

        if (!token) {
            setError('Please log in to use the currency converter');
            setLoading(false);
            return;
        }

        try {
            console.log('Converting:', { fromCurrency, toCurrency, amount });
            const response = await currencyService.convertCurrency(
                fromCurrency,
                toCurrency,
                parseFloat(amount),
                token
            );
            console.log('Response:', response);
            if (response.success && response.data) {
                setResult({
                    convertedAmount: Number(response.data.convertedAmount),
                    rate: Number(response.data.rate)
                });
            } else {
                throw new Error(response.message || 'Failed to convert currency');
            }
        } catch (err) {
            setError(err.message || 'Failed to convert currency');
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        // Check if the reverse pair exists
        const reversePairExists = currencyPairs.some(
            pair => pair.baseCurrency === toCurrency && pair.targetCurrency === fromCurrency
        );
        
        if (reversePairExists) {
            setFromCurrency(toCurrency);
            setToCurrency(fromCurrency);
            setResult(null);
        } else {
            setError('Cannot swap - conversion rate not available for this direction');
        }
    };

    // Get valid currency pairs
    const getValidPairs = () => {
        const fromCurrencies = [...new Set(currencyPairs.map(pair => pair.baseCurrency))].sort();
        const getValidToCurrencies = (from) => {
            return currencyPairs
                .filter(pair => pair.baseCurrency === from)
                .map(pair => pair.targetCurrency)
                .sort();
        };
        return { fromCurrencies, getValidToCurrencies };
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Currency Converter</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="amount" className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="0"
                                    step="any"
                                    required
                                />
                            </div>

                            <div className="row mb-4 align-items-center">
                                <div className="col">
                                    <label htmlFor="fromCurrency" className="form-label">From</label>
                                    <select
                                        className="form-select"
                                        id="fromCurrency"
                                        value={fromCurrency}
                                        onChange={(e) => {
                                            const newFromCurrency = e.target.value;
                                            setFromCurrency(newFromCurrency);
                                            // Reset toCurrency when fromCurrency changes
                                            const validToCurrencies = getValidPairs().getValidToCurrencies(newFromCurrency);
                                            if (!validToCurrencies.includes(toCurrency)) {
                                                setToCurrency(validToCurrencies[0] || '');
                                            }
                                            setResult(null);
                                        }}
                                    >
                                        <option key="default-from" value="">Select currency</option>
                                        {getValidPairs().fromCurrencies.map((currency) => (
                                            <option key={`from-${currency}`} value={currency}>
                                                {currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-auto d-flex align-items-end">
                                    <button 
                                        className="btn btn-outline-secondary mb-2" 
                                        onClick={handleSwap}
                                        type="button"
                                    >
                                        <i className="bi bi-arrow-left-right"></i>
                                    </button>
                                </div>

                                <div className="col">
                                    <label htmlFor="toCurrency" className="form-label">To</label>
                                    <select
                                        className="form-select"
                                        id="toCurrency"
                                        value={toCurrency}
                                        onChange={(e) => {
                                            setToCurrency(e.target.value);
                                            setResult(null);
                                        }}
                                    >
                                        <option key="default-to" value="">Select currency</option>
                                        {fromCurrency && getValidPairs().getValidToCurrencies(fromCurrency).map((currency) => (
                                            <option key={`to-${currency}`} value={currency}>
                                                {currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={handleConvert}
                                disabled={loading || !amount || !fromCurrency || !toCurrency || !token}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Converting...
                                    </>
                                ) : 'Convert'}
                            </button>

                            {result && (
                                <div className="mt-4 text-center">
                                    <h3 className="mb-3">Result</h3>
                                    <div className="h4 text-primary mb-2">
                                        {amount} {fromCurrency} = {typeof result.convertedAmount === 'number' ? result.convertedAmount.toFixed(2) : '0.00'} {toCurrency}
                                    </div>
                                    <div className="text-muted">
                                        Exchange Rate: 1 {fromCurrency} = {typeof result.rate === 'number' ? result.rate.toFixed(4) : '0.00'} {toCurrency}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;

import React, { useState, useEffect } from 'react';
import currencyService from '../services/currencyService';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currencyPairs, setCurrencyPairs] = useState([]);

    useEffect(() => {
        fetchCurrencyPairs();
    }, []);

    const fetchCurrencyPairs = async () => {
        try {
            const response = await currencyService.getAllPairs();
            if (response.success) {
                setCurrencyPairs(response.data);
                if (response.data.length > 0) {
                    setFromCurrency(response.data[0].fromCurrency);
                    setToCurrency(response.data[0].toCurrency);
                }
            }
        } catch (err) {
            setError('Failed to fetch currency pairs');
        }
    };

    const handleConvert = async () => {
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const response = await currencyService.convertCurrency(
                fromCurrency,
                toCurrency,
                parseFloat(amount)
            );
            if (response.success) {
                setResult(response.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to convert currency');
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setResult(null);
    };

    // Get unique currencies from pairs
    const getUniqueCurrencies = () => {
        const currencies = new Set();
        currencyPairs.forEach(pair => {
            currencies.add(pair.fromCurrency);
            currencies.add(pair.toCurrency);
        });
        return Array.from(currencies).sort();
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
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                    >
                                        {getUniqueCurrencies().map((currency) => (
                                            <option key={currency} value={currency}>
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
                                        onChange={(e) => setToCurrency(e.target.value)}
                                    >
                                        {getUniqueCurrencies().map((currency) => (
                                            <option key={currency} value={currency}>
                                                {currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={handleConvert}
                                disabled={loading || !amount || !fromCurrency || !toCurrency}
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
                                        {amount} {fromCurrency} = {result.convertedAmount.toFixed(2)} {toCurrency}
                                    </div>
                                    <div className="text-muted">
                                        Exchange Rate: 1 {fromCurrency} = {result.rate} {toCurrency}
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

/**
 * @fileoverview Currency Converter Component
 * 
 * This component implements a full-featured currency conversion interface.
 * It demonstrates several advanced React patterns and best practices:
 * 
 * Key Concepts:
 * 1. Complex State Management
 *    - Multiple useState hooks for different aspects of the application
 *    - State dependencies and relationships
 * 
 * 2. Side Effects and Lifecycle
 *    - useEffect for data fetching
 *    - Cleanup and memory management
 *    - Event listener handling
 * 
 * 3. Real-time Updates
 *    - Polling mechanism for rate updates
 *    - Visibility state handling
 *    - Event-based updates
 * 
 * 4. Animation Integration
 *    - GSAP for smooth animations
 *    - ScrollTrigger for scroll-based animations
 *    - Conditional animation triggers
 * 
 * 5. Error Handling
 *    - Comprehensive error states
 *    - User feedback
 *    - Graceful degradation
 * 
 * 6. Performance Optimization
 *    - Debounced updates
 *    - Conditional rendering
 *    - Efficient re-renders
 */

import React, { useState, useEffect } from 'react';
import './CurrencyConverter.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
gsap.registerPlugin(ScrollTrigger);

import currencyService from '../services/currencyService';
import { useAuth } from '../context/AuthContext';

/**
 * CurrencyConverter Component
 * 
 * A comprehensive currency conversion interface with real-time updates,
 * animations, and error handling.
 * 
 * @component
 * @example
 * return (
 *   <CurrencyConverter />
 * )
 */
const CurrencyConverter = () => {
    // Form State - Manages user input and selection
    const [amount, setAmount] = useState('');              // User input amount
    const [fromCurrency, setFromCurrency] = useState('');  // Source currency code
    const [toCurrency, setToCurrency] = useState('');      // Target currency code
    
    // Application State - Manages application behavior
    const [result, setResult] = useState(null);            // Conversion result object
    const [error, setError] = useState('');                // Error message state
    const [loading, setLoading] = useState(false);         // Loading indicator
    const [currencyPairs, setCurrencyPairs] = useState([]); // Available currency pairs
    
    // Authentication Context - User authentication state
    const { token } = useAuth();

    // Animation Refs - DOM references for GSAP animations
    const cardRef = React.useRef(null);
    const formRef = React.useRef(null);
    const resultRef = React.useRef(null);
    const titleRef = React.useRef(null);
    const inputsRef = React.useRef(null);
    const buttonRef = React.useRef(null);

    /**
     * Currency Pairs Initialization Effect
     * 
     * This effect handles:
     * 1. Initial data fetching
     * 2. Real-time updates
     * 3. Visibility change handling
     * 4. Cleanup and memory management
     */
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
                    // Set default currencies if none are selected
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

        // Initial fetch of currency pairs
        initializeCurrencyPairs();
        
        // Set up event listeners for real-time updates
        const handleCurrencyPairUpdate = () => initializeCurrencyPairs();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                initializeCurrencyPairs();
            }
        };

        // Poll for updates every 30 seconds to keep rates current
        const interval = setInterval(initializeCurrencyPairs, 30000);
        
        // Add event listeners for updates
        window.addEventListener('currencyPairUpdate', handleCurrencyPairUpdate);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Cleanup function to remove event listeners and clear interval
        return () => {
            clearInterval(interval);
            window.removeEventListener('currencyPairUpdate', handleCurrencyPairUpdate);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fromCurrency, toCurrency, token]); // Dependencies for useEffect


    /**
     * Currency Conversion Handler
     * 
     * Processes the currency conversion request with proper error handling:
     * 1. Input validation and authentication check
     * 2. API request with error boundaries
     * 3. Result state management
     * 4. Loading state handling
     * 
     * @async
     * @function
     */
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
            // Call API to perform conversion
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

    /**
     * Currency Swap Handler
     * 
     * Handles the currency pair swap operation:
     * 1. Validates if reverse pair exists
     * 2. Updates currency states
     * 3. Resets result state
     * 4. Provides error feedback
     */
    const handleSwap = () => {
        // Verify if the reverse currency pair exists
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

    /**
     * Currency Pair Validator
     * 
     * Utility function that:
     * 1. Extracts unique base currencies
     * 2. Maps valid target currencies for each base
     * 3. Ensures currency pair validity
     * 4. Maintains sorted order for UI consistency
     * 
     * @returns {Object} Object containing fromCurrencies array and getValidToCurrencies function
     */
    const getValidPairs = () => {
        // Get unique base currencies
        const fromCurrencies = [...new Set(currencyPairs.map(pair => pair.baseCurrency))].sort();
        // Get valid target currencies for a given base currency
        const getValidToCurrencies = (from) => {
            return currencyPairs
                .filter(pair => pair.baseCurrency === from)
                .map(pair => pair.targetCurrency)
                .sort();
        };
        return { fromCurrencies, getValidToCurrencies };
    };

    /**
     * Animation Initialization Effect
     * 
     * Sets up GSAP animations for enhanced user experience:
     * 1. Card entrance animation with scroll trigger
     * 2. Form elements stagger animation
     * 3. Proper cleanup of animation triggers
     * 
     * Uses ScrollTrigger for scroll-based animations:
     * - Triggers when element enters viewport
     * - Reverses on scroll up
     * - Proper memory management
     */
    useEffect(() => {
        // Card entrance animation
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 100 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    
        // Form elements stagger animation
        gsap.fromTo(formRef.current.children,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: formRef.current,
                    start: "top 70%",
                    end: "top 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    
        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []); // Run once on mount
    
    /**
     * Result Display Animation Effect
     * 
     * Handles the animation of conversion results:
     * 1. Triggers when new result is available
     * 2. Scales and fades in the result
     * 3. Uses GSAP for smooth transitions
     * 
     * @dependency {result} - Re-runs when result state changes
     */
    useEffect(() => {
        if (result && resultRef.current) {
            gsap.fromTo(resultRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    }, [result]);
    
    /**
     * Component Render Method
     * 
     * Renders a responsive currency converter interface:
     * 1. Bootstrap-based responsive grid
     * 2. Form inputs with validation
     * 3. Dynamic currency selection
     * 4. Loading states and error handling
     * 5. Animated result display
     * 
     * @returns {JSX.Element} The rendered currency converter interface
     */
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card" ref={cardRef}>
                        <div className="card-body" ref={formRef}>
                            <h2 className="card-title text-center mb-4 apple-title" ref={titleRef}>Currency Converter</h2>

                            {/* Error message display */}
                            {error && (
                                <div className="alert apple-alert" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Amount input field */}
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

                            {/* Currency selection row */}
                            <div className="row mb-4 align-items-center" ref={inputsRef}>
                                {/* From currency dropdown */}
                                <div className="col">
                                    <label htmlFor="fromCurrency" className="form-label">From</label>
                                    <select
                                        className="form-select"
                                        id="fromCurrency"
                                        value={fromCurrency}
                                        onChange={(e) => {
                                            const newFromCurrency = e.target.value;
                                            setFromCurrency(newFromCurrency);
                                            // Reset target currency if current selection becomes invalid
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

                                {/* Swap button */}
                                <div className="col-auto d-flex align-items-end">
                                    <button 
                                        className="btn btn-outline-secondary mb-2" 
                                        onClick={handleSwap}
                                        type="button"
                                    >
                                        <i className="bi bi-arrow-left-right"></i>
                                    </button>
                                </div>

                                {/* To currency dropdown */}
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

                            {/* Convert button */}
                            <button
                                className="btn btn-apple w-100"
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

                            {/* Conversion result display */}
                            {result && (
                                <div className="mt-4 text-center" ref={resultRef}>
                                    <h3 className="mb-3">Result</h3>
                                    <div className="h4 apple-result mb-2">
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

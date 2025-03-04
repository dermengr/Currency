import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import currencyService from '../services/currencyService';
import './AdminDashboard.css'; // Added import for custom styles
import { gsap } from 'gsap'; // Import GSAP

/**
 * @fileoverview Admin Dashboard Component
 * 
 * This component serves as a comprehensive example of modern React development practices.
 * It's designed to be educational for junior developers, demonstrating various concepts
 * and patterns commonly used in professional React applications.
 * 
 * Key Learning Concepts:
 * 
 * 1. React Fundamentals
 *    - Functional Components
 *    - Hook Usage (useState, useEffect, useRef, custom hooks)
 *    - Component Lifecycle Management
 *    - JSX Patterns and Best Practices
 * 
 * 2. State Management
 *    - Complex State Organization
 *    - Form State Handling
 *    - Modal State Control
 *    - Loading States
 * 
 * 3. API Integration
 *    - Async/Await Pattern
 *    - CRUD Operations
 *    - Error Handling
 *    - Loading States
 * 
 * 4. User Interface
 *    - Form Handling with Controlled Components
 *    - Modal Implementation
 *    - Responsive Design with Bootstrap
 *    - Animation using GSAP
 * 
 * 5. Advanced Patterns
 *    - Custom Event Dispatching
 *    - Ref Usage for DOM Manipulation
 *    - Conditional Rendering
 *    - List Rendering with Keys
 * 
 * 6. Performance Considerations
 *    - Optimized Animations
 *    - Proper Cleanup in useEffect
 *    - Efficient State Updates
 *    - Memory Leak Prevention
 * 
 * @component
 * @example
 * return (
 *   <AdminDashboard />
 * )
 */

const AdminDashboard = () => {
    // State management using useState hook
    const { token } = useAuth(); // Getting authentication token from context
    const [currencyPairs, setCurrencyPairs] = useState([]); // State for storing currency pairs data
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for tracking loading status
    const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
    const [editingPair, setEditingPair] = useState(null); // State for tracking which pair is being edited
    const [formData, setFormData] = useState({ // State for form input values
        baseCurrency: '',
        targetCurrency: '',
        rate: ''
    });

    /**
     * Animation Refs
     * DOM references for GSAP animations
     */
    const cardRef = useRef(null);
    const tableRef = useRef(null);
    const titleRef = useRef(null);
    const modalRef = useRef(null);

    /**
     * Currency Pairs Fetcher
     * Fetches currency pairs from the API
     * 
     * Wrapped in useCallback to:
     * 1. Prevent unnecessary recreations
     * 2. Allow safe usage in useEffect dependencies
     * 3. Maintain referential equality
     * 
     * @async
     * @function
     */
    const fetchCurrencyPairs = useCallback(async () => {
        try {
            const response = await currencyService.getAllPairs(token);
            if (response.success) {
                setCurrencyPairs(response.data);
            }
        } catch (err) {
            setError('Failed to fetch currency pairs');
            if (cardRef.current) {
                gsap.to(cardRef.current, {
                    x: [-5, 5, -5, 5, 0],
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
            }
        }
    }, [token, cardRef, setError]);

    /**
     * Initial Setup Effect
     * Handles component initialization and animations
     * 
     * Note: fetchCurrencyPairs is included in dependencies
     * to ensure proper data fetching behavior
     */
    useEffect(() => {
        // Initial data fetch
        fetchCurrencyPairs();

        // Card entrance animation - demonstrates GSAP animation techniques
        gsap.fromTo(cardRef.current, // Target element
            { y: 50, opacity: 0, scale: 0.95 }, // Starting properties
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' } // Ending properties and animation settings
        );

        // Title animation with delay
        gsap.fromTo(titleRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'back.out(1.7)' } // 'back' easing creates a slight overshoot effect
        );
    }, [fetchCurrencyPairs]); // Include fetchCurrencyPairs in dependencies

    /**
     * Table Animation Effect
     * Animates table rows when data loads
     */
    useEffect(() => {
        if (currencyPairs.length > 0 && tableRef.current) {
            const rows = tableRef.current.querySelectorAll('tbody tr');
            gsap.fromTo(rows,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power1.out' } // Stagger creates a cascading effect
            );
        }
    }, [currencyPairs]);

    /**
     * Modal Animation Effect
     * Handles modal entrance animation
     */
    useEffect(() => {
        if (showModal && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { opacity: 0, y: -30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );
        }
    }, [showModal]);

    /*
     * Modal open handler - demonstrates conditional state updates
     * If a pair is provided, we're editing; otherwise, we're creating new
     */
    const handleOpenModal = (pair = null) => {
        if (pair) {
            setEditingPair(pair); // Store the pair being edited
            setFormData({ // Pre-fill form with existing data
                baseCurrency: pair.baseCurrency || '',
                targetCurrency: pair.targetCurrency || '',
                rate: pair.rate ? pair.rate.toString() : ''
            });
        } else {
            setEditingPair(null); // No pair means we're creating new
            setFormData({ // Reset form to empty values
                baseCurrency: '',
                targetCurrency: '',
                rate: ''
            });
        }
        setShowModal(true); // Show the modal
    };

    /*
     * Modal close handler with animation
     * Demonstrates using GSAP with callback functions
     */
    const handleCloseModal = () => {
        // Animate modal out
        if (modalRef.current) {
            gsap.to(modalRef.current, {
                opacity: 0,
                y: -20,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => { // Callback function runs after animation completes
                    setShowModal(false);
                    setEditingPair(null);
                    setFormData({
                        baseCurrency: '',
                        targetCurrency: '',
                        rate: ''
                    });
                }
            });
        } else {
            // Fallback if ref is not available
            setShowModal(false);
            setEditingPair(null);
            setFormData({
                baseCurrency: '',
                targetCurrency: '',
                rate: ''
            });
        }
    };

    /*
     * Custom event emitter for cross-component communication
     * This is an alternative to prop drilling or context for simple notifications
     */
    const emitCurrencyPairUpdate = () => {
        const event = new CustomEvent('currencyPairUpdate'); // Create a custom event
        window.dispatchEvent(event); // Dispatch it globally
    };

    /*
     * Form submission handler - demonstrates async/await with form handling
     * Shows proper loading state management and error handling
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(''); // Clear any previous errors
        setLoading(true); // Set loading state to show spinner

        try {
            const data = {
                ...formData, // Spread operator to copy all form fields
                rate: parseFloat(formData.rate) // Convert string to number
            };

            // Conditional API call based on whether we're editing or creating
            if (editingPair) {
                await currencyService.updatePair(editingPair._id, data, token); // Update existing
            } else {
                await currencyService.createPair(data, token); // Create new
            }

            handleCloseModal(); // Close the modal
            await fetchCurrencyPairs(); // Refresh the data
            emitCurrencyPairUpdate(); // Notify other components
        } catch (err) {
            setError(err.message || 'Failed to save currency pair'); // Set error message
            // Error shake animation
            if (modalRef.current) {
                gsap.to(modalRef.current, {
                    x: [-5, 5, -5, 5, 0],
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
            }
        } finally {
            setLoading(false); // Always reset loading state whether success or error
        }
    };

    /*
     * Delete handler - demonstrates confirmation pattern and animation before API call
     */
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this currency pair?')) { // Simple confirmation
            setError('');
            try {
                // Animate row out before deletion - improves perceived performance
                const rowToDelete = document.querySelector(`tr[data-id="${id}"]`);
                if (rowToDelete) {
                    await gsap.to(rowToDelete, { // Using await with GSAP animation
                        opacity: 0,
                        height: 0,
                        padding: 0,
                        duration: 0.3,
                        ease: 'power1.out'
                    });
                }
                
                await currencyService.deletePair(id, token); // API call to delete
                await fetchCurrencyPairs(); // Refresh data
                emitCurrencyPairUpdate(); // Notify other components
            } catch (err) {
                setError(err.message || 'Failed to delete currency pair');
                // Error shake animation
                if (cardRef.current) {
                    gsap.to(cardRef.current, {
                        x: [-5, 5, -5, 5, 0],
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });
                }
            }
        }
    };

    /*
     * Component render method - JSX structure
     * Demonstrates proper React component organization with:
     * - Container/card structure
     * - Conditional rendering (error message)
     * - List rendering with keys
     * - Event handlers
     * - Form controls
     * - Modal implementation
     */
    return (
        <div className="container mt-4">
            <div className="card shadow" ref={cardRef}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="card-title mb-0" ref={titleRef}>Currency Pairs Management</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleOpenModal()}
                        >
                            Add New Pair
                        </button>
                    </div>

                    {/* Conditional rendering - only shows when error state is set */}
                    {error && (
                        <div className="alert apple-alert" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-striped" ref={tableRef}>
                            <thead>
                                <tr>
                                    <th>From Currency</th>
                                    <th>To Currency</th>
                                    <th>Exchange Rate</th>
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Map through array to render table rows - always use key prop for lists */}
                                {currencyPairs.map((pair, index) => (
                                    <tr key={pair._id} data-id={pair._id}>
                                        <td>{pair.baseCurrency}</td>
                                        <td>{pair.targetCurrency}</td>
                                        <td>{pair.rate}</td>
                                        <td>
                                            {new Date(pair.lastUpdated).toLocaleString()} {/* Date formatting */}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleOpenModal(pair)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(pair._id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal implementation - conditionally rendered and styled */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} 
                style={{ display: showModal ? 'block' : 'none' }}
                tabIndex="-1"
                role="dialog"
                aria-hidden={!showModal}
            >
                <div className="modal-dialog">
                    <div className="modal-content" ref={modalRef}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editingPair ? 'Edit Currency Pair' : 'Add New Currency Pair'} {/* Conditional title */}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            ></button>
                        </div>
                        {/* Form with onSubmit handler */}
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="baseCurrency" className="form-label">From Currency</label>
                                    {/* Controlled component */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="baseCurrency"
                                        value={formData.baseCurrency}
                                        onChange={(e) => setFormData({...formData, baseCurrency: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="targetCurrency" className="form-label">To Currency</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="targetCurrency"
                                        value={formData.targetCurrency}
                                        onChange={(e) => setFormData({...formData, targetCurrency: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rate" className="form-label">Exchange Rate</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        className="form-control"
                                        id="rate"
                                        value={formData.rate}
                                        onChange={(e) => setFormData({...formData, rate: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Saving...
                                        </>
                                    ) : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import currencyService from '../services/currencyService';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [currencyPairs, setCurrencyPairs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPair, setEditingPair] = useState(null);
    const [formData, setFormData] = useState({
        fromCurrency: '',
        toCurrency: '',
        rate: ''
    });

    useEffect(() => {
        fetchCurrencyPairs();
    }, []);

    const fetchCurrencyPairs = async () => {
        try {
            const response = await currencyService.getAllPairs();
            if (response.success) {
                setCurrencyPairs(response.data);
            }
        } catch (err) {
            setError('Failed to fetch currency pairs');
        }
    };

    const handleOpenModal = (pair = null) => {
        if (pair) {
            setEditingPair(pair);
            setFormData({
                fromCurrency: pair.fromCurrency,
                toCurrency: pair.toCurrency,
                rate: pair.rate.toString()
            });
        } else {
            setEditingPair(null);
            setFormData({
                fromCurrency: '',
                toCurrency: '',
                rate: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPair(null);
        setFormData({
            fromCurrency: '',
            toCurrency: '',
            rate: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = {
                ...formData,
                rate: parseFloat(formData.rate)
            };

            if (editingPair) {
                await currencyService.updatePair(editingPair._id, data, token);
            } else {
                await currencyService.createPair(data, token);
            }

            handleCloseModal();
            fetchCurrencyPairs();
        } catch (err) {
            setError(err.message || 'Failed to save currency pair');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this currency pair?')) {
            setError('');
            try {
                await currencyService.deletePair(id, token);
                fetchCurrencyPairs();
            } catch (err) {
                setError(err.message || 'Failed to delete currency pair');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="card-title mb-0">Currency Pairs Management</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleOpenModal()}
                        >
                            Add New Pair
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-striped">
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
                                {currencyPairs.map((pair) => (
                                    <tr key={pair._id}>
                                        <td>{pair.fromCurrency}</td>
                                        <td>{pair.toCurrency}</td>
                                        <td>{pair.rate}</td>
                                        <td>
                                            {new Date(pair.lastUpdated).toLocaleString()}
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

            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} 
                style={{ display: showModal ? 'block' : 'none' }}
                tabIndex="-1"
                role="dialog"
                aria-hidden={!showModal}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editingPair ? 'Edit Currency Pair' : 'Add New Currency Pair'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="fromCurrency" className="form-label">From Currency</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fromCurrency"
                                        value={formData.fromCurrency}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            fromCurrency: e.target.value.toUpperCase() 
                                        })}
                                        placeholder="e.g., USD"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="toCurrency" className="form-label">To Currency</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="toCurrency"
                                        value={formData.toCurrency}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            toCurrency: e.target.value.toUpperCase() 
                                        })}
                                        placeholder="e.g., EUR"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rate" className="form-label">Exchange Rate</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="rate"
                                        value={formData.rate}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            rate: e.target.value 
                                        })}
                                        step="0.0001"
                                        min="0"
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

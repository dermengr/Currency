import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || username.length < 3) {
            setError('Username must be at least 3 characters long');
            return false;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (isRegistering && password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateForm()) {
            return;
        }

        try {
            let response;
            if (isRegistering) {
                response = await authService.register(username, password);
                if (response.success) {
                    // Auto-login after successful registration
                    login(response.user, response.token);
                    navigate('/');
                }
            } else {
                response = await authService.login(username, password);
                if (response.success) {
                    login(response.user, response.token);
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.message || `Failed to ${isRegistering ? 'register' : 'login'}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">
                                {isRegistering ? 'Register' : 'Login'}
                            </h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {isRegistering && (
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required={isRegistering}
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {isRegistering ? 'Registering...' : 'Logging in...'}
                                        </>
                                    ) : (isRegistering ? 'Register' : 'Login')}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100"
                                    onClick={toggleMode}
                                    disabled={loading}
                                >
                                    {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

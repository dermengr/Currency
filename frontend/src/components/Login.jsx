/**
 * @fileoverview Login Component
 * 
 * This component handles user authentication (login and registration).
 * It demonstrates several advanced React concepts and features:
 * 
 * Key Concepts:
 * 1. Form handling in React
 * 2. Multiple state management with useState
 * 3. Side effects with useEffect
 * 4. Refs for DOM manipulation
 * 5. GSAP animations
 * 6. Error handling
 * 7. Conditional rendering
 * 8. Authentication flow
 */

import React, { useState, useEffect, useRef } from 'react';
import './Login.css';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

/**
 * Login Component
 * Handles both login and registration functionality with animated transitions
 * 
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
const Login = () => {
    // Form input states
    const [username, setUsername] = useState('');  // Username input
    const [password, setPassword] = useState('');  // Password input
    const [confirmPassword, setConfirmPassword] = useState('');  // Confirm password for registration
    
    // UI states
    const [error, setError] = useState('');  // Error message display
    const [loading, setLoading] = useState(false);  // Loading state for submit button
    const [isRegistering, setIsRegistering] = useState(false);  // Toggle between login/register modes
    
    // Hooks for authentication and navigation
    const { login } = useAuth();  // Authentication context
    const navigate = useNavigate();  // Programmatic navigation

    // Refs for GSAP animations - allows direct DOM manipulation
    const cardRef = useRef(null);
    const formRef = useRef(null);
    const titleRef = useRef(null);
    const buttonRef = useRef(null);

    /**
     * Animation Effect
     * Initializes and runs animations when component mounts or mode changes
     * Demonstrates complex animation sequences with GSAP
     */
    useEffect(() => {
        // Card entrance animation
        gsap.fromTo(cardRef.current,
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
        );

        // Title animation
        gsap.fromTo(titleRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'back.out(1.7)' }
        );

        // Form elements stagger animation
        gsap.fromTo(formRef.current.children,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.5, ease: 'power1.out' }
        );

        // Button animation
        gsap.fromTo(buttonRef.current.children,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, delay: 0.8, ease: 'power3.out' }
        );
    }, [isRegistering]); // Re-run animations when switching between login/register

    /**
     * Form Validation
     * Checks form inputs against business rules
     * 
     * @returns {boolean} Whether the form is valid
     */
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

    /**
     * Form Submission Handler
     * Processes form submission for both login and registration
     * Demonstrates async/await pattern and error handling
     * 
     * @param {Event} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            let response;
            if (isRegistering) {
                response = await authService.register(username, password);
                if (response.success) {
                    // Animate out before navigating
                    gsap.to(cardRef.current, {
                        y: -50,
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.5,
                        onComplete: () => {
                            // Auto-login after successful registration
                            login(response.user, response.token);
                            navigate('/');
                        }
                    });
                }
            } else {
                response = await authService.login(username, password);
                if (response.success) {
                    // Animate out before navigating
                    gsap.to(cardRef.current, {
                        y: -50,
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.5,
                        onComplete: () => {
                            login(response.user, response.token);
                            navigate('/');
                        }
                    });
                }
            }
        } catch (err) {
            setError(err.message || `Failed to ${isRegistering ? 'register' : 'login'}`);
            // Shake animation for error
            gsap.to(cardRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.5,
                ease: 'power2.inOut'
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Mode Toggle Handler
     * Switches between login and registration modes with animations
     * Demonstrates state management with animations
     */
    const toggleMode = () => {
        // Animate out current form
        gsap.to(formRef.current.children, {
            opacity: 0,
            x: -20,
            stagger: 0.05,
            duration: 0.3,
            onComplete: () => {
                setIsRegistering(!isRegistering);
                setError('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            }
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card" ref={cardRef}>
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4 apple-title" ref={titleRef}>
                                {isRegistering ? 'Register' : 'Login'}
                            </h2>

                            {error && (
                                <div className="alert apple-alert" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} ref={formRef}>
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

                                <div ref={buttonRef}>
                                    <button
                                        type="submit"
                                        className="btn btn-apple w-100 mb-3"
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
                                        className="btn btn-outline-apple w-100"
                                        onClick={toggleMode}
                                        disabled={loading}
                                    >
                                        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

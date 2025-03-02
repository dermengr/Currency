/**
 * @fileoverview Navbar Component
 * 
 * This component represents the navigation bar of the application.
 * It demonstrates several key React concepts and features:
 * 
 * Key Concepts:
 * 1. React Hooks (useState, useEffect, useRef)
 * 2. React Router navigation
 * 3. Context API usage
 * 4. Conditional rendering
 * 5. Animation with GSAP
 * 6. Bootstrap integration
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import { gsap } from 'gsap';

/**
 * Navbar Component
 * 
 * @component
 * @example
 * return (
 *   <Navbar />
 * )
 */
const Navbar = () => {
    // Destructure auth context values for user management
    const { user, logout, isAdmin } = useAuth();  // Get authentication context
    const navigate = useNavigate();  // Hook for programmatic navigation
    const navRef = React.useRef(null);  // Ref for navbar animation
    const linksRef = React.useRef(null);  // Ref for links animation

    /**
     * Animation Effect
     * Uses GSAP library to create entrance animations for the navbar
     * Demonstrates useEffect hook for handling side effects
     */
    React.useEffect(() => {
        // Navbar entrance animation
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        );

        // Links stagger animation
        gsap.fromTo(linksRef.current.children,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
        );
    }, []);

    /**
     * Handles user logout
     * 1. Calls logout function from auth context
     * 2. Redirects to login page
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /**
     * Render Method
     * 
     * Structure:
     * 1. Responsive navbar container
     * 2. Brand logo/text
     * 3. Collapsible menu for mobile
     * 4. Navigation links (conditional based on user role)
     * 5. User authentication section
     */
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary" ref={navRef}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Currency Manager
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav" ref={linksRef}>
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Converter
                            </Link>
                        </li>
                        {isAdmin() && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}
                    </ul>
                    
                    <div className="d-flex align-items-center">
                        {user ? (
                            <>
                                <span className="text-light me-3">
                                    {user.username} ({user.role})
                                </span>
                                <button
                                    className="btn btn-outline-light"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link className="btn btn-outline-light" to="/login">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Added import for custom styles
import { gsap } from 'gsap'; // Import GSAP

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const navRef = React.useRef(null);
    const linksRef = React.useRef(null);

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (you can implement your auth logic here)
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/', label: 'Home Page', public: true },
    { path: '/login', label: 'Login', public: true, hideWhenLoggedIn: true },
    { path: '/register', label: 'Register', public: true, hideWhenLoggedIn: true },
    { path: '/dashboard', label: 'Dashboard', public: false },
    { path: '/interview-setup', label: 'Interview Setup', public: false },
    { path: '/interview-room', label: 'Interview Room', public: false },
    { path: '/coding-interview', label: 'Coding Interview', public: false },
    { path: '/results', label: 'Results', public: false },
    { path: '/history', label: 'History', public: false },
    { path: '/profile', label: 'Profile', public: false },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!isLoggedIn && !item.public) return false;
    if (isLoggedIn && item.hideWhenLoggedIn) return false;
    return true;
  });

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h1>HireMind AI</h1>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Desktop navigation */}
        <div className="navbar-links desktop-nav">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          
          {isLoggedIn && (
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          )}
        </div>

        {/* Mobile navigation */}
        <div className={`navbar-links mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          {isLoggedIn && (
            <button 
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }} 
              className="nav-link logout-btn"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

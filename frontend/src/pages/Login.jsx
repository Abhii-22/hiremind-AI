import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful login
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify({ email: formData.email }));
    console.log('Login successful:', formData);
    
    // Redirect to home page after login
    window.location.href = '/';
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn-login">Login</button>
        </form>
        
        <div className="divider">or</div>
        
        <button className="btn-google" onClick={handleGoogleLogin}>
          🌐 Continue with Google
        </button>
        
        <div className="register-link">
          Don't have account? 
          <a href="/register"> Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

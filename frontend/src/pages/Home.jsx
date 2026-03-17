import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Practice Interviews With AI 🤖
            </h1>
            <p className="hero-subtitle">
              Prepare for your dream job with real interview
              questions and instant feedback.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Start Interview</button>
              <button className="btn btn-secondary">Watch Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="ai-avatar">🤖</div>
              <div className="interview-bubble">
                "Tell me about your experience with React..."
              </div>
              <div className="user-bubble">
                "I have 2 years of experience building..."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How it Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1️⃣</div>
              <h3>Choose Role</h3>
              <p>Select job role like React, Python, Java</p>
            </div>
            <div className="step-card">
              <div className="step-number">2️⃣</div>
              <h3>Practice Interview</h3>
              <p>AI asks real interview questions</p>
            </div>
            <div className="step-card">
              <div className="step-number">3️⃣</div>
              <h3>Get Feedback</h3>
              <p>AI analyzes your answers and gives score</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3>Voice Interview</h3>
              <p>Practice with voice responses</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Coding Interview</h3>
              <p>Solve coding problems</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Performance Analytics</h3>
              <p>Track improvement</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Resume Based Questions</h3>
              <p>AI generates questions from resume</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "HireMind AI helped me crack my dream job! The AI feedback was spot-on."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💼</div>
                <div className="author-info">
                  <div className="author-name">Rahul Kumar</div>
                  <div className="author-role">Software Engineer</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "The voice interview feature is amazing. Felt like a real interview!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💼</div>
                <div className="author-info">
                  <div className="author-name">Priya Sharma</div>
                  <div className="author-role">Frontend Developer</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Coding interviews were tough, but the practice made me confident."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💻</div>
                <div className="author-info">
                  <div className="author-name">Amit Patel</div>
                  <div className="author-role">Full Stack Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <div className="container">
          <h2 className="section-title">Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>FREE PLAN</h3>
                <div className="price">₹0</div>
              </div>
              <div className="pricing-features">
                <div className="feature-item">✓ 3 interviews per week</div>
                <div className="feature-item">✓ Basic questions</div>
              </div>
              <button className="btn btn-outline">Start Free</button>
            </div>
            <div className="pricing-card popular">
              <div className="popular-badge">MOST POPULAR</div>
              <div className="pricing-header">
                <h3>PREMIUM PLAN</h3>
                <div className="price">₹199<span>/month</span></div>
              </div>
              <div className="pricing-features">
                <div className="feature-item">✓ Unlimited interviews</div>
                <div className="feature-item">✓ AI feedback</div>
                <div className="feature-item">✓ Coding interview</div>
                <div className="feature-item">✓ Resume based questions</div>
              </div>
              <button className="btn btn-primary">Upgrade</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>HireMind AI</h3>
              <p>Your AI-powered interview preparation partner</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="/features">Features</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/demo">Demo</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/careers">Careers</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 HireMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="landing">
      <div className="landing-container">
        {/* Header Section */}
        <header className="landing-header">
          <div className="logo">
            <span className="logo-icon">💬</span>
            <span className="logo-text">ChatApp</span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Connect with the world in <span className="highlight">real-time</span>
            </h1>
            <p className="hero-subtitle">
              Experience seamless communication with our advanced chat platform. 
              Share moments, ideas, and stay connected with anyone, anywhere.
            </p>
            
            <button className="cta-button primary" onClick={handleGetStarted}>
              <span className="button-text">Get Started</span>
              <span className="button-icon">→</span>
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Why Choose ChatApp?</h2>
            <p className="section-subtitle">Built with modern technology for the best user experience</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">💬</div>
              </div>
              <h3 className="feature-title">Real-time Chat</h3>
              <p className="feature-description">
                Instant messaging with zero delays. Experience conversations that flow naturally.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🖼️</div>
              </div>
              <h3 className="feature-title">Rich Media</h3>
              <p className="feature-description">
                Share photos, videos, documents and more. All file types supported.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⚡</div>
              </div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Optimized for speed. Messages delivered in milliseconds.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🔒</div>
              </div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                End-to-end encryption. Your conversations stay private and secure.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="demo-section">
          <div className="demo-content">
            <div className="demo-text">
              <h2 className="demo-title">See it in action</h2>
              <p className="demo-subtitle">
                Experience the intuitive interface that makes chatting effortless
              </p>
            </div>
            
            <div className="chat-demo">
              <div className="chat-header">
                <div className="chat-avatar">👤</div>
                <div className="chat-info">
                  <div className="chat-name">John Doe</div>
                  <div className="chat-status">Online</div>
                </div>
              </div>
              
              <div className="chat-messages">
                <div className="message received">
                  <p>Hey! How's it going?</p>
                  <span className="message-time">12:30</span>
                </div>
                <div className="message sent">
                  <p>Great! Check out this photo</p>
                  <span className="message-time">12:31</span>
                </div>
                <div className="message sent media">
                  <div className="media-content">📸</div>
                  <span className="message-time">12:31</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="final-cta">
          <div className="cta-content">
            <h2 className="cta-title">Ready to start chatting?</h2>
            <p className="cta-subtitle">
              Join thousands of users who are already connected
            </p>
            <button className="cta-button secondary" onClick={handleGetStarted}>
              <span className="button-text">Start Chatting Now</span>
              <span className="button-icon">🚀</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing; 
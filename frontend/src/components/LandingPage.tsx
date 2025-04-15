import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Master Problem Solving</h1>
                    <p className="hero-subtitle">Sharpen your coding skills with our comprehensive problem-solving platform</p>
                    <div className="cta-buttons">
                        <Link to="/signup" className="cta-button primary">Get Started</Link>
                        <Link to="/signin" className="cta-button secondary">Sign In</Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Why Choose Our Platform?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Comprehensive Problem Sets</h3>
                        <p>Access a wide range of coding problems to practice and improve your skills</p>
                    </div>
                    <div className="feature-card">
                        <h3>Real-time Code Evaluation</h3>
                        <p>Get instant feedback on your solutions with our advanced evaluation system</p>
                    </div>
                    <div className="feature-card">
                        <h3>Track Your Progress</h3>
                        <p>Monitor your improvement with detailed performance analytics</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <h2>Ready to Start Your Journey?</h2>
                <p>Join thousands of developers who are improving their problem-solving skills</p>
                <Link to="/signup" className="cta-button primary">Create Your Account</Link>
            </section>
        </div>
    );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/api/user/signup", 
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data;
            
            if (data.token) {
                localStorage.setItem("token", "Bearer " + data.token);
                navigate('/all_PS');
            }
        } catch (err: any) {
            if (err.response) {
                const errorMsg = err.response.data.msg;
                if (errorMsg === "Please fill all the fields.") {
                    setError("Please fill in all fields.");
                } else if (errorMsg === "Invalid data format.") {
                    setError("Invalid data format. Please check your inputs.");
                } else if (errorMsg === "User already exists.") {
                    setError("User already exists. Try a different username.");
                } else {
                    setError("An error occurred. Please try again later.");
                }
            } else {
                setError("Network error or server down. Please try again.");
            }
            setShowError(true);
            // Clear the form fields
            setFormData({
                username: '',
                email: '',
                password: ''
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseError = () => {
        setShowError(false);
        setError('');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join us to start solving problems</p>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-input"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/signin">Sign in</Link></p>
                </div>
            </div>

            {showError && (
                <div className="error-popup">
                    <div className="error-popup-content">
                        <h3>Error</h3>
                        <p>{error}</p>
                        <button 
                            className="btn btn-primary"
                            onClick={handleCloseError}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

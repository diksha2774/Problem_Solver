import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;
export default function Signin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await axios.post(`${apiUrl}/api/user/signin`, 
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
                if (errorMsg === "Please provide both username and password.") {
                    setError("Please fill in all fields.");
                } else if (errorMsg === "User does not exist.") {
                    setError("User does not exist. Please check your username.");
                } else if (errorMsg === "Incorrect password.") {
                    setError("Incorrect password. Please try again.");
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
                <h2>Sign In</h2>
                <p className="auth-subtitle">Welcome back! Please enter your details</p>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-input"
                            placeholder="Enter your username"
                            value={formData.username}
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
                            placeholder="Enter your password"
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
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
                
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
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

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';
import '../styles/Evaluate_code.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function Evaluate_code() {
    const location = useLocation();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [approach, setApproach] = useState('');
    const [response, setResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [problemTitle, setProblemTitle] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (location.state && location.state.selectedTitle) {
            setProblemTitle(location.state.selectedTitle);
        } else {
            navigate('/all_PS');
        }
    }, [location.state, navigate]);

    const handleCloseError = () => {
        setShowError(false);
        setError('');
    };

    const onclickhandler = async () => {
        if (!code.trim()) {
            setError("Please enter your code before submitting.");
            setShowError(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/signin');
                return;
            }

            const response = await axios.post(
                `${apiUrl}/api/problem/Evaluate_code`,
                {
                    title: problemTitle,
                    code: code,
                    approach: approach
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                }
            );

            setResponse(response.data.response);
        } catch (err: any) {
            if (err.response) {
                const errorMsg = err.response.data.error;
                if (errorMsg === "User not found") {
                    setError("Please sign in again.");
                    navigate('/signin');
                } else if (errorMsg === "No active problem statement found.") {
                    setError("Problem statement not found. Please try again.");
                } else if (errorMsg === "Failed to generate AI response") {
                    setError("Failed to evaluate code. Please try again.");
                } else {
                    setError("An error occurred. Please try again later.");
                }
            } else {
                setError("Network error or server down. Please try again.");
            }
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="evaluate-container">
            <div className="evaluate-header">
                <div className="header-content">
                    <h1>Code Evaluation</h1>
                    <div className="problem-info">
                        <span className="problem-label">Problem:</span>
                        <span className="problem-title">{problemTitle}</span>
                    </div>
                </div>
            </div>

            <div className="evaluate-content">
                <div className="code-section">
                    <div className="section-header">
                        <h2>Your Solution</h2>
                        <div className="action-buttons">
                            <button 
                                className="btn btn-outline"
                                onClick={() => {
                                    setCode('');
                                    setApproach('');
                                }}
                            >
                                <i className="fas fa-redo"></i> Reset
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={onclickhandler}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Evaluating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-play"></i> Evaluate Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Your Approach</label>
                        <textarea
                            className="approach-input"
                            value={approach}
                            onChange={(e) => setApproach(e.target.value)}
                            placeholder="Describe your approach to solving this problem..."
                            rows={3}
                        />
                    </div>

                    <div className="code-editor-wrapper">
                        <div className="editor-header">
                            <span className="editor-title">Code Editor</span>
                            <span className="language-indicator">JavaScript</span>
                        </div>
                        <textarea
                            className="code-editor"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Write your code here..."
                            rows={20}
                        />
                    </div>
                </div>

                <div className="result-section">
                    <div className="section-header">
                        <h2>Evaluation Result</h2>
                    </div>
                    <div className="result-content">
                        {isSubmitting ? (
                            <div className="loading-state">
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Evaluating your code...</span>
                            </div>
                        ) : (
                            <div className="result-output">
                                {response ? (
                                    <pre>{response}</pre>
                                ) : (
                                    <div className="empty-state">
                                        <i className="fas fa-code"></i>
                                        <p>Your evaluation results will appear here</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showError && (
                <div className="error-modal">
                    <div className="error-modal-content">
                        <div className="error-header">
                            <i className="fas fa-exclamation-circle"></i>
                            <h3>Error</h3>
                        </div>
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

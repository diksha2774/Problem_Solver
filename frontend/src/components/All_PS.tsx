import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

interface Problem {
    id: number;
    title: string;
    description: string;
    constraints: string;
    difficulty?: string;
    category?: string;
    created_at?: string;
    updated_at?: string;
    author_id?: number;
    status?: string;
}

export default function All_PS() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const token = localStorage.getItem("token")?.split(" ")[1];
                console.log(token);
                if (!token) {
                    navigate('/signin');
                    return;
                }

                const response = await axios.get("http://localhost:3000/api/problem/all_PS", {
                    headers: {
                        "Authorization": token
                    }
                });

                if (response.data && response.data.Problems) {
                    setProblems(response.data.Problems);
                }
            } catch (err: any) {
                setError("Failed to fetch problems. Please try again later.");
                setShowError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProblems();
    }, [navigate]);

    const handleCloseError = () => {
        setShowError(false);
        setError('');
    };

    const handleProblemClick = (title: string) => {
        navigate("/Evaluate_code", { state: { selectedTitle: title } });
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className="loading-container">
                    <h2>Loading problems...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Problem Statements</h1>
                <p className="page-subtitle">Choose a problem to solve</p>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/PS_data")}
                >
                    Create New Problem
                </button>
            </div>

            <div className="problems-grid">
                {problems.length > 0 ? (
                    problems.map((problem) => (
                        <div 
                            key={problem.id} 
                            className="problem-card"
                            onClick={() => handleProblemClick(problem.title)}
                        >
                            <div className="card-header">
                                <h3>{problem.title}</h3>
                                {problem.difficulty && (
                                    <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                                        {problem.difficulty}
                                    </span>
                                )}
                            </div>
                            <p className="card-description">{problem.description}</p>
                            <div className="card-footer">
                                {/* <div className="constraints">
                                    <h4>Constraints:</h4>
                                    <p>{problem.constraints}</p>
                                </div> */}
                                <button className="btn btn-primary">Start Solving</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-problems">
                        <h3>No problems available</h3>
                        <p>Create a new problem to get started</p>
                    </div>
                )}
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

export default function PS_data() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        constraints: ['']
    });
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addConstraint = () => {
        setFormData(prev => ({
            ...prev,
            constraints: [...prev.constraints, '']
        }));
    };

    const updateConstraint = (index: number, value: string) => {
        const updatedConstraints = [...formData.constraints];
        updatedConstraints[index] = value;
        setFormData(prev => ({
            ...prev,
            constraints: updatedConstraints
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/signin');
                return;
            }

            await axios.post(
                "http://localhost:3000/api/problem/PS_data",
                {
                    title: formData.title,
                    description: formData.description,
                    constraints: formData.constraints
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                }
            );

            // Navigate to Evaluate_code with the new problem title
            navigate("/Evaluate_code", { state: { selectedTitle: formData.title } });
        } catch (err: any) {
            if (err.response) {
                const errorMsg = err.response.data.msg;
                if (errorMsg === "Please fill all the fields.") {
                    setError("Please fill in all fields.");
                } else if (errorMsg === "Invalid data format.") {
                    setError("Invalid data format. Please check your inputs.");
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

    const handleCloseError = () => {
        setShowError(false);
        setError('');
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Create New Problem</h1>
                <p className="page-subtitle">Design your own problem statement</p>
            </div>

            <div className="problem-form-container">
                <form className="problem-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">Problem Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-input"
                            placeholder="Enter problem title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Problem Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-input"
                            rows={5}
                            placeholder="Describe the problem in detail"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Constraints</label>
                        {formData.constraints.map((constraint, index) => (
                            <div key={index} className="constraint-input-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={`Constraint ${index + 1}`}
                                    value={constraint}
                                    onChange={(e) => updateConstraint(index, e.target.value)}
                                    required
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={addConstraint}
                        >
                            Add Constraint
                        </button>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Problem'}
                        </button>
                        <button 
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/all_PS')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
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
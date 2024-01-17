import React, { useState } from 'react';
import { createUserWithEmailAndPassword, auth } from './firebaseauth';
import { Link } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        setLoading(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setSuccessMessage('User registered successfully');
                setErrorMessage('');
            })
            .catch((error) => {
                setErrorMessage(error.message);
                console.error('Error registering user:', error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="container mt-5">
            <div className="col-md-6 offset-md-3">
                <h2 className="text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                {successMessage && <p className="text-success mt-3">{successMessage}</p>}
                {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                <div className="mt-3">
                    <Link to="/login">Already have an account? Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;

import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from './firebaseauth';
import Todo from './todo/todo';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();

    const signIn = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Sign-in successful!');
            navigate('/todo');
        } catch (error) {
            alert(error.message);
            console.error('Sign-in failed:', error.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="col-md-6 offset-md-3">
                <h2 className="text-center mb-4">Sign In</h2>
                <form onSubmit={signIn}>
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
                    <button type="submit" className="btn btn-success form-control">
                        Sign In
                    </button>
                </form>
                <div className="mt-3">
                    <Link to="/signup">Don't have an account? Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default SignIn;

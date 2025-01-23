import React, { useState } from "react";
import "../styles.css";

const Login = ({ onLoginSuccess }) => {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        // Replace these with your desired valid login credentials
        const validCredentials = {
            id: "admin@rewinhealth.com", // Replace "admin" with the actual login ID
            password: "Rewin@admin123", // Replace "password123" with the actual password
        };

        // Validate the login ID and password
        if (loginId === validCredentials.id && password === validCredentials.password) {
            setError(""); // Clear any previous errors
            onLoginSuccess(); // Redirect to the dashboard
        } else {
            setError("Invalid Login ID or Password. Please try again.");
        }
    };

    return (
        <div className="login-page">
            {/* Left panel with background image */}
            <div className="login-left">
                <h1>ReWin VR Dashboard</h1>
            </div>

            {/* Right panel with login form */}
            <div className="login-right">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Sign In</h2>
                    <div className="form-group">
                        <label htmlFor="loginId">Email ID</label>
                        <input
                            type="text"
                            id="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            required
                            placeholder="Enter your Email ID"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;

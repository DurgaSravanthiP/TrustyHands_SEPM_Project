import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors([]);
    const newErrors = [];

    // --- ADMIN LOGIN BYPASS ---
    if (email === "admin@trustyhands.com" && password === "admin123") {
      sessionStorage.setItem("adminLoggedIn", "true");
      navigate("/admin-dashboard");
      return;
    } else if (email === "admin@trustyhands.com" && password !== "admin123") {
      newErrors.push("Incorrect Administrative Access Key.");
      setErrors(newErrors);
      return;
    }
    // ---------------------------

    if (password.length < 8) {
      newErrors.push("Password must be at least 8 characters long.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // NOTE: Replace with actual API call here
      // const result = await api.post('/api/auth/login', { email, password });
      // if (result.success) { ... }

      // Dummy success flow:
      localStorage.setItem("th_logged_in", "true");
      navigate("/");
    } catch (err) {
      setErrors(["An error occurred during login. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid = password.length >= 8;

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <i className="fas fa-hands-helping login-decoration login-decoration-1"></i>
        <i className="fas fa-tools login-decoration login-decoration-2"></i>

        <div className="login-logo-container">
          <Link to="/" className="login-logo">
            <i className="fas fa-hands-helping"></i>
            <span>Trustyhands</span>
          </Link>
          <p className="login-logo-text">
            Premium service platform connecting customers with trusted professionals
          </p>
        </div>

        <div className="login-form-container">
          {errors.length > 0 && (
            <div className="login-error-message">
              {errors.map((err, idx) => (
                <p key={idx}>
                  <i className="fas fa-exclamation-circle"></i> {err}
                </p>
              ))}
            </div>
          )}

          <h1 className="login-form-title">Welcome Back</h1>

          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </span>
            </div>

            <div className="login-password-requirements">
              <div
                className={`login-requirement ${isPasswordValid ? "met" : ""}`}
              >
                <i
                  className={`fas ${
                    isPasswordValid ? "fa-check-circle" : "fa-circle"
                  }`}
                ></i>
                <span>Minimum 8 characters</span>
              </div>
            </div>

            <div className="login-recover">
              <a href="#!">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-or">or continue with</div>

          <div className="login-icons">
            <div className="login-social-icon">
              <i className="fab fa-google"></i>
            </div>
            <div className="login-social-icon">
              <i className="fab fa-facebook"></i>
            </div>
            <div className="login-social-icon">
              <i className="fab fa-linkedin"></i>
            </div>
          </div>

          <div className="login-links">
            <p>Don't have an account yet?</p>
            <Link to="/register" className="login-switch-btn">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

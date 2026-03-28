import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Register.css";

const Register = () => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors([]);
    const newErrors = [];

    if (password.length < 8) {
      newErrors.push("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
      newErrors.push("Passwords do not match.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // NOTE: Replace with actual API call here
      // const data = { fName, lName, email, password };
      // const result = await api.post('/api/auth/register', data);
      // if (result.success) { ... }

      // Dummy success flow:
      localStorage.setItem("th_logged_in", "true");
      navigate("/");
    } catch (err) {
      setErrors(["An error occurred during registration. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLengthMet = password.length >= 8;
  const isMatchMet = confirmPassword && password === confirmPassword;

  return (
    <div className="register-page-wrapper">
      <div className="register-container">
        <i className="fas fa-hands-helping register-decoration register-decoration-1"></i>
        <i className="fas fa-tools register-decoration register-decoration-2"></i>

        <div className="register-logo-container">
          <Link to="/" className="register-logo">
            <i className="fas fa-hands-helping"></i>
            <span>Trustyhands</span>
          </Link>
          <p className="register-logo-text">
            Premium service platform connecting customers with trusted professionals
          </p>
        </div>

        <div className="register-form-container">
          {errors.length > 0 && (
            <div className="register-error-message">
              {errors.map((err, idx) => (
                <p key={idx}>
                  <i className="fas fa-exclamation-circle"></i> {err}
                </p>
              ))}
            </div>
          )}

          <h1 className="register-form-title">Create Account</h1>

          <form onSubmit={handleRegister}>
            <div className="register-input-group">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                placeholder="First Name"
                required
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
            </div>

            <div className="register-input-group">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                placeholder="Last Name"
                required
                value={lName}
                onChange={(e) => setLName(e.target.value)}
              />
            </div>

            <div className="register-input-group">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="register-input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </span>
            </div>

            <div className="register-input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="register-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={
                    showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </span>
            </div>

            <div className="register-password-requirements">
              <div
                className={`register-requirement ${isLengthMet ? "met" : ""}`}
              >
                <i
                  className={`fas ${
                    isLengthMet ? "fa-check-circle" : "fa-circle"
                  }`}
                ></i>
                <span>Minimum 8 characters</span>
              </div>
              <div
                className={`register-requirement ${isMatchMet ? "met" : ""}`}
              >
                <i
                  className={`fas ${
                    isMatchMet ? "fa-check-circle" : "fa-circle"
                  }`}
                ></i>
                <span>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="register-or">or continue with</div>

          <div className="register-icons">
            <div className="register-social-icon">
              <i className="fab fa-google"></i>
            </div>
            <div className="register-social-icon">
              <i className="fab fa-facebook"></i>
            </div>
            <div className="register-social-icon">
              <i className="fab fa-linkedin"></i>
            </div>
          </div>

          <div className="register-links">
            <p>Already Have Account?</p>
            <Link to="/login" className="register-switch-btn">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

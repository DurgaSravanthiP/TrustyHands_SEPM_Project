import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors([]);
    const newErrors = [];

    if (!role) {
      newErrors.push("Please choose your role.");
    }

    if (password.length < 8) {
      newErrors.push("Password must be at least 8 characters long.");
    }

    if (!email.trim()) {
      newErrors.push("Email is required.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim(),
          password,
          role,
        },
      );

      const user = response.data.user;
      localStorage.setItem("th_user", JSON.stringify(user));
      localStorage.setItem("th_logged_in", "true");

      if (role === "customer") {
        navigate("/customer-dashboard");
      } else if (role === "worker") {
        navigate("/worker-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "An error occurred during login. Please try again.";
      setErrors([msg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid = password.length >= 8;

  return (
    <div className="login-page-wrapper">
      <div className="login-container" style={{ maxWidth: "550px" }}>
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

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div className="login-input-group role-radio-group" style={{ marginBottom: "5px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#4f5e3f" }}>Login As</label>
              <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "#f8faf3", padding: "12px 15px", borderRadius: "8px", border: "1px solid rgba(96, 108, 56, 0.2)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "500" }}>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === "customer"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--primary)", padding: 0 }}
                  />
                  <span>Customer</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "500" }}>
                  <input
                    type="radio"
                    name="role"
                    value="worker"
                    checked={role === "worker"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--primary)", padding: 0 }}
                  />
                  <span>Worker</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "500" }}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--primary)", padding: 0 }}
                  />
                  <span>Admin</span>
                </label>
              </div>
            </div>

            <div className="login-input-group" style={{ marginBottom: "0" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4f5e3f" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <i className="fas fa-envelope input-icon" style={{ zIndex: 2 }}></i>
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "12px", paddingLeft: "40px" }}
                />
              </div>
            </div>

            <div className="login-input-group" style={{ marginBottom: "0" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4f5e3f" }}>Password</label>
              <div style={{ position: "relative" }}>
                <i className="fas fa-lock input-icon" style={{ zIndex: 2 }}></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "12px", paddingLeft: "40px", paddingRight: "40px" }}
                />
                <span
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 2 }}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </span>
              </div>
            </div>

            <div className="login-recover" style={{ marginTop: "-5px" }}>
              <a href="#!">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
              style={{ padding: "14px", fontSize: "1.05rem", marginTop: "5px" }}
            >
              {isSubmitting ? "Signing In..." : "Log In Securely"}
            </button>
          </form>

          <div className="login-links" style={{ marginTop: "20px" }}>
            <p>Don't have an account yet?</p>
            <Link to="/register" className="login-switch-btn" style={{ fontSize: "1rem" }}>
              Sign Up Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

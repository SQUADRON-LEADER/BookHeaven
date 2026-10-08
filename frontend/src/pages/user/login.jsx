import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiBook, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import "./login.css"; 
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${Server_URL}users/login`, data);
      const { role } = response.data.user || {};
      const token = response.data.token;

      localStorage.setItem("authToken", token);
      if (role) localStorage.setItem("role", role);

      showSuccessToast("Welcome back! Login successful.");

      if (role === "admin" || role === "librarian") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lib-auth-page">
      <div className="lib-auth-card">
        {/* Header */}
        <div className="lib-auth-header">
          <div className="lib-auth-brand">
            <span className="lib-auth-brand-icon">
              <FiBook size={24} />
            </span>
            <span className="lib-auth-brand-name">AGC Library</span>
          </div>
          <h2 className="lib-auth-title">Welcome Back</h2>
          <p className="lib-auth-sub">Enter your credentials to access your library account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lib-auth-form">
          <div className="lib-auth-group">
            <label className="lib-auth-label">Email Address</label>
            <div className="lib-auth-input-wrap">
              <FiMail className="lib-auth-field-icon" size={17} />
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address"
                  }
                })}
                placeholder="name@college.edu"
                className="lib-auth-input"
              />
            </div>
            {errors.email && <span className="lib-auth-error">{errors.email.message}</span>}
          </div>

          <div className="lib-auth-group">
            <div className="lib-auth-label-row">
              <label className="lib-auth-label">Password</label>
              <Link to="/forgetpassword" className="lib-auth-forgot-link">
                Forgot Password?
              </Link>
            </div>
            <div className="lib-auth-input-wrap">
              <FiLock className="lib-auth-field-icon" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="lib-auth-input"
              />
              <button
                type="button"
                className="lib-auth-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <span className="lib-auth-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="lib-btn lib-btn-primary lib-auth-submit" disabled={loading}>
            {loading ? "Signing In..." : (
              <>
                Sign In to Account <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="lib-auth-footer">
          <p>
            Don't have an account yet?{" "}
            <Link to="/register" className="lib-auth-switch-link">
              Register here
            </Link>
          </p>
          <div className="lib-auth-admin-link">
            <Link to="/admin-login">Staff &amp; Librarian Portal &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

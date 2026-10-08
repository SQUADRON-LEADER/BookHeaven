import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser, FiMail, FiLock, FiBook, FiCalendar,
  FiArrowRight, FiEye, FiEyeOff, FiLayers
} from "react-icons/fi";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import "./login.css";

export default function Register() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = { ...data, role: "user" };
      const response = await axios.post(`${Server_URL}users/register`, formData);

      showSuccessToast("Account created successfully! Please sign in.");
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Registration failed. Please try again.");
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
          <h2 className="lib-auth-title">Create Account</h2>
          <p className="lib-auth-sub">Join thousands of students and faculty members</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lib-auth-form">
          {/* Name */}
          <div className="lib-auth-group">
            <label className="lib-auth-label">Full Name</label>
            <div className="lib-auth-input-wrap">
              <FiUser className="lib-auth-field-icon" size={17} />
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="John Doe"
                className="lib-auth-input"
              />
            </div>
            {errors.name && <span className="lib-auth-error">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div className="lib-auth-group">
            <label className="lib-auth-label">College Email</label>
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
                placeholder="john.doe@college.edu"
                className="lib-auth-input"
              />
            </div>
            {errors.email && <span className="lib-auth-error">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="lib-auth-group">
            <label className="lib-auth-label">Password</label>
            <div className="lib-auth-input-wrap">
              <FiLock className="lib-auth-field-icon" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
                placeholder="Create a strong password"
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

          {/* Stream */}
          <div className="lib-auth-group">
            <label className="lib-auth-label">Academic Stream / Department</label>
            <div className="lib-auth-input-wrap">
              <FiLayers className="lib-auth-field-icon" size={17} />
              <input
                type="text"
                {...register("stream", { required: "Stream/Department is required" })}
                placeholder="e.g. Computer Science & Engineering"
                className="lib-auth-input"
              />
            </div>
            {errors.stream && <span className="lib-auth-error">{errors.stream.message}</span>}
          </div>

          {/* Year */}
          <div className="lib-auth-group">
            <label className="lib-auth-label">Academic Year</label>
            <div className="lib-auth-input-wrap">
              <FiCalendar className="lib-auth-field-icon" size={17} />
              <input
                type="number"
                min="1"
                max="5"
                {...register("year", { required: "Year is required" })}
                placeholder="e.g. 1, 2, 3, 4"
                className="lib-auth-input"
              />
            </div>
            {errors.year && <span className="lib-auth-error">{errors.year.message}</span>}
          </div>

          <button type="submit" className="lib-btn lib-btn-primary lib-auth-submit" disabled={loading}>
            {loading ? "Creating Account..." : (
              <>
                Register Account <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="lib-auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="lib-auth-switch-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../../utils/config";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiLock, FiMail, FiCheck, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { showSuccessToast, showErrorToast } from "../../../utils/toasthelper";
import "../login.css";

function ResetPassword() {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${Server_URL}users/reset-password`, data);
      showSuccessToast(res.data.message || "Password updated successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="lib-auth-page">
      <div className="lib-auth-card">
        <div className="lib-auth-header">
          <div className="lib-auth-brand">
            <span className="lib-auth-brand-icon">
              <FiLock size={22} />
            </span>
            <span className="lib-auth-brand-name">AGC Library</span>
          </div>
          <h2 className="lib-auth-title">Reset Password</h2>
          <p className="lib-auth-sub">
            Create a new secure password for your library account
          </p>
        </div>
        
        <form className="lib-auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="lib-auth-group">
            <label htmlFor="email" className="lib-auth-label">
              Email Address
            </label>
            <div className="lib-auth-input-wrap">
              <FiMail className="lib-auth-field-icon" size={17} />
              <input
                id="email"
                type="email"
                className="lib-auth-input"
                placeholder="Enter your registered email"
                defaultValue={email}
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
            </div>
            {errors.email && (
              <span className="lib-auth-error">{errors.email.message}</span>
            )}
          </div>

          <div className="lib-auth-group">
            <label htmlFor="newPassword" className="lib-auth-label">
              New Password
            </label>
            <div className="lib-auth-input-wrap">
              <FiLock className="lib-auth-field-icon" size={17} />
              <input
                id="newPassword"
                type={showPwd ? "text" : "password"}
                className="lib-auth-input"
                placeholder="Min. 6 characters"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: { 
                    value: 6, 
                    message: "Password must be at least 6 characters" 
                  }
                })}
              />
              <button
                type="button"
                className="lib-auth-toggle-pwd"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="lib-auth-error">{errors.newPassword.message}</span>
            )}
          </div>

          <div className="lib-auth-group">
            <label htmlFor="confirmPassword" className="lib-auth-label">
              Confirm New Password
            </label>
            <div className="lib-auth-input-wrap">
              <FiLock className="lib-auth-field-icon" size={17} />
              <input
                id="confirmPassword"
                type={showPwd ? "text" : "password"}
                className="lib-auth-input"
                placeholder="Re-enter new password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => 
                    value === watch("newPassword") || "Passwords do not match"
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="lib-auth-error">{errors.confirmPassword.message}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="lib-btn lib-btn-primary lib-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : (
              <>
                Update Password &amp; Login <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>
        
        <div className="lib-auth-footer">
          <p>
            Remember your credentials?{" "}
            <Link to="/login" className="lib-auth-switch-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
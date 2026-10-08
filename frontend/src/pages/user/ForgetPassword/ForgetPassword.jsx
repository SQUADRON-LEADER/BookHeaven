import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../../utils/config";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiBook, FiArrowRight, FiArrowLeft, FiKey } from "react-icons/fi";
import { showSuccessToast, showErrorToast } from "../../../utils/toasthelper";
import "../login.css";

function ForgotPassword() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${Server_URL}users/forgot-password`, data);
      showSuccessToast(res.data.message || "OTP sent successfully to your email!");
      navigate("/verifyotp", { state: { email: data.email } });
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to send reset OTP. Please check your email.");
    }
  };

  return (
    <div className="lib-auth-page">
      <div className="lib-auth-card">
        <div className="lib-auth-header">
          <div className="lib-auth-brand">
            <span className="lib-auth-brand-icon">
              <FiKey size={22} />
            </span>
            <span className="lib-auth-brand-name">AGC Library</span>
          </div>
          <h2 className="lib-auth-title">Password Recovery</h2>
          <p className="lib-auth-sub">
            Enter your registered email address and we'll send a 6-digit verification code.
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
                placeholder="name@college.edu"
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
          
          <button 
            type="submit" 
            className="lib-btn lib-btn-primary lib-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending OTP..." : (
              <>
                Send Verification Code <FiArrowRight size={16} />
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

export default ForgotPassword;
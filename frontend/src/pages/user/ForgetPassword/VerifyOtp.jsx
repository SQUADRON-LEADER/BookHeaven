import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../../utils/config";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiMail, FiShield, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { showSuccessToast, showErrorToast } from "../../../utils/toasthelper";
import "../login.css";

function VerifyOTP() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${Server_URL}users/verify-otp`, data);
      showSuccessToast(res.data.message || "OTP verified successfully!");
      navigate("/resetpass", { state: { email: data.email } });
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Invalid or expired OTP code.");
    }
  };

  const resendOtp = async () => {
    if (!email) {
      showErrorToast("Email not found. Please start the recovery process again.");
      return;
    }
    try {
      await axios.post(`${Server_URL}users/forgot-password`, { email });
      showSuccessToast("A new OTP code has been sent to your email!");
    } catch (err) {
      showErrorToast("Failed to resend OTP.");
    }
  };

  return (
    <div className="lib-auth-page">
      <div className="lib-auth-card">
        <div className="lib-auth-header">
          <div className="lib-auth-brand">
            <span className="lib-auth-brand-icon">
              <FiShield size={22} />
            </span>
            <span className="lib-auth-brand-name">AGC Library</span>
          </div>
          <h2 className="lib-auth-title">Verify OTP</h2>
          <p className="lib-auth-sub">
            We've sent a 6-digit verification code to <strong style={{ color: "var(--clr-gold)" }}>{email || "your email"}</strong>
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
            <div className="lib-auth-label-row">
              <label htmlFor="otp" className="lib-auth-label">
                6-Digit Security Code
              </label>
              <button 
                type="button" 
                className="lib-auth-forgot-link"
                onClick={resendOtp}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Resend Code
              </button>
            </div>
            <div className="lib-auth-input-wrap">
              <FiShield className="lib-auth-field-icon" size={17} />
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                className="lib-auth-input"
                placeholder="123456"
                style={{ letterSpacing: "4px", fontWeight: "bold" }}
                {...register("otp", { 
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 digits"
                  },
                  maxLength: {
                    value: 6,
                    message: "OTP must be 6 digits"
                  },
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "OTP must be numeric"
                  }
                })}
              />
            </div>
            {errors.otp && (
              <span className="lib-auth-error">{errors.otp.message}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="lib-btn lib-btn-primary lib-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : (
              <>
                Confirm &amp; Proceed <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>
        
        <div className="lib-auth-footer">
          <p>
            Didn't receive the email? Check spam folder or{" "}
            <button 
              className="lib-auth-switch-link"
              onClick={resendOtp}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Click here to resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
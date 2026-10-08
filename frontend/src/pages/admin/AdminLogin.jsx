import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FiShield, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import "../user/login.css";

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const url = Server_URL + 'admin/login';
      const response = await axios.post(url, data);
      
      const token = response.data.token;
      const role = response.data.user?.role || "admin";

      localStorage.setItem("authToken", token);
      localStorage.setItem("adminauthToken", token);
      localStorage.setItem("role", role);

      showSuccessToast("Administrator authentication successful!");
      navigate("/admin");
    } catch (error) {
      console.error("Admin Login Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lib-auth-page">
      <div className="lib-auth-card">
        <div className="lib-auth-header">
          <div className="lib-auth-brand">
            <span className="lib-auth-brand-icon">
              <FiShield size={24} />
            </span>
            <span className="lib-auth-brand-name">AGC Administration</span>
          </div>
          <h2 className="lib-auth-title">Staff Portal</h2>
          <p className="lib-auth-sub">Authorized library staff and administrators only</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="lib-auth-form">
          <div className="lib-auth-group">
            <label className="lib-auth-label">Administrator Email</label>
            <div className="lib-auth-input-wrap">
              <FiMail className="lib-auth-field-icon" size={17} />
              <input
                type="email"
                placeholder="admin@college.edu"
                className="lib-auth-input"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <span className="lib-auth-error">{errors.email.message}</span>}
          </div>

          <div className="lib-auth-group">
            <label className="lib-auth-label">Security Key / Password</label>
            <div className="lib-auth-input-wrap">
              <FiLock className="lib-auth-field-icon" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="lib-auth-input"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                className="lib-auth-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <span className="lib-auth-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="lib-btn lib-btn-primary lib-auth-submit" disabled={loading}>
            {loading ? "Authenticating..." : (
              <>
                Access Admin Suite <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="lib-auth-footer">
          <p>
            Student or Faculty?{" "}
            <Link to="/login" className="lib-auth-switch-link">
              Student Login Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

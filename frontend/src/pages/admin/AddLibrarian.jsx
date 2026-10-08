import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import { FiUserPlus, FiUser, FiMail, FiLock, FiShield, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function AddLibrarian() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = { ...data, role: "librarian" };
      const url = Server_URL + "admin/addlibrarian";
      const authToken = localStorage.getItem("authToken");

      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      showSuccessToast(response.data.message || "Librarian staff account created successfully!");
      reset();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Failed to add librarian.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lib-admin-dash" style={{ padding: "3rem 1rem" }}>
      <div className="lib-container" style={{ maxWidth: "600px" }}>
        <div className="lib-section-card">
          <div className="lib-section-card__title">
            <FiUserPlus size={22} />
            <h2>Register Staff Librarian</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="lib-auth-form">
            <div className="lib-auth-group">
              <label className="lib-auth-label">Full Name</label>
              <div className="lib-auth-input-wrap">
                <FiUser className="lib-auth-field-icon" size={17} />
                <input
                  type="text"
                  className="lib-auth-input"
                  placeholder="e.g. Sarah Jenkins"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <span className="lib-auth-error">{errors.name.message}</span>}
            </div>

            <div className="lib-auth-group">
              <label className="lib-auth-label">Staff Email Address</label>
              <div className="lib-auth-input-wrap">
                <FiMail className="lib-auth-field-icon" size={17} />
                <input
                  type="email"
                  className="lib-auth-input"
                  placeholder="librarian@college.edu"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Valid email is required"
                    }
                  })}
                />
              </div>
              {errors.email && <span className="lib-auth-error">{errors.email.message}</span>}
            </div>

            <div className="lib-auth-group">
              <label className="lib-auth-label">Initial Access Password</label>
              <div className="lib-auth-input-wrap">
                <FiLock className="lib-auth-field-icon" size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="lib-auth-input"
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
                  })}
                />
                <button
                  type="button"
                  className="lib-auth-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <span className="lib-auth-error">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              className="lib-btn lib-btn-primary lib-auth-submit"
              disabled={loading}
              style={{ marginTop: "1rem" }}
            >
              {loading ? "Creating Credentials..." : (
                <>
                  <FiShield size={16} /> Create Librarian Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

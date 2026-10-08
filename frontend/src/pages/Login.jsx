import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import {
  FiBook,
  FiLock,
  FiMail,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiCheck
} from "react-icons/fi";

export default function Login() {
  const { login, registerUser } = useLibrary();
  const navigate = useNavigate();

  // Mode: 'signin' | 'register'
  const [activeMode, setActiveMode] = useState("signin");

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPwd, setShowSignInPwd] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [loading, setLoading] = useState(false);

  // Register Form State
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "Computer Science",
    phone: "",
  });
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInError("");
    setLoading(true);

    const res = await login(signInEmail, signInPassword);
    setLoading(false);

    if (res.success) {
      navigate("/");
    } else {
      setSignInError(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match. Please retype carefully.");
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const res = await registerUser(registerData);
    setLoading(false);

    if (res.success) {
      setActiveMode("signin");
      setSignInEmail(registerData.email);
      setSignInPassword(registerData.password);
    } else {
      setRegisterError(res.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "520px",
        margin: "40px auto",
        padding: "0 16px",
      }}
    >
      <div className="academic-card" style={{ padding: "32px 30px", borderTop: "4px solid var(--green-primary)" }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              margin: "0 auto 10px",
              background: "var(--green-soft)",
              border: "1px solid var(--green-soft-border)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--green-primary)",
            }}
          >
            <FiBook size={24} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--green-primary-dark)", letterSpacing: "0.5px" }}>
            BOOKHAVEN
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "3px" }}>
            Institutional Portal for Patrons, Librarians &amp; Administrators
          </p>
        </div>

        {/* Tab Toggle (Sign In vs Register) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            background: "var(--bg-app)",
            padding: "4px",
            borderRadius: "4px",
            border: "1px solid var(--border-light)",
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            className={`btn ${activeMode === "signin" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "13px", padding: "6px" }}
            onClick={() => {
              setActiveMode("signin");
              setSignInError("");
            }}
          >
            <FiLogIn size={13} /> Sign In
          </button>
          <button
            type="button"
            className={`btn ${activeMode === "register" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "13px", padding: "6px" }}
            onClick={() => {
              setActiveMode("register");
              setRegisterError("");
            }}
          >
            <FiUserPlus size={13} /> Register Account
          </button>
        </div>

        {/* ── SIGN IN FORM ── */}
        {activeMode === "signin" && (
          <form onSubmit={handleSignInSubmit}>
            {signInError && (
              <div className="academic-alert academic-alert-danger">
                <FiAlertCircle size={16} />
                <span>{signInError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Institutional Email Address <span className="required-star">*</span>
              </label>
              <div className="search-input-wrapper">
                <FiMail className="search-icon-inside" size={15} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. user@college.edu or admin@library.edu"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Account Password <span className="required-star">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <div className="search-input-wrapper">
                  <FiLock className="search-icon-inside" size={15} />
                  <input
                    type={showSignInPwd ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your account password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowSignInPwd(!showSignInPwd)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  aria-label="Toggle password"
                >
                  {showSignInPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "10px", marginTop: "12px", fontSize: "14px" }}
              disabled={loading}
            >
              <FiLogIn size={15} /> {loading ? "Authenticating..." : "Sign In to Library System"}
            </button>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {activeMode === "register" && (
          <form onSubmit={handleRegisterSubmit}>
            {registerError && (
              <div className="academic-alert academic-alert-danger">
                <FiAlertCircle size={16} />
                <span>{registerError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <div className="search-input-wrapper">
                <FiUser className="search-icon-inside" size={15} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Vikram Malhotra"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Institutional Email <span className="required-star">*</span>
              </label>
              <div className="search-input-wrapper">
                <FiMail className="search-icon-inside" size={15} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. vikram.malhotra@college.edu"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select
                  className="form-select"
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="librarian">Librarian Staff</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={registerData.department}
                  onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="Electronics &amp; Comm">Electronics &amp; Comm</option>
                  <option value="Mechanical Eng.">Mechanical Eng.</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Literature">Literature</option>
                  <option value="Economics">Economics</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">
                  Password <span className="required-star">*</span>
                </label>
                <input
                  type={showRegPwd ? "text" : "password"}
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Confirm Password <span className="required-star">*</span>
                </label>
                <input
                  type={showRegPwd ? "text" : "password"}
                  className="form-control"
                  placeholder="Re-enter password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <input
                type="checkbox"
                id="showRegPwdToggle"
                checked={showRegPwd}
                onChange={(e) => setShowRegPwd(e.target.checked)}
              />
              <label htmlFor="showRegPwdToggle" style={{ fontSize: "12px", color: "var(--text-muted)", cursor: "pointer" }}>
                Show password characters
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "10px", fontSize: "14px" }}
              disabled={loading}
            >
              <FiUserPlus size={15} /> Create Institutional Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

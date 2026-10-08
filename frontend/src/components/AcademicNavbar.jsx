import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import {
  FiBook,
  FiUsers,
  FiRepeat,
  FiList,
  FiGrid,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiRefreshCw,
  FiCheckSquare
} from "react-icons/fi";

export default function AcademicNavbar() {
  const { currentUser, logout, switchRole, resetToSampleData } = useLibrary();
  const navigate = useNavigate();

  return (
    <header className="academic-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <FiBook size={20} />
          <span style={{ letterSpacing: "0.5px" }}>BOOKHAVEN</span>
          <span className="brand-badge">Central Library</span>
        </Link>

        {/* Navigation Links */}
        {currentUser && (
          <nav>
            <ul className="navbar-links">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `nav-link-btn ${isActive ? "active" : ""}`
                  }
                >
                  <FiGrid size={15} /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/books"
                  className={({ isActive }) =>
                    `nav-link-btn ${isActive ? "active" : ""}`
                  }
                >
                  <FiBook size={15} /> Books Catalog
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/members"
                  className={({ isActive }) =>
                    `nav-link-btn ${isActive ? "active" : ""}`
                  }
                >
                  <FiUsers size={15} /> Members
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/circulation"
                  className={({ isActive }) =>
                    `nav-link-btn ${isActive ? "active" : ""}`
                  }
                >
                  <FiRepeat size={15} /> Issue &amp; Return
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `nav-link-btn ${isActive ? "active" : ""}`
                  }
                >
                  <FiList size={15} /> Transactions
                </NavLink>
              </li>
            </ul>
          </nav>
        )}

        {/* User Auth Section */}
        <div className="navbar-user-section">
          {currentUser ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.12)",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "12.5px",
                }}
              >
                <FiUser size={14} style={{ color: "#d8edd6" }} />
                <span>
                  <strong>{currentUser.name}</strong>
                </span>
                <span
                  style={{
                    background: "var(--green-soft)",
                    color: "var(--green-primary-dark)",
                    fontSize: "10.5px",
                    fontWeight: "700",
                    padding: "1px 6px",
                    borderRadius: "3px",
                    textTransform: "uppercase",
                  }}
                >
                  {currentUser.role}
                </span>
              </div>

              {/* Quick Role Tester Selector */}
              <select
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "3px",
                  padding: "3px 6px",
                  fontSize: "11.5px",
                  cursor: "pointer",
                }}
                title="Simulate Role Authorization (Admin vs Librarian vs Student)"
              >
                <option value="admin" style={{ color: "#1e293b", background: "#fff" }}>
                  Role: Admin
                </option>
                <option value="librarian" style={{ color: "#1e293b", background: "#fff" }}>
                  Role: Librarian
                </option>
                <option value="student" style={{ color: "#1e293b", background: "#fff" }}>
                  Role: Student
                </option>
              </select>

              <button
                className="btn-nav-logout"
                onClick={resetToSampleData}
                title="Restore default comprehensive seed dataset"
                style={{ fontSize: "11.5px", padding: "4px 8px" }}
              >
                <FiRefreshCw size={11} /> Reset Data
              </button>

              <button
                className="btn-nav-logout"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <FiLogOut size={13} /> Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-nav-logout"
              style={{ background: "#ffffff", color: "var(--green-primary)" }}
            >
              <FiLogIn size={13} /> Institutional Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

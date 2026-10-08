import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiBook, FiUser, FiLogOut, FiGrid, FiPlusCircle,
  FiBookOpen, FiInbox, FiRotateCcw, FiUsers, FiMenu, FiX, FiChevronDown
} from "react-icons/fi";
import "./adminnavbar.css";

export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [booksDropdown, setBooksDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lib-admin-nav">
      <div className="lib-admin-nav__inner">
        {/* Brand */}
        <Link to="/admin" className="lib-admin-nav__brand">
          <span className="lib-admin-nav__brand-icon">
            <FiBook size={20} />
          </span>
          <span className="lib-admin-nav__brand-text">
            AGC Admin <small>Portal</small>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="lib-admin-nav__links">
          <li>
            <Link
              to="/admin"
              className={`lib-admin-nav__link ${isActive("/admin") ? "lib-admin-nav__link--active" : ""}`}
            >
              <FiGrid size={15} /> Dashboard
            </Link>
          </li>

          {/* Books Dropdown */}
          <li className="lib-admin-nav__dropdown-wrap">
            <button
              className={`lib-admin-nav__link lib-admin-nav__dropdown-toggle ${
                location.pathname.startsWith("/admin/addbook") || location.pathname.startsWith("/admin/viewbook")
                  ? "lib-admin-nav__link--active"
                  : ""
              }`}
              onClick={() => {
                setBooksDropdown(!booksDropdown);
                setProfileDropdown(false);
              }}
            >
              <FiBookOpen size={15} /> Catalog <FiChevronDown size={12} />
            </button>
            {booksDropdown && (
              <div className="lib-admin-nav__dropdown-menu">
                <Link
                  to="/admin/viewbook"
                  className="lib-admin-nav__dropdown-item"
                  onClick={() => setBooksDropdown(false)}
                >
                  <FiBook size={14} /> Inventory &amp; Manage
                </Link>
                <Link
                  to="/admin/addbook"
                  className="lib-admin-nav__dropdown-item"
                  onClick={() => setBooksDropdown(false)}
                >
                  <FiPlusCircle size={14} /> Add New Book
                </Link>
              </div>
            )}
          </li>

          {role === "librarian" && (
            <>
              <li>
                <Link
                  to="/admin/issuerequest"
                  className={`lib-admin-nav__link ${isActive("/admin/issuerequest") ? "lib-admin-nav__link--active" : ""}`}
                >
                  <FiInbox size={15} /> Issue Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/returnrequest"
                  className={`lib-admin-nav__link ${isActive("/admin/returnrequest") ? "lib-admin-nav__link--active" : ""}`}
                >
                  <FiRotateCcw size={15} /> Returns
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/admin/issued"
              className={`lib-admin-nav__link ${isActive("/admin/issued") ? "lib-admin-nav__link--active" : ""}`}
            >
              <FiBookOpen size={15} /> Issued Books
            </Link>
          </li>

          {role === "admin" && (
            <li>
              <Link
                to="/admin/addlibrarian"
                className={`lib-admin-nav__link ${isActive("/admin/addlibrarian") ? "lib-admin-nav__link--active" : ""}`}
              >
                <FiUsers size={15} /> Add Librarian
              </Link>
            </li>
          )}
        </ul>

        {/* Right Section / Profile */}
        <div className="lib-admin-nav__auth">
          {token ? (
            <div className="lib-admin-nav__profile-wrap">
              <button
                className="lib-admin-nav__profile-btn"
                onClick={() => {
                  setProfileDropdown(!profileDropdown);
                  setBooksDropdown(false);
                }}
              >
                <span className="lib-admin-nav__avatar">
                  <FiUser size={15} />
                </span>
                <span className="lib-admin-nav__role-tag">{role || "Staff"}</span>
                <FiChevronDown size={12} />
              </button>

              {profileDropdown && (
                <div className="lib-admin-nav__dropdown-menu lib-admin-nav__dropdown-menu--right">
                  <Link
                    to="/admin"
                    className="lib-admin-nav__dropdown-item"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <FiGrid size={14} /> Control Panel
                  </Link>
                  <Link
                    to="/"
                    className="lib-admin-nav__dropdown-item"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <FiBook size={14} /> View Student Site
                  </Link>
                  <hr className="lib-admin-nav__divider" />
                  <button
                    className="lib-admin-nav__dropdown-item lib-admin-nav__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/admin-login" className="lib-btn lib-btn-primary lib-btn--sm">
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="lib-admin-nav__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lib-admin-nav__mobile ${menuOpen ? "lib-admin-nav__mobile--open" : ""}`}>
        <Link to="/admin" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
          <FiGrid size={15} /> Dashboard
        </Link>
        <Link to="/admin/viewbook" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
          <FiBook size={15} /> Inventory Books
        </Link>
        <Link to="/admin/addbook" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
          <FiPlusCircle size={15} /> Add Book
        </Link>
        {role === "librarian" && (
          <>
            <Link to="/admin/issuerequest" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
              <FiInbox size={15} /> Issue Requests
            </Link>
            <Link to="/admin/returnrequest" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
              <FiRotateCcw size={15} /> Returns
            </Link>
          </>
        )}
        <Link to="/admin/issued" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
          <FiBookOpen size={15} /> Issued Books
        </Link>
        {role === "admin" && (
          <Link to="/admin/addlibrarian" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
            <FiUsers size={15} /> Add Librarian
          </Link>
        )}
        <hr className="lib-admin-nav__divider" />
        <Link to="/" className="lib-admin-nav__mobile-link" onClick={() => setMenuOpen(false)}>
          <FiBook size={15} /> View Student Site
        </Link>
        <button className="lib-admin-nav__mobile-link lib-admin-nav__mobile-link--danger" onClick={handleLogout}>
          <FiLogOut size={15} /> Sign Out
        </button>
      </div>
    </nav>
  );
}
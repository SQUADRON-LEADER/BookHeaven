import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiBook, FiMenu, FiX, FiUser, FiLogOut,
  FiHome, FiGrid, FiInfo, FiMail, FiChevronDown
} from "react-icons/fi";
import "./navbar.css";

const NAV_LINKS = [
  { to: "/",         label: "Home",       icon: <FiHome size={15} /> },
  { to: "/books",    label: "Books",      icon: <FiBook size={15} /> },
  { to: "/category", label: "Categories", icon: <FiGrid size={15} /> },
  { to: "/aboutus",  label: "About",      icon: <FiInfo size={15} /> },
  { to: "/contactus",label: "Contact",    icon: <FiMail size={15} /> },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const token    = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on route change */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav className={`lib-nav ${scrolled ? "lib-nav--scrolled" : ""}`}>
      <div className="lib-nav__inner">

        {/* Brand */}
        <Link to="/" className="lib-nav__brand">
          <span className="lib-nav__brand-icon">
            <FiBook size={20} />
          </span>
          <span className="lib-nav__brand-text">AGC Library</span>
        </Link>

        {/* Desktop Links */}
        <ul className="lib-nav__links">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`lib-nav__link ${isActive(to) ? "lib-nav__link--active" : ""}`}
              >
                {icon}
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Section */}
        <div className="lib-nav__auth">
          {token ? (
            <div className="lib-nav__profile">
              <button
                className="lib-nav__profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-label="Profile menu"
              >
                <span className="lib-nav__avatar">
                  <FiUser size={15} />
                </span>
                <span className="lib-nav__profile-label">Account</span>
                <FiChevronDown
                  size={13}
                  className={`lib-nav__chevron ${profileOpen ? "lib-nav__chevron--open" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="lib-nav__dropdown">
                  <Link to="/user" className="lib-nav__dropdown-item">
                    <FiUser size={14} />
                    My Profile
                  </Link>
                  <hr className="lib-nav__dropdown-divider" />
                  <button className="lib-nav__dropdown-item lib-nav__dropdown-item--danger" onClick={handleLogout}>
                    <FiLogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="lib-btn lib-btn-ghost lib-nav__login-btn">
                Sign In
              </Link>
              <Link to="/register" className="lib-btn lib-btn-primary">
                Register
              </Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button
            className="lib-nav__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lib-nav__mobile ${menuOpen ? "lib-nav__mobile--open" : ""}`}>
        {NAV_LINKS.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`lib-nav__mobile-link ${isActive(to) ? "lib-nav__mobile-link--active" : ""}`}
          >
            {icon}
            {label}
          </Link>
        ))}
        <hr className="lib-nav__mobile-divider" />
        {token ? (
          <>
            <Link to="/user" className="lib-nav__mobile-link">
              <FiUser size={15} /> My Profile
            </Link>
            <button className="lib-nav__mobile-link lib-nav__mobile-link--danger" onClick={handleLogout}>
              <FiLogOut size={15} /> Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="lib-nav__mobile-link">Sign In</Link>
            <Link to="/register" className="lib-nav__mobile-cta lib-btn lib-btn-primary">Register Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}
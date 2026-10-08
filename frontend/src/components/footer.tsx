import React from "react";
import { Link } from "react-router-dom";
import {
  FiBook, FiFacebook, FiTwitter, FiInstagram, FiLinkedin,
  FiMail, FiPhone, FiMapPin, FiClock, FiArrowRight
} from "react-icons/fi";
import "./footer.css";

const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function Footer() {
  return (
    <footer className="lib-footer">
      {/* Top band */}
      <div className="lib-footer__top">
        <div className="lib-container">
          <div className="lib-footer__cta-row">
            <div>
              <p className="lib-label" style={{ color: "var(--clr-primary)" }}>Stay Connected</p>
              <h3 className="lib-footer__cta-heading">
                Explore our growing collection of academic resources.
              </h3>
            </div>
            <Link to="/books" className="lib-btn lib-btn-primary lib-footer__cta-btn" onClick={scrollTop}>
              Browse Books <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="lib-footer__main">
        <div className="lib-container">
          <div className="lib-footer__grid">

            {/* Brand */}
            <div className="lib-footer__col lib-footer__col--brand">
              <Link to="/" className="lib-footer__brand" onClick={scrollTop}>
                <span className="lib-footer__brand-icon">
                  <FiBook size={18} />
                </span>
                AGC Library
              </Link>
              <p className="lib-footer__about">
                The College Central Library — your academic hub for books, research
                materials, and digital resources supporting learning and discovery.
              </p>
              <div className="lib-footer__social">
                <a href="#" aria-label="Facebook" className="lib-footer__social-link"><FiFacebook size={17} /></a>
                <a href="#" aria-label="Twitter"  className="lib-footer__social-link"><FiTwitter  size={17} /></a>
                <a href="#" aria-label="Instagram" className="lib-footer__social-link"><FiInstagram size={17} /></a>
                <a href="#" aria-label="LinkedIn"  className="lib-footer__social-link"><FiLinkedin size={17} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lib-footer__col">
              <h4 className="lib-footer__heading">Quick Links</h4>
              <ul className="lib-footer__links">
                {[
                  { to: "/", label: "Home" },
                  { to: "/books", label: "Browse Books" },
                  { to: "/category", label: "Categories" },
                  { to: "/aboutus", label: "About Us" },
                  { to: "/contactus", label: "Contact" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="lib-footer__link" onClick={scrollTop}>
                      <FiArrowRight size={12} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lib-footer__col">
              <h4 className="lib-footer__heading">Contact Us</h4>
              <ul className="lib-footer__contact">
                <li>
                  <FiMapPin size={15} />
                  <span>123 College Avenue, Academic City, AC 12345</span>
                </li>
                <li>
                  <FiMail size={15} />
                  <a href="mailto:library@college.edu">library@college.edu</a>
                </li>
                <li>
                  <FiPhone size={15} />
                  <a href="tel:+11234567890">(123) 456-7890</a>
                </li>
                <li>
                  <FiClock size={15} />
                  <div>
                    <span>Mon–Fri: 8:00 AM – 10:00 PM</span>
                    <span>Sat–Sun: 10:00 AM – 6:00 PM</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="lib-footer__bottom">
        <div className="lib-container">
          <p className="lib-footer__copy">
            &copy; {new Date().getFullYear()} AGC College Library. All rights reserved.
          </p>
          <div className="lib-footer__legal">
            <a href="#" className="lib-footer__legal-link">Privacy Policy</a>
            <a href="#" className="lib-footer__legal-link">Terms of Use</a>
            <a href="#" className="lib-footer__legal-link">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

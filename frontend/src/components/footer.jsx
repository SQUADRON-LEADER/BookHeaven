import React from "react";
import { Link } from "react-router-dom";
import {
  FiBook, FiMapPin, FiMail, FiPhone, FiClock,
  FiHeart, FiArrowRight
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lib-footer">
      {/* Top newsletter / CTA strip */}
      <div className="lib-footer__cta">
        <div className="lib-footer__cta-inner">
          <div className="lib-footer__cta-text">
            <h3>Stay connected with our collection</h3>
            <p>Get notified about new arrivals, research workshops, and library events.</p>
          </div>
          <div className="lib-footer__cta-form">
            <input
              type="email"
              placeholder="Enter your college email"
              aria-label="Email address"
            />
            <button className="lib-btn lib-btn-primary" type="button">
              Subscribe <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="lib-footer__main">
        <div className="lib-footer__grid">

          {/* Col 1: Brand */}
          <div className="lib-footer__col lib-footer__brand-col">
            <Link to="/" className="lib-footer__brand">
              <span className="lib-footer__brand-icon">
                <FiBook size={20} />
              </span>
              <span className="lib-footer__brand-title">AGC Library</span>
            </Link>
            <p className="lib-footer__desc">
              Your gateway to academic excellence. Empowering students, faculty, and researchers
              with world-class literary and digital resources.
            </p>
            <div className="lib-footer__socials">
              <a href="#" aria-label="Facebook" className="lib-footer__social-link"><FaFacebookF size={14} /></a>
              <a href="#" aria-label="Twitter" className="lib-footer__social-link"><FaTwitter size={14} /></a>
              <a href="#" aria-label="Instagram" className="lib-footer__social-link"><FaInstagram size={14} /></a>
              <a href="#" aria-label="LinkedIn" className="lib-footer__social-link"><FaLinkedinIn size={14} /></a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lib-footer__col">
            <h4 className="lib-footer__col-title">Navigation</h4>
            <ul className="lib-footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/books">Browse Books</Link></li>
              <li><Link to="/category">Categories</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
              <li><Link to="/contactus">Contact &amp; Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Academic Resources */}
          <div className="lib-footer__col">
            <h4 className="lib-footer__col-title">Resources</h4>
            <ul className="lib-footer__list">
              <li><Link to="/books">New Arrivals</Link></li>
              <li><Link to="/category">Research Papers</Link></li>
              <li><Link to="/books">E-Journals</Link></li>
              <li><Link to="/user">Borrowing Policy</Link></li>
              <li><Link to="/admin-login">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="lib-footer__col">
            <h4 className="lib-footer__col-title">Contact &amp; Hours</h4>
            <ul className="lib-footer__contact-list">
              <li>
                <FiMapPin size={15} className="lib-footer__contact-icon" />
                <span>123 Knowledge Blvd, Campus Area, City 12345</span>
              </li>
              <li>
                <FiMail size={15} className="lib-footer__contact-icon" />
                <a href="mailto:library@agcollege.edu">library@agcollege.edu</a>
              </li>
              <li>
                <FiPhone size={15} className="lib-footer__contact-icon" />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li>
                <FiClock size={15} className="lib-footer__contact-icon" />
                <span>Mon – Fri: 8:00 AM – 8:00 PM<br />Sat: 9:00 AM – 5:00 PM</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="lib-footer__bottom">
        <div className="lib-footer__bottom-inner">
          <p className="lib-footer__copyright">
            &copy; {currentYear} AGC Central Library. All rights reserved.
          </p>
          <div className="lib-footer__legal">
            <Link to="/aboutus">Privacy Policy</Link>
            <span className="lib-footer__dot">•</span>
            <Link to="/aboutus">Terms of Use</Link>
            <span className="lib-footer__dot">•</span>
            <Link to="/contactus">Library Rules</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import {
  FiBook, FiMapPin, FiMail, FiPhone, FiClock
} from "react-icons/fi";
import "./footer.css";

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lib-footer">
      <div className="lib-footer__main">
        <div className="lib-footer__grid">
          {/* Col 1 */}
          <div className="lib-footer__col lib-footer__brand-col">
            <Link to="/admin" className="lib-footer__brand">
              <span className="lib-footer__brand-icon">
                <FiBook size={20} />
              </span>
              <span className="lib-footer__brand-title">AGC Admin Portal</span>
            </Link>
            <p className="lib-footer__desc">
              Library administration console for managing catalog inventory, patron issue requests, returns, and staff credentials.
            </p>
          </div>

          {/* Col 2 */}
          <div className="lib-footer__col">
            <h4 className="lib-footer__col-title">Portal Links</h4>
            <ul className="lib-footer__list">
              <li><Link to="/admin">Dashboard Overview</Link></li>
              <li><Link to="/admin/viewbook">Manage Books</Link></li>
              <li><Link to="/admin/addbook">Add New Volume</Link></li>
              <li><Link to="/admin/issued">Active Borrow Records</Link></li>
              <li><Link to="/">Public Student Site</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="lib-footer__col">
            <h4 className="lib-footer__col-title">Technical Support</h4>
            <ul className="lib-footer__contact-list">
              <li>
                <FiMapPin size={15} className="lib-footer__contact-icon" />
                <span>Central Library Systems Dept, Floor 3</span>
              </li>
              <li>
                <FiMail size={15} className="lib-footer__contact-icon" />
                <a href="mailto:admin-library@agcollege.edu">admin-library@agcollege.edu</a>
              </li>
              <li>
                <FiClock size={15} className="lib-footer__contact-icon" />
                <span>Admin Operations: Mon – Fri (8am – 6pm)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lib-footer__bottom">
        <div className="lib-footer__bottom-inner">
          <p className="lib-footer__copyright">
            &copy; {currentYear} AGC Library Administrative Suite. Confidential &amp; Authorized Personnel Only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
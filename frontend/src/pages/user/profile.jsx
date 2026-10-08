import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import "./profile.css";
import { getAuthToken } from "../../utils/auth";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import {
  FiUser, FiMail, FiShield, FiBook, FiClock,
  FiRotateCcw, FiCalendar, FiDollarSign, FiCheckCircle
} from "react-icons/fi";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issuedRequests, setIssuedRequests] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssuedBooks = async () => {
    try {
      const url = Server_URL + "books/issued";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const books = response.data.issuedBooks || [];
      setAllBooks(books);
      setIssuedBooks(books.filter(b => b.status === "Issued"));
      setIssuedRequests(books.filter(b => b.status === "Requested"));
      setReturnRequests(books.filter(b => b.status === "Requested Return"));
    } catch (error) {
      console.error("Error fetching issued books:", error.message);
    }
  };

  async function fetchProfile() {
    try {
      const response = await axios.get(`${Server_URL}users/profile`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const { user } = response.data;
      setUser(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchIssuedBooks();
  }, []);

  async function returnBook(borrowId) {
    try {
      const response = await axios.put(
        `${Server_URL}books/returnrequest/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      showSuccessToast(response.data.message || "Return request submitted successfully!");
      fetchIssuedBooks();
    } catch (error) {
      console.error("Error returning book:", error);
      showErrorToast(error.response?.data?.message || "Something went wrong!");
    }
  }

  if (loading) {
    return (
      <div className="lib-profile-page">
        <div className="lib-container">
          <div className="lib-profile-loading">
            <div className="lib-spinner"></div>
            <p>Loading member profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lib-profile-page">
      <div className="lib-container">
        {/* Profile Card Header */}
        <div className="lib-profile-header-card">
          <div className="lib-profile-avatar-wrap">
            <div className="lib-profile-avatar">
              <FiUser size={36} />
            </div>
          </div>
          <div className="lib-profile-header-info">
            <span className="lib-profile-role-badge">
              <FiShield size={13} /> {user?.role || "Member"}
            </span>
            <h1 className="lib-profile-name">{user?.name || "Student Member"}</h1>
            <div className="lib-profile-meta-row">
              <span className="lib-profile-meta-item">
                <FiMail size={14} /> {user?.email}
              </span>
              {user?.stream && (
                <span className="lib-profile-meta-item">
                  <FiBook size={14} /> {user.stream}
                </span>
              )}
              {user?.year && (
                <span className="lib-profile-meta-item">
                  <FiCalendar size={14} /> Year {user.year}
                </span>
              )}
            </div>
          </div>
          <div className="lib-profile-stat-box">
            <div className="lib-profile-stat-item">
              <span className="lib-profile-stat-num">{issuedBooks.length}</span>
              <span className="lib-profile-stat-lbl">Active Borrows</span>
            </div>
            <div className="lib-profile-stat-item">
              <span className="lib-profile-stat-num">{issuedRequests.length}</span>
              <span className="lib-profile-stat-lbl">Pending Requests</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="lib-profile-sections">
          {/* Active Borrowed Books */}
          <div className="lib-section-card">
            <div className="lib-section-card__title">
              <FiBook size={20} />
              <h2>Currently Borrowed Books</h2>
            </div>
            {issuedBooks.length === 0 ? (
              <div className="lib-profile-empty">
                <FiBook size={32} />
                <p>No books currently in your possession.</p>
              </div>
            ) : (
              <div className="lib-table-responsive">
                <table className="lib-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Fine</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuedBooks.map((book) => (
                      <tr key={book._id}>
                        <td className="lib-table-title">{book.bookId?.title || "Book"}</td>
                        <td>{new Date(book.issueDate).toLocaleDateString()}</td>
                        <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className="lib-badge lib-badge--issued">
                            {book.status}
                          </span>
                        </td>
                        <td className="lib-table-fine">₹{book.fine || 0}</td>
                        <td>
                          <button
                            className="lib-btn lib-btn-danger lib-btn--sm"
                            onClick={() => returnBook(book._id)}
                          >
                            <FiRotateCcw size={13} /> Request Return
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending Issue Requests */}
          <div className="lib-section-card">
            <div className="lib-section-card__title">
              <FiClock size={20} />
              <h2>Pending Issue Requests</h2>
            </div>
            {issuedRequests.length === 0 ? (
              <div className="lib-profile-empty">
                <FiClock size={32} />
                <p>No pending issue requests under review.</p>
              </div>
            ) : (
              <div className="lib-table-responsive">
                <table className="lib-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Request Date</th>
                      <th>Target Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuedRequests.map((book) => (
                      <tr key={book._id}>
                        <td className="lib-table-title">{book.bookId?.title || "Book"}</td>
                        <td>{new Date(book.issueDate).toLocaleDateString()}</td>
                        <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className="lib-badge lib-badge--requested">
                            Pending Review
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Return Requests */}
          <div className="lib-section-card">
            <div className="lib-section-card__title">
              <FiRotateCcw size={20} />
              <h2>Pending Return Requests</h2>
            </div>
            {returnRequests.length === 0 ? (
              <div className="lib-profile-empty">
                <FiRotateCcw size={32} />
                <p>No pending return requests in process.</p>
              </div>
            ) : (
              <div className="lib-table-responsive">
                <table className="lib-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Request Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnRequests.map((book) => (
                      <tr key={book._id}>
                        <td className="lib-table-title">{book.bookId?.title || "Book"}</td>
                        <td>{new Date(book.issueDate).toLocaleDateString()}</td>
                        <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className="lib-badge lib-badge--return-req">
                            Awaiting Check-in
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

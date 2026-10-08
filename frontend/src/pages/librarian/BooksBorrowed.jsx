import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { FiBookOpen, FiUser, FiCalendar, FiClock } from "react-icons/fi";

export default function BooksBorrowed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = Server_URL + "librarian/bookissued";
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching issued books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="lib-admin-dash" style={{ padding: "3rem 1rem 5rem" }}>
      <div className="lib-container">
        <div className="lib-admin-dash__section-header">
          <div>
            <span className="lib-section__eyebrow">Circulation Registry</span>
            <h1 className="lib-admin-dash__section-title">Active Borrowed Volumes</h1>
          </div>
        </div>

        <div className="lib-section-card">
          <div className="lib-section-card__title">
            <FiBookOpen size={22} />
            <h2>All Books Currently Issued to Patrons</h2>
          </div>

          {loading ? (
            <div className="lib-profile-loading">
              <div className="lib-spinner"></div>
              <p>Loading circulation records...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="lib-profile-empty">
              <FiBookOpen size={36} />
              <p>No volumes are currently marked as issued.</p>
            </div>
          ) : (
            <div className="lib-table-responsive">
              <table className="lib-table">
                <thead>
                  <tr>
                    <th>Patron Name</th>
                    <th>Book Title</th>
                    <th>Date Issued</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td className="lib-table-title">{req.userId?.name || "Patron"}</td>
                      <td>{req.bookId?.title || "Book Title"}</td>
                      <td>{new Date(req.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(req.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className="lib-badge lib-badge--issued">
                          {req.status || "Issued"}
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
  );
}

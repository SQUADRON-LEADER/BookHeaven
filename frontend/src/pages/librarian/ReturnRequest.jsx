import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import { FiRotateCcw, FiCheck, FiUser, FiBook, FiDollarSign } from "react-icons/fi";

export default function ReturnRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = Server_URL + "librarian/returnrequest";
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching return requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const url = Server_URL + "librarian/approvereturnrequest/" + id;
      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      showSuccessToast(response.data.message || "Book return processed & checked in successfully!");
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error("Error approving return request", err);
      showErrorToast("Failed to process return approval.");
    }
  };

  return (
    <div className="lib-admin-dash" style={{ padding: "3rem 1rem 5rem" }}>
      <div className="lib-container">
        <div className="lib-admin-dash__section-header">
          <div>
            <span className="lib-section__eyebrow">Check-in Desk</span>
            <h1 className="lib-admin-dash__section-title">Return Book Requests</h1>
          </div>
        </div>

        <div className="lib-section-card">
          <div className="lib-section-card__title">
            <FiRotateCcw size={22} />
            <h2>Volumes Submitted for Check-in</h2>
          </div>

          {loading ? (
            <div className="lib-profile-loading">
              <div className="lib-spinner"></div>
              <p>Fetching return submissions...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="lib-profile-empty">
              <FiRotateCcw size={36} />
              <p>No books currently awaiting return verification.</p>
            </div>
          ) : (
            <div className="lib-table-responsive">
              <table className="lib-table">
                <thead>
                  <tr>
                    <th>Patron Name</th>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Accrued Fine</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td className="lib-table-title">{req.userId?.name || "Patron"}</td>
                      <td>{req.bookId?.title || "Book Title"}</td>
                      <td>{new Date(req.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(req.dueDate).toLocaleDateString()}</td>
                      <td className="lib-table-fine">₹{req.fine || 0}</td>
                      <td>
                        <span className="lib-badge lib-badge--return-req">
                          {req.status || "Return Requested"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="lib-btn lib-btn-primary lib-btn--sm"
                          onClick={() => approveRequest(req._id)}
                        >
                          <FiCheck size={14} /> Accept &amp; Restock
                        </button>
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

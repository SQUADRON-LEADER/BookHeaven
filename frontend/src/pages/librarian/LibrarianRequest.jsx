import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import { FiInbox, FiCheck, FiClock, FiBook, FiUser } from "react-icons/fi";

export default function LibrarianRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = Server_URL + "librarian/issuerequest";
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const url = Server_URL + "librarian/approverequest/" + id;
      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      showSuccessToast(response.data.message || "Book successfully issued to patron!");
      fetchRequests();
    } catch (err) {
      if (err.response) {
        showErrorToast(err.response.data?.error || err.response.data?.message || "Failed to approve request");
      } else {
        showErrorToast("Network error: " + err.message);
      }
      console.error("Error approving request:", err);
    }
  };

  return (
    <div className="lib-admin-dash" style={{ padding: "3rem 1rem 5rem" }}>
      <div className="lib-container">
        <div className="lib-admin-dash__section-header">
          <div>
            <span className="lib-section__eyebrow">Circulation Desk</span>
            <h1 className="lib-admin-dash__section-title">Pending Issue Requests</h1>
          </div>
        </div>

        <div className="lib-section-card">
          <div className="lib-section-card__title">
            <FiInbox size={22} />
            <h2>Issue Requests Awaiting Authorization</h2>
          </div>

          {loading ? (
            <div className="lib-profile-loading">
              <div className="lib-spinner"></div>
              <p>Loading pending patron requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="lib-profile-empty">
              <FiInbox size={36} />
              <p>No pending book issue requests in the queue.</p>
            </div>
          ) : (
            <div className="lib-table-responsive">
              <table className="lib-table">
                <thead>
                  <tr>
                    <th>Patron Name</th>
                    <th>Book Title</th>
                    <th>Request Date</th>
                    <th>Target Due Date</th>
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
                      <td>
                        <span className="lib-badge lib-badge--requested">
                          {req.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="lib-btn lib-btn-primary lib-btn--sm"
                          onClick={() => approveRequest(req._id)}
                        >
                          <FiCheck size={14} /> Authorize Issue
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

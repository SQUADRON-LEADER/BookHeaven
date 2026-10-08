import React from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import {
  FiBook,
  FiUsers,
  FiRepeat,
  FiAlertTriangle,
  FiPlus,
  FiArrowRight,
  FiCheckCircle,
  FiDollarSign,
  FiLayers
} from "react-icons/fi";

export default function Dashboard() {
  const { books, members, transactions, calculateFine, returnBook } = useLibrary();

  // Metrics Calculation
  const totalBooksCount = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const availableBooksCount = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const issuedBooksCount = totalBooksCount - availableBooksCount;

  const activeTransactions = transactions.filter((t) => t.status === "Issued");
  const overdueTransactions = activeTransactions.filter((t) => {
    const { isOverdue } = calculateFine(t.dueDate, t.finePerDay);
    return isOverdue;
  });

  const totalOverdueFines = overdueTransactions.reduce((acc, t) => {
    const { fine } = calculateFine(t.dueDate, t.finePerDay);
    return acc + fine;
  }, 0);

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FiLayers size={22} /> BOOKHAVEN &mdash; Central Library Operations
          </h1>
          <p className="page-subtitle">
            Academic catalog inventory, active circulations, overdue fines, and patron management.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/testing" className="btn btn-secondary">
            <FiCheckCircle size={15} /> QA Test Suite (Sec. 6-14)
          </Link>
          <Link to="/circulation" className="btn btn-primary">
            <FiRepeat size={15} /> Issue / Return Desk
          </Link>
          <Link to="/books" className="btn btn-secondary">
            <FiPlus size={15} /> Add Book
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="stats-grid-row">
        <div className="stat-box" style={{ borderLeftColor: "#2d5a27" }}>
          <span className="stat-box-label">Catalog Titles</span>
          <span className="stat-box-value">{books.length}</span>
          <span className="stat-box-subtext">
            {totalBooksCount} total physical copies ({availableBooksCount} in stacks)
          </span>
        </div>

        <div className="stat-box" style={{ borderLeftColor: "#407a38" }}>
          <span className="stat-box-label">Active Members</span>
          <span className="stat-box-value">{members.length}</span>
          <span className="stat-box-subtext">Students &amp; Faculty Patrons</span>
        </div>

        <div className="stat-box" style={{ borderLeftColor: "#d97706" }}>
          <span className="stat-box-label">Active Book Loans</span>
          <span className="stat-box-value">{activeTransactions.length}</span>
          <span className="stat-box-subtext">Books currently in circulation</span>
        </div>

        <div className="stat-box" style={{ borderLeftColor: overdueTransactions.length > 0 ? "#dc2626" : "#2d5a27" }}>
          <span className="stat-box-label">Overdue Books</span>
          <span className="stat-box-value" style={{ color: overdueTransactions.length > 0 ? "#b91c1c" : "inherit" }}>
            {overdueTransactions.length}
          </span>
          <span className="stat-box-subtext">
            ₹{totalOverdueFines} accumulated fines (₹5/day)
          </span>
        </div>
      </div>

      {/* Overdue Items Alert Panel (if any exist) */}
      {overdueTransactions.length > 0 && (
        <div className="academic-card" style={{ borderColor: "#fecaca", backgroundColor: "#fffbfb" }}>
          <div className="academic-card-header" style={{ borderColor: "#fee2e2" }}>
            <h2 className="academic-card-title" style={{ color: "#991b1b" }}>
              <FiAlertTriangle size={18} /> Overdue Loans Requiring Action ({overdueTransactions.length})
            </h2>
            <Link to="/circulation" className="btn btn-danger-outline btn-sm">
              Process Return at Desk
            </Link>
          </div>

          <div className="table-responsive">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Book Title</th>
                  <th>Member Name</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th>Calculated Fine</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overdueTransactions.map((txn) => {
                  const { daysOverdue, fine } = calculateFine(txn.dueDate, txn.finePerDay);
                  return (
                    <tr key={txn.id}>
                      <td style={{ fontWeight: "600" }}>{txn.id}</td>
                      <td>{txn.bookTitle}</td>
                      <td>
                        {txn.memberName} <span style={{ color: "var(--text-light)", fontSize: "12px" }}>({txn.memberId})</span>
                      </td>
                      <td style={{ color: "#dc2626", fontWeight: "600" }}>{txn.dueDate}</td>
                      <td>
                        <span className="status-badge overdue">
                          {daysOverdue} Days Late
                        </span>
                      </td>
                      <td style={{ fontWeight: "700", color: "#991b1b" }}>₹{fine}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => returnBook(txn.id)}
                          title="Process Return and collect fine"
                        >
                          Return &amp; Collect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Circulation Log */}
      <div className="academic-card">
        <div className="academic-card-header">
          <h2 className="academic-card-title">
            <FiRepeat size={18} /> Recent Circulation Log
          </h2>
          <Link to="/history" style={{ fontSize: "13px", fontWeight: "600" }}>
            View All History &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Book Title</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine Info</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => {
                const isReturned = txn.status === "Returned";
                const { isOverdue, daysOverdue, fine } = calculateFine(txn.dueDate, txn.finePerDay);

                return (
                  <tr key={txn.id}>
                    <td style={{ fontWeight: "600" }}>{txn.id}</td>
                    <td>{txn.bookTitle}</td>
                    <td>
                      {txn.memberName} <small style={{ color: "var(--text-light)" }}>({txn.memberId})</small>
                    </td>
                    <td>{txn.issueDate}</td>
                    <td>{txn.dueDate}</td>
                    <td>
                      {isReturned ? (
                        <span className="status-badge available">Returned</span>
                      ) : isOverdue ? (
                        <span className="status-badge overdue">Overdue ({daysOverdue}d)</span>
                      ) : (
                        <span className="status-badge issued">Active Loan</span>
                      )}
                    </td>
                    <td>
                      {isReturned ? (
                        txn.finePaid ? `₹${txn.finePaid} Paid` : "No Fine"
                      ) : isOverdue ? (
                        <strong style={{ color: "#b91c1c" }}>₹{fine} Due</strong>
                      ) : (
                        "₹0"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import {
  FiList,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiRotateCcw,
  FiFileText
} from "react-icons/fi";

export default function Transactions() {
  const { transactions, calculateFine } = useLibrary();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTransactions = transactions.filter((txn) => {
    const term = searchTerm.toLowerCase().trim();
    const { isOverdue } = calculateFine(txn.dueDate, txn.finePerDay);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Issued" && txn.status === "Issued" && !isOverdue) ||
      (statusFilter === "Overdue" && txn.status === "Issued" && isOverdue) ||
      (statusFilter === "Returned" && txn.status === "Returned");

    const matchesSearch =
      !term ||
      txn.id.toLowerCase().includes(term) ||
      txn.bookTitle.toLowerCase().includes(term) ||
      txn.memberName.toLowerCase().includes(term) ||
      txn.memberId.toLowerCase().includes(term) ||
      (txn.isbn && txn.isbn.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FiList size={22} /> Circulation Audit &amp; Transaction Ledger
          </h1>
          <p className="page-subtitle">
            Complete historical log of all book issues, return timestamps, and collected fines.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon-inside" size={15} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by Transaction ID, Book Title, Member Name, or Member ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiFilter size={15} style={{ color: "var(--text-muted)" }} />
          <select
            className="form-select"
            style={{ width: "auto", minWidth: "170px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Transactions ({transactions.length})</option>
            <option value="Issued">Active Loans Only</option>
            <option value="Overdue">Overdue Loans Only</option>
            <option value="Returned">Returned Loans Only</option>
          </select>
        </div>

        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
          Found: <strong>{filteredTransactions.length}</strong> records
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="academic-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Book Title &amp; ISBN</th>
              <th>Member Details</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Fine Paid / Due</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  No transaction records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => {
                const isReturned = txn.status === "Returned";
                const { isOverdue, daysOverdue, fine } = calculateFine(
                  txn.dueDate,
                  txn.finePerDay || 5
                );

                return (
                  <tr key={txn.id}>
                    <td style={{ fontWeight: "700", color: "var(--green-primary)" }}>
                      {txn.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: "600" }}>{txn.bookTitle}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        ISBN: {txn.isbn || "N/A"} &bull; ID: {txn.bookId}
                      </div>
                    </td>
                    <td>
                      <div><strong>{txn.memberName}</strong></div>
                      <div style={{ fontSize: "12px", color: "var(--text-light)" }}>
                        ID: {txn.memberId}
                      </div>
                    </td>
                    <td>{txn.issueDate}</td>
                    <td style={{ color: isOverdue && !isReturned ? "#dc2626" : "inherit", fontWeight: isOverdue && !isReturned ? "700" : "normal" }}>
                      {txn.dueDate}
                    </td>
                    <td>
                      {isReturned ? (
                        <span style={{ color: "var(--green-primary-dark)", fontWeight: "500" }}>
                          {txn.returnDate}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-light)" }}>-- In Circulation --</span>
                      )}
                    </td>
                    <td>
                      {isReturned ? (
                        <span className="status-badge available">Returned</span>
                      ) : isOverdue ? (
                        <span className="status-badge overdue">
                          Overdue ({daysOverdue}d)
                        </span>
                      ) : (
                        <span className="status-badge issued">Active Loan</span>
                      )}
                    </td>
                    <td>
                      {isReturned ? (
                        txn.finePaid ? (
                          <span style={{ color: "#991b1b", fontWeight: "600" }}>₹{txn.finePaid} Collected</span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>No Fine</span>
                        )
                      ) : isOverdue ? (
                        <strong style={{ color: "#991b1b" }}>₹{fine} Due</strong>
                      ) : (
                        <span style={{ color: "var(--text-light)" }}>₹0</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

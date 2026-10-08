import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import {
  FiRepeat,
  FiBook,
  FiUsers,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiCheck,
  FiSearch,
  FiRotateCcw,
  FiDollarSign,
  FiClock,
  FiX
} from "react-icons/fi";

export default function IssueReturn() {
  const {
    books,
    members,
    transactions,
    issueBook,
    returnBook,
    calculateFine,
  } = useLibrary();

  const [searchParams] = useSearchParams();
  const initialBookId = searchParams.get("bookId") || "";

  // Tab State
  const [activeTab, setActiveTab] = useState("issue"); // 'issue' | 'return'

  // Issue Form State
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [loanPeriodDays, setLoanPeriodDays] = useState(14);
  const [issueError, setIssueError] = useState("");

  // Return Form State / Search
  const [returnSearch, setReturnSearch] = useState("");
  const [selectedReturnTxn, setSelectedReturnTxn] = useState(null);
  const [waiveFine, setWaiveFine] = useState(false);

  useEffect(() => {
    if (initialBookId) {
      setSelectedBookId(initialBookId);
      setActiveTab("issue");
    }
  }, [initialBookId]);

  const selectedMember = members.find((m) => m.id === selectedMemberId);
  const selectedBook = books.find((b) => b.id === selectedBookId);

  const memberActiveBorrows = selectedMemberId
    ? transactions.filter((t) => t.memberId === selectedMemberId && t.status === "Issued")
    : [];

  const isMemberLimitReached =
    selectedMember && memberActiveBorrows.length >= selectedMember.maxLimit;

  // Test Case 7, 8, 12: Handle Issue
  const handleIssueSubmit = (e) => {
    e.preventDefault();
    setIssueError("");

    if (!selectedMemberId || !selectedBookId) {
      setIssueError("Please select both a registered member and a book title.");
      return;
    }

    const result = issueBook({
      memberId: selectedMemberId,
      bookId: selectedBookId,
      days: loanPeriodDays,
    });

    if (!result.success) {
      setIssueError(result.message);
    } else {
      setSelectedBookId("");
      setIssueError("");
    }
  };

  // Active Issued Transactions for Return Tab
  const activeTransactions = transactions.filter((t) => {
    const matchesSearch =
      !returnSearch ||
      t.bookTitle.toLowerCase().includes(returnSearch.toLowerCase()) ||
      t.memberName.toLowerCase().includes(returnSearch.toLowerCase()) ||
      t.memberId.toLowerCase().includes(returnSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(returnSearch.toLowerCase());
    return t.status === "Issued" && matchesSearch;
  });

  // Test Case 9 & 10: Handle Return
  const handleConfirmReturn = () => {
    if (!selectedReturnTxn) return;
    returnBook(selectedReturnTxn.id, { waiveFine });
    setSelectedReturnTxn(null);
    setWaiveFine(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FiRepeat size={22} /> Circulation Desk: Issue &amp; Return
          </h1>
          <p className="page-subtitle">
            Execute real-time book borrowing, return check-ins, stock deduction, and overdue fine collection.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`btn ${activeTab === "issue" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("issue")}
          >
            <FiBook size={15} /> Issue Book Desk
          </button>
          <button
            className={`btn ${activeTab === "return" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("return")}
          >
            <FiRotateCcw size={15} /> Return &amp; Fine Desk
          </button>
        </div>
      </div>

      {/* ── TAB 1: ISSUE BOOK DESK ── */}
      {activeTab === "issue" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
          {/* Issue Form */}
          <div className="academic-card">
            <div className="academic-card-header">
              <h2 className="academic-card-title">
                <FiBook size={18} /> Issue a Book to Member
              </h2>
            </div>

            {issueError && (
              <div className="academic-alert academic-alert-danger">
                <FiAlertCircle size={16} />
                <span>{issueError}</span>
              </div>
            )}

            <form onSubmit={handleIssueSubmit}>
              {/* Member Picker */}
              <div className="form-group">
                <label className="form-label">
                  1. Select Member <span className="required-star">*</span>
                </label>
                <select
                  className={`form-select ${isMemberLimitReached ? "is-invalid" : ""}`}
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    setIssueError("");
                  }}
                  required
                >
                  <option value="">-- Choose Registered Member --</option>
                  {members.map((m) => {
                    const activeCount = transactions.filter(
                      (t) => t.memberId === m.id && t.status === "Issued"
                    ).length;
                    return (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.id}) — {m.department} [{activeCount}/{m.maxLimit} Books Borrowed]
                      </option>
                    );
                  })}
                </select>
                {selectedMember && (
                  <span className="form-help-text">
                    Max Borrowing Limit: <strong>{selectedMember.maxLimit}</strong> books. Currently holding:{" "}
                    <strong>{memberActiveBorrows.length}</strong> books.
                  </span>
                )}
              </div>

              {/* Book Picker */}
              <div className="form-group">
                <label className="form-label">
                  2. Select Book Title <span className="required-star">*</span>
                </label>
                <select
                  className="form-select"
                  value={selectedBookId}
                  onChange={(e) => {
                    setSelectedBookId(e.target.value);
                    setIssueError("");
                  }}
                  required
                >
                  <option value="">-- Choose Catalog Book --</option>
                  {books.map((b) => (
                    <option
                      key={b.id}
                      value={b.id}
                      style={{ color: b.availableCopies === 0 ? "#dc2626" : "inherit" }}
                    >
                      {b.title} (ISBN: {b.isbn}) — {b.availableCopies > 0 ? `${b.availableCopies} available` : "OUT OF STOCK"}
                    </option>
                  ))}
                </select>
                {selectedBook && (
                  <span className="form-help-text">
                    Available Copies in Stacks:{" "}
                    <strong style={{ color: selectedBook.availableCopies > 0 ? "var(--green-primary)" : "#dc2626" }}>
                      {selectedBook.availableCopies} / {selectedBook.totalCopies}
                    </strong>{" "}
                    ({selectedBook.shelfLocation || "General Stacks"})
                  </span>
                )}
              </div>

              {/* Loan Period */}
              <div className="form-group">
                <label className="form-label">3. Loan Duration</label>
                <select
                  className="form-select"
                  value={loanPeriodDays}
                  onChange={(e) => setLoanPeriodDays(e.target.value)}
                >
                  <option value={7}>7 Days (Standard Short Loan)</option>
                  <option value={14}>14 Days (Standard Academic Loan)</option>
                  <option value={30}>30 Days (Extended Research Loan)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "10px", marginTop: "10px" }}
              >
                <FiCheckCircle size={16} /> Authorize &amp; Issue Book
              </button>
            </form>
          </div>

          {/* Live Validation & Info Preview */}
          <div className="academic-card" style={{ backgroundColor: "#fafdfa" }}>
            <div className="academic-card-header">
              <h3 className="academic-card-title" style={{ fontSize: "14.5px" }}>
                <FiCheckCircle size={16} /> Loan Eligibility Summary
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
              {/* Member Status */}
              <div>
                <span style={{ fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  MEMBER STATUS:
                </span>
                {selectedMember ? (
                  <div style={{ padding: "8px 12px", background: "#fff", border: "1px solid var(--border-light)", borderRadius: "3px" }}>
                    <div><strong>{selectedMember.name}</strong> ({selectedMember.id})</div>
                    <div style={{ color: "var(--text-muted)" }}>{selectedMember.email} &bull; {selectedMember.department}</div>
                    <div style={{ marginTop: "4px" }}>
                      Holding: <strong>{memberActiveBorrows.length} / {selectedMember.maxLimit}</strong> books
                      {isMemberLimitReached && (
                        <span style={{ color: "#dc2626", fontWeight: "700", marginLeft: "8px" }}>
                          [LIMIT REACHED]
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span style={{ color: "var(--text-light)" }}>No member selected yet.</span>
                )}
              </div>

              {/* Book Status */}
              <div>
                <span style={{ fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  BOOK AVAILABILITY STATUS:
                </span>
                {selectedBook ? (
                  <div style={{ padding: "8px 12px", background: "#fff", border: "1px solid var(--border-light)", borderRadius: "3px" }}>
                    <div><strong>{selectedBook.title}</strong></div>
                    <div style={{ color: "var(--text-muted)" }}>by {selectedBook.author} &bull; ISBN: {selectedBook.isbn}</div>
                    <div style={{ marginTop: "4px" }}>
                      Stock Status:{" "}
                      {selectedBook.availableCopies > 0 ? (
                        <span className="status-badge available">
                          In Stock ({selectedBook.availableCopies} copies available)
                        </span>
                      ) : (
                        <span className="status-badge overdue">
                          Out of Stock (0 copies available)
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span style={{ color: "var(--text-light)" }}>No book selected yet.</span>
                )}
              </div>

              {/* Fine Rules Reminder */}
              <div style={{ padding: "10px 12px", background: "var(--green-soft)", border: "1px solid var(--green-soft-border)", borderRadius: "3px" }}>
                <strong style={{ color: "var(--green-primary-dark)" }}>Institutional Policy:</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px", fontSize: "12px" }}>
                  Overdue loans incur a statutory penalty of <strong>₹5 per day</strong> calculated automatically upon check-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: RETURN BOOK & FINE COLLECTION ── */}
      {activeTab === "return" && (
        <div>
          <div className="toolbar-bar">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon-inside" size={15} />
              <input
                type="text"
                className="form-control"
                placeholder="Search active loans by Member Name, Member ID, Book Title, or Txn ID..."
                value={returnSearch}
                onChange={(e) => setReturnSearch(e.target.value)}
              />
            </div>

            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
              Active Borrow Records: <strong>{activeTransactions.length}</strong>
            </span>
          </div>

          <div className="table-responsive">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Book Title</th>
                  <th>Member Name &amp; ID</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th>Calculated Fine</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No active loans matching your search query.
                    </td>
                  </tr>
                ) : (
                  activeTransactions.map((txn) => {
                    const { isOverdue, daysOverdue, fine } = calculateFine(txn.dueDate, txn.finePerDay || 5);

                    return (
                      <tr key={txn.id}>
                        <td style={{ fontWeight: "700" }}>{txn.id}</td>
                        <td>
                          <strong>{txn.bookTitle}</strong>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>ISBN: {txn.isbn}</div>
                        </td>
                        <td>
                          <div>{txn.memberName}</div>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>ID: {txn.memberId}</span>
                        </td>
                        <td>{txn.issueDate}</td>
                        <td style={{ fontWeight: isOverdue ? "700" : "normal", color: isOverdue ? "#dc2626" : "inherit" }}>
                          {txn.dueDate}
                        </td>
                        <td>
                          {isOverdue ? (
                            <span className="status-badge overdue">{daysOverdue} Days Late</span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>On Time</span>
                          )}
                        </td>
                        <td>
                          {isOverdue ? (
                            <strong style={{ color: "#b91c1c", fontSize: "14px" }}>₹{fine}</strong>
                          ) : (
                            <span style={{ color: "var(--text-light)" }}>₹0</span>
                          )}
                        </td>
                        <td>
                          {isOverdue ? (
                            <span className="status-badge overdue">Overdue</span>
                          ) : (
                            <span className="status-badge issued">Active Loan</span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setSelectedReturnTxn(txn);
                              setWaiveFine(false);
                            }}
                          >
                            <FiRotateCcw size={13} /> Process Return
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Return Confirmation & Fine Calculator Modal (Test Case 9 & 10) ── */}
      {selectedReturnTxn && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">
                <FiRotateCcw size={16} /> Confirm Book Return &amp; Check-in
              </h2>
              <button
                onClick={() => setSelectedReturnTxn(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="modal-body-custom">
              {(() => {
                const { isOverdue, daysOverdue, fine } = calculateFine(
                  selectedReturnTxn.dueDate,
                  selectedReturnTxn.finePerDay || 5
                );

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ padding: "12px", background: "var(--bg-app)", border: "1px solid var(--border-main)", borderRadius: "3px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700" }}>{selectedReturnTxn.bookTitle}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Borrowed by: <strong>{selectedReturnTxn.memberName}</strong> ({selectedReturnTxn.memberId})
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Issue Date: {selectedReturnTxn.issueDate} &bull; Due Date: <strong>{selectedReturnTxn.dueDate}</strong>
                      </div>
                    </div>

                    {/* Fine Breakdown (Test Case 10) */}
                    {isOverdue ? (
                      <div
                        style={{
                          padding: "14px",
                          background: "#fff5f5",
                          border: "1px solid #fed7d7",
                          borderRadius: "3px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#991b1b", fontWeight: "700" }}>
                          <FiAlertCircle size={16} /> Overdue Fine Calculation
                        </div>
                        <div style={{ marginTop: "6px", fontSize: "13px", color: "#742a2a" }}>
                          Days Overdue: <strong>{daysOverdue} days</strong>
                          <br />
                          Rate: ₹{selectedReturnTxn.finePerDay || 5} per day
                          <br />
                          <span style={{ fontSize: "16px", fontWeight: "700", color: "#991b1b" }}>
                            Total Fine Payable: ₹{fine}
                          </span>
                        </div>

                        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="checkbox"
                            id="waiveFineCheck"
                            checked={waiveFine}
                            onChange={(e) => setWaiveFine(e.target.checked)}
                          />
                          <label htmlFor="waiveFineCheck" style={{ fontSize: "12.5px", fontWeight: "600", cursor: "pointer" }}>
                            Waive Fine (Authorized Academic Exemption)
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "12px",
                          background: "#ebf7ed",
                          border: "1px solid #b7e4be",
                          borderRadius: "3px",
                          color: "#166534",
                          fontSize: "13px",
                        }}
                      >
                        <FiCheckCircle size={15} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                        Book returned on time. No overdue penalties applied.
                      </div>
                    )}

                    <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      Upon confirmation, the book copy will be marked as returned and immediately restored to active stock availability.
                    </p>
                  </div>
                );
              })()}
            </div>

            <div className="modal-footer-custom">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedReturnTxn(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmReturn}
              >
                <FiCheck size={15} /> Confirm Return &amp; Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

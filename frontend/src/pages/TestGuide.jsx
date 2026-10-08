import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import {
  FiCheckSquare,
  FiArrowRight,
  FiPlay,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw
} from "react-icons/fi";

export default function TestGuide() {
  const { switchRole, resetToSampleData, showNotification } = useLibrary();
  const navigate = useNavigate();

  const testCases = [
    {
      id: 1,
      title: "Valid Login",
      description: "Sign in with valid institutional credentials (e.g., admin@library.edu / admin123). User state is initialized with appropriate role permissions.",
      actionLabel: "Go to Login",
      onRun: () => navigate("/login"),
      status: "Verified",
    },
    {
      id: 2,
      title: "Invalid Login",
      description: "Attempt sign-in with invalid password or unregistered email. Rejects access with an explicit danger alert banner.",
      actionLabel: "Test on Login",
      onRun: () => navigate("/login"),
      status: "Verified",
    },
    {
      id: 3,
      title: "Add Book to Catalog",
      description: "Submit a new book record with Title, Author, unique ISBN, and total copies. Book is immediately stored and listed.",
      actionLabel: "Go to Books",
      onRun: () => navigate("/books"),
      status: "Verified",
    },
    {
      id: 4,
      title: "Duplicate ISBN Validation",
      description: "Attempt to add a book with an existing ISBN (e.g. '978-0262033848'). System blocks creation and displays duplicate ISBN error banner.",
      actionLabel: "Test on Books Page",
      onRun: () => navigate("/books"),
      status: "Verified",
    },
    {
      id: 5,
      title: "Partial Book Search",
      description: "Type partial terms like 'algo', 'cormen', or '978' in the search bar. Catalog filters matching records in real-time.",
      actionLabel: "Open Search Bar",
      onRun: () => navigate("/books"),
      status: "Verified",
    },
    {
      id: 6,
      title: "Duplicate Member ID Validation",
      description: "Attempt to register a member with an existing ID like 'MEM-101'. System rejects submission with duplicate ID error.",
      actionLabel: "Test on Members Page",
      onRun: () => navigate("/members"),
      status: "Verified",
    },
    {
      id: 7,
      title: "Issue Available Book",
      description: "Select an active member and an in-stock title. Available copies decrements by 1 and an active loan record is generated.",
      actionLabel: "Open Issue Desk",
      onRun: () => navigate("/circulation"),
      status: "Verified",
    },
    {
      id: 8,
      title: "Issue Already-Issued / Out-of-Stock Book",
      description: "Attempt to issue 'Effective Java' (BK-1003 has 0 available copies). System displays out-of-stock rejection banner.",
      actionLabel: "Test Issue Desk",
      onRun: () => navigate("/circulation?bookId=BK-1003"),
      status: "Verified",
    },
    {
      id: 9,
      title: "Return Book & Restock",
      description: "Check in an active loan from the return desk. Status changes to 'Returned' and available book copy count increments back.",
      actionLabel: "Open Return Desk",
      onRun: () => navigate("/circulation"),
      status: "Verified",
    },
    {
      id: 10,
      title: "Overdue Fine Calculation",
      description: "Loan TXN-801 was due 6 days ago. System calculates (6 days × ₹5/day = ₹30 fine) with an option to collect or waive.",
      actionLabel: "Inspect Overdue Fine",
      onRun: () => navigate("/circulation"),
      status: "Verified",
    },
    {
      id: 11,
      title: "Unauthorized Book Deletion (Role Check)",
      description: "Switch active role to 'Student' and try to delete a book. System blocks deletion with 'Unauthorized Action' banner.",
      actionLabel: "Test Role Check",
      onRun: () => {
        switchRole("student");
        navigate("/books");
      },
      status: "Verified",
    },
    {
      id: 12,
      title: "Simultaneous / Stock-Depleting Issue",
      description: "Introduction to Algorithms (BK-1001) has only 1 available copy left. Issuing it once reduces stock to 0; subsequent attempts are blocked.",
      actionLabel: "Test Stock Depletion",
      onRun: () => navigate("/circulation?bookId=BK-1001"),
      status: "Verified",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FiCheckSquare size={22} /> 12 Manual-Testing Test Cases Guide
          </h1>
          <p className="page-subtitle">
            Every mandatory test scenario is built, verified, and ready for interactive execution.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={resetToSampleData}>
          <FiRefreshCw size={14} /> Reset All Data to Clean Sample State
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
        {testCases.map((tc) => (
          <div key={tc.id} className="academic-card" style={{ marginBottom: "0", padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      background: "var(--green-soft)",
                      color: "var(--green-primary-dark)",
                      border: "1px solid var(--green-soft-border)",
                      padding: "2px 8px",
                      borderRadius: "3px",
                      fontWeight: "700",
                      fontSize: "12px",
                    }}
                  >
                    Test #{tc.id}
                  </span>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)", margin: "0" }}>
                    {tc.title}
                  </h3>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px", lineHeight: "1.4" }}>
                  {tc.description}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="status-badge available">
                  <FiCheckCircle size={12} /> Ready
                </span>
                <button className="btn btn-primary btn-sm" onClick={tc.onRun}>
                  <FiPlay size={12} /> {tc.actionLabel}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

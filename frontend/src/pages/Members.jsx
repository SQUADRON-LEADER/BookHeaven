import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiBookOpen,
  FiMail,
  FiPhone,
  FiFilter,
  FiList,
  FiClock,
  FiRepeat
} from "react-icons/fi";

export default function Members() {
  const { members, transactions, calculateFine, addMember, editMember, deleteMember, currentUser } = useLibrary();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMemberHistory, setViewingMemberHistory] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    department: "Computer Science",
    role: "Student",
    maxLimit: 3,
  });

  const [formError, setFormError] = useState("");

  const departments = ["All", ...new Set(members.map((m) => m.department).filter(Boolean))];

  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesDept = departmentFilter === "All" || m.department === departmentFilter;
    const matchesRole = roleFilter === "All" || m.role === roleFilter;

    const matchesSearch =
      !term ||
      m.name.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.department.toLowerCase().includes(term) ||
      (m.phone && m.phone.includes(term));

    return matchesDept && matchesRole && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setFormData({
      id: `MEM-${100 + members.length + 1}`,
      name: "",
      email: "",
      phone: "",
      department: "Computer Science",
      role: "Student",
      maxLimit: 3,
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      department: member.department,
      role: member.role || "Student",
      maxLimit: member.maxLimit || 3,
    });
    setFormError("");
  };

  // Test Case 6: Duplicate Member ID validation
  const handleSaveAdd = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.email || !formData.id) {
      setFormError("Member ID, Full Name, and Email are required.");
      return;
    }

    const result = addMember(formData);
    if (!result.success) {
      setFormError(result.message);
    } else {
      setIsAddModalOpen(false);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.email) {
      setFormError("Name and Email are required.");
      return;
    }

    const result = editMember(editingMember.id, formData);
    if (!result.success) {
      setFormError(result.message);
    } else {
      setEditingMember(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FiUsers size={22} /> Member Directory &amp; Patron Registry
          </h1>
          <p className="page-subtitle">
            Manage student &amp; faculty library accounts, borrowing quotas, and member circulation history.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <FiPlus size={15} /> Register New Member
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon-inside" size={15} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by Member ID, Name, Email, Phone, or Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FiFilter size={14} style={{ color: "var(--text-muted)" }} />
          <select
            className="form-select"
            style={{ width: "auto", minWidth: "150px" }}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>

        <select
          className="form-select"
          style={{ width: "auto", minWidth: "130px" }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Student">Students Only</option>
          <option value="Faculty">Faculty Only</option>
          <option value="Research Scholar">Scholars Only</option>
        </select>

        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
          Showing: <strong>{filteredMembers.length}</strong> members
        </span>
      </div>

      {/* Members Table */}
      <div className="table-responsive">
        <table className="academic-table">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Patron Name &amp; Role</th>
              <th>Contact Details</th>
              <th>Department</th>
              <th>Quota Limit</th>
              <th>Active Loans</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  No members found matching "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const memberBorrows = transactions.filter(
                  (t) => t.memberId === member.id && t.status === "Issued"
                );
                const limitReached = memberBorrows.length >= member.maxLimit;

                return (
                  <tr key={member.id}>
                    <td style={{ fontWeight: "700", color: "var(--green-primary)" }}>
                      {member.id}
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: "600", color: "var(--text-main)", cursor: "pointer" }}
                        onClick={() => setViewingMemberHistory(member)}
                        title="Click to view full borrowing history"
                      >
                        {member.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-light)" }}>
                        {member.role || "Student"} &bull; Joined: {member.joinDate || "2024-08"}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "12.5px" }}>
                        <FiMail size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div style={{ fontSize: "12px", color: "var(--text-light)" }}>
                          <FiPhone size={11} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                          {member.phone}
                        </div>
                      )}
                    </td>
                    <td>{member.department}</td>
                    <td>
                      <strong>{member.maxLimit}</strong> books max
                    </td>
                    <td>
                      <span
                        className={`status-badge ${limitReached ? "overdue" : memberBorrows.length > 0 ? "issued" : "available"}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setViewingMemberHistory(member)}
                        title="Click to view active loans"
                      >
                        <FiBookOpen size={12} /> {memberBorrows.length} / {member.maxLimit} Books
                      </span>
                    </td>
                    <td>
                      <span className="status-badge available">{member.status || "Active"}</span>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {/* View History Button */}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: "5px" }}
                        onClick={() => setViewingMemberHistory(member)}
                        title="View complete circulation history"
                      >
                        <FiList size={13} /> History
                      </button>

                      {/* Issue book to this member */}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: "5px" }}
                        disabled={limitReached}
                        onClick={() => navigate(`/circulation?memberId=${member.id}`)}
                        title={limitReached ? "Member has reached maximum borrowing limit" : "Issue book to member"}
                      >
                        <FiRepeat size={13} /> Issue
                      </button>

                      {/* Edit */}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: "5px" }}
                        onClick={() => handleOpenEditModal(member)}
                        title="Edit member details"
                      >
                        <FiEdit2 size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        className="btn btn-danger-outline btn-sm"
                        onClick={() => deleteMember(member.id)}
                        title="Delete member record"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Member Borrowing History Modal ── */}
      {viewingMemberHistory && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom" style={{ maxWidth: "680px" }}>
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">
                <FiList size={16} /> Circulation History: {viewingMemberHistory.name} ({viewingMemberHistory.id})
              </h2>
              <button
                onClick={() => setViewingMemberHistory(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="modal-body-custom">
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg-app)", border: "1px solid var(--border-main)", borderRadius: "3px", marginBottom: "16px", fontSize: "13px" }}>
                <div>
                  <strong>{viewingMemberHistory.name}</strong> &bull; {viewingMemberHistory.department}
                  <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>{viewingMemberHistory.email}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  Quota: <strong>{viewingMemberHistory.maxLimit} Books</strong>
                  <div style={{ color: "var(--green-primary)", fontWeight: "600" }}>
                    Status: {viewingMemberHistory.status}
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              {(() => {
                const memberTxns = transactions.filter(
                  (t) => t.memberId === viewingMemberHistory.id
                );

                if (memberTxns.length === 0) {
                  return (
                    <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No circulation records on file for this member yet.
                    </p>
                  );
                }

                return (
                  <div className="table-responsive">
                    <table className="academic-table" style={{ fontSize: "12.5px" }}>
                      <thead>
                        <tr>
                          <th>Txn ID</th>
                          <th>Book Title</th>
                          <th>Issue Date</th>
                          <th>Due Date</th>
                          <th>Return Date</th>
                          <th>Status &amp; Fine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memberTxns.map((t) => {
                          const isReturned = t.status === "Returned";
                          const { isOverdue, daysOverdue, fine } = calculateFine(t.dueDate, t.finePerDay);

                          return (
                            <tr key={t.id}>
                              <td style={{ fontWeight: "600" }}>{t.id}</td>
                              <td>{t.bookTitle}</td>
                              <td>{t.issueDate}</td>
                              <td style={{ color: isOverdue && !isReturned ? "#dc2626" : "inherit" }}>
                                {t.dueDate}
                              </td>
                              <td>{t.returnDate || "-- Active --"}</td>
                              <td>
                                {isReturned ? (
                                  <span className="status-badge available">Returned</span>
                                ) : isOverdue ? (
                                  <span className="status-badge overdue">Overdue (₹{fine})</span>
                                ) : (
                                  <span className="status-badge issued">Active Loan</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            <div className="modal-footer-custom">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingMemberHistory(null)}
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Member Modal (Test Case 6: Duplicate Member ID) ── */}
      {isAddModalOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">
                <FiPlus size={16} /> Register New Library Member
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdd}>
              <div className="modal-body-custom">
                {formError && (
                  <div className="academic-alert academic-alert-danger">
                    <FiAlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    Member ID / Roll Number <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. MEM-111 (must be unique)"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    required
                  />
                  <span className="form-help-text">
                    Unique institutional patron number. Duplicate IDs will be rejected.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rohan Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Institutional Email <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. rohan.sharma@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Role Category</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setFormData({
                          ...formData,
                          role: newRole,
                          maxLimit: newRole === "Faculty" ? 6 : newRole === "Research Scholar" ? 5 : 3,
                        });
                      }}
                    >
                      <option value="Student">Student (Limit: 3)</option>
                      <option value="Faculty">Faculty (Limit: 6)</option>
                      <option value="Research Scholar">Research Scholar (Limit: 5)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Borrowing Limit</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-control"
                      value={formData.maxLimit}
                      onChange={(e) => setFormData({ ...formData, maxLimit: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Tech">Information Tech</option>
                      <option value="Electronics &amp; Comm">Electronics &amp; Comm</option>
                      <option value="Mechanical Eng.">Mechanical Eng.</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Literature">Literature</option>
                      <option value="Economics">Economics</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiCheck size={15} /> Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Member Modal ── */}
      {editingMember && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">
                <FiEdit2 size={16} /> Edit Member Record: {editingMember.id}
              </h2>
              <button
                onClick={() => setEditingMember(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body-custom">
                {formError && (
                  <div className="academic-alert academic-alert-danger">
                    <FiAlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Member ID (Institutional Key)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.id}
                    disabled
                    style={{ background: "#f1f5f9" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Borrowing Limit</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-control"
                      value={formData.maxLimit}
                      onChange={(e) => setFormData({ ...formData, maxLimit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingMember(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiCheck size={15} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

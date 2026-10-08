import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import {
  FiBook,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiRepeat,
  FiFilter,
  FiInfo,
  FiLayers,
  FiMapPin,
  FiDollarSign,
  FiTag
} from "react-icons/fi";

export default function Books() {
  const { books, transactions, addBook, editBook, deleteBook, currentUser } = useLibrary();
  const navigate = useNavigate();

  // Search & Filter State (Test Case 5: Partial Search)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All"); // 'All' | 'Available' | 'OutOfStock'
  const [sortBy, setSortBy] = useState("title");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Computer Science",
    year: 2023,
    publisher: "Academic Press",
    totalCopies: 3,
    shelfLocation: "Stack CS-01-A",
    callNumber: "QA76.6 .C66",
    price: 500,
  });

  const [formError, setFormError] = useState("");

  const categories = ["All", ...new Set(books.map((b) => b.category).filter(Boolean))];

  // Test Case 5: Partial Search implementation
  const filteredBooks = books
    .filter((book) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Available" && book.availableCopies > 0) ||
        (stockFilter === "OutOfStock" && book.availableCopies === 0);

      const matchesSearch =
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.isbn.toLowerCase().includes(term) ||
        (book.publisher && book.publisher.toLowerCase().includes(term)) ||
        (book.callNumber && book.callNumber.toLowerCase().includes(term)) ||
        (book.shelfLocation && book.shelfLocation.toLowerCase().includes(term));

      return matchesCategory && matchesStock && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "year") return (b.year || 0) - (a.year || 0);
      if (sortBy === "available") return b.availableCopies - a.availableCopies;
      return 0;
    });

  const handleOpenAddModal = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "Computer Science",
      year: new Date().getFullYear(),
      publisher: "University Press",
      totalCopies: 3,
      shelfLocation: "Stack A-1",
      callNumber: `QA.${Math.floor(100 + Math.random() * 900)}`,
      price: 599,
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      year: book.year || 2020,
      publisher: book.publisher || "",
      totalCopies: book.totalCopies,
      shelfLocation: book.shelfLocation || "",
      callNumber: book.callNumber || "",
      price: book.price || 0,
    });
    setFormError("");
  };

  // Test Case 3 & 4: Add Book with Duplicate ISBN validation
  const handleSaveAdd = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title || !formData.author || !formData.isbn) {
      setFormError("Title, Author, and ISBN are mandatory fields.");
      return;
    }

    const result = addBook(formData);
    if (!result.success) {
      setFormError(result.message);
    } else {
      setIsAddModalOpen(false);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title || !formData.author || !formData.isbn) {
      setFormError("Title, Author, and ISBN are mandatory fields.");
      return;
    }

    const result = editBook(editingBook.id, formData);
    if (!result.success) {
      setFormError(result.message);
    } else {
      setEditingBook(null);
    }
  };

  // Test Case 11: Delete Book with role authorization
  const handleDelete = (id) => {
    deleteBook(id);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FiBook size={22} /> Catalog Book Inventory
          </h1>
          <p className="page-subtitle">
            Search physical collection, filter by discipline or stock, inspect shelf numbers, and manage catalog records.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <FiPlus size={15} /> Add New Catalog Volume
        </button>
      </div>

      {/* Toolbar: Partial Search & Filters (Test Case 5) */}
      <div className="toolbar-bar">
        {/* Partial Search Box */}
        <div className="search-input-wrapper">
          <FiSearch className="search-icon-inside" size={15} />
          <input
            type="text"
            className="form-control"
            placeholder="Partial search by Title, Author, ISBN, Publisher, Call Number (e.g. 'cormen', 'algo', '978', 'mit')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FiFilter size={14} style={{ color: "var(--text-muted)" }} />
          <select
            className="form-select"
            style={{ width: "auto", minWidth: "150px" }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <select
          className="form-select"
          style={{ width: "auto", minWidth: "140px" }}
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="All">All Stock Levels</option>
          <option value="Available">Available Only</option>
          <option value="OutOfStock">Out of Stock Only</option>
        </select>

        {/* Sort */}
        <select
          className="form-select"
          style={{ width: "auto", minWidth: "130px" }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Sort: Title</option>
          <option value="author">Sort: Author</option>
          <option value="year">Sort: Newest Year</option>
          <option value="available">Sort: Most Available</option>
        </select>

        {/* Result Counter */}
        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
          Showing <strong>{filteredBooks.length}</strong> of {books.length} volumes
        </span>
      </div>

      {/* Books Table */}
      <div className="table-responsive">
        <table className="academic-table">
          <thead>
            <tr>
              <th>Call / Accession ID</th>
              <th>Book Title &amp; Publication</th>
              <th>Author(s)</th>
              <th>ISBN Code</th>
              <th>Category</th>
              <th>Shelf Location</th>
              <th>Total Stock</th>
              <th>Available</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  No catalog records match your search criteria "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <tr key={book.id}>
                    <td>
                      <div style={{ fontWeight: "700", color: "var(--green-primary)", fontSize: "12.5px" }}>
                        {book.id}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-light)", fontFamily: "monospace" }}>
                        {book.callNumber || "QA.LIB"}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: "600", color: "var(--text-main)", cursor: "pointer" }}
                        onClick={() => setViewingBook(book)}
                        title="Click to view full record details"
                      >
                        {book.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {book.publisher || "Academic Press"} &bull; {book.year || "N/A"}
                      </div>
                    </td>
                    <td style={{ fontSize: "13px" }}>{book.author}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{book.isbn}</td>
                    <td>
                      <span
                        style={{
                          background: "var(--green-soft)",
                          color: "var(--green-primary-dark)",
                          padding: "2px 7px",
                          borderRadius: "3px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {book.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                        <FiMapPin size={11} style={{ marginRight: "3px", verticalAlign: "middle" }} />
                        {book.shelfLocation || "General Stacks"}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600" }}>{book.totalCopies}</td>
                    <td
                      style={{
                        fontWeight: "700",
                        color: isAvailable ? "var(--green-primary)" : "#dc2626",
                      }}
                    >
                      {book.availableCopies}
                    </td>
                    <td>
                      {isAvailable ? (
                        <span className="status-badge available">
                          Available ({book.availableCopies})
                        </span>
                      ) : (
                        <span className="status-badge overdue">Out of Stock</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {/* View Details */}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: "5px" }}
                        onClick={() => setViewingBook(book)}
                        title="View detailed book record"
                      >
                        <FiInfo size={13} /> Details
                      </button>

                      {/* Issue Quick Action */}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: "5px" }}
                        onClick={() => navigate(`/circulation?bookId=${book.id}`)}
                        disabled={!isAvailable}
                        title={isAvailable ? "Issue this book to a member" : "Book is out of stock"}
                      >
                        <FiRepeat size={13} /> Issue
                      </button>

                      {/* Edit */}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: "5px" }}
                        onClick={() => handleOpenEditModal(book)}
                        title="Edit book metadata"
                      >
                        <FiEdit2 size={13} />
                      </button>

                      {/* Delete (Test Case 11: Unauthorized check) */}
                      <button
                        className="btn btn-danger-outline btn-sm"
                        onClick={() => handleDelete(book.id)}
                        title={
                          currentUser?.role === "admin"
                            ? "Delete book"
                            : "Delete (Requires Administrator Role)"
                        }
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

      {/* ── Realistic Book Details Modal ── */}
      {viewingBook && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom" style={{ maxWidth: "620px" }}>
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">
                <FiInfo size={16} /> Catalog Accession Record: {viewingBook.id}
              </h2>
              <button
                onClick={() => setViewingBook(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="modal-body-custom">
              <div style={{ padding: "12px 14px", background: "var(--bg-app)", border: "1px solid var(--border-main)", borderRadius: "3px", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--green-primary-dark)" }}>
                  {viewingBook.title}
                </h3>
                <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px" }}>
                  by <strong>{viewingBook.author}</strong>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", marginBottom: "16px" }}>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "12px" }}>ISBN-13</span>
                  <strong>{viewingBook.isbn}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "12px" }}>Call Number</span>
                  <strong>{viewingBook.callNumber || "QA76.LIB"}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "12px" }}>Academic Discipline</span>
                  <strong>{viewingBook.category}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "12px" }}>Publisher &amp; Year</span>
                  <strong>{viewingBook.publisher} ({viewingBook.year})</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "12px" }}>Physical Shelf Location</span>
                  <strong>{viewingBook.shelfLocation}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "12px" }}>Stock Availability</span>
                  <span style={{ fontWeight: "700", color: viewingBook.availableCopies > 0 ? "var(--green-primary)" : "#dc2626" }}>
                    {viewingBook.availableCopies} available out of {viewingBook.totalCopies} copies
                  </span>
                </div>
              </div>

              {/* Active Borrowers List for this book */}
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>
                  Active Borrowers for this Title:
                </h4>
                {(() => {
                  const activeBorrows = transactions.filter(
                    (t) => t.bookId === viewingBook.id && t.status === "Issued"
                  );
                  if (activeBorrows.length === 0) {
                    return (
                      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        All copies are currently resting on the library shelves.
                      </p>
                    );
                  }
                  return (
                    <div className="table-responsive">
                      <table className="academic-table" style={{ fontSize: "12.5px" }}>
                        <thead>
                          <tr>
                            <th>Txn ID</th>
                            <th>Patron Name</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeBorrows.map((ab) => (
                            <tr key={ab.id}>
                              <td>{ab.id}</td>
                              <td>{ab.memberName} ({ab.memberId})</td>
                              <td>{ab.issueDate}</td>
                              <td>{ab.dueDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="modal-footer-custom">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingBook(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={viewingBook.availableCopies === 0}
                onClick={() => {
                  setViewingBook(null);
                  navigate(`/circulation?bookId=${viewingBook.id}`);
                }}
              >
                <FiRepeat size={14} /> Issue Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Book Modal (Test Case 3 & 4) ── */}
      {isAddModalOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">
                <FiPlus size={16} /> Add New Book to Catalog
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
                    Book Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Introduction to Algorithms (4th Edition)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Author(s) <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Thomas H. Cormen, Charles E. Leiserson"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    ISBN-13 Code <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 978-0262046305 (must be unique)"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                  />
                  <span className="form-help-text">
                    Unique International Standard Book Number. Duplicate entries will be rejected.
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Academic Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical Eng.">Mechanical Eng.</option>
                      <option value="Literature">Literature</option>
                      <option value="Economics">Economics</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Publisher</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. MIT Press"
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Publication Year</label>
                    <input
                      type="number"
                      min="1900"
                      max="2030"
                      className="form-control"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Shelf Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Stack CS-01-A"
                      value={formData.shelfLocation}
                      onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">
                      Total Copies <span className="required-star">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.totalCopies}
                      onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Replacement Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
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
                  <FiCheck size={15} /> Save Book to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Book Modal ── */}
      {editingBook && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">
                <FiEdit2 size={16} /> Edit Catalog Entry: {editingBook.id}
              </h2>
              <button
                onClick={() => setEditingBook(null)}
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
                  <label className="form-label">Book Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Author(s)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Copies</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.totalCopies}
                      onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Shelf Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.shelfLocation}
                      onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingBook(null)}
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

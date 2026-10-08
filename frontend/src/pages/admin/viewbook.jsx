import { useState, useEffect } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import {
  FiBook, FiEdit2, FiTrash2, FiTag, FiHash,
  FiDollarSign, FiLayers, FiX, FiCheck, FiPlusCircle
} from "react-icons/fi";
import { Link } from "react-router-dom";
import "./viewbook.css";

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    price: "",
    totalCopies: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const url = Server_URL + "books";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volume from inventory?")) return;

    try {
      await axios.delete(`${Server_URL}books/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      showSuccessToast("Book successfully removed from inventory.");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error.response?.data?.message || error.message);
      showErrorToast("Failed to delete book!");
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      isbn: book.isbn || "",
      price: book.price || "",
      totalCopies: book.totalCopies || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${Server_URL}books/update/${selectedBook._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      showSuccessToast("Book record updated successfully!");
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error.response?.data?.message || error.message);
      showErrorToast("Failed to update book!");
    }
  };

  return (
    <div className="lib-admin-dash" style={{ padding: "3rem 1rem 5rem" }}>
      <div className="lib-container">
        {/* Header */}
        <div className="lib-admin-dash__section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="lib-section__eyebrow">Catalog Inventory</span>
            <h1 className="lib-admin-dash__section-title">Manage Library Books</h1>
          </div>
          <Link to="/admin/addbook" className="lib-btn lib-btn-primary">
            <FiPlusCircle size={16} /> Add New Volume
          </Link>
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="lib-books-grid">
            {books.map((book) => (
              <div key={book._id} className="lib-book-card">
                <div className="lib-book-card__thumb-wrap">
                  <img
                    src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"}
                    className="lib-book-card__thumb"
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80";
                    }}
                  />
                  <span
                    className={`lib-book-card__badge ${
                      book.availableCopies > 0
                        ? "lib-book-card__badge--avail"
                        : "lib-book-card__badge--unavail"
                    }`}
                  >
                    {book.availableCopies ?? 0} in stock
                  </span>
                </div>

                <div className="lib-book-card__body">
                  <span className="lib-book-card__category">{book.category || "General"}</span>
                  <h3 className="lib-book-card__title" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="lib-book-card__author">by {book.author}</p>

                  <div className="lib-viewbook-meta-list">
                    <div className="lib-viewbook-meta-line">
                      <FiHash size={13} /> <span>ISBN: {book.isbn || "AGC-LIB"}</span>
                    </div>
                    <div className="lib-viewbook-meta-line">
                      <FiDollarSign size={13} /> <span>Price: ₹{book.price || 0}</span>
                    </div>
                  </div>

                  <div className="lib-viewbook-card-actions">
                    <button
                      className="lib-btn lib-btn-ghost lib-btn--sm"
                      onClick={() => handleEdit(book)}
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
                    <button
                      className="lib-btn lib-btn-danger lib-btn--sm"
                      onClick={() => handleDelete(book._id)}
                    >
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="lib-empty-box">
            <FiBook size={48} />
            <h3>No books found in catalog</h3>
            <p>Get started by adding your first volume to the collection.</p>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && selectedBook && (
          <div className="lib-modal-overlay">
            <div className="lib-modal-card">
              <div className="lib-modal-header">
                <h3>Edit Catalog Entry</h3>
                <button
                  className="lib-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="lib-auth-form" style={{ padding: "1.5rem" }}>
                <div className="lib-auth-group">
                  <label className="lib-auth-label">Title</label>
                  <input
                    type="text"
                    className="lib-auth-input"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lib-auth-group">
                  <label className="lib-auth-label">Author</label>
                  <input
                    type="text"
                    className="lib-auth-input"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lib-auth-group">
                  <label className="lib-auth-label">Category</label>
                  <input
                    type="text"
                    className="lib-auth-input"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lib-detail-meta-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="lib-auth-group">
                    <label className="lib-auth-label">ISBN</label>
                    <input
                      type="text"
                      className="lib-auth-input"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="lib-auth-group">
                    <label className="lib-auth-label">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="lib-auth-input"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="lib-auth-group">
                  <label className="lib-auth-label">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    className="lib-auth-input"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lib-modal-footer">
                  <button
                    type="button"
                    className="lib-btn lib-btn-ghost"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="lib-btn lib-btn-primary">
                    <FiCheck size={16} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBooks;

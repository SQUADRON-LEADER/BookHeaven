import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiSearch, FiBook, FiFilter, FiGrid, FiInfo,
  FiX
} from "react-icons/fi";
import { Server_URL } from "../../utils/config";
import "./books.css";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const cat = searchParams.get("category");
    const q   = searchParams.get("search");
    if (cat) setSelectedCategory(cat);
    if (q)   setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${Server_URL}books`);
        const list = res.data.books || res.data || [];
        const validList = Array.isArray(list) ? list : [];
        setBooks(validList);

        const cats = Array.from(new Set(validList.map((b) => b.category).filter(Boolean)));
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesCat =
      selectedCategory === "All" || book.category === selectedCategory;
    const matchesSearch =
      !search ||
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.category?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="lib-books-page">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="lib-books-header">
        <div className="lib-container">
          <div className="lib-books-header__inner">
            <div>
              <span className="lib-section__eyebrow">AGC Catalog</span>
              <h1 className="lib-books-header__title">Library Collection</h1>
              <p className="lib-books-header__sub">
                Explore thousands of academic texts, journals, and reference materials.
              </p>
            </div>

            {/* Search Bar */}
            <div className="lib-books-search-wrap">
              <FiSearch className="lib-books-search-icon" size={18} />
              <input
                type="text"
                className="lib-books-search-input"
                placeholder="Search by title, author, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search collection"
              />
              {search && (
                <button
                  className="lib-books-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Layout ─────────────────────────────────── */}
      <div className="lib-container lib-books-content">
        {/* Mobile filter toggle */}
        <button
          className="lib-books-filter-toggle lib-btn lib-btn-ghost"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiFilter size={16} />
          {sidebarOpen ? "Hide Filters" : "Filter by Category"}
          {selectedCategory !== "All" && <span className="lib-badge-dot" />}
        </button>

        <div className="lib-books-layout">
          {/* ── Sidebar Filters ── */}
          <aside className={`lib-books-sidebar ${sidebarOpen ? "lib-books-sidebar--open" : ""}`}>
            <div className="lib-books-sidebar__header">
              <div className="lib-books-sidebar__title">
                <FiFilter size={16} />
                <h3>Categories</h3>
              </div>
              {selectedCategory !== "All" && (
                <button
                  className="lib-books-sidebar__reset"
                  onClick={() => setSelectedCategory("All")}
                >
                  Reset
                </button>
              )}
            </div>

            <ul className="lib-books-cat-list">
              <li>
                <button
                  className={`lib-books-cat-item ${selectedCategory === "All" ? "lib-books-cat-item--active" : ""}`}
                  onClick={() => { setSelectedCategory("All"); setSidebarOpen(false); }}
                >
                  <span>All Categories</span>
                  <span className="lib-books-cat-count">{books.length}</span>
                </button>
              </li>
              {categories.map((cat) => {
                const count = books.filter((b) => b.category === cat).length;
                return (
                  <li key={cat}>
                    <button
                      className={`lib-books-cat-item ${selectedCategory === cat ? "lib-books-cat-item--active" : ""}`}
                      onClick={() => { setSelectedCategory(cat); setSidebarOpen(false); }}
                    >
                      <span>{cat}</span>
                      <span className="lib-books-cat-count">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ── Books Grid ── */}
          <main className="lib-books-main">
            <div className="lib-books-main__topbar">
              <span className="lib-books-count">
                Showing <strong>{filteredBooks.length}</strong> {filteredBooks.length === 1 ? "book" : "books"}
                {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              </span>
            </div>

            {loading ? (
              <div className="lib-books__loading">
                <div className="lib-spinner" />
                <p>Loading library catalog...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="lib-books-empty">
                <FiBook size={48} className="lib-books-empty__icon" />
                <h3>No books found</h3>
                <p>Try adjusting your search query or category filter.</p>
                <button
                  className="lib-btn lib-btn-primary"
                  onClick={() => { setSelectedCategory("All"); setSearch(""); }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="lib-books-grid">
                {filteredBooks.map((book) => (
                  <div key={book._id || book.id} className="lib-book-card">
                    <div className="lib-book-card__thumb-wrap">
                      <img
                        src={book.coverImage || "/assets/book_placeholder.png"}
                        alt={book.title}
                        className="lib-book-card__thumb"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80";
                        }}
                      />
                      <span
                        className={`lib-book-card__badge ${
                          book.availableCopies > 0
                            ? "lib-book-card__badge--avail"
                            : "lib-book-card__badge--unavail"
                        }`}
                      >
                        {book.availableCopies > 0 ? "Available" : "Checked Out"}
                      </span>
                    </div>

                    <div className="lib-book-card__body">
                      <span className="lib-book-card__category">{book.category || "General"}</span>
                      <h3 className="lib-book-card__title" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="lib-book-card__author">by {book.author || "Unknown"}</p>

                      <div className="lib-book-card__meta">
                        <span className="lib-book-card__copies">
                          Copies: {book.availableCopies ?? "N/A"}
                        </span>
                        <button
                          onClick={() => navigate(`/bookdetails/${book._id || book.id}`)}
                          className="lib-btn lib-btn-primary lib-btn--sm"
                        >
                          <FiInfo size={13} /> View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
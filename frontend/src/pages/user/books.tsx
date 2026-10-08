import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiSearch, FiBook, FiFilter, FiGrid, FiInfo,
  FiShoppingCart, FiX
} from "react-icons/fi";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import "./books.css";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  price?: number;
}

const Books: React.FC = () => {
  const [books, setBooks]                   = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks]   = useState<Book[]>([]);
  const [searchTerm, setSearchTerm]         = useState("");
  const [categories, setCategories]         = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading]           = useState(true);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  async function issueBook(bookid: string) {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) { showErrorToast("Please login to issue a book."); return; }
    try {
      const response = await axios.post(
        `${Server_URL}books/borrow/request-issue/${bookid}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const { error, message } = response.data;
      error ? showErrorToast(message) : showSuccessToast(message);
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || "Something went wrong!");
    }
  }

  const bookDetails = (bookid: string) => navigate(`/bookdetails/${bookid}`);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${Server_URL}books`)
      .then(({ data }) => {
        if (!data.error) {
          setBooks(data.books);
          setFilteredBooks(data.books);
          const cats = ["All", ...new Set<string>(data.books.map((b: Book) => b.category))];
          setCategories(cats);

          // Pre-select category from URL param
          const catParam = searchParams.get("category");
          if (catParam) {
            setSelectedCategory(catParam);
            setFilteredBooks(data.books.filter((b: Book) => b.category === catParam));
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filterBooks = (search: string, category: string) => {
    let result = books;
    if (category !== "All") result = result.filter(b => b.category === category);
    if (search) result = result.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));
    setFilteredBooks(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    filterBooks(val, selectedCategory);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    filterBooks(searchTerm, cat);
    setSidebarOpen(false);
  };

  return (
    <div className="lib-books-page">

      {/* Page Header */}
      <div className="lib-books-header">
        <div className="lib-container">
          <span className="lib-label">Collection</span>
          <h1 className="lib-heading">All Books</h1>
          <p className="lib-subheading">
            Browse and borrow from our curated academic library
          </p>
        </div>
      </div>

      <div className="lib-container lib-books-layout">

        {/* Sidebar */}
        <aside className={`lib-books-sidebar ${sidebarOpen ? "lib-books-sidebar--open" : ""}`}>
          <div className="lib-books-sidebar__header">
            <span className="lib-books-sidebar__title">
              <FiFilter size={15} /> Categories
            </span>
            <button
              className="lib-books-sidebar__close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="lib-books-sidebar__list">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`lib-books-sidebar__cat ${selectedCategory === cat ? "lib-books-sidebar__cat--active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="lib-books-sidebar__check">
                    <FiBook size={12} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="lib-books-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="lib-books-main">

          {/* Toolbar */}
          <div className="lib-books-toolbar">
            <div className="lib-books-search">
              <FiSearch size={16} className="lib-books-search__icon" />
              <input
                id="books-search"
                type="text"
                className="lib-books-search__input"
                placeholder="Search books by title…"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  className="lib-books-search__clear"
                  onClick={() => { setSearchTerm(""); filterBooks("", selectedCategory); }}
                  aria-label="Clear search"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            <button
              className="lib-btn lib-btn-ghost lib-books-filter-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open category filter"
            >
              <FiFilter size={15} /> Filter
            </button>
          </div>

          {/* Results count */}
          {!isLoading && (
            <p className="lib-books-count">
              Showing <strong>{filteredBooks.length}</strong> book{filteredBooks.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="lib-books-loading">
              <div className="lib-preloader__spinner" />
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="lib-books-grid">
              {filteredBooks.map((book, i) => (
                <div key={i} className="lib-book-item">
                  <div className="lib-book-item__cover-wrap">
                    <img
                      src={book.coverImage}
                      className="lib-book-item__cover"
                      alt={book.title}
                      onError={(e: any) => {
                        e.target.src = "https://via.placeholder.com/200x280?text=No+Cover";
                      }}
                    />
                    <span className="lib-badge lib-book-item__badge">{book.category}</span>
                    <div className="lib-book-item__hover-layer">
                      <button
                        id={`btn-details-${book._id}`}
                        className="lib-btn lib-btn-outline lib-book-item__act-btn"
                        onClick={() => bookDetails(book._id)}
                      >
                        <FiInfo size={15} /> Details
                      </button>
                      <button
                        id={`btn-issue-${book._id}`}
                        className="lib-btn lib-btn-primary lib-book-item__act-btn"
                        onClick={() => issueBook(book._id)}
                      >
                        <FiShoppingCart size={15} /> Issue
                      </button>
                    </div>
                  </div>
                  <div className="lib-book-item__info">
                    <h3 className="lib-book-item__title">{book.title}</h3>
                    <p className="lib-book-item__author">by {book.author}</p>
                    {book.price !== undefined && (
                      <span className="lib-book-item__price">₹{book.price}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="lib-books-empty">
              <FiBook size={48} className="lib-books-empty__icon" />
              <h4 className="lib-books-empty__title">No books found</h4>
              <p className="lib-books-empty__text">Try adjusting your search or filter</p>
              <button
                className="lib-btn lib-btn-ghost"
                onClick={() => { setSearchTerm(""); handleCategoryChange("All"); }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Books;

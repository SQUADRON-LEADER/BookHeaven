import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiBook, FiUsers, FiGrid, FiArrowRight,
  FiClock, FiCalendar, FiSearch, FiAward, FiCompass
} from "react-icons/fi";
import { Server_URL } from "../../utils/config";
import "./home.css";

const STATIC_STATS = [
  { icon: <FiBook size={24} />,     count: "50,000+", label: "Books & Journals" },
  { icon: <FiUsers size={24} />,    count: "10,000+", label: "Active Members" },
  { icon: <FiAward size={24} />,    count: "100%",    label: "Accredited Catalog" },
  { icon: <FiCompass size={24} />,  count: "24/7",    label: "Digital Access" },
];

const CATEGORIES = [
  { name: "Computer Science", desc: "Algorithms, AI, Systems & Web", icon: <FiGrid size={22} />, tag: "Tech" },
  { name: "Literature",       desc: "Classic & Modern Prose, Poetry", icon: <FiBook size={22} />, tag: "Humanities" },
  { name: "Science",          desc: "Physics, Chemistry, Biology",   icon: <FiCompass size={22} />, tag: "STEM" },
  { name: "Mathematics",      desc: "Calculus, Algebra, Statistics", icon: <FiAward size={22} />, tag: "STEM" },
];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get(`${Server_URL}books`);
      const list = response.data.books || response.data || [];
      setBooks(Array.isArray(list) ? list.slice(0, 8) : []);
    } catch (err) {
      console.error("Error fetching books for home:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="lib-home">
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="lib-hero">
        <div className="lib-hero__bg-glow" />
        <div className="lib-hero__container">
          <div className="lib-hero__content">
            <span className="lib-hero__badge">
              <span className="lib-hero__badge-dot" />
              AGC Central Library &bull; Knowledge Gateway
            </span>
            <h1 className="lib-hero__title">
              Expand your mind with <span className="lib-hero__title--accent">limitless</span> knowledge.
            </h1>
            <p className="lib-hero__desc">
              Explore thousands of books, research papers, and digital archives.
              Discover, borrow, and elevate your academic journey today.
            </p>

            <form
              className="lib-hero__search"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/books?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
            >
              <FiSearch className="lib-hero__search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by title, author, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search catalog"
              />
              <button type="submit" className="lib-btn lib-btn-primary">
                Search
              </button>
            </form>

            <div className="lib-hero__actions">
              <Link to="/books" className="lib-btn lib-btn-primary lib-btn--lg">
                Explore Catalog <FiArrowRight size={16} />
              </Link>
              <Link to="/category" className="lib-btn lib-btn-ghost lib-btn--lg">
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ───────────────────────────────────────────── */}
      <section className="lib-stats">
        <div className="lib-container">
          <div className="lib-stats__grid">
            {STATIC_STATS.map(({ icon, count, label }, i) => (
              <div key={i} className="lib-stats__card">
                <div className="lib-stats__icon">{icon}</div>
                <div className="lib-stats__count">{count}</div>
                <div className="lib-stats__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR CATEGORIES ──────────────────────────────────────── */}
      <section className="lib-section lib-categories-section">
        <div className="lib-container">
          <div className="lib-section__header">
            <div>
              <span className="lib-section__eyebrow">Discover</span>
              <h2 className="lib-section__title">Browse by Discipline</h2>
            </div>
            <Link to="/category" className="lib-section__link">
              All categories <FiArrowRight size={15} />
            </Link>
          </div>

          <div className="lib-categories__grid">
            {CATEGORIES.map(({ name, desc, icon, tag }, i) => (
              <Link to={`/books?category=${encodeURIComponent(name)}`} key={i} className="lib-cat-card">
                <div className="lib-cat-card__top">
                  <div className="lib-cat-card__icon">{icon}</div>
                  <span className="lib-cat-card__tag">{tag}</span>
                </div>
                <h3 className="lib-cat-card__name">{name}</h3>
                <p className="lib-cat-card__desc">{desc}</p>
                <div className="lib-cat-card__footer">
                  <span>Explore books</span>
                  <FiArrowRight size={14} className="lib-cat-card__arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS / FEATURED BOOKS ───────────────────────────── */}
      <section className="lib-section lib-featured-section">
        <div className="lib-container">
          <div className="lib-section__header">
            <div>
              <span className="lib-section__eyebrow">Curated</span>
              <h2 className="lib-section__title">Featured &amp; New Arrivals</h2>
            </div>
            <Link to="/books" className="lib-section__link">
              View all {books.length ? `(${books.length}+)` : ""} <FiArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="lib-books__loading">
              <div className="lib-spinner" />
              <p>Fetching collection...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="lib-empty">
              <FiBook size={40} className="lib-empty__icon" />
              <p>No books found. Check back soon!</p>
            </div>
          ) : (
            <div className="lib-books-grid">
              {books.map((book) => (
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
                    <span className="lib-book-card__badge">
                      {book.availableCopies > 0 ? "Available" : "Checked Out"}
                    </span>
                  </div>

                  <div className="lib-book-card__body">
                    <span className="lib-book-card__category">{book.category || "General"}</span>
                    <h4 className="lib-book-card__title" title={book.title}>
                      {book.title}
                    </h4>
                    <p className="lib-book-card__author">by {book.author || "Unknown"}</p>

                    <div className="lib-book-card__meta">
                      <span className="lib-book-card__copies">
                        Copies: {book.availableCopies ?? "N/A"}
                      </span>
                      <Link
                        to={`/bookdetails/${book._id || book.id}`}
                        className="lib-btn lib-btn-primary lib-btn--sm"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LIBRARY HOURS & INFO ────────────────────────────────────── */}
      <section className="lib-section lib-hours-section">
        <div className="lib-container">
          <div className="lib-hours__card">
            <div className="lib-hours__left">
              <span className="lib-section__eyebrow">Visit Campus</span>
              <h2 className="lib-hours__title">Library Schedule &amp; Facilities</h2>
              <p className="lib-hours__desc">
                Our quiet reading rooms, digital labs, and collaborative study pods
                are open to all registered students and faculty members.
              </p>
              <div className="lib-hours__times">
                <div className="lib-hours__time-row">
                  <FiClock className="lib-hours__time-icon" size={18} />
                  <div>
                    <strong>Monday &ndash; Friday</strong>
                    <span>8:00 AM &ndash; 8:00 PM</span>
                  </div>
                </div>
                <div className="lib-hours__time-row">
                  <FiCalendar className="lib-hours__time-icon" size={18} />
                  <div>
                    <strong>Saturday</strong>
                    <span>9:00 AM &ndash; 5:00 PM (Closed Sundays)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lib-hours__right">
              <div className="lib-hours__stat-pill">
                <h4>150+</h4>
                <span>Study Desks</span>
              </div>
              <div className="lib-hours__stat-pill">
                <h4>50+</h4>
                <span>Digital Terminals</span>
              </div>
              <div className="lib-hours__stat-pill">
                <h4>Hi-Speed</h4>
                <span>Campus Wi-Fi</span>
              </div>
              <div className="lib-hours__stat-pill">
                <h4>Silent</h4>
                <span>Research Zones</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
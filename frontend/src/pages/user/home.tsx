import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiBook, FiUsers, FiGrid, FiArrowRight,
  FiClock, FiCalendar, FiSearch
} from "react-icons/fi";
import { Server_URL } from "../../utils/config";
import Preloader from "../../components/Preloader";
import "./home.css";

interface Stats {
  totalCategories?: number;
  totalBooks?: number;
  totalActiveStudents?: number;
}

interface Category {
  category: string;
  count: number;
  coverImage?: string;
}

interface Book {
  title: string;
  author: string;
  category: string;
  coverImage?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(Server_URL + "home");
      if (!data.error) {
        setStats(data.stats);
        setCategories(data.categories);
        setNewArrivals(data.newArrivals);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Preloader />;

  return (
    <div className="lib-home">

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="lib-hero">
        <div className="lib-hero__bg" aria-hidden="true" />
        <div className="lib-hero__overlay" aria-hidden="true" />
        <div className="lib-container lib-hero__content">
          <span className="lib-badge lib-animate-fade-up" style={{ animationDelay: "0s" }}>
            <span className="lib-dot-online" style={{ marginRight: "6px" }} />
            College Central Library — Online Portal
          </span>
          <h1 className="lib-heading lib-hero__title lib-animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Knowledge at your <br />
            <span className="lib-gradient-text">fingertips.</span>
          </h1>
          <p className="lib-subheading lib-hero__subtitle lib-animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Browse thousands of academic books, journals, and research materials.
            Borrow, explore and discover your next great read.
          </p>
          <div className="lib-hero__actions lib-animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/books" className="lib-btn lib-btn-primary lib-hero__btn">
              <FiSearch size={16} />
              Browse Collection
            </Link>
            <Link to="/category" className="lib-btn lib-btn-outline">
              View Categories
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Decorative orbs */}
        <div className="lib-hero__orb lib-hero__orb--1" aria-hidden="true" />
        <div className="lib-hero__orb lib-hero__orb--2" aria-hidden="true" />
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="lib-stats">
        <div className="lib-container">
          <div className="lib-stats__grid">
            <div className="lib-stats__card lib-animate-fade-up lib-animate-delay-1">
              <span className="lib-stats__icon"><FiGrid size={22} /></span>
              <span className="lib-stats__number">{stats.totalCategories ?? 0}+</span>
              <span className="lib-stats__label">Categories</span>
            </div>
            <div className="lib-stats__card lib-animate-fade-up lib-animate-delay-2">
              <span className="lib-stats__icon"><FiBook size={22} /></span>
              <span className="lib-stats__number">{stats.totalBooks ?? 0}+</span>
              <span className="lib-stats__label">Total Books</span>
            </div>
            <div className="lib-stats__card lib-animate-fade-up lib-animate-delay-3">
              <span className="lib-stats__icon"><FiUsers size={22} /></span>
              <span className="lib-stats__number">{stats.totalActiveStudents ?? 0}</span>
              <span className="lib-stats__label">Active Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────── */}
      <section className="lib-section lib-categories">
        <div className="lib-container">
          <div className="lib-section-header">
            <span className="lib-label">Explore</span>
            <h2 className="lib-heading">Browse by Category</h2>
            <p className="lib-subheading">Find textbooks and resources for your courses</p>
          </div>

          <div className="lib-categories__grid">
            {categories.map((cat, i) => (
              <Link
                to={`/books?category=${cat.category}`}
                key={i}
                className="lib-category-card"
              >
                <div className="lib-category-card__img-wrap">
                  <img
                    src={cat.coverImage || "/images/default-subject.jpg"}
                    alt={cat.category}
                    loading="lazy"
                    className="lib-category-card__img"
                  />
                  <div className="lib-category-card__overlay" />
                </div>
                <div className="lib-category-card__body">
                  <h3 className="lib-category-card__name">{cat.category}</h3>
                  <span className="lib-category-card__count">{cat.count} books</span>
                </div>
                <span className="lib-category-card__arrow">
                  <FiArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>

          <div className="lib-categories__footer">
            <Link to="/category" className="lib-btn lib-btn-outline">
              View All Categories
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ────────────────────────────────── */}
      <section className="lib-section lib-arrivals">
        <div className="lib-container">
          <div className="lib-section-header">
            <span className="lib-label">New Arrivals</span>
            <h2 className="lib-heading">Recently Added</h2>
            <p className="lib-subheading">Fresh additions to our growing collection</p>
          </div>

          <div className="lib-arrivals__grid">
            {newArrivals.map((book, i) => (
              <div key={i} className="lib-book-card">
                <div className="lib-book-card__cover-wrap">
                  <img
                    src={book.coverImage || "/images/default-book.jpg"}
                    alt={book.title}
                    className="lib-book-card__cover"
                    loading="lazy"
                  />
                  <div className="lib-book-card__shimmer" />
                </div>
                <div className="lib-book-card__info">
                  <h3 className="lib-book-card__title">{book.title}</h3>
                  <p className="lib-book-card__author">{book.author}</p>
                  <span className="lib-badge">{book.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Library Hours ───────────────────────────────── */}
      <section className="lib-section lib-hours">
        <div className="lib-container">
          <div className="lib-section-header">
            <span className="lib-label">Visit Us</span>
            <h2 className="lib-heading">Library Hours</h2>
          </div>
          <div className="lib-hours__grid">
            <div className="lib-card lib-hours__card">
              <span className="lib-hours__card-icon"><FiClock size={24} /></span>
              <h3 className="lib-hours__card-title">Regular Hours</h3>
              <ul className="lib-hours__list">
                <li><span>Monday – Friday</span><strong>8:00 AM – 8:00 PM</strong></li>
                <li><span>Saturday</span><strong>10:00 AM – 5:00 PM</strong></li>
                <li><span>Sunday</span><strong>Closed</strong></li>
              </ul>
            </div>
            <div className="lib-card lib-hours__card lib-hours__card--accent">
              <span className="lib-hours__card-icon"><FiCalendar size={24} /></span>
              <h3 className="lib-hours__card-title">Exam Period</h3>
              <ul className="lib-hours__list">
                <li><span>Monday – Sunday</span><strong>7:00 AM – 11:00 PM</strong></li>
              </ul>
              <span className="lib-badge" style={{ marginTop: "auto" }}>Extended Hours</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

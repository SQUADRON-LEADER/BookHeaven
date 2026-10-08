import React, { useState, useEffect } from "react";
import { Server_URL } from "../../utils/config";
import axios from "axios";
import "./allcategories.css";
import { Link } from "react-router-dom";
import Loader from "../../components/Preloader";
import { showErrorToast } from "../../utils/toasthelper";
import { FiGrid, FiBook, FiArrowRight, FiLayers } from "react-icons/fi";

export default function ViewAllCategories() {
  const [books, setBooks] = useState([]);
  const [filterBooks, setFilteredBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const url = Server_URL + "books";
      const response = await axios.get(url);
      const { error, message, books } = response.data;

      if (error) {
        if (message !== "No Books Found") {
          showErrorToast(message);
        }
        setBooks([]);
        setFilteredBooks([]);
      } else {
        const bookList = books || [];
        setBooks(bookList);
        setFilteredBooks(bookList);

        const categoryCountMap = {};
        bookList.forEach((book) => {
          const cat = book.category;
          if (cat) {
            categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
          }
        });

        setCategoryCounts(categoryCountMap);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showErrorToast("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (selectedCategory) => {
    setActiveCategory(selectedCategory);
    if (selectedCategory === "All") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) => book.category === selectedCategory
      );
      setFilteredBooks(filtered);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const uniqueCategories = [...new Set(books.map((book) => book.category).filter(Boolean))];

  return (
    <div className="lib-cat-page">
      {/* Page Header */}
      <div className="lib-cat-header">
        <div className="lib-container">
          <span className="lib-section__eyebrow">Taxonomy</span>
          <h1 className="lib-cat-header__title">Explore Academic Categories</h1>
          <p className="lib-cat-header__sub">
            Filter our extensive physical and digital catalog across specialized disciplines.
          </p>
        </div>
      </div>

      <div className="lib-container lib-cat-body">
        <div className="lib-cat-layout">
          {/* Sidebar */}
          <aside className="lib-cat-sidebar">
            <div className="lib-cat-sidebar__title">
              <FiLayers size={16} />
              <span>Disciplines</span>
            </div>
            <ul className="lib-cat-nav">
              <li
                className={`lib-cat-nav-item ${
                  activeCategory === "All" ? "lib-cat-nav-item--active" : ""
                }`}
                onClick={() => handleCategoryClick("All")}
              >
                <span>All Disciplines</span>
                <span className="lib-cat-count-badge">{books.length}</span>
              </li>
              {uniqueCategories.map((category, index) => (
                <li
                  key={index}
                  className={`lib-cat-nav-item ${
                    activeCategory === category ? "lib-cat-nav-item--active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span>{category}</span>
                  <span className="lib-cat-count-badge">
                    {categoryCounts[category] || 0}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="lib-cat-main">
            <div className="lib-cat-main__header">
              <h2>
                {activeCategory === "All" ? "All Categories" : activeCategory}
                <span className="lib-cat-highlight-count">
                  ({activeCategory === "All" ? uniqueCategories.length : 1} {uniqueCategories.length === 1 ? "category" : "categories"})
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="lib-loading-box">
                <Loader />
              </div>
            ) : filterBooks.length > 0 ? (
              <div className="lib-cat-grid">
                {(activeCategory === "All" ? uniqueCategories : [activeCategory]).map(
                  (category, index) => {
                    const sampleBook = filterBooks.find((b) => b.category === category);
                    const count = categoryCounts[category] || 0;
                    return (
                      <div key={index} className="lib-category-card">
                        <div className="lib-category-card__thumb-wrap">
                          <img
                            src={sampleBook?.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"}
                            className="lib-category-card__img"
                            alt={category}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80";
                            }}
                          />
                          <div className="lib-category-card__overlay">
                            <span className="lib-category-card__badge">
                              {count} {count === 1 ? "Book" : "Books"}
                            </span>
                          </div>
                        </div>
                        <div className="lib-category-card__content">
                          <h3 className="lib-category-card__title">{category}</h3>
                          <p className="lib-category-card__desc">
                            Explore available texts, reference material, and research journals in {category}.
                          </p>
                          <Link
                            to={`/books?category=${encodeURIComponent(category)}`}
                            className="lib-btn lib-btn-primary lib-btn--sm lib-category-card__btn"
                          >
                            Browse Collection <FiArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="lib-empty-box">
                <FiBook size={44} />
                <p>No catalog entries found for this category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

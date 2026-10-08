import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { motion } from "framer-motion";
import {
  FiBook, FiTag, FiHash, FiDollarSign, FiInfo,
  FiArrowLeft, FiCheckCircle, FiXCircle, FiLayers
} from "react-icons/fi";
import "./bookdetails.css";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isIssuing, setIsIssuing] = useState(false);

  async function issueBook(bookid) {
    try {
      setIsIssuing(true);
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        showErrorToast("Please sign in to borrow or issue a book.");
        return;
      }
      const response = await axios.post(
        `${Server_URL}books/borrow/request-issue/${bookid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const { error, message } = response.data;
      if (error) {
        showErrorToast(message || "Could not request book.");
      } else {
        showSuccessToast(message || "Book issue request submitted successfully!");
      }
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Something went wrong! Please try again."
      );
    } finally {
      setIsIssuing(false);
    }
  }

  useEffect(() => {
    async function fetchBook() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${Server_URL}books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  if (isLoading) {
    return (
      <div className="lib-bookdetail-page">
        <div className="lib-container">
          <div className="lib-detail-loading">
            <div className="lib-spinner"></div>
            <p>Loading catalog record...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lib-bookdetail-page">
        <div className="lib-container">
          <div className="lib-detail-error">
            <FiXCircle size={32} />
            <p>{error}</p>
            <Link to="/books" className="lib-btn lib-btn-primary">
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="lib-bookdetail-page">
        <div className="lib-container">
          <div className="lib-detail-empty">
            <FiBook size={48} />
            <h2>Catalog Record Not Found</h2>
            <p>The requested book does not exist or may have been removed.</p>
            <Link to="/books" className="lib-btn lib-btn-primary">
              <FiArrowLeft size={16} /> Back to Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies !== undefined ? book.availableCopies > 0 : true;

  return (
    <div className="lib-bookdetail-page">
      <div className="lib-container">
        {/* Back Link */}
        <div className="lib-detail-back">
          <Link to="/books" className="lib-back-btn">
            <FiArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>

        <motion.div
          className="lib-detail-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Cover Column */}
          <div className="lib-detail-cover-col">
            <div className="lib-detail-img-wrap">
              <img
                src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"}
                alt={book.title}
                className="lib-detail-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80";
                }}
              />
              <div
                className={`lib-detail-badge ${
                  isAvailable ? "lib-detail-badge--avail" : "lib-detail-badge--unavail"
                }`}
              >
                {isAvailable ? (
                  <>
                    <FiCheckCircle size={14} /> {book.availableCopies ?? "In Stock"} Available
                  </>
                ) : (
                  <>
                    <FiXCircle size={14} /> Out of Stock
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="lib-detail-info-col">
            <span className="lib-detail-category">{book.category || "General Collection"}</span>
            <h1 className="lib-detail-title">{book.title}</h1>
            <p className="lib-detail-author">by {book.author || "Unknown Author"}</p>

            {/* Meta Grid */}
            <div className="lib-detail-meta-grid">
              <div className="lib-detail-meta-item">
                <FiTag className="lib-detail-meta-icon" size={18} />
                <div>
                  <span className="lib-detail-meta-lbl">Category</span>
                  <span className="lib-detail-meta-val">{book.category || "N/A"}</span>
                </div>
              </div>

              <div className="lib-detail-meta-item">
                <FiHash className="lib-detail-meta-icon" size={18} />
                <div>
                  <span className="lib-detail-meta-lbl">ISBN / Code</span>
                  <span className="lib-detail-meta-val">{book.isbn || "AGC-LIB"}</span>
                </div>
              </div>

              <div className="lib-detail-meta-item">
                <FiDollarSign className="lib-detail-meta-icon" size={18} />
                <div>
                  <span className="lib-detail-meta-lbl">Price / Value</span>
                  <span className="lib-detail-meta-val">₹{book.price || "Free Borrow"}</span>
                </div>
              </div>

              <div className="lib-detail-meta-item">
                <FiLayers className="lib-detail-meta-icon" size={18} />
                <div>
                  <span className="lib-detail-meta-lbl">Available Copies</span>
                  <span className="lib-detail-meta-val">{book.availableCopies ?? "Available"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="lib-detail-desc">
              <h3>
                <FiInfo size={16} /> Overview &amp; Synopsis
              </h3>
              <p>
                {book.description ||
                  "No detailed synopsis has been provided for this catalog entry. Please consult the librarian or view the volume physically on the shelves."}
              </p>
            </div>

            {/* Actions */}
            <div className="lib-detail-actions">
              <button
                className={`lib-btn lib-btn-primary lib-btn--lg lib-issue-btn ${
                  !isAvailable ? "lib-issue-btn--disabled" : ""
                }`}
                onClick={() => issueBook(book._id || book.id)}
                disabled={!isAvailable || isIssuing}
              >
                {isIssuing ? (
                  <span className="lib-btn-loader" />
                ) : (
                  <>
                    <FiBook size={18} />
                    {isAvailable ? "Request to Borrow Book" : "Currently Unavailable"}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BookDetails;
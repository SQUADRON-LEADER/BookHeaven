import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import {
  FiBook, FiPlusCircle, FiUser, FiTag, FiHash,
  FiDollarSign, FiLayers, FiImage, FiFileText, FiArrowRight
} from "react-icons/fi";

const AddBookForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(data).forEach((key) => {
        if (key !== "coverImage") {
          formData.append(key, data[key]);
        }
      });
  
      // Append the file
      if (data.coverImage && data.coverImage[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }
  
      const authToken = localStorage.getItem("authToken");
      const url = Server_URL + "books/add";
  
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { error, message } = response.data;
      if (error) {
        showErrorToast(message || "Could not add book.");
      } else {
        showSuccessToast(message || "Book successfully added to catalog!");
        reset();
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      showErrorToast(error.response?.data?.message || "Failed to add book!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lib-admin-dash" style={{ padding: "3rem 1rem" }}>
      <div className="lib-container" style={{ maxWidth: "800px" }}>
        <div className="lib-section-card">
          <div className="lib-section-card__title">
            <FiPlusCircle size={22} />
            <h2>Add New Catalog Volume</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="lib-auth-form">
            <div className="lib-detail-meta-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {/* Title */}
              <div className="lib-auth-group">
                <label className="lib-auth-label">Book Title</label>
                <div className="lib-auth-input-wrap">
                  <FiBook className="lib-auth-field-icon" size={17} />
                  <input
                    type="text"
                    className="lib-auth-input"
                    placeholder="e.g. Introduction to Algorithms"
                    {...register("title", { required: "Title is required" })}
                  />
                </div>
                {errors.title && <span className="lib-auth-error">{errors.title.message}</span>}
              </div>

              {/* Author */}
              <div className="lib-auth-group">
                <label className="lib-auth-label">Author Name</label>
                <div className="lib-auth-input-wrap">
                  <FiUser className="lib-auth-field-icon" size={17} />
                  <input
                    type="text"
                    className="lib-auth-input"
                    placeholder="e.g. Thomas H. Cormen"
                    {...register("author", { required: "Author is required" })}
                  />
                </div>
                {errors.author && <span className="lib-auth-error">{errors.author.message}</span>}
              </div>
            </div>

            <div className="lib-detail-meta-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {/* Category */}
              <div className="lib-auth-group">
                <label className="lib-auth-label">Academic Category</label>
                <div className="lib-auth-input-wrap">
                  <FiTag className="lib-auth-field-icon" size={17} />
                  <select
                    className="lib-auth-input"
                    {...register("category", { required: "Category is required" })}
                  >
                    <option value="">Select Category</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Literature">Literature</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="History">History</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-fiction">Non-fiction</option>
                  </select>
                </div>
                {errors.category && <span className="lib-auth-error">{errors.category.message}</span>}
              </div>

              {/* ISBN */}
              <div className="lib-auth-group">
                <label className="lib-auth-label">ISBN / Catalog Code</label>
                <div className="lib-auth-input-wrap">
                  <FiHash className="lib-auth-field-icon" size={17} />
                  <input
                    type="text"
                    className="lib-auth-input"
                    placeholder="e.g. 978-0262033848"
                    {...register("isbn", { required: "ISBN is required" })}
                  />
                </div>
                {errors.isbn && <span className="lib-auth-error">{errors.isbn.message}</span>}
              </div>
            </div>

            <div className="lib-detail-meta-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {/* Copies */}
              <div className="lib-auth-group">
                <label className="lib-auth-label">Total Inventory Copies</label>
                <div className="lib-auth-input-wrap">
                  <FiLayers className="lib-auth-field-icon" size={17} />
                  <input
                    type="number"
                    min="1"
                    className="lib-auth-input"
                    placeholder="e.g. 10"
                    {...register("totalCopies", { required: "Total copies is required", min: 1 })}
                  />
                </div>
                {errors.totalCopies && <span className="lib-auth-error">{errors.totalCopies.message}</span>}
              </div>

              {/* Price */}
              <div className="lib-auth-group">
                <label className="lib-auth-label">Estimated Replacement Price (₹)</label>
                <div className="lib-auth-input-wrap">
                  <FiDollarSign className="lib-auth-field-icon" size={17} />
                  <input
                    type="number"
                    step="0.01"
                    className="lib-auth-input"
                    placeholder="e.g. 599.00"
                    {...register("price", { required: "Price is required" })}
                  />
                </div>
                {errors.price && <span className="lib-auth-error">{errors.price.message}</span>}
              </div>
            </div>

            {/* Cover Image */}
            <div className="lib-auth-group">
              <label className="lib-auth-label">Cover Image File</label>
              <div className="lib-auth-input-wrap">
                <FiImage className="lib-auth-field-icon" size={17} />
                <input
                  type="file"
                  accept="image/*"
                  className="lib-auth-input"
                  {...register("coverImage")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="lib-auth-group">
              <label className="lib-auth-label">Book Synopsis &amp; Details</label>
              <textarea
                className="lib-auth-input"
                rows="4"
                style={{ padding: "0.85rem 1rem" }}
                placeholder="Enter a comprehensive overview of the book..."
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <span className="lib-auth-error">{errors.description.message}</span>}
            </div>

            <button
              type="submit"
              className="lib-btn lib-btn-primary lib-auth-submit"
              disabled={loading}
              style={{ marginTop: "1rem" }}
            >
              {loading ? "Adding to Catalog..." : (
                <>
                  <FiPlusCircle size={17} /> Add Book to Library Inventory
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookForm;

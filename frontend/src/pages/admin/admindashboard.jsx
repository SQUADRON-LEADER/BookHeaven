import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Server_URL } from "../../utils/config";
import "./AdminDashboard.css";
import {
  FiGrid, FiUsers, FiBook, FiBookOpen, FiActivity,
  FiLayers, FiShield, FiTrendingUp, FiCheckCircle
} from "react-icons/fi";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [user, setUser] = useState([]);
  const [lib, setLib] = useState([]);
  const [books, setBooks] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [totalLib, setTotalLib] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [occupancyPercent, setOccupancyPercent] = useState(0);
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#c9973a",
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ec4899",
        ],
        borderColor: "#111827",
        borderWidth: 2,
      },
    ],
  });

  const role = localStorage.getItem("role");

  async function getUsers() {
    try {
      const url = Server_URL + "users";
      const result = await axios.get(url);
      const { error } = result.data;
      if (!error) {
        const { user } = result.data;
        const studentList = (user || []).filter((u) => u.role === "user");
        const librarianList = (user || []).filter((u) => u.role === "librarian");
        setUser(studentList);
        setLib(librarianList);
        setTotalUser(studentList.length);
        setTotalLib(librarianList.length);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function getBooks() {
    try {
      const url = Server_URL + "books";
      const result = await axios.get(url);
      const { error } = result.data;
      if (!error) {
        const { books, totalBooks } = result.data;
        const bookList = books || [];
        setBooks(bookList);
        setTotalBooks(totalBooks || bookList.length);

        const categoryCount = bookList.reduce((acc, book) => {
          if (book.category) {
            acc[book.category] = (acc[book.category] || 0) + 1;
          }
          return acc;
        }, {});

        const labels = Object.keys(categoryCount);
        const data = Object.values(categoryCount);
        setCategoryData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                "#c9973a",
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
                "#ec4899",
              ],
              borderColor: "#111827",
              borderWidth: 2,
            },
          ],
        });

        const borrowed = bookList.reduce((acc, book) => {
          return acc + (Math.max(0, (book.totalCopies || 0) - (book.availableCopies || 0)));
        }, 0);
        setBorrowedBooks(borrowed);

        const total = bookList.reduce((acc, book) => acc + (book.totalCopies || 0), 0);
        const occupancy = total ? Math.round((borrowed / total) * 100) : 0;
        setOccupancyPercent(occupancy);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  async function getLatestBooks() {
    try {
      const url = Server_URL + "books/new";
      const result = await axios.get(url);
      const { error, books } = result.data;
      if (!error && books) {
        setLatestBooks(books);
      }
    } catch (error) {
      console.error("Error fetching latest books:", error);
    }
  }

  useEffect(() => {
    getUsers();
    getBooks();
    getLatestBooks();
  }, []);

  return (
    <div className="lib-admin-dash">
      <div className="lib-admin-dash__container">
        {/* Sidebar */}
        <aside className="lib-admin-dash__sidebar">
          <div className="lib-admin-dash__sidebar-header">
            <FiShield className="lib-admin-dash__sidebar-icon" size={20} />
            <h4>{role === "admin" ? "Admin Control" : "Librarian Suite"}</h4>
          </div>
          <ul className="lib-admin-dash__nav">
            <li>
              <button
                className={`lib-admin-dash__nav-btn ${
                  selectedSection === "dashboard" ? "lib-admin-dash__nav-btn--active" : ""
                }`}
                onClick={() => setSelectedSection("dashboard")}
              >
                <FiGrid size={16} /> Dashboard
              </button>
            </li>
            <li>
              <button
                className={`lib-admin-dash__nav-btn ${
                  selectedSection === "users" ? "lib-admin-dash__nav-btn--active" : ""
                }`}
                onClick={() => setSelectedSection("users")}
              >
                <FiUsers size={16} /> Students ({totalUser})
              </button>
            </li>
            {role === "admin" && (
              <li>
                <button
                  className={`lib-admin-dash__nav-btn ${
                    selectedSection === "librarians" ? "lib-admin-dash__nav-btn--active" : ""
                  }`}
                  onClick={() => setSelectedSection("librarians")}
                >
                  <FiShield size={16} /> Librarians ({totalLib})
                </button>
              </li>
            )}
            <li>
              <button
                className={`lib-admin-dash__nav-btn ${
                  selectedSection === "books" ? "lib-admin-dash__nav-btn--active" : ""
                }`}
                onClick={() => setSelectedSection("books")}
              >
                <FiBook size={16} /> Books Inventory ({totalBooks})
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="lib-admin-dash__main">
          {selectedSection === "dashboard" && (
            <>
              <div className="lib-admin-dash__section-header">
                <div>
                  <span className="lib-section__eyebrow">Analytics &amp; Status</span>
                  <h1 className="lib-admin-dash__section-title">Operations Dashboard</h1>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="lib-admin-stats-grid">
                <div className="lib-admin-stat-card">
                  <div className="lib-admin-stat-icon lib-admin-stat-icon--gold">
                    <FiBook size={24} />
                  </div>
                  <div className="lib-admin-stat-content">
                    <span className="lib-admin-stat-lbl">Catalog Volumes</span>
                    <h3 className="lib-admin-stat-val">{totalBooks}</h3>
                  </div>
                </div>

                <div className="lib-admin-stat-card">
                  <div className="lib-admin-stat-icon lib-admin-stat-icon--blue">
                    <FiUsers size={24} />
                  </div>
                  <div className="lib-admin-stat-content">
                    <span className="lib-admin-stat-lbl">Registered Patrons</span>
                    <h3 className="lib-admin-stat-val">{totalUser}</h3>
                  </div>
                </div>

                {role === "admin" && (
                  <div className="lib-admin-stat-card">
                    <div className="lib-admin-stat-icon lib-admin-stat-icon--purple">
                      <FiShield size={24} />
                    </div>
                    <div className="lib-admin-stat-content">
                      <span className="lib-admin-stat-lbl">Library Staff</span>
                      <h3 className="lib-admin-stat-val">{totalLib}</h3>
                    </div>
                  </div>
                )}

                <div className="lib-admin-stat-card">
                  <div className="lib-admin-stat-icon lib-admin-stat-icon--green">
                    <FiBookOpen size={24} />
                  </div>
                  <div className="lib-admin-stat-content">
                    <span className="lib-admin-stat-lbl">Currently Borrowed</span>
                    <h3 className="lib-admin-stat-val">{borrowedBooks}</h3>
                  </div>
                </div>
              </div>

              {/* Progress & Utilization */}
              <div className="lib-admin-progress-card">
                <div className="lib-admin-progress-header">
                  <div>
                    <h3>Circulation Utilization</h3>
                    <p>Percentage of total catalog inventory currently in circulation</p>
                  </div>
                  <span className="lib-admin-progress-badge">{occupancyPercent}% Active</span>
                </div>
                <div className="lib-admin-progress-track">
                  <div
                    className="lib-admin-progress-fill"
                    style={{ width: `${Math.min(100, Math.max(0, occupancyPercent))}%` }}
                  />
                </div>
              </div>

              {/* Chart & Activity */}
              <div className="lib-admin-grid-two">
                {/* Category Chart */}
                <div className="lib-admin-card">
                  <div className="lib-admin-card-header">
                    <FiLayers size={18} />
                    <h3>Category Breakdown</h3>
                  </div>
                  <div className="lib-admin-chart-box">
                    <Pie
                      data={categoryData}
                      options={{
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              color: "#9ca3af",
                              padding: 16,
                              font: { family: "Inter", size: 12 },
                            },
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>

                {/* Recent Additions */}
                <div className="lib-admin-card">
                  <div className="lib-admin-card-header">
                    <FiActivity size={18} />
                    <h3>Recent Catalog Additions</h3>
                  </div>
                  <div className="lib-admin-activity-list">
                    {latestBooks.length === 0 ? (
                      <p className="lib-admin-empty-text">No recent book records.</p>
                    ) : (
                      latestBooks.slice(0, 5).map((book, index) => (
                        <div key={index} className="lib-admin-activity-item">
                          <div className="lib-admin-activity-icon">
                            <FiBook size={15} />
                          </div>
                          <div className="lib-admin-activity-body">
                            <strong>{book.title}</strong>
                            <p>
                              Added by {book.addedBy?.name || "Librarian"} &bull; {book.category || "General"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Students Section */}
          {selectedSection === "users" && (
            <>
              <div className="lib-admin-dash__section-header">
                <div>
                  <span className="lib-section__eyebrow">Directory</span>
                  <h1 className="lib-admin-dash__section-title">Registered Students</h1>
                </div>
              </div>
              <div className="lib-admin-card">
                <div className="lib-table-responsive">
                  <table className="lib-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Stream / Dept</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="lib-table-title">{data.name}</td>
                          <td>{data.email}</td>
                          <td>{data.stream || "General"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Librarians Section */}
          {selectedSection === "librarians" && (
            <>
              <div className="lib-admin-dash__section-header">
                <div>
                  <span className="lib-section__eyebrow">Staff Credentials</span>
                  <h1 className="lib-admin-dash__section-title">Librarians &amp; Managers</h1>
                </div>
              </div>
              <div className="lib-admin-card">
                <div className="lib-table-responsive">
                  <table className="lib-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Staff Name</th>
                        <th>Staff Email</th>
                        <th>Assigned Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lib.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="lib-table-title">{data.name}</td>
                          <td>{data.email}</td>
                          <td>
                            <span className="lib-badge lib-badge--issued">{data.role}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Books Inventory Section */}
          {selectedSection === "books" && (
            <>
              <div className="lib-admin-dash__section-header">
                <div>
                  <span className="lib-section__eyebrow">Catalog Records</span>
                  <h1 className="lib-admin-dash__section-title">Inventory Overview</h1>
                </div>
              </div>
              <div className="lib-admin-card">
                <div className="lib-table-responsive">
                  <table className="lib-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Volume Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Total Stock</th>
                        <th>Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="lib-table-title">{data.title}</td>
                          <td>{data.author}</td>
                          <td>{data.category}</td>
                          <td>{data.totalCopies}</td>
                          <td>
                            <span
                              className={`lib-badge ${
                                data.availableCopies > 0
                                  ? "lib-badge--issued"
                                  : "lib-badge--return-req"
                              }`}
                            >
                              {data.availableCopies} in stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

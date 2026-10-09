import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LibraryProvider } from "./context/LibraryContext";
import AcademicNavbar from "./components/AcademicNavbar";
import NotificationBanner from "./components/NotificationBanner";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import IssueReturn from "./pages/IssueReturn";
import Transactions from "./pages/Transactions";
import TestingReport from "./pages/TestingReport";
import Login from "./pages/Login";

function AppLayout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-container">
      {/* Ambient Background Video */}
      <div className="video-background-wrapper">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          src="/1.mp4"
        />
        <div className="video-overlay" />
      </div>

      {!isLoginPage && <AcademicNavbar />}
      <NotificationBanner />
      <main className="main-content">{children}</main>
      <footer className="academic-footer">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1280px", margin: "0 auto" }}>
          <span>
            <strong>BOOKHAVEN</strong> &bull; Central Academic Library Management System &bull; Academic Year 2026
          </span>
          <a
            href="/testing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              color: "var(--green-primary)",
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            QA Test Execution Suite &amp; Manual Report (Sec. 6-14) &rarr;
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/circulation" element={<IssueReturn />} />
          <Route path="/history" element={<Transactions />} />
          <Route path="/testing" element={<TestingReport />} />
          <Route path="/test-guide" element={<TestingReport />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </LibraryProvider>
  );
}
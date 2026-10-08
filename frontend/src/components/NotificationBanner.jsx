import React from "react";
import { useLibrary } from "../context/LibraryContext";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

export default function NotificationBanner() {
  const { notification, clearNotification } = useLibrary();

  if (!notification) return null;

  const getAlertClass = () => {
    switch (notification.type) {
      case "danger":
        return "academic-alert-danger";
      case "info":
        return "academic-alert-info";
      case "success":
      default:
        return "academic-alert-success";
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "danger":
        return <FiAlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />;
      case "info":
        return <FiInfo size={18} style={{ flexShrink: 0, marginTop: "1px" }} />;
      case "success":
      default:
        return <FiCheckCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />;
    }
  };

  return (
    <div
      className={`academic-alert ${getAlertClass()}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "16px auto 0",
        maxWidth: "1280px",
        width: "calc(100% - 40px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {getIcon()}
        <span style={{ fontWeight: "500" }}>{notification.message}</span>
      </div>
      <button
        onClick={clearNotification}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          padding: "2px",
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Dismiss message"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}

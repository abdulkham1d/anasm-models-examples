// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Lab from "./pages/Lab.jsx";
import Cardboard from "./pages/Cardboard.jsx";
import ContentPage from "./pages/ContentPage.jsx";

// Bu kichkina wrapper bizga xatolarni sahifada ko'rsatadi
function SafePage({ children, label }) {
  try {
    return children;
  } catch (err) {
    console.error("Render error in", label, err);
    return (
      <div
        style={{
          background: "#220000",
          color: "#ff8080",
          fontFamily: "monospace",
          padding: "16px",
          minHeight: "100vh",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
          CRASH in {label}
        </div>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "12px",
            lineHeight: "1.4",
          }}
        >
          {String(err?.message || err)}
        </pre>
      </div>
    );
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <SpeedInsights />
      <Routes>
        <Route
          path="/"
          element={
            <SafePage label="Lab">
              <Lab />
            </SafePage>
          }
        />
        <Route
          path="/lab/:organId/:partName/:section/:subItem"
          element={
            <SafePage label="ContentPage">
              <ContentPage />
            </SafePage>
          }
        />
        <Route
          path="/cardboard"
          element={
            <SafePage label="Cardboard">
              <Cardboard />
            </SafePage>
          }
        />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
}

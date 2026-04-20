// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { injectSpeedInsights } from "@vercel/speed-insights";
import App from "./App.jsx";
import "./styles/app.css";

injectSpeedInsights();

const container = document.getElementById("root");

if (!container) {
  // favfallback, just in case
  const fallback = document.createElement("div");
  fallback.style.cssText = `
    background:#1a1a1a;
    color:#fff;
    font-family:monospace;
    padding:16px;
  `;
  fallback.innerText = "ERROR: no #root element in index.html";
  document.body.appendChild(fallback);
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

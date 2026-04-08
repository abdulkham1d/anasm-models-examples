// src/components/ui/content/ContentTest.jsx
import React from "react";

export default function ContentTest({ partName, section }) {
  return (
    <div className="cp cp-test">
      <div className="cp-test-card">
        <div className="cp-test-q">
          <span className="cp-test-num">1</span>
          <span className="cp-test-text">Savol matni shu yerda bo'ladi...</span>
        </div>
        <div className="cp-test-options">
          <div className="cp-test-opt">
            <span className="cp-test-letter">A</span>
            <span className="cp-test-line" />
          </div>
          <div className="cp-test-opt">
            <span className="cp-test-letter">B</span>
            <span className="cp-test-line" />
          </div>
          <div className="cp-test-opt">
            <span className="cp-test-letter">C</span>
            <span className="cp-test-line" />
          </div>
          <div className="cp-test-opt">
            <span className="cp-test-letter">D</span>
            <span className="cp-test-line" />
          </div>
        </div>
      </div>
      <div className="cp-title">Test Sinovi</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">Bilimingizni sinab ko'ring</div>
      <div className="cp-badge">Tayyorlanmoqda</div>
    </div>
  );
}

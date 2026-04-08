// src/components/ui/content/ContentQuiz.jsx
import React from "react";

export default function ContentQuiz({ partName, section }) {
  return (
    <div className="cp cp-quiz">
      <div className="cp-quiz-board">
        <div className="cp-quiz-top">
          <div className="cp-quiz-timer">
            <span className="cp-quiz-clock">&#x23F1;</span>
            <span>15:00</span>
          </div>
          <div className="cp-quiz-score">0 / 30</div>
        </div>
        <div className="cp-quiz-variants">
          <div className="cp-quiz-row">
            <span className="cp-quiz-num">1</span>
            <span className="cp-quiz-dots">
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
            </span>
          </div>
          <div className="cp-quiz-row">
            <span className="cp-quiz-num">2</span>
            <span className="cp-quiz-dots">
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
            </span>
          </div>
          <div className="cp-quiz-row">
            <span className="cp-quiz-num">3</span>
            <span className="cp-quiz-dots">
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
              <span className="cp-quiz-dot" />
            </span>
          </div>
        </div>
      </div>
      <div className="cp-title">Variantli Masala</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">30 ta savol, 15 daqiqa vaqt</div>
      <div className="cp-badge">Tayyorlanmoqda</div>
    </div>
  );
}

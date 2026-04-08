// src/components/ui/content/ContentFacts.jsx
import React from "react";

export default function ContentFacts({ partName, section }) {
  return (
    <div className="cp cp-facts">
      <div className="cp-facts-cards">
        <div className="cp-facts-card">
          <div className="cp-facts-bulb">&#x1F4A1;</div>
          <div className="cp-facts-text">
            Bilasizmi? Odam tanasida 206 ta suyak mavjud...
          </div>
        </div>
        <div className="cp-facts-card">
          <div className="cp-facts-bulb">&#x2728;</div>
          <div className="cp-facts-text">
            Yurak kuniga 100 000 marta uradi...
          </div>
        </div>
        <div className="cp-facts-card cp-facts-more">
          <span>+10 ta fakt</span>
        </div>
      </div>
      <div className="cp-title">Qiziqarli Ma'lumotlar</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">Anatomiya haqida hayratlanarli faktlar</div>
      <div className="cp-badge">Tayyorlanmoqda</div>
    </div>
  );
}

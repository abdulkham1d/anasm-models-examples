// src/components/ui/content/ContentSlayd.jsx
import React from "react";

export default function ContentSlayd({ partName, section }) {
  return (
    <div className="cp cp-slayd">
      <div className="cp-slayd-deck">
        <div className="cp-slayd-slide cp-slayd-bg">
          <div className="cp-slayd-line w60" />
          <div className="cp-slayd-line w40" />
        </div>
        <div className="cp-slayd-slide cp-slayd-mid">
          <div className="cp-slayd-line w80" />
          <div className="cp-slayd-line w50" />
        </div>
        <div className="cp-slayd-slide cp-slayd-front">
          <div className="cp-slayd-icon">S</div>
          <div className="cp-slayd-line w70" />
          <div className="cp-slayd-line w40" />
        </div>
      </div>
      <div className="cp-slayd-dots">
        <span className="active" /><span /><span /><span /><span />
      </div>
      <div className="cp-title">Slayd Taqdimot</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">Rasmli va sxemali ma'ruza slaydlari</div>
      <div className="cp-badge">Tayyorlanmoqda</div>
    </div>
  );
}

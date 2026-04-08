// src/components/ui/content/Content3D.jsx
import React from "react";

export default function Content3D({ partName, section }) {
  return (
    <div className="cp cp-3d">
      <div className="cp-3d-viewport">
        <div className="cp-3d-cube">
          <div className="cp-3d-face cp-3d-front">3D</div>
          <div className="cp-3d-face cp-3d-back" />
          <div className="cp-3d-face cp-3d-left" />
          <div className="cp-3d-face cp-3d-right" />
        </div>
        <div className="cp-3d-ring" />
      </div>
      <div className="cp-title">3D Model</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">Interaktiv 3D model tez kunda yuklanadi</div>
      <div className="cp-badge">Tayyorlanmoqda</div>
    </div>
  );
}

// src/components/ui/content/ContentVR.jsx
import React from "react";

export default function ContentVR({ partName, section }) {
  return (
    <div className="cp cp-vr">
      <div className="cp-vr-headset">
        <div className="cp-vr-lens" />
        <div className="cp-vr-lens" />
      </div>
      <div className="cp-vr-waves">
        <span /><span /><span />
      </div>
      <div className="cp-title">VR / AR Tajriba</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">Virtual va Kengaytirilgan Reallik orqali o'rganing</div>
      <div className="cp-badge cp-badge-vr">Tez kunda ishga tushadi</div>
    </div>
  );
}

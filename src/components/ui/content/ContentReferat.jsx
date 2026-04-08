// src/components/ui/content/ContentReferat.jsx
import React from "react";

export default function ContentReferat({ partName, section }) {
  return (
    <div className="cp cp-referat">
      <div className="cp-referat-doc">
        <div className="cp-referat-header">
          <div className="cp-referat-line w60 center" />
          <div className="cp-referat-line w40 center dim" />
        </div>
        <div className="cp-referat-body">
          <div className="cp-referat-line w100" />
          <div className="cp-referat-line w90" />
          <div className="cp-referat-line w80" />
          <div className="cp-referat-line w100" />
          <div className="cp-referat-line w70" />
        </div>
        <div className="cp-referat-footer">
          <div className="cp-referat-page">1 / 12</div>
        </div>
      </div>
      <div className="cp-title">Referat</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">Ilmiy maqola va referatlar to'plami</div>
      <div className="cp-badge">Tayyorlanmoqda</div>
    </div>
  );
}

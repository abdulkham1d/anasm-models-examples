// src/components/ui/content/ContentVideo.jsx
import React from "react";

export default function ContentVideo({ partName, section }) {
  return (
    <div className="cp cp-video">
      <div className="cp-video-player">
        <div className="cp-video-screen">
          <div className="cp-video-play">&#9654;</div>
        </div>
        <div className="cp-video-controls">
          <div className="cp-video-bar">
            <div className="cp-video-progress" />
          </div>
          <div className="cp-video-time">0:00 / --:--</div>
        </div>
      </div>
      <div className="cp-title">Video Darslik</div>
      <div className="cp-desc">{partName} &mdash; {section}</div>
      <div className="cp-hint">Professional o'qituvchilar tomonidan tayyorlangan</div>
      <div className="cp-badge">Tayyorlanmoqda</div>
    </div>
  );
}

// src/pages/ContentPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findOrgan } from "../data/organs.ts";
import { SECTION_LABELS, SUB_ITEM_LABELS } from "../data/sections.ts";
import Content3D from "../components/ui/content/Content3D.jsx";
import ContentVR from "../components/ui/content/ContentVR.jsx";
import ContentVideo from "../components/ui/content/ContentVideo.jsx";
import ContentSlayd from "../components/ui/content/ContentSlayd.jsx";
import ContentTest from "../components/ui/content/ContentTest.jsx";
import ContentFacts from "../components/ui/content/ContentFacts.jsx";
import ContentReferat from "../components/ui/content/ContentReferat.jsx";
import ContentQuiz from "../components/ui/content/ContentQuiz.jsx";
import "../styles/app.css";
import "../styles/content-pages.css";
import "../styles/content-page-layout.css";

const CONTENT_MAP = {
  "3d": Content3D,
  vr_ar: ContentVR,
  video: ContentVideo,
  slayd: ContentSlayd,
  test: ContentTest,
  facts: ContentFacts,
  referat: ContentReferat,
  quiz: ContentQuiz,
};

export default function ContentPage() {
  const { organId, partName, section, subItem } = useParams();
  const navigate = useNavigate();

  const organ = findOrgan(organId);
  const decodedPart = decodeURIComponent(partName || "");
  const sectionLabel = SECTION_LABELS[section] || section;
  const subItemLabel = SUB_ITEM_LABELS[subItem] || subItem;
  const ContentComponent = CONTENT_MAP[subItem];

  if (!ContentComponent) {
    return (
      <div className="cpage">
        <div className="cpage-empty">
          <div className="cpage-empty-title">Sahifa topilmadi</div>
          <button className="cpage-back-btn" onClick={() => navigate(`/?organ=${organId || ""}`)}>
            &#8592; Ortga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cpage">
      {/* Header */}
      <header className="cpage-header">
        <button
          className="cpage-back-btn"
          onClick={() => navigate(`/?organ=${organId || ""}`)}
        >
          &#8592; Ortga
        </button>
        <nav className="cpage-breadcrumb">
          <span className="cpage-crumb">{organ?.title || organId}</span>
          <span className="cpage-sep">/</span>
          <span className="cpage-crumb">{decodedPart}</span>
          <span className="cpage-sep">/</span>
          <span className="cpage-crumb">{sectionLabel}</span>
          <span className="cpage-sep">/</span>
          <span className="cpage-crumb cpage-crumb-active">{subItemLabel}</span>
        </nav>
      </header>

      {/* Content */}
      <main className="cpage-body">
        <div className="cpage-content">
          <ContentComponent partName={decodedPart} section={sectionLabel} />
        </div>
      </main>

      {/* Footer */}
      <footer className="cpage-footer">
        <span>AnaSM&bull; {organ?.title} &bull; {decodedPart} &bull; {sectionLabel} &bull; {subItemLabel}</span>
      </footer>
    </div>
  );
}

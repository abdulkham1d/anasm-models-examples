// src/components/ui/AnatomyPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { SECTIONS, SUB_ITEMS } from "../../data/sections.ts";
import { projectToScreen } from "../../lib/projectToScreen.js";

const CARD_WIDTH = 220;
const OFFSET_X = 16;
const OFFSET_Y = -40;

export default function AnatomyPanel({ state, dispatch, cameraInfo, organId }) {
  const navigate = useNavigate();
  const overlayRef = React.useRef(null);
  const { selection, level, activeSection } = state;

  if (!selection || level === "closed") return null;

  const partName = selection.name || "Noma'lum qism";
  const sectionObj = SECTIONS.find((s) => s.key === activeSection);
  const sectionLabel = sectionObj?.label || "";

  // Project 3D click point to 2D screen position
  let cardStyle = {};
  if (selection.clickPoint && cameraInfo?.current) {
    const { camera, getSize } = cameraInfo.current;
    const size = getSize();
    const pos = projectToScreen(selection.clickPoint, camera, size);

    let left = pos.x + OFFSET_X;
    let top = pos.y + OFFSET_Y;

    const containerW = size.width;
    const containerH = size.height;
    const cardW = Math.min(CARD_WIDTH, containerW * 0.9);

    // flip to left if no room on right
    if (left + cardW > containerW - 12) {
      left = pos.x - cardW - OFFSET_X;
    }
    if (left < 12) left = 12;
    if (top < 12) top = 12;
    if (top > containerH - 200) top = containerH - 200;

    cardStyle = {
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: `${cardW}px`,
    };
  }

  const handleSubItemClick = (subKey) => {
    const encodedPart = encodeURIComponent(partName);
    navigate(`/lab/${organId}/${encodedPart}/${activeSection}/${subKey}`);
  };

  return (
    <div
      className={`acard-overlay ${cardStyle.position ? "acard-overlay-transparent" : ""}`}
      ref={overlayRef}
      onClick={() => dispatch({ type: "CLOSE" })}
    >
      <div className="acard" style={cardStyle} onClick={(e) => e.stopPropagation()}>
        {/* Glow top line */}
        <div className="acard-glow" />

        {/* Header */}
        <div className="acard-header">
          <div className="acard-header-left">
            {level !== "sections" && (
              <button
                className="acard-nav-btn"
                onClick={() => dispatch({ type: "GO_BACK" })}
              >
                &#8592;
              </button>
            )}
            <div className="acard-header-info">
              <div className="acard-title">
                {level === "sections" && partName}
                {level === "subitems" && sectionLabel}
              </div>
              {level === "subitems" && (
                <div className="acard-breadcrumb">
                  {partName} / {sectionLabel}
                </div>
              )}
            </div>
          </div>
          <button
            className="acard-nav-btn acard-close"
            onClick={() => dispatch({ type: "CLOSE" })}
          >
            &#10005;
          </button>
        </div>

        {/* Level 1: Sections */}
        {level === "sections" && (
          <div className="acard-body">
            <div className="acard-grid acard-grid-2">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.key}
                  className="acard-tile"
                  onClick={() => dispatch({ type: "OPEN_SECTION", payload: sec.key })}
                >
                  <span className="acard-tile-icon">{sec.icon}</span>
                  <span className="acard-tile-label">{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level 2: Sub-items → navigate to page */}
        {level === "subitems" && (
          <div className="acard-body">
            <div className="acard-grid acard-grid-4">
              {SUB_ITEMS.map((sub) => (
                <button
                  key={sub.key}
                  className="acard-tile acard-tile-sm"
                  onClick={() => handleSubItemClick(sub.key)}
                >
                  <span className="acard-tile-icon">{sub.icon}</span>
                  <span className="acard-tile-label">{sub.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

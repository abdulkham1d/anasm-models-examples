// src/components/sidebar/InfoSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { SECTIONS, SUB_ITEMS } from "../../data/sections.ts";

export default function InfoSidebar({ state, dispatch, organId }) {
  const navigate = useNavigate();
  const { selection, level, activeSection } = state;

  const sectionObj = SECTIONS.find((s) => s.key === activeSection);
  const sectionLabel = sectionObj?.label || "";
  const partName = selection?.name || "";

  const handleSubItemClick = (subKey) => {
    const encoded = encodeURIComponent(partName);
    navigate(`/lab/${organId}/${encoded}/${activeSection}/${subKey}`);
  };

  return (
    <aside className="info-sidebar">
      {/* Header */}
      <div className="isb-header">
        <div className="isb-header-title">Ma'lumot paneli</div>
      </div>

      {/* No selection state */}
      {!selection && (
        <div className="isb-empty">
          <div className="isb-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="isb-empty-text">
            3D modelning biror qismiga bosing
          </div>
          <div className="isb-empty-hint">
            Tanlangan a'zo haqida batafsil ma'lumot shu yerda ko'rinadi
          </div>
        </div>
      )}

      {/* Selection active */}
      {selection && (
        <div className="isb-content">
          {/* Part info card */}
          <div className="isb-part-card">
            <div className="isb-part-name">{partName}</div>
            {selection.info && (
              <div className="isb-part-desc">{selection.info}</div>
            )}
          </div>

          {/* Breadcrumb / back */}
          {level === "subitems" && (
            <button
              className="isb-back-btn"
              onClick={() => dispatch({ type: "GO_BACK" })}
            >
              <span className="isb-back-arrow">&larr;</span>
              <span>{partName} / {sectionLabel}</span>
            </button>
          )}

          {/* Section grid (level 1) */}
          {level === "sections" && (
            <>
              <div className="isb-section-label">Bo'limni tanlang</div>
              <div className="isb-grid isb-grid-2">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.key}
                    className="isb-tile"
                    onClick={() =>
                      dispatch({ type: "OPEN_SECTION", payload: sec.key })
                    }
                  >
                    <span className="isb-tile-icon">{sec.icon}</span>
                    <span className="isb-tile-label">{sec.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Sub-item grid (level 2) */}
          {level === "subitems" && (
            <>
              <div className="isb-section-label">{sectionLabel}</div>
              <div className="isb-grid isb-grid-2">
                {SUB_ITEMS.map((sub) => (
                  <button
                    key={sub.key}
                    className="isb-tile isb-tile-sm"
                    onClick={() => handleSubItemClick(sub.key)}
                  >
                    <span className="isb-tile-icon">{sub.icon}</span>
                    <span className="isb-tile-label">{sub.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Deselect button */}
          <button
            className="isb-deselect"
            onClick={() => dispatch({ type: "CLOSE" })}
          >
            Tanlovni bekor qilish
          </button>
        </div>
      )}
    </aside>
  );
}

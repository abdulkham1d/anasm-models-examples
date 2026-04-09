// src/pages/Lab.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ORGANS, findOrgan } from "../data/organs.ts";
import ViewerSwitch from "../components/viewer/ViewerSwitch.jsx";
import LazyMount from "../components/viewer/LazyMount.jsx";
import AnatomyPanel from "../components/ui/AnatomyPanel.jsx";
import InfoSidebar from "../components/sidebar/InfoSidebar.jsx";
import "../styles/app.css";
import "../styles/content-pages.css";

const STORAGE_KEY = "anasm_3d_unlocked";

const initialPanel = {
  selection: null,
  level: "closed",
  activeSection: null,
  activeSubItem: null,
};

function panelReducer(state, action) {
  switch (action.type) {
    case "SELECT_PART":
      return { selection: action.payload, level: "sections", activeSection: null, activeSubItem: null };
    case "OPEN_SECTION":
      return { ...state, level: "subitems", activeSection: action.payload };
    case "GO_BACK":
      if (state.level === "subitems") return { ...state, level: "sections", activeSection: null };
      return { ...initialPanel };
    case "CLOSE":
      return { ...initialPanel };
    default:
      return state;
  }
}

function wasUnlockedBefore() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function Lab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrgan = searchParams.get("organ") || ORGANS[0]?.id;
  const [currentId, setCurrentId] = React.useState(initialOrgan);
  const currentItem = React.useMemo(() => findOrgan(currentId), [currentId]);
  const [panelState, dispatch] = React.useReducer(panelReducer, initialPanel);

  // One-time gate: first visit shows button, after that goes straight to 3D
  const [unlocked, setUnlocked] = React.useState(wasUnlockedBefore);
  const [fadeIn, setFadeIn] = React.useState(wasUnlockedBefore);

  const cameraInfoRef = React.useRef(null);

  const handleOrganChange = React.useCallback((id) => {
    setCurrentId(id);
    setSearchParams({ organ: id }, { replace: true });
  }, [setSearchParams]);

  React.useEffect(() => {
    dispatch({ type: "CLOSE" });
  }, [currentId]);

  const setSelection = React.useCallback((sel) => {
    if (sel) {
      dispatch({ type: "SELECT_PART", payload: sel });
    } else {
      dispatch({ type: "CLOSE" });
    }
  }, []);

  const handleCameraReady = React.useCallback((info) => {
    cameraInfoRef.current = info;
  }, []);

  const handleUnlock = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch { /* storage full or blocked */ }
    setUnlocked(true);
    // Smooth fade-in after a brief delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFadeIn(true));
    });
  };

  return (
    <div className="landing">
      {/* HEADER */}
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-logo">AnaSM.uz</span>
          <span className="landing-subtitle">O'zbek tilidagi odam anatomiyasi</span>
        </div>
      </header>

      {/* BANNER */}
      <section className="banner-section">
        <div className="banner-container">
          <img
            className="banner-gif"
            src="/banner.gif"
            alt="AnaSM 3D Anatomy"
            loading="lazy"
          />
        </div>
      </section>

      {/* CATALOG */}
      <nav className="catalog">
        <div className="catalog-title">CATALOG</div>
        <div className="catalog-items">
          {ORGANS.map((organ) => (
            <button
              key={organ.id}
              className={`catalog-card ${currentId === organ.id ? "active" : ""}`}
              onClick={() => handleOrganChange(organ.id)}
            >
              <span className="catalog-label">{organ.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN: VIEWER + SIDEBAR */}
      <main className="landing-main">
        <div className="landing-viewer">
          <div className="viewer-box">
            {!unlocked ? (
              /* ---- WELCOME GATE (first visit only) ---- */
              <div className="welcome-gate">
                <div className="welcome-content">
                  <div className="welcome-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <h2 className="welcome-title">3D Anatomiya</h2>
                  <p className="welcome-desc">
                    Interaktiv 3D modellarni yuklash uchun tugmani bosing.
                    <br />
                    Keyingi tashrif avtomatik yuklanadi.
                  </p>
                  <button className="welcome-btn" onClick={handleUnlock}>
                    3D modellarni yuklash
                  </button>
                </div>
              </div>
            ) : (
              /* ---- 3D VIEWER ---- */
              <div className={`viewer-inner ${fadeIn ? "viewer-visible" : "viewer-loading"}`}>
                <LazyMount>
                  <ViewerSwitch
                    key={currentItem ? currentItem.id : "none"}
                    item={currentItem}
                    selection={panelState.selection}
                    setSelection={setSelection}
                    onCameraReady={handleCameraReady}
                  />
                </LazyMount>
                <AnatomyPanel
                  state={panelState}
                  dispatch={dispatch}
                  cameraInfo={cameraInfoRef}
                  organId={currentId}
                />
              </div>
            )}
          </div>
        </div>

        <InfoSidebar
          state={panelState}
          dispatch={dispatch}
          organId={currentId}
        />
      </main>

      {/* FOOTER */}
      <footer className="landing-footer">
        <span>Ozbek tilidagi inson tanasi morfologiyasi</span>
      </footer>
    </div>
  );
}

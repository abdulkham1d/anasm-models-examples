// src/pages/Lab.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ORGANS, findOrgan } from "../data/organs.ts";
import ViewerSwitch from "../components/viewer/ViewerSwitch.jsx";
import LazyMount from "../components/viewer/LazyMount.jsx";
import InfoSidebar from "../components/sidebar/InfoSidebar.jsx";
import "../styles/app.css";
import "../styles/content-pages.css";

const YOUTUBE_EMBED =
  "https://www.youtube.com/embed/rq6PJb85C_M?autoplay=1&mute=1&loop=1&playlist=rq6PJb85C_M&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3";

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

export default function Lab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrgan = searchParams.get("organ") || ORGANS[0]?.id;
  const [currentId, setCurrentId] = React.useState(initialOrgan);
  const currentItem = React.useMemo(() => findOrgan(currentId), [currentId]);
  const [panelState, dispatch] = React.useReducer(panelReducer, initialPanel);

  const cameraInfoRef = React.useRef(null);

  const handleOrganChange = React.useCallback((id) => {
    setCurrentId(id);
    setSearchParams({ organ: id }, { replace: true });
  }, [setSearchParams]);

  // catalog almashganda panel yopilsin
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

  return (
    <div className="landing">
      {/* HEADER */}
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-logo">AnaSM.uz</span>
          <span className="landing-subtitle">O'zbek tilidagi odam anatomiyasi</span>
        </div>
      </header>

      {/* YOUTUBE BANNER */}
      <section className="banner-section">
        <div className="banner-container">
          <iframe
            className="banner-iframe"
            src={YOUTUBE_EMBED}
            title="AnaSM promo"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            loading="lazy"
          />
          {/* Transparent overlay blocks all pointer events on the video */}
          <div className="banner-overlay" />
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
            <LazyMount>
              <ViewerSwitch
                key={currentItem ? currentItem.id : "none"}
                item={currentItem}
                selection={panelState.selection}
                setSelection={setSelection}
                onCameraReady={handleCameraReady}
              />
            </LazyMount>
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
        <span>Qismni bosing &bull; Ma'lumot oling &bull; 3D modelni aylantiring</span>
      </footer>
    </div>
  );
}

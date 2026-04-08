// src/pages/Lab.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ORGANS, findOrgan } from "../data/organs.ts";
import ViewerSwitch from "../components/viewer/ViewerSwitch.jsx";
import LazyMount from "../components/viewer/LazyMount.jsx";
import AnatomyPanel from "../components/ui/AnatomyPanel.jsx";
import "../styles/app.css";
import "../styles/content-pages.css";

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

      {/* 3D VIEWER */}
      <main className="landing-viewer">
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
          <AnatomyPanel
            state={panelState}
            dispatch={dispatch}
            cameraInfo={cameraInfoRef}
            organId={currentId}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="landing-footer">
        <span>Qismni bosing &bull; Ma'lumot oling &bull; 3D modelni aylantiring</span>
      </footer>
    </div>
  );
}

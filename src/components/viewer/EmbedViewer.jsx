// src/components/viewer/EmbedViewer.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function EmbedViewer({ src, meta }) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    timerRef.current = setTimeout(
      () => setTimedOut(true),
      8000
    );
    return () => clearTimeout(timerRef.current);
  }, [src]);

  return (
    <div className="canvasWrap" style={{ display: "grid" }}>
      {!loaded && !timedOut && (
        <div
          style={{ placeSelf: "center" }}
          className="tiny muted"
        >
          Loading embed…
        </div>
      )}

      {timedOut && !loaded && (
        <div
          style={{
            placeSelf: "center",
            textAlign: "center",
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 600 }}>
            Embedding is slow
          </div>
          <div className="tiny muted">
            Open the model on its source site:
          </div>
          {meta?.sourceLink && <div className="spacer" />}
          {meta?.sourceLink && (
            <a
              className="btn"
              href={meta.sourceLink}
              target="_blank"
              rel="noreferrer"
            >
              Open Source
            </a>
          )}
        </div>
      )}

      <iframe
        title="Model Embed"
        src={src}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          display:
            timedOut && !loaded ? "none" : "block",
          background: "#0b0f14",
        }}
        onLoad={() => {
          setLoaded(true);
          clearTimeout(timerRef.current);
        }}
        loading="lazy"
      />

      {meta && (
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 16,
            background:
              "rgba(0,0,0,0.35)",
            padding: "6px 10px",
            borderRadius: 10,
            fontSize: "11px",
            lineHeight: 1.3,
            color: "#fff",
          }}
          className="tiny"
        >
          {meta.author && (
            <>
              Author: <b>{meta.author}</b> ·{" "}
            </>
          )}
          {meta.license && (
            <>License: {meta.license}</>
          )}
        </div>
      )}
    </div>
  );
}

EmbedViewer.propTypes = {
  src: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    author: PropTypes.string,
    license: PropTypes.string,
    sourceLink: PropTypes.string,
  }),
};

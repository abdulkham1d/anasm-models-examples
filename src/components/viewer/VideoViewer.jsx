// src/components/viewer/VideoViewer.jsx
import React from "react";
import PropTypes from "prop-types";

export default function VideoViewer({ src, poster }) {
  return (
    <div
      className="canvasWrap"
      style={{
        display: "grid",
        placeItems: "center",
        background: "#000",
      }}
    >
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          backgroundColor: "#000",
        }}
      />
    </div>
  );
}

VideoViewer.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
};

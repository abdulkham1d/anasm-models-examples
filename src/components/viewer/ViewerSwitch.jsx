// src/components/viewer/ViewerSwitch.jsx
import React, { Suspense, lazy, useMemo } from "react";
import PropTypes from "prop-types";

const R3FViewer = lazy(() => import("./R3FViewer.jsx"));
const EmbedViewer = lazy(() => import("./EmbedViewer.jsx"));
const VideoViewer = lazy(() => import("./VideoViewer.jsx"));

export default function ViewerSwitch({ item, selection, setSelection, onCameraReady }) {
  const viewerData = useMemo(() => {
    if (!item) return { kind: "none" };

    if (item.type === "sketchfab" && item.sketchfab?.uid) {
      const params = new URLSearchParams({
        autostart: "1",
        ui_theme: "dark",
        transparent: "1",
        ui_watermark: "0",
        ui_watermark_link: "0",
      });
      const src = `https://sketchfab.com/models/${item.sketchfab.uid}/embed?${params.toString()}`;
      return {
        kind: "sketchfab",
        src,
        meta: {
          author: item.sketchfab.author,
          license: item.sketchfab.license,
          sourceLink: item.sketchfab.modelUrl,
        },
      };
    }

    if (item.type === "video" && item.videoSrc) {
      return {
        kind: "video",
        src: item.videoSrc,
        poster: item.thumb || "",
      };
    }

    const modelPath =
      item.glbSrc || `/model/${item.id}/${item.id}.glb`;

    return {
      kind: "glb",
      modelPath,
      cameraConfig: item.camera || null,
    };
  }, [item]);

  const fallback = (
    <div
      className="canvasWrap"
      style={{
        display: "grid",
        placeItems: "center",
        color: "#9ca3af",
        fontSize: "12px",
      }}
    >
      <div className="tiny muted">Preparing viewer…</div>
    </div>
  );

  if (!item || viewerData.kind === "none") {
    return (
      <div
        className="canvasWrap"
        style={{
          display: "grid",
          placeItems: "center",
          color: "#9ca3af",
          fontSize: "14px",
        }}
      >
        No model selected
      </div>
    );
  }

  return (
    <Suspense fallback={fallback}>
      {viewerData.kind === "glb" && (
        <R3FViewer
          modelPath={viewerData.modelPath}
          cameraConfig={viewerData.cameraConfig}
          selection={selection}
          setSelection={setSelection}
          onCameraReady={onCameraReady}
        />
      )}

      {viewerData.kind === "sketchfab" && (
        <EmbedViewer src={viewerData.src} meta={viewerData.meta} />
      )}

      {viewerData.kind === "video" && (
        <VideoViewer
          src={viewerData.src}
          poster={viewerData.poster}
        />
      )}
    </Suspense>
  );
}

ViewerSwitch.propTypes = {
  item: PropTypes.object,
};

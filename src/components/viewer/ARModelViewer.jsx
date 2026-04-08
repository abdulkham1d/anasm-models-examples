import React, { useEffect, useRef } from "react";

// props: glbSrc? usdzSrc?
export default function ARModelViewer({ glbSrc, usdzSrc, poster }) {
  const ref = useRef(null);

  useEffect(() => {
    // If you want to trigger AR from your global AR button, expose a method:
    ref.current?.activateAR?.(); // (not auto; just demonstrating the API)
  }, []);

  return (
    <div className="canvasWrap">
      <model-viewer
        ref={ref}
        src={glbSrc || undefined}
        ios-src={usdzSrc || undefined}
        alt="3D model"
        ar
        ar-modes="quick-look scene-viewer webxr"
        camera-controls
        poster={poster || undefined}
        style={{width:"100%", height:"100%", background:"#0b0f14"}}
        exposure="1.0"
      ></model-viewer>
    </div>
  );
}

// src/components/viewer/R3FViewer.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import * as THREE from "three";

import ClickableGLB from "./ClickableGLB.jsx";
import { headExists } from "../../lib/glb.js";
import { initThreeLoaders } from "../../lib/three-opt.js";

/* Scene inside Canvas */
function Scene({ modelPath, selection, setSelection, controlsRef, invalidateRef }) {
  return (
    <>
      <PerformanceMonitor />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      {/* lights / bg */}
      <color attach="background" args={[0x0b0f14]} />
      <hemisphereLight intensity={0.6} groundColor={"#10151c"} />
      <directionalLight
        position={[2, 5, 3]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
      />

      <ClickableGLB
        url={modelPath}
        selection={selection}
        setSelection={setSelection}
        fadeOthers={!!selection}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        enableRotate
        enableZoom
        zoomSpeed={0.75}
        onChange={() => invalidateRef.current?.()}
      />

      <Preload all={false} />
    </>
  );
}

Scene.propTypes = {
  modelPath: PropTypes.string.isRequired,
  controlsRef: PropTypes.object,
  invalidateRef: PropTypes.object,
};

/* Outer shell */
export default function R3FViewer({ modelPath, cameraConfig, selection, setSelection, onCameraReady }) {
  const [exists, setExists] = useState(true);
  const [checking, setChecking] = useState(true);

  const canvasDivRef = useRef(null);
  const controlsRef = useRef(null);
  const invalidateRef = useRef(() => {});

  // check modelPath HEAD first
  useEffect(() => {
    let alive = true;
    setChecking(true);
    headExists(modelPath)
      .then((ok) => alive && setExists(ok))
      .finally(() => alive && setChecking(false));
    return () => {
      alive = false;
    };
  }, [modelPath]);

  // Shift+wheel = pan
  useEffect(() => {
    const el = canvasDivRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (!e.shiftKey || !controlsRef.current) return;
      e.preventDefault();

      const controls = controlsRef.current;
      const cam = controls.object;
      const elem = controls.domElement;

      const dx = e.deltaX || 0;
      const dy = e.deltaY || e.deltaZ || 0;

      const offset = cam.position.clone().sub(controls.target);
      let targetDistance = offset.length();
      targetDistance *= Math.tan((cam.fov / 2) * Math.PI / 180);

      const panX = (2 * dx * targetDistance) / elem.clientHeight;
      const panY = (2 * dy * targetDistance) / elem.clientHeight;

      const pan = new THREE.Vector3(-panX, panY, 0).applyMatrix3(
        new THREE.Matrix3().setFromMatrix4(cam.matrix)
      );

      controls.target.add(pan);
      cam.position.add(pan);
      controls.update();
      invalidateRef.current?.();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // invalidate on resize
  useEffect(() => {
    const onResize = () => invalidateRef.current?.();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (checking) {
    return (
      <div
        className="canvasWrap"
        style={{ display: "grid", placeItems: "center" }}
      >
        <div className="tiny muted">Loading model…</div>
      </div>
    );
  }

  if (!exists) {
    return (
      <div
        className="canvasWrap"
        style={{
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <h3 style={{ marginTop: 0 }}>Model not found</h3>
          <p className="tiny muted">
            We couldn't load <code>{modelPath}</code>. Check the path
            under <code>/public</code>.
          </p>
          <div className="spacer" />
          <button
            className="btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={canvasDivRef} className="canvasWrap">
      <Canvas
        frameloop="demand"
        dpr={[1, Math.min(1.75, window.devicePixelRatio || 1)]}
        camera={{
          position: cameraConfig?.position || [0, 0.8, 2.2],
          fov: cameraConfig?.fov || 40,
          near: 0.01,
          far: 50,
        }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl, invalidate, camera }) => {
          invalidateRef.current = invalidate;
          initThreeLoaders(gl);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          requestAnimationFrame(invalidate);
          onCameraReady?.({
            camera,
            getSize: () => ({
              width: gl.domElement.clientWidth,
              height: gl.domElement.clientHeight,
            }),
          });
        }}
      >
        <Scene
          modelPath={modelPath}
          selection={selection}
          setSelection={setSelection}
          controlsRef={controlsRef}
          invalidateRef={invalidateRef}
        />
      </Canvas>
    </div>
  );
}

R3FViewer.propTypes = {
  modelPath: PropTypes.string.isRequired,
};

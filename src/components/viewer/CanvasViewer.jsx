// src/components/viewer/CanvasViewer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * WorldAnchorCard
 * - ekranda absolute div render qiladi
 * - worldPos ni 2D ekran koordinataga proyeksiya qiladi
 * - "Hear (EN)" tugmasi ham shu yerda
 */
function WorldAnchorCard({ camera, anchor, onClose }) {
  const cardRef = useRef(null);
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0, visible: false });

  // har frame’da world -> screen project
  useFrame(() => {
    if (!anchor || !anchor.worldPos || !camera) return;
    const p = anchor.worldPos.clone();
    p.project(camera); // now NDC (-1..1)

    // viewport width/height
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const x = (p.x * 0.5 + 0.5) * vw;
    const y = (-p.y * 0.5 + 0.5) * vh;

    setScreenPos({
      x,
      y,
      visible: p.z < 1, // oldinda bo'lsa
    });
  });

  if (!anchor || !screenPos.visible) return null;

  const title = anchor.part?.name || "Unnamed part";
  const desc =
    anchor.part?.desc ||
    "No metadata provided.\nAdd userData.info in GLB.";

  return (
    <div
      ref={cardRef}
      style={{
        position: "fixed",
        left: screenPos.x + 12,
        top: screenPos.y + 12,
        zIndex: 50,
        background: "rgba(15,23,42,0.95)",
        color: "#fff",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.8),0 2px 4px rgba(0,0,0,0.6)",
        padding: "10px 12px",
        minWidth: "180px",
        maxWidth: "240px",
        fontSize: "12px",
        lineHeight: 1.4,
        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      {/* header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          gap: "8px",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: 1.4,
            color: "#fff",
            wordBreak: "break-word",
          }}
        >
          {title}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            fontSize: "11px",
            lineHeight: 1,
            padding: "2px 4px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* body desc */}
      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.8)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          marginBottom: "8px",
        }}
      >
        {desc}
      </div>

      {/* Hear (EN) */}
      <button
        onClick={() => {
          // eski pattern: tts:en custom event
          window.dispatchEvent(
            new CustomEvent("tts:en", {
              detail: { text: title },
            })
          );
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          fontSize: "11px",
          lineHeight: 1,
          padding: "5px 8px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "inline-block",
          }}
        >
          🔊
        </span>
        <span>Hear (EN)</span>
      </button>
    </div>
  );
}

WorldAnchorCard.propTypes = {
  camera: PropTypes.object,
  anchor: PropTypes.shape({
    part: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      desc: PropTypes.string,
    }),
    worldPos: PropTypes.object, // THREE.Vector3
  }),
  onClose: PropTypes.func,
};

/**
 * ModelObject
 * - yuklaydi
 * - centering
 * - selection highlight
 * - click -> part info
 * - anchor position for floating card
 */
function ModelObject({
  url,
  selection,
  setSelection,
  onPartsExtracted,
  onPartPicked,
  setAnchorData,
}) {
  const groupRef = useRef(null);
  const framedRef = useRef(false); // camera framed once
  const { scene } = useGLTF(url, true);
  const { camera } = useThree();

  // sahnaga modelni qo'yish + parts
  useEffect(() => {
    if (!groupRef.current || !scene) return;

    if (groupRef.current.children.length === 0) {
      const clone = scene.clone(true);

      const foundParts = [];
      clone.traverse((child) => {
        if (child.isMesh) {
          const meshName = child.name || child.parent?.name || "Unnamed";
          foundParts.push({
            id: child.uuid,
            name: meshName,
            desc:
              child.userData?.info ||
              child.userData?.description ||
              undefined,
            // child objectning worldPos ini keyinchalik olishimiz mumkin
          });

          // perf tweaks
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;
          if (child.material) {
            child.material.transparent = false;
          }
        }
      });

      if (onPartsExtracted) {
        onPartsExtracted(foundParts);
      }

      groupRef.current.add(clone);

      // kamerani markazga frame qilamiz faqat bir marta
      if (!framedRef.current) {
        framedRef.current = true;

        const box = new THREE.Box3().setFromObject(groupRef.current);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const radius = Math.max(sphere.radius, 0.001);
        const center = sphere.center.clone();

        // model pivotini (0,0,0) ga keltirish
        groupRef.current.position.copy(
          center.clone().multiplyScalar(-1)
        );

        // kamera dist
        const fov = (camera.fov * Math.PI) / 180;
        const dist = radius / Math.tan(fov / 2);
        const safeDist = dist * 1.4;

        camera.position.set(0, 0, safeDist);
        camera.near = safeDist / 100;
        camera.far = safeDist * 100;
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);
      }
    }
  }, [scene, camera, onPartsExtracted]);

  // pointerDown -> selection + info + anchor
  useEffect(() => {
    if (!groupRef.current) return;

    const meshes = [];

    const handlePointerDown = (e) => {
      e.stopPropagation();
      const obj = e.object;
      if (!obj || !obj.isMesh) return;

      // part data
      const meshName = obj.name || obj.parent?.name || "Unnamed";
      const meshDesc =
        obj.userData?.info ||
        obj.userData?.description ||
        undefined;

      const part = {
        id: obj.uuid,
        name: meshName,
        desc: meshDesc,
      };

      // selection highlight in scene
      if (setSelection) {
        setSelection(obj.uuid);
      }

      // Tell parent (Lab) for global modal + TTS
      if (onPartPicked) {
        onPartPicked(part);
      }

      // local anchored tooltip data
      // world pos from the hit point
      const worldPos = new THREE.Vector3();
      worldPos.copy(e.point); // e.point is world space intersection
      if (setAnchorData) {
        setAnchorData({
          part,
          worldPos,
        });
      }
    };

    groupRef.current.traverse((child) => {
      if (child.isMesh) {
        child.onPointerDown = handlePointerDown;
        meshes.push(child);
      }
    });

    return () => {
      meshes.forEach((m) => {
        m.onPointerDown = null;
      });
    };
  }, [setSelection, onPartPicked, setAnchorData]);

  // highlight emissive
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.uuid === selection) {
          if ("emissive" in child.material) {
            child.material.emissive = new THREE.Color("#1fb6ff");
            child.material.emissiveIntensity = 0.6;
          }
        } else {
          if ("emissive" in child.material) {
            child.material.emissive = new THREE.Color("#000000");
            child.material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [selection]);

  return <group ref={groupRef} />;
}

/**
 * SceneWrapper
 * - OrbitControls target = (0,0,0)
 * - Holds ModelObject
 * - Renders WorldAnchorCard overlay in DOM via state passed from child
 */
function SceneWrapper({
  url,
  selection,
  setSelection,
  onPartsExtracted,
  onPartPicked,
}) {
  const orbitRef = useRef(null);

  const { camera } = useThree();

  // anchored card state
  const [anchorData, setAnchorData] = useState(null);

  // OrbitControls doimo model markazida aylanadi
  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.target.set(0, 0, 0);
    }
  }, [selection]);

  return (
    <>
      {/* 3D lights */}
      <hemisphereLight args={[0xffffff, 0x10151c, 0.75]} />
      <directionalLight
        color={0xffffff}
        intensity={0.9}
        position={[2, 5, 3]}
      />

      {/* actual model */}
      <ModelObject
        url={url}
        selection={selection}
        setSelection={setSelection}
        onPartsExtracted={onPartsExtracted}
        onPartPicked={onPartPicked}
        setAnchorData={setAnchorData}
      />

      {/* camera controller */}
      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        minDistance={0.2}
        maxDistance={10}
      />

      {/* floating anchored card in DOM */}
      <WorldAnchorCard
        camera={camera}
        anchor={anchorData}
        onClose={() => setAnchorData(null)}
      />
    </>
  );
}

/**
 * CanvasViewer
 * - full-screen Canvas
 * - SceneWrapper handles anchored tooltip + click logic + parts extraction
 * - Errors overlay
 */
export default function CanvasViewer({
  url,
  selection,
  setSelection,
  onPartsExtracted,
  onPartPicked,
}) {
  const [error, setError] = useState(null);

  const finalUrl = useMemo(() => url || "", [url]);

  if (!finalUrl) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#111827",
          color: "#fff",
          fontSize: "14px",
          lineHeight: 1.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
            No model URL
          </div>
          <div
            style={{
              opacity: 0.8,
              fontSize: "12px",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "60vw",
              wordBreak: "break-all",
            }}
          >
            The current item doesn't provide a GLB / glTF source.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Canvas
        onError={(e) => {
          console.warn("Canvas error:", e);
          setError(e?.message || "WebGL error");
        }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{
          fov: 50,
          near: 0.01,
          far: 100,
          position: [0, 0, 3],
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          backgroundColor: "#0b0f14",
        }}
      >
        {!error && (
          <SceneWrapper
            url={finalUrl}
            selection={selection}
            setSelection={setSelection}
            onPartsExtracted={onPartsExtracted}
            onPartPicked={onPartPicked}
          />
        )}
      </Canvas>

      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            color: "#ef4444",
            fontSize: "13px",
            padding: "1rem",
            textAlign: "center",
            lineHeight: 1.4,
            backgroundColor: "#0b0f14",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, marginBottom: "6px" }}>
              Failed to load model
            </div>
            <div style={{ opacity: 0.8, wordBreak: "break-all" }}>
              {String(error)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

CanvasViewer.propTypes = {
  url: PropTypes.string,
  selection: PropTypes.any,
  setSelection: PropTypes.func,
  onPartsExtracted: PropTypes.func,
  onPartPicked: PropTypes.func,
};

// silence drei warning about preloading
useGLTF.preload = () => {};

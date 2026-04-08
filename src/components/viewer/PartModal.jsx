// src/components/viewer/PartModal.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Html, Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Anchored floating callout next to selected mesh.
 * sprite=true => fixed pixel size, not zooming.
 * Also includes 🔊 Hear (EN) button triggering tts:en.
 */
export default function PartModal({
  selection,
  onClose,
  side = "auto",
  variant = "sprite",
  distanceFactor = 26,
  lineColor = "#9ccfff",
  lineOpacity = 0.9,
  className = "",
  showTTS = true,
}) {
  const { camera } = useThree();
  if (!selection?.bounds) return null;

  const from = useMemo(
    () => new THREE.Vector3(...selection.bounds.center),
    [selection?.bounds?.center]
  );

  const radius = Math.max(
    0.02,
    selection.bounds.radius || 0.08
  );

  const basis = useMemo(() => {
    const right = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(camera.quaternion)
      .normalize();
    const up = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(camera.quaternion)
      .normalize();
    return { right, up };
  }, [camera]);

  const resolvedSide = useMemo(() => {
    if (side !== "auto") return side;
    const ndc = from.clone().project(camera);
    return Math.abs(ndc.x) > Math.abs(ndc.y)
      ? ndc.x < 0
        ? "right"
        : "left"
      : ndc.y < 0
      ? "up"
      : "down";
  }, [from, camera, side]);

  const to = useMemo(() => {
    const base = Math.min(
      0.35,
      Math.max(0.09, radius * 0.9)
    );
    const o = new THREE.Vector3();
    if (resolvedSide === "right")
      o.add(basis.right.clone().multiplyScalar(base));
    else if (resolvedSide === "left")
      o.add(basis.right.clone().multiplyScalar(-base));
    else if (resolvedSide === "up")
      o.add(basis.up.clone().multiplyScalar(base));
    else if (resolvedSide === "down")
      o.add(basis.up.clone().multiplyScalar(-base));
    o.add(basis.up.clone().multiplyScalar(base * 0.25));
    return from.clone().add(o);
  }, [from, basis, radius, resolvedSide]);

  const cardStyle = {
    width: 130,
    padding: "6px 6px",
    borderRadius: 6,
    fontSize: 10,
    background: "rgba(18,22,28,0.92)",
    color: "#eaf6ff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
    maxWidth: 160,
  };
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  };
  const tinyBtn = {
    fontSize: 10,
    padding: "2px 4px",
    border:
      "1px solid rgba(255,255,255,0.25)",
    background:
      "rgba(255,255,255,0.06)",
    borderRadius: 6,
    color: "#eaf6ff",
    cursor: "pointer",
  };

  const htmlProps =
    variant === "transform"
      ? { transform: true, distanceFactor }
      : { sprite: true };

  return (
    <>
      <Line
        points={[from, to]}
        color={lineColor}
        lineWidth={1}
        transparent
        opacity={lineOpacity}
      />
      <Html position={to} zIndexRange={[20, 30]} {...htmlProps}>
        <div
          className={`anchorCard ${className}`}
          style={cardStyle}
        >
          <div style={headerStyle}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 10.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 100,
              }}
            >
              {selection.name || "Part"}
            </div>
            <button
              style={tinyBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div
            style={{
              fontSize: 10,
              lineHeight: 1.3,
              color: "#cfe8ff",
            }}
          >
            {selection.info ||
              "No metadata provided. Add userData.info in GLB."}
          </div>

          {showTTS && (
            <div style={{ marginTop: 6 }}>
              <button
                style={tinyBtn}
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("tts:en", {
                      detail: {
                        text: `${selection.name || ""}. ${
                          selection.info || ""
                        }`,
                      },
                    })
                  )
                }
              >
                🔊 Hear (EN)
              </button>
            </div>
          )}
        </div>
      </Html>
    </>
  );
}

PartModal.propTypes = {
  selection: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
    bounds: PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number),
      radius: PropTypes.number,
    }),
  }),
  onClose: PropTypes.func,
  side: PropTypes.string,
  variant: PropTypes.string,
  distanceFactor: PropTypes.number,
  lineColor: PropTypes.string,
  lineOpacity: PropTypes.number,
  className: PropTypes.string,
  showTTS: PropTypes.bool,
};

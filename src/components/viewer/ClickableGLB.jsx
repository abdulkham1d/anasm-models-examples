// src/components/viewer/ClickableGLB.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, Bounds, useCursor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { resolvePartName } from "../../data/partNames.js";

// Thresholds to distinguish a click from a drag/rotate gesture
const CLICK_TIME_MS = 400;
const CLICK_DIST_PX = 8;

export default function ClickableGLB({
  url,
  onPartsExtracted,
  selection,
  setSelection,
  fadeOthers = true,
}) {
  const root = useRef();
  const { scene } = useGLTF(url, true);
  const [meshes, setMeshes] = useState([]);
  const [hovered, setHovered] = useState(null);
  const { invalidate } = useThree();
  useCursor(Boolean(hovered));

  // Track pointer-down origin for drag detection
  const pointerStart = useRef({ time: 0, x: 0, y: 0 });

  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Collect ALL meshes from the scene — each one becomes a clickable part
  useEffect(() => {
    const list = [];
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.userData.__pickable = true;
        child.frustumCulled = true;
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material?.clone) child.material = child.material.clone();
        child.material.transparent = true;

        // Give each mesh its own unique identity
        list.push({
          id: child.uuid,
          name: resolvePartName(child.name),
          meshName: child.name || "",
          ref: child,
          info: child.userData?.info || null,
        });
      }
    });
    setMeshes(list);

    onPartsExtracted?.(
      list.map(({ id, name, meshName, info }) => ({
        id,
        name,
        meshName,
        desc: info || null,
      }))
    );
  }, [cloned, onPartsExtracted]);

  useEffect(() => {
    invalidate();
  }, [selection, hovered, invalidate]);

  // highlight only the selected mesh, fade all others
  useFrame(() => {
    if (!selection && !hovered) return;
    meshes.forEach(({ ref }) => {
      if (!ref.material) return;
      const isSel = selection?.id === ref.uuid;
      const isHover = hovered?.uuid === ref.uuid;
      if (ref.material.emissive) {
        ref.material.emissive.set(
          isSel || isHover ? "#1fb6ff" : "#000000"
        );
        ref.material.emissiveIntensity = isSel
          ? 0.6
          : isHover
          ? 0.3
          : 0.0;
      }
      ref.material.opacity =
        fadeOthers && selection ? (isSel ? 1 : 0.28) : 1;
    });
  });

  const onMove = (e) => {
    e.stopPropagation();
    setHovered(
      e.object?.userData?.__pickable ? e.object : null
    );
  };
  const onOut = () => setHovered(null);

  // Record pointer-down position and time (do NOT select yet)
  const onDown = (e) => {
    e.stopPropagation();
    pointerStart.current = {
      time: Date.now(),
      x: e.nativeEvent?.clientX ?? 0,
      y: e.nativeEvent?.clientY ?? 0,
    };
  };

  /** Was the last pointer gesture a short, stationary click? */
  const isDragGesture = (nativeEvt) => {
    const { time, x, y } = pointerStart.current;
    const dt = Date.now() - time;
    const dx = (nativeEvt?.clientX ?? 0) - x;
    const dy = (nativeEvt?.clientY ?? 0) - y;
    return dt > CLICK_TIME_MS || Math.sqrt(dx * dx + dy * dy) > CLICK_DIST_PX;
  };

  // Select the exact mesh that was clicked — not a group, not a parent
  const handleClick = (e) => {
    e.stopPropagation();
    if (isDragGesture(e.nativeEvent)) return;
    if (!setSelection) return;

    // e.object is the exact mesh the ray hit first (closest to camera)
    const obj = e.object;
    if (!obj?.userData?.__pickable) return;

    const part = meshes.find((m) => m.ref === obj);
    if (!part) return;

    const box = new THREE.Box3().setFromObject(part.ref);
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    setSelection({
      id: part.id,
      name: part.name,
      meshName: part.meshName,
      info: part.info,
      bounds: {
        center: [sphere.center.x, sphere.center.y, sphere.center.z],
        radius: sphere.radius,
      },
      clickPoint: [e.point.x, e.point.y, e.point.z],
    });
  };

  // Only clear selection on real clicks, not drags
  const handleMissed = (e) => {
    if (isDragGesture(e)) return;
    setSelection?.(null);
  };

  return (
    <group
      ref={root}
      onPointerMove={onMove}
      onPointerOut={onOut}
      onPointerDown={onDown}
      onClick={handleClick}
      onPointerMissed={handleMissed}
      dispose={null}
    >
      <Bounds fit clip observe margin={1.2}>
        <primitive object={cloned} />
      </Bounds>
    </group>
  );
}

useGLTF.preload("/model/full_bones/full_bones.glb");

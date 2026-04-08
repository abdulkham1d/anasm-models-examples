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

  // Pending selection captured on pointer-down (reliable for tiny meshes)
  const pendingHit = useRef(null);
  // Global pointer-down coords for onPointerMissed drag detection
  const globalStart = useRef({ time: 0, x: 0, y: 0 });

  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Track ALL pointer-downs globally for onPointerMissed drag detection
  useEffect(() => {
    const handler = (e) => {
      globalStart.current = { time: Date.now(), x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointerdown", handler, true);
    return () => window.removeEventListener("pointerdown", handler, true);
  }, []);

  // Window-level pointerup — always fires, confirms selection if not a drag
  useEffect(() => {
    const handleUp = (e) => {
      const hit = pendingHit.current;
      if (!hit) return;
      pendingHit.current = null;

      const dt = Date.now() - hit.time;
      const dx = e.clientX - hit.x;
      const dy = e.clientY - hit.y;
      if (dt > CLICK_TIME_MS || Math.sqrt(dx * dx + dy * dy) > CLICK_DIST_PX) return;

      setSelection?.(hit.selection);
    };
    window.addEventListener("pointerup", handleUp);
    return () => window.removeEventListener("pointerup", handleUp);
  }, [setSelection]);

  // collect meshes & parts
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

  // highlight & fade
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

  // Capture exact mesh on pointer-down (same as original — reliable for skeleton)
  // Selection is deferred to window pointerup with drag check
  const onDown = (e) => {
    e.stopPropagation();
    const obj = e.object;
    if (!obj?.userData?.__pickable) return;
    if (!setSelection) return;

    const part = meshes.find((m) => m.ref === obj);
    if (!part) return;

    const box = new THREE.Box3().setFromObject(part.ref);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const center = [
      sphere.center.x,
      sphere.center.y,
      sphere.center.z,
    ];
    const radius = sphere.radius;

    pendingHit.current = {
      time: Date.now(),
      x: e.nativeEvent?.clientX ?? 0,
      y: e.nativeEvent?.clientY ?? 0,
      selection: {
        id: part.id,
        name: part.name,
        meshName: part.meshName,
        info: part.info,
        bounds: { center, radius },
        clickPoint: [e.point.x, e.point.y, e.point.z],
      },
    };
  };

  // Clear selection only on real clicks, not drags
  const handleMissed = (e) => {
    const { time, x, y } = globalStart.current;
    const dt = Date.now() - time;
    const dx = (e?.clientX ?? 0) - x;
    const dy = (e?.clientY ?? 0) - y;
    if (dt > CLICK_TIME_MS || Math.sqrt(dx * dx + dy * dy) > CLICK_DIST_PX) return;
    setSelection?.(null);
  };

  return (
    <group
      ref={root}
      onPointerMove={onMove}
      onPointerOut={onOut}
      onPointerDown={onDown}
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

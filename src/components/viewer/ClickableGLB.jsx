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

  // Track pointer-down position for drag detection (global — captures all downs)
  const pointerStart = useRef({ time: 0, x: 0, y: 0 });
  // Store the mesh hit on pointer-down (reliable for tiny meshes like skeleton)
  const pendingHit = useRef(null);

  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Global pointerdown listener so we always have start coords for drag detection
  useEffect(() => {
    const handler = (e) => {
      pointerStart.current = { time: Date.now(), x: e.clientX, y: e.clientY };
      pendingHit.current = null;
    };
    window.addEventListener("pointerdown", handler, true);
    return () => window.removeEventListener("pointerdown", handler, true);
  }, []);

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

  /** Was the last pointer gesture a drag (not a clean click)? */
  const isDragGesture = (nativeEvt) => {
    const { time, x, y } = pointerStart.current;
    const dt = Date.now() - time;
    const dx = (nativeEvt?.clientX ?? 0) - x;
    const dy = (nativeEvt?.clientY ?? 0) - y;
    return dt > CLICK_TIME_MS || Math.sqrt(dx * dx + dy * dy) > CLICK_DIST_PX;
  };

  // Capture the exact mesh on pointer down — reliable for tiny meshes like skeleton
  const onDown = (e) => {
    e.stopPropagation();
    const obj = e.object;
    if (obj?.userData?.__pickable) {
      pendingHit.current = { object: obj, point: e.point };
    }
  };

  // Finalize selection on pointer up, only if it wasn't a drag
  const onUp = (e) => {
    e.stopPropagation();
    const hit = pendingHit.current;
    pendingHit.current = null;
    if (!hit || !setSelection) return;
    if (isDragGesture(e.nativeEvent)) return;

    const part = meshes.find((m) => m.ref === hit.object);
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
      clickPoint: [hit.point.x, hit.point.y, hit.point.z],
    });
  };

  // Clear selection only on real clicks on empty space, not drags
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
      onPointerUp={onUp}
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

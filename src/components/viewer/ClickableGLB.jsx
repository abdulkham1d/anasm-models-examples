// src/components/viewer/ClickableGLB.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, Bounds, useCursor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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

  const cloned = useMemo(() => scene.clone(true), [scene]);

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
          name: child.name || "Unnamed part",
          ref: child,
          info: child.userData?.info || null,
        });
      }
    });
    setMeshes(list);

    onPartsExtracted?.(
      list.map(({ id, name, info }) => ({
        id,
        name,
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

    setSelection({
      id: part.id,
      name: part.name,
      info: part.info,
      bounds: { center, radius },
      clickPoint: [e.point.x, e.point.y, e.point.z],
    });
  };

  return (
    <group
      ref={root}
      onPointerMove={onMove}
      onPointerOut={onOut}
      onPointerDown={onDown}
      onPointerMissed={() => setSelection?.(null)}
      dispose={null}
    >
      <Bounds fit clip observe margin={1.2}>
        <primitive object={cloned} />
      </Bounds>
    </group>
  );
}

useGLTF.preload("/model/full_bones/full_bones.glb");

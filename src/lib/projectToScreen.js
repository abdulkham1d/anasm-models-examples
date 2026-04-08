// src/lib/projectToScreen.js
import * as THREE from "three";

/**
 * Project a 3D world point to 2D pixel coordinates relative to a container.
 * @param {[number, number, number]} worldPoint
 * @param {THREE.Camera} camera
 * @param {{ width: number, height: number }} size
 * @returns {{ x: number, y: number }}
 */
export function projectToScreen(worldPoint, camera, size) {
  const vec = new THREE.Vector3(worldPoint[0], worldPoint[1], worldPoint[2]);
  vec.project(camera);
  const x = (vec.x * 0.5 + 0.5) * size.width;
  const y = (-vec.y * 0.5 + 0.5) * size.height;
  return { x, y };
}

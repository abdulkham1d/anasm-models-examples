// src/lib/three-opt.js
import { useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import * as THREE from "three";

/**
 * Initialize global model/texture decoders once per app session.
 * Call from Canvas.onCreated(gl => initThreeLoaders(gl))
 */
let bootstrapped = false;

export function initThreeLoaders(gl) {
  if (bootstrapped) return;

  // Meshopt (for models packed with gltfpack -cc)
  try {
    useGLTF.setMeshoptDecoder(MeshoptDecoder);
  } catch {}

  // Draco (if some assets are Draco-compressed)
  try {
    const draco = new DRACOLoader();
    // Put decoder files under /public/draco/
    // (draco_decoder.wasm, draco_wasm_wrapper.js, draco_decoder.js)
    draco.setDecoderPath("/draco/");
    useGLTF.setDRACOLoader(draco);
  } catch {}

  // KTX2/Basis (GPU texture compression)
  try {
    const ktx2 = new KTX2Loader().setTranscoderPath("/basis/"); // /public/basis/
    ktx2.detectSupport(gl);
    // Optionally stash for later manual use
    THREE.Cache.add("ktx2-loader", ktx2);
  } catch {}

  bootstrapped = true;
}

/**
 * Optional helper if you manually assign KTX2 textures to materials.
 * Not strictly required for our current flow.
 */
export function setKTX2OnMaterial(mat) {
  if (!mat) return;
  ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap"].forEach(
    (key) => {
      if (mat[key]?.isCompressedTexture) mat[key].needsUpdate = true;
    }
  );
}

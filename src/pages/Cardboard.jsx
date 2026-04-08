import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
    GLTFLoader,
    DRACOLoader,
    KTX2Loader,
    MeshoptDecoder,
    DeviceOrientationControls,
    StereoEffect,
  } from "three-stdlib";

export default function Cardboard() {
  const wrapRef = useRef(null);
  const stateRef = useRef({
    renderer: null,
    effect: null,
    camera: null,
    scene: null,
    controls: null,
    raycaster: new THREE.Raycaster(),
    reticle: null,
    clock: new THREE.Clock(),
    stop: false,
  });

  // helpers
  const qs = new URLSearchParams(window.location.search);
  const modelId = qs.get("model") || "right_arm";
  const src = qs.get("src") || `/model/${modelId}/${modelId}.glb`;

  useEffect(() => {
    const container = wrapRef.current;
    if (!container) return;

    // ----------- Renderer (perf-first) -----------
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    renderer.setPixelRatio(1); // DPR=1: telefon uchun eng yaxshi FPS
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Stereo split
    const effect = new StereoEffect(renderer);
    effect.setSize(container.clientWidth, container.clientHeight);

    // ----------- Scene / camera -----------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f14);

    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 50);
    camera.position.set(0, 0.8, 2.2);

    // Lights (soyani o‘chirib, eng yengil)
    const hemi = new THREE.HemisphereLight(0xffffff, 0x10151c, 0.75);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(2, 5, 3);
    scene.add(dir);

    // Ground (vizual)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x0c131c })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    scene.add(ground);

    // ----------- Reticle (gaze cursor) -----------
    const retGeo = new THREE.RingGeometry(0.01, 0.018, 32);
    const retMat = new THREE.MeshBasicMaterial({ color: 0x9ccfff, side: THREE.DoubleSide });
    const reticle = new THREE.Mesh(retGeo, retMat);
    reticle.position.set(0, 0, -1); // will be attached to camera later
    camera.add(reticle);
    scene.add(camera);

    // ----------- Controls -----------
    const controls = new DeviceOrientationControls(camera, true);
    controls.connect();

    // ----------- Loaders (Meshopt/Draco/KTX2) -----------
    const gltfLoader = new GLTFLoader();
    THREE.Cache.enabled = true;

    try {
      gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    } catch {}

    try {
      const draco = new DRACOLoader();
      draco.setDecoderPath("/draco/");   // public/draco/*
      gltfLoader.setDRACOLoader(draco);
    } catch {}

    try {
      const ktx2 = new KTX2Loader().setTranscoderPath("/basis/");
      ktx2.detectSupport(renderer);
      // Agar GLB ichida ktx2 bo'lsa, loader avtomatik ishlaydi
    } catch {}

    // ----------- Load model -----------
    let modelRoot = null;
    gltfLoader.load(
      src,
      (gltf) => {
        modelRoot = gltf.scene;
        // perf: soyalar yo'q
        modelRoot.traverse((c) => {
          if (c.isMesh) {
            c.frustumCulled = true;
            c.castShadow = false;
            c.receiveShadow = false;
            if (c.material) c.material.transparent = false;
          }
        });
        scene.add(modelRoot);

        // fokus (masofa FOV bo‘yicha)
        const box = new THREE.Box3().setFromObject(modelRoot);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const center = sphere.center;
        const radius = Math.max(0.05, sphere.radius);
        const fov = (camera.fov * Math.PI) / 180;
        const dist = Math.min(2.5, (radius / Math.tan(fov / 2)) * 0.85);
        const dirVec = camera.position.clone().sub(center).normalize();
        camera.position.copy(center.clone().add(dirVec.multiplyScalar(dist)));
        camera.lookAt(center);
      },
      undefined,
      (err) => {
        console.warn("GLB load error:", err);
      }
    );

    // ----------- Tap select (raycast markazi) -----------
    const raycaster = new THREE.Raycaster();
    const tap = () => {
      raycaster.setFromCamera({ x: 0, y: 0 }, camera);
      const hits = modelRoot ? raycaster.intersectObject(modelRoot, true) : [];
      if (hits.length) {
        const hit = hits[0].object;
        // kichik highlight
        if (hit.material?.emissive?.set) {
          hit.material.emissive.set(0x1fb6ff);
          hit.material.emissiveIntensity = 0.6;
          setTimeout(() => {
            hit.material.emissiveIntensity = 0.0;
            hit.material.emissive?.set(0x000000);
          }, 500);
        }
      }
    };
    const onClick = () => tap();
    container.addEventListener("click", onClick);

    // ----------- Fullscreen helpers -----------
    const enterFullscreen = () => {
      const el = renderer.domElement;
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
    };
    const exitFullscreen = () => {
      (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
    };

    // ----------- iOS motion permission -----------
    const needMotionPermission =
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function";

    const askMotion = async () => {
      try {
        // iOS 13+
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== "granted") alert("Motion permission is required for VR.");
      } catch {}
    };

    // ----------- Buttons (UI minimal) -----------
    const bar = document.createElement("div");
    bar.style.cssText =
      "position:fixed;left:12px;top:12px;display:flex;gap:8px;z-index:10";
    const btnStyle =
      "font-size:12px;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#eaf6ff;";
    const bEnter = document.createElement("button");
    bEnter.textContent = "Enter VR";
    bEnter.style.cssText = btnStyle;
    const bRecenter = document.createElement("button");
    bRecenter.textContent = "Recenter";
    bRecenter.style.cssText = btnStyle;
    const bExit = document.createElement("button");
    bExit.textContent = "Exit";
    bExit.style.cssText = btnStyle;
    bar.appendChild(bEnter);
    bar.appendChild(bRecenter);
    bar.appendChild(bExit);
    container.appendChild(bar);

    bEnter.onclick = async () => {
      if (needMotionPermission) await askMotion();
      enterFullscreen();
    };
    bExit.onclick = () => exitFullscreen();
    bRecenter.onclick = () => {
      controls.disconnect();
      controls.connect();
    };

    // ----------- Resize -----------
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      effect.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ----------- Animate (always) -----------
    let stopped = false;
    const animate = () => {
      if (stopped) return;
      controls.update();
      // reticle always -Z
      reticle.position.set(0, 0, -1);
      reticle.lookAt(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));

      effect.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // store
    stateRef.current = {
      renderer,
      effect,
      camera,
      scene,
      controls,
      raycaster,
      reticle,
      stop: () => (stopped = true),
    };

    return () => {
      stopped = true;
      window.removeEventListener("resize", onResize);
      container.removeEventListener("click", onClick);
      controls?.dispose?.();
      renderer?.dispose?.();
      container.innerHTML = "";
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", height: "100vh", background: "#0b0f14" }}
    />
  );
}

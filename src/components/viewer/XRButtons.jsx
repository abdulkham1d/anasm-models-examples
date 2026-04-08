import React, { useEffect, useState } from "react";
import { getXRSupport } from "../../lib/xr.js";

/**
 * XRButtons
 * - Shows two buttons: AR and VR
 * - Detects support via navigator.xr.isSessionSupported
 * - If onAR/onVR are provided, they are called on click.
 * - Otherwise, shows a default message about support / how to try.
 */
export default function XRButtons({ onAR, onVR, className = "" }) {
  const [support, setSupport] = useState({ ar: false, vr: false });

  useEffect(() => {
    let alive = true;
    getXRSupport().then((res) => alive && setSupport(res));
    return () => { alive = false; };
  }, []);

  const handleAR = async () => {
    if (onAR) return onAR(support);
    alert(
      support.ar
        ? "AR supported. Start a WebXR AR session or trigger <model-viewer>.activateAR()."
        : "AR not supported in this browser/device. Try Android Chrome (ARCore) or iOS Quick Look."
    );
  };

  const handleVR = async () => {
    if (onVR) return onVR(support);
    alert(
      support.vr
        ? "VR supported. Start a WebXR immersive-vr session (e.g., Meta Quest browser)."
        : "VR not supported in this browser/device."
    );
  };

  // style hooks use global .btn class from app.css
  return (
    <div className={`corner ${className}`}>
      <button className="btn" onClick={handleAR} title={support.ar ? "AR ready" : "AR not available"}>
        🧭 AR
      </button>
      <button className="btn" onClick={handleVR} title={support.vr ? "VR ready" : "VR not available"}>
        🕶️ VR
      </button>
    </div>
  );
}

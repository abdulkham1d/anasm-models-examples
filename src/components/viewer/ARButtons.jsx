import React from "react";
import QRModal from "../ui/QRModal.jsx";

/**
 * ARButtons
 * Props:
 *  - modelId: string        // e.g., "right_arm"
 *  - glbUrl: string         // absolute or site-relative URL for Android SceneViewer
 *  - usdzUrl: string        // absolute or site-relative URL for iOS QuickLook
 *  - title?: string         // optional label in AR viewers
 */
export default function ARButtons({ modelId, glbUrl, usdzUrl, title = "View in AR" }) {
  const [qrOpen, setQrOpen] = React.useState(false);
  const [qrUrl, setQrUrl] = React.useState("");

  const ua = navigator.userAgent || "";
  const isAndroid = /android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isMobile = isAndroid || isIOS;

  // Build platform-specific AR deep links
  const buildAndroidIntent = () => {
    // https must be absolute when served from a real domain
    const file = new URL(glbUrl, window.location.origin).href;
    const mode = "ar_only"; // or "ar_preferred"
    const linkBack = window.location.href;
    return `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(file)}&mode=${mode}&title=${encodeURIComponent(title)}&link=${encodeURIComponent(linkBack)}#Intent;scheme=https;package=com.google.ar.core;end;`;
  };

  const buildIOSLink = () => {
    // QuickLook just needs a normal anchor with rel="ar"
    // We’ll still return the href to encode into QR for desktop
    return new URL(usdzUrl, window.location.origin).href + `#callToAction=${encodeURIComponent(title)}`;
  };

  const handleAR = async () => {
    if (isAndroid) {
      window.location.href = buildAndroidIntent();
      return;
    }
    if (isIOS) {
      // For iOS we should render a <a rel="ar" href="...">…</a>
      // But from a button we can still navigate:
      window.location.href = buildIOSLink();
      return;
    }

    // Desktop: show QR that opens the right AR link on phone
    // Prefer Android intent; if user scans on iOS it will open but won’t launch QuickLook,
    // so we generate a small redirect URL that picks platform server-side later
    // For now we choose iOS link if the user clicks a toggle; simplest: show Android intent by default
    const urlForQR = buildAndroidIntent(); // You could switch to a redirector if you have a backend
    setQrUrl(urlForQR);
    setQrOpen(true);
  };

  const handleVR = () => {
    // simple: route to a VR view where WebXR is enabled (we’ll wire it later)
    const target = new URL(window.location.href);
    target.searchParams.set("vr", "1");
    target.searchParams.set("model", modelId || "");
    window.location.href = target.toString();
  };

  const shareOnMobile = async () => {
    try {
      if (navigator.share && isMobile) {
        await navigator.share({
          title: title,
          text: "Open in AR",
          url: isAndroid ? buildAndroidIntent() : buildIOSLink(),
        });
      } else {
        handleAR();
      }
    } catch {
      handleAR();
    }
  };

  return (
    <>
      <div className="corner top-right" style={{ gap: 8 }}>
        <button className="btn sm" onClick={shareOnMobile}>⚡ AR</button>
        <button className="btn sm" onClick={handleVR}>🕶️ VR</button>
      </div>

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} url={qrUrl} label="Scan to open AR" />
    </>
  );
}

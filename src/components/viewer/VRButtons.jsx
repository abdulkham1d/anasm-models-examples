import React from "react";
import QRModal from "../ui/QRModal.jsx";

export default function VRButtons({ modelId, glbUrl, title = "View in VR" }) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const ua = navigator.userAgent || "";
  const isAndroid = /android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isMobile = isAndroid || isIOS;

  const buildCardboardUrl = () => {
    const u = new URL(window.location.origin + "/cardboard"); // route to Cardboard.jsx
    if (modelId) u.searchParams.set("model", modelId);
    // GLB manzilini ham yuboramiz (fallback)
    if (glbUrl) u.searchParams.set("src", new URL(glbUrl, window.location.origin).href);
    return u.toString();
  };

  const onVR = () => {
    const cardUrl = buildCardboardUrl();
    if (isMobile) {
      window.location.href = cardUrl;
    } else {
      setUrl(cardUrl);
      setOpen(true);
    }
  };

  return (
    <>
      <div className="corner top-right" style={{ gap: 8 }}>
        <button className="btn sm" onClick={onVR}>🕶️ VR (Cardboard)</button>
      </div>
      <QRModal open={open} onClose={() => setOpen(false)} url={url} label="Scan to open VR" />
    </>
  );
}

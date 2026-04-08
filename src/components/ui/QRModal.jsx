// src/components/ui/QRModal.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";

export default function QRModal({ open, onClose, url, label }) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let alive = true;
    if (open && url) {
      QRCode.toDataURL(url, { margin: 1, scale: 6 })
        .then((qr) => {
          if (alive) setDataUrl(qr);
        })
        .catch(() => {
          if (alive) setDataUrl("");
        });
    } else {
      setDataUrl("");
    }
    return () => {
      alive = false;
    };
  }, [open, url]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(3px)",
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0f172a",
          border:
            "1px solid rgba(255,255,255,0.15)",
          borderRadius: "12px",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.9)",
          padding: "16px",
          width: "min(260px, 90vw)",
          color: "#fff",
          fontSize: "13px",
          lineHeight: 1.4,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontWeight: 600,
            marginBottom: "8px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <span>{label || "Scan on phone"}</span>
          <button
            className="btn sm"
            style={{
              padding: "4px 6px",
              fontSize: "11px",
              lineHeight: 1.2,
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "8px",
            display: "grid",
            placeItems: "center",
            marginBottom: "12px",
          }}
        >
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="QR"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                color: "#000",
                fontSize: "12px",
                lineHeight: 1.4,
                textAlign: "center",
              }}
            >
              Generating QR…
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.7)",
            wordBreak: "break-all",
          }}
        >
          {url}
        </div>
      </div>
    </div>
  );
}

QRModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  url: PropTypes.string,
  label: PropTypes.string,
};

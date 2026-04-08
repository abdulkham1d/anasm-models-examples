// src/components/sidebar/RightSidebar.jsx
import React from "react";
import PropTypes from "prop-types";

export default function RightSidebar({
  open,
  setOpen,
  parts,
  currentSelection,
  onSelectPart,
}) {
  if (!open) return null;

  return (
    <aside
      className="sidebar right"
      style={{
        width: "100%",
        height: "100%",
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* header */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
          fontSize: "12px",
          lineHeight: 1.3,
        }}
      >
        <div style={{ color: "#fff" }}>
          <div style={{ fontWeight: 600 }}>Organ qismlari</div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Avtomatik aniqlangan
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button
            className="btn sm"
            style={{
              fontSize: "11px",
              lineHeight: 1.2,
              padding: "4px 6px",
              minWidth: "auto",
            }}
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          <button
            className="btn sm"
            style={{
              fontSize: "11px",
              lineHeight: 1.2,
              padding: "4px 6px",
              minWidth: "auto",
            }}
            onClick={() => {
              alert("Add custom part (future)");
            }}
          >
            ✚
          </button>
        </div>
      </div>

      {/* scrollable list */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "8px 12px",
          fontSize: "12px",
          lineHeight: 1.4,
          color: "#fff",
        }}
      >
        {(!parts || parts.length === 0) && (
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.4,
              padding: "8px 0",
            }}
          >
            Qismlar avtomatik aniqlanmadi.
            <br />
            Name meshes in the GLB and/or add userData.info.
          </div>
        )}

        {parts &&
          parts.map((p) => {
            const active = currentSelection === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  // now we send whole part object up
                  onSelectPart({
                    id: p.id,
                    name: p.name,
                    desc: p.desc,
                  });
                }}
                style={{
                  userSelect: "none",
                  cursor: "pointer",
                  backgroundColor: active
                    ? "rgba(17,181,229,0.12)"
                    : "rgba(255,255,255,0.03)",
                  border: active
                    ? "1px solid rgba(17,181,229,0.6)"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  marginBottom: "8px",
                  boxShadow: active
                    ? "0 0 10px rgba(17,181,229,0.4)"
                    : "none",
                  wordBreak: "break-word",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {p.name || "Unnamed"}
                </div>

                {p.desc && (
                  <div
                    style={{
                      fontSize: "11px",
                      lineHeight: 1.4,
                      color: "rgba(255,255,255,0.7)",
                      marginTop: "4px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {p.desc}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </aside>
  );
}

RightSidebar.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      desc: PropTypes.string,
    })
  ),
  currentSelection: PropTypes.any,
  onSelectPart: PropTypes.func,
};

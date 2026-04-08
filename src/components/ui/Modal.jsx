import React from "react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modalScrim" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
          <div style={{fontWeight:700, fontSize:18}}>{title}</div>
          <button className="btn sm" onClick={onClose}>Close</button>
        </div>
        <div className="spacer" />
        {children}
      </div>
    </div>
  );
}

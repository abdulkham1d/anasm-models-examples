// src/components/viewer/PinLabels.jsx
import React from "react";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import MiniCallout3D from "./MiniCallout3D.jsx";

/**
 * Pins are real UI pixels now (Html sprite), so they never scale with zoom.
 * - Pins only render when showPins=true (after a selection).
 * - Pins are occluded by the mesh (Html occlude).
 * - Callout can be "3d" (recommended, ultra-tiny) or "html" (also sprite).
 */
export default function PinLabels({
  pins = [],
  selection,
  onPick,
  showPins = false,
  calloutMode = "3d", // "3d" | "html"
}) {
  // Tiny HTML fallback callout (also sprite so it never scales)
  const HtmlCard = ({ pin, title, info }) => {
    // small offset for card placement
    const labelPos = pin.position.clone().add(new THREE.Vector3(0.06, 0.045, 0));
    return (
      <Html
        position={labelPos}
        sprite                // <— fixed pixel size
        occlude               // <— hide when behind geometry
        zIndexRange={[20, 30]}
      >
        <div className="anchorCard" style={{ width: 130, padding: 6 }}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:6}}>
            <div style={{fontWeight:700, fontSize:10.5}}>{title}</div>
            <button className="btn sm" onClick={()=>onPick?.(null)}>×</button>
          </div>
          <div className="spacer" />
          <p className="tiny muted" style={{margin:0, lineHeight:1.3, fontSize:10}}>
            {info || "Нет данных. Добавьте userData.info в GLB."}
          </p>
          <div className="spacer" />
          <button
            className="btn sm"
            onClick={() => window.dispatchEvent(new CustomEvent("tts:ru", { detail: { text: `${title}. ${info || ""}` } }))}
          >
            🔊 Озвучить
          </button>
        </div>
      </Html>
    );
  };

  return (
    <>
      {/* Pins: fixed 10×10 px buttons; don’t scale with camera; hidden when occluded */}
      {showPins && pins.map((p) => (
        <Html
          key={p.id}
          position={p.position}
          sprite                 // <— FIX: pixel-sized, never zoomed
          occlude                // <— hide behind geometry
          zIndexRange={[18, 28]}
        >
          <button
            className="pin-btn"
            onClick={(e)=>{ e.stopPropagation(); onPick?.(p); }}
            aria-label={`Выбрать ${p.name}`}
            title={p.name}
          >
            +
          </button>
        </Html>
      ))}

      {/* Selected part callout */}
      {selection && (() => {
        const pin = pins.find(x => x.id === selection.id);
        if (!pin) return null;

        if (calloutMode === "3d") {
          // ultra-tiny 3D label + connector (best for minimal UI)
          const text = selection.info ? `${selection.name}: ${selection.info}` : selection.name;
          return <MiniCallout3D from={pin.position} text={text} />;
        }

        // tiny HTML sprite fallback (also fixed pixel size)
        // add a short connector for symmetry
        const to = pin.position.clone().add(new THREE.Vector3(0.06, 0.045, 0));
        return (
          <>
            <Line points={[pin.position, to]} color="#9ccfff" lineWidth={1} transparent opacity={0.9} />
            <HtmlCard pin={pin} title={selection.name} info={selection.info} />
          </>
        );
      })()}
    </>
  );
}

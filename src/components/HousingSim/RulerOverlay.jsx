import React from "react";

export default function RulerOverlay() {
  // Generate horizontal ruler
  const width = window.innerWidth;
  const height = window.innerHeight;
  const hTicks = Array.from({ length: Math.ceil(width / 50) }, (_, i) => i * 50);
  const vTicks = Array.from({ length: Math.ceil(height / 50) }, (_, i) => i * 50);

  return (
    <>
      {/* Horizontal ruler */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: 24,
        background: "rgba(0,0,0,0.05)",
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center"
      }}>
        {hTicks.map(x => (
          <div key={x} style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 1,
            height: 24,
            background: "#888"
          }} />
        ))}
        {hTicks.map(x => (
          <span key={"label-"+x} style={{
            position: "absolute",
            left: x + 2,
            top: 2,
            fontSize: 10,
            color: "#444"
          }}>{x}px</span>
        ))}
      </div>
      {/* Vertical ruler */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 24,
        height: "100vh",
        background: "rgba(0,0,0,0.05)",
        zIndex: 9999,
        pointerEvents: "none"
      }}>
        {vTicks.map(y => (
          <div key={y} style={{
            position: "absolute",
            top: y,
            left: 0,
            width: 24,
            height: 1,
            background: "#888"
          }} />
        ))}
        {vTicks.map(y => (
          <span key={"label-"+y} style={{
            position: "absolute",
            left: 2,
            top: y + 2,
            fontSize: 10,
            color: "#444"
          }}>{y}px</span>
        ))}
      </div>
    </>
  );
}

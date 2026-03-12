import { useState } from "react";
import SVGNode from "./SVGNode.jsx";

export default function ArchNode({
  node,
  isSelected,
  onMouseDown,
  onDelete,
  onConnect,
  onDoubleClick,
  isConnecting,
  onPortMouseDown,
  isDragConnecting,
  onPortDragStart,
}) {
  const [hovered, setHovered] = useState(false);
  const [isDraggingPort, setIsDraggingPort] = useState(false);

  const shouldShow = hovered || isDraggingPort;

  const sizes = {
    svg1: { w: 88, h: 88 },
    svg2: { w: 149, h: 90 },
    svg3: { w: 80, h: 80 },
    svg4: { w: 64, h: 40 },
  };
  const { w, h } = sizes[node.svgType] || { w: 88, h: 88 };

  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return;
    if (e.target.closest("[data-port]")) return;
    onMouseDown(e, node.id);
  };

  const handleNodeClick = (e) => {
    if (isConnecting) {
      e.stopPropagation();
      onConnect?.(node.id);
    }
  };

  return (
    <div
      style={{
        left: node.x,
        top: node.y,
        position: "absolute",
        width: w,
        height: h + 60, // KEY: explicit height so dots below are inside bounds
        zIndex: 2,
        cursor: isConnecting || isDragConnecting ? "crosshair" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(node); }}
      onClick={handleNodeClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!isDraggingPort) setHovered(false); }}
    >
      {/* SVG node rendered at top of wrapper */}
      <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        <SVGNode
          svgType={node.svgType}
          label={node.title}
          color={node.color}
          iconColor={node.iconColor}
        />
      </div>

      {/* Selection ring */}
      {/* {isSelected && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: w, height: h,
          borderRadius: "50%",
          border: "2px solid #7c6af7",
          pointerEvents: "none",
          boxShadow: "0 0 10px rgba(124,106,247,0.4)",
        }} />
      )} */}

      {/* Delete button */}
      {shouldShow && !isDragConnecting && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete?.(node.id); }}
          style={{
            position: "absolute", top: "-10px", right: "-10px",
            zIndex: 20, background: "#1a1a2e", border: "1.5px solid #7c6af7",borderRadius: "50%",
            cursor: "pointer", padding: "4px",width: "26px", height: "26px",        // CHANGED: fixed size for perfect circle
      display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img src="/src/assets/Button.svg" alt="delete" width="18" height="18" />
        </button>
      )}

      {/* Teal drag-to-connect dot — at top: h+8, inside h+60 wrapper */}
      {shouldShow && (
        <div
          data-port="drag"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsDraggingPort(true);
            onPortDragStart?.(node.id, e);
            const onUp = () => {
              setIsDraggingPort(false);
              setHovered(false);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mouseup", onUp);
          }}
          style={{
            position: "absolute",
            top: h -10,
            left: "50%",
            transform: "translateX(-50%)",
            width: "16px",
            height: "16px",
            background: "#ffffff",
            border: "2.5px solid #fff",
            borderRadius: "50%",
            cursor: "crosshair",
            zIndex: 20,
            boxShadow: "0 0 0 3px rgba(0,213,190,0.3), 0 0 12px rgba(0,213,190,0.6)",
          }}
        />
      )}

      {/* Drop target ring */}
      {/* {isDragConnecting && hovered && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: w, height: h,
          borderRadius: "50%",
          border: "2px dashed #7c6af7",
          pointerEvents: "none",
          opacity: 0.7,
        }} />
      )} */}
    </div>
  );
}
import { useState, useEffect } from "react";
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
        // cursor: isConnecting ? "crosshair" : "grab",
        // outline: isConnecting ? "2px solid #7c6af7" : "none",
        borderRadius: "50%",
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(node); }}
      onClick={handleNodeClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Selection ring */}
      {isSelected && (
        <div style={{
          position: "absolute", inset: "-4px", borderRadius: "50%",
          border: "2px solid #7c6af7", pointerEvents: "none", zIndex: 0,
          boxShadow: "0 0 10px rgba(124,106,247,0.4)",
        }} />
      )}

      {/* Delete button */}
      {shouldShow && !isDragConnecting && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete?.(node.id); }}
          style={{
            position: "absolute", top: "-10px", right: "-10px",
            zIndex: 20, background: "transparent", border: "none",
            cursor: "pointer", padding: 0,
          }}
        >
          <img src="/src/assets/Button.svg" alt="delete" width="18" height="18" />
        </button>
      )}

      {/* Purple click-to-connect dot */}
      {shouldShow && (
        <div
          data-port="click"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onPortMouseDown?.(node.id);
          }}
          style={{
            position: "absolute",
            bottom: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "12px", height: "12px",
            background: "#7c6af7",
            border: "2px solid #fff",
            borderRadius: "50%",
            cursor: "crosshair",
            zIndex: 20,
          }}
        />
      )}

      {/* Teal drag-to-connect dot */}
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
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mouseup", onUp);
          }}
          style={{
            position: "absolute",
            bottom: "-34px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "16px", height: "16px",
            background: "#00d5be",
            border: "2.5px solid #fff",
            borderRadius: "50%",
            cursor: "crosshair",
            zIndex: 20,
            boxShadow: "0 0 0 3px rgba(0,213,190,0.3), 0 0 12px rgba(0,213,190,0.6)",
          }}
        />
      )}

      {/* Drop target ring */}
      {isDragConnecting && hovered && (
        <div style={{
          position: "absolute", inset: "-8px", borderRadius: "50%",
          border: "2px dashed #7c6af7", pointerEvents: "none", zIndex: 0,
          opacity: 0.7,
        }} />
      )}

      <SVGNode
        svgType={node.svgType}
        label={node.title}
        color={node.color}
        iconColor={node.iconColor}
      />
    </div>
  );
}
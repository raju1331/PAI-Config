import { useState } from "react";
import SVGNode from "./SVGNode.jsx";

export default function ArchNode({ node, isSelected, onMouseDown, onDelete, onConnect, onDoubleClick, isConnecting, onPortMouseDown }) {
  const [showActions, setShowActions] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(node.id);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return;
    if (e.target.closest(".arch-node__port")) return;
    onMouseDown(e, node.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick?.(node);
  };

  const handleNodeClick = (e) => {
    if (isConnecting) {
      e.stopPropagation();
      onConnect?.(node.id);
    }
  };

  return (
    <div
      className={`arch-node arch-node--svg ${isSelected ? "arch-node--selected" : ""} ${isConnecting ? "arch-node--connecting" : ""}`}
      style={{ 
        left: node.x, 
        top: node.y, 
        position: "absolute",
        // cursor: isConnecting ? "crosshair" : "grab",
        // outline: isConnecting ? "2px solid #7c6af7" : "none",
        borderRadius: "50%",
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={handleNodeClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showActions && (
        <button
          className="arch-node__delete"
          title="Delete"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleDeleteClick}
        >
          <img src="/src/assets/Button.svg" alt="delete" width="18" height="18" />
        </button>
      )}

      {showActions && (
        <div
          className="arch-node__port arch-node__port--connect"
          title="Click to connect"
          onMouseDown={(e) => {
            e.stopPropagation();
            onPortMouseDown?.(node.id);
          }}
          style={{
            position: "absolute",
            bottom: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "12px",
            height: "12px",
            background: "#7c6af7",
            border: "2px solid #fff",
            borderRadius: "50%",
            cursor: "crosshair",
            zIndex: 10,
          }}
        />
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
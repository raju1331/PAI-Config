import { useState } from "react";
import SVGNode from "./SVGNode.jsx";

/**
 * ArchNode
 * A single draggable node on the architecture canvas using SVG shapes.
 *
 * Props:
 *  - node        { id, title, color, iconColor, x, y, svgType, ... }
 *  - isSelected  bool
 *  - onMouseDown (e, nodeId) => void
 *  - onDelete    (nodeId) => void
 *  - onConnect   (nodeId) => void
 */
export default function ArchNode({ node, isSelected, onMouseDown, onDelete, onConnect }) {
  const [showActions, setShowActions] = useState(false);
console.log("Rendering ArchNode:", node);
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(node.id);
  };

  const handleConnectClick = (e) => {
    e.stopPropagation();
    onConnect?.(node.id);
  };

  return (
    <div
      className={`arch-node arch-node--svg ${isSelected ? "arch-node--selected" : ""}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Delete button - shows on hover */}
      {showActions && (
        <button
          className="arch-node__delete"
          title="Delete node"
          onClick={handleDeleteClick}
          aria-label="Delete node"
        >
          ✕
        </button>
      )}

      {/* Connect button - shows on hover */}
      {showActions && (
        <button
          className="arch-node__connect"
          title="Connect nodes"
          onClick={handleConnectClick}
          aria-label="Connect to another node"
        >
          ◉
        </button>
      )}

      {/* SVG Node Rendering */}
      <SVGNode
        svgType={node.svgType}
        label={node.title}
        color={node.color}
        iconColor={node.iconColor}
      />
    </div>
  );
}

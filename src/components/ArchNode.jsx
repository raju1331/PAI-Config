/**
 * ArchNode
 * A single draggable node on the architecture canvas.
 *
 * Props:
 *  - node        { id, title, subtitle, icon, color, iconColor, x, y, status }
 *  - isSelected  bool
 *  - onMouseDown (e, nodeId) => void
 */
export default function ArchNode({ node, isSelected, onMouseDown }) {
  return (
    <div
      className={`arch-node ${isSelected ? "arch-node--selected" : ""}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      <div className="arch-node__header">
        <div
          className="arch-node__icon"
          style={{ background: node.color, color: node.iconColor }}
        >
          {node.icon}
        </div>

        <div>
          <div className="arch-node__title">{node.title}</div>
          <div className="arch-node__subtitle">{node.subtitle}</div>
        </div>
      </div>

      <div className="arch-node__status">
        <div className="arch-node__status-dot" />
        <span className="arch-node__status-text">{node.status}</span>
      </div>
    </div>
  );
}

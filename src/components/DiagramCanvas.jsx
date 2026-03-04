import { useState } from "react";
import ArchNode from "./ArchNode.jsx";
// import PropertiesPanel from "./PropertiesPanel.jsx";

export default function DiagramCanvas({ nodes, setNodes }) {
  const [selectedNodeId, setSelectedId] = useState(null);
  const [dragging, setDragging]       = useState(null); // { nodeId, offsetX, offsetY }


  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setSelectedId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    setDragging({ nodeId, offsetX: e.clientX - node.x, offsetY: e.clientY - node.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const { nodeId, offsetX, offsetY } = dragging;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, x: e.clientX - offsetX, y: e.clientY - offsetY }
          : n
      )
    );
  };

  const handleMouseUp  = () => setDragging(null);
  const handleBgClick  = () => setSelectedId(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (data.type === "asset") {
        // Get canvas position
        const canvasWrapper = e.currentTarget.querySelector(".canvas-wrapper");
        const rect = canvasWrapper?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0);
        const y = e.clientY - (rect?.top || 0);

        // Create a new node from the dropped asset
        const newNodeId = Math.max(...nodes.map(n => typeof n.id === 'number' ? n.id : 0), 0) + 1;
        const newNode = {
          id: newNodeId,
          title: data.asset.name,
          subtitle: data.asset.tag,
          icon: data.asset.icon,
          color: data.color,
          iconColor: data.iconColor,
          x: Math.max(0, x - 75), // Center the node at drop point
          y: Math.max(0, y - 55),
          status: "Running",
        };

        setNodes((prev) => [...prev, newNode]);
      }
    } catch (error) {
      console.error("Error parsing dropped data:", error);
    }
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div className="canvas-area">
        <div
          className="canvas-wrapper"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleBgClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {nodes.length === 0 && (
            <div className="canvas-empty">
              <div className="canvas-empty__icon">🗺️</div>
              <p className="canvas-empty__text">Drag and drop items here to configure</p>
              <p className="canvas-empty__sub">Use an existing template</p>
            </div>
          )}

          {/* Architecture nodes */}
          {nodes.map((node) => (
            <ArchNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onMouseDown={handleNodeMouseDown}
            />
          ))}
        </div>
      </div>

      {/* ── Properties panel ── */}
      {/* <PropertiesPanel
        selectedNode={selectedNode}
        nodeCount={nodes.length}
        connectionCount={INITIAL_CONNECTIONS.length}
      /> */}
    </div>
  );
}

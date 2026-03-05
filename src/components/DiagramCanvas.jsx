import { useState } from "react";
import ArchNode from "./ArchNode.jsx";
// import PropertiesPanel from "./PropertiesPanel.jsx";

export default function DiagramCanvas({ nodes, setNodes }) {
  const [selectedNodeId, setSelectedId] = useState(null);
  const [dragging, setDragging]       = useState(null); // { nodeId, offsetX, offsetY }
  const [connections, setConnections] = useState([]); // Array of { from, to }
  const [connectingFrom, setConnectingFrom] = useState(null); // Node ID we're connecting from

  // Compute canvas data on the fly (not stored in state)
  const getCanvasData = () => ({
    nodes: nodes.map(({ id, title, subtitle, icon, status, assetId, category, allowedTargets, requiredBefore, maxOutgoing }) => ({
      id,
      title,
      subtitle,
      icon,
      status,
      assetId,
      category,
      allowedTargets,
      requiredBefore,
      maxOutgoing,
    })),
    connections: connections,
    exportedAt: new Date().toISOString(),
  });

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
          title: data.asset.label,
          subtitle: data.asset.description,
          icon: data.asset.icon,
          color: data.color,
          iconColor: data.iconColor,
          x: Math.max(0, x - 50), // Center the node at drop point (SVG nodes are smaller)
          y: Math.max(0, y - 60),
          status: "Running",
          svgType: data.asset.svgType,
          // Additional metadata from asset
          assetId: data.asset.id,
          category: data.asset.category,
          allowedTargets: data.asset.allowedTargets,
          requiredBefore: data.asset.requiredBefore,
          maxOutgoing: data.asset.maxOutgoing,
        };

        setNodes((prev) => [...prev, newNode]);
      }
    } catch (error) {
      console.error("Error parsing dropped data:", error);
    }
  };

  const handleDeleteNode = (nodeId) => {
    // Remove the node
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    
    // Remove all connections involving this node
    setConnections((prev) =>
      prev.filter((conn) => conn.from !== nodeId && conn.to !== nodeId)
    );
    
    setSelectedId(null);
  };

  const handleConnect = (nodeId) => {
    if (connectingFrom === null) {
      // Start connection from this node
      setConnectingFrom(nodeId);
    } else if (connectingFrom === nodeId) {
      // Cancel connection
      setConnectingFrom(null);
    } else {
      // Complete connection
      const fromNode = nodes.find((n) => n.id === connectingFrom);
      const toNode = nodes.find((n) => n.id === nodeId);
      if (!fromNode || !toNode) {
        setConnectingFrom(null);
        return;
      }

      // Validation: fromNode.allowedTargets must include toNode.id, and toNode.requiredBefore must include fromNode.id
      const allowed = Array.isArray(fromNode.allowedTargets) && fromNode.allowedTargets.includes(toNode.assetId);
      // const required = Array.isArray(toNode.requiredBefore) && toNode.requiredBefore.includes(fromNode.id);

      if (!allowed ) {
        // Optionally, show a message to the user (could use alert or a better UI feedback)
        alert("Connection between these 2 assests is not feasible.");
        setConnectingFrom(null);
        return;
      }

      const newConnection = { from: connectingFrom, to: nodeId };
      // Avoid duplicate connections (directional)
      const exists = connections.some(
        (conn) => conn.from === connectingFrom && conn.to === nodeId
      );
      if (!exists) {
        setConnections((prev) => [...prev, newConnection]);
      }
      setConnectingFrom(null);
    }
  };

  const drawConnections = () => {
    if (connections.length === 0 && connectingFrom === null) return;

    const paths = [];

    // Draw existing connections
    connections.forEach((conn, i) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const toNode = nodes.find((n) => n.id === conn.to);
      
      if (!fromNode || !toNode) return;

      const x1 = fromNode.x + 75;
      const y1 = fromNode.y + 55;
      const x2 = toNode.x + 75;
      const y2 = toNode.y + 55;
      const mx = (x1 + x2) / 2;

      paths.push(
        <path
          key={`conn-${i}`}
          d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
          fill="none"
          stroke="#2a3148"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    });

    // Draw temporary connection line while connecting
    if (connectingFrom !== null) {
      const fromNode = nodes.find((n) => n.id === connectingFrom);
      if (fromNode) {
        paths.push(
          <circle
            key="connect-indicator"
            cx={fromNode.x + 75}
            cy={fromNode.y + 55}
            r="5"
            fill="#4f8ef7"
            opacity="0.5"
          />
        );
      }
    }

    return paths;
  };

  const exportCanvasAsJSON = () => {
    const jsonString = JSON.stringify(getCanvasData(), null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canvas-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: "column" }}>
      {/* Info bar */}
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "8px", alignItems: "center", background: "#f7fafc" }}>
        <span style={{ fontSize: "12px", color: "#4a5568" }}>
          Nodes: {nodes.length} | Connections: {connections.length}
        </span>
        {connectingFrom !== null && (
          <span style={{ fontSize: "12px", color: "#4f8ef7", fontWeight: "bold" }}>
            Click another node to connect (or same node to cancel)
          </span>
        )}
        <button
          onClick={exportCanvasAsJSON}
          style={{
            marginLeft: "auto",
            padding: "4px 12px",
            fontSize: "11px",
            background: "#4f8ef7",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export JSON
        </button>
      </div>

      <div className="canvas-area" style={{ flex: 1, overflow: "hidden" }}>
        <div
          className="canvas-wrapper"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleBgClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ position: "relative" }}
        >
          {nodes.length === 0 && (
            <div className="canvas-empty">
              <div className="canvas-empty__icon">🗺️</div>
              <p className="canvas-empty__text">Your canvas is empty</p>
              <p className="canvas-empty__sub">Drag assets from the left panel to begin</p>
            </div>
          )}

          {/* SVG for connections */}
          <svg
            className="connections-svg"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#2a3148" />
              </marker>
            </defs>
            {drawConnections()}
          </svg>

          {/* Architecture nodes */}
          {nodes.map((node) => (
            <ArchNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId || node.id === connectingFrom}
              onMouseDown={handleNodeMouseDown}
              onDelete={handleDeleteNode}
              onConnect={handleConnect}
            />
          ))}
        </div>
      </div>

      {/* ── Properties panel ── */}
      {/* <PropertiesPanel
        selectedNode={selectedNode}
        nodeCount={nodes.length}
        connectionCount={connections.length}
      /> */}
    </div>
  );
}

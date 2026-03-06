import { useState } from "react";
import ArchNode from "./ArchNode.jsx";
import Property from "./Property.jsx";

export default function DiagramCanvas({ nodes, setNodes }) {
  const [selectedNodeId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [connections, setConnections] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedNodeForProps, setSelectedNodeForProps] = useState(null);
  const [connectingFromId, setConnectingFromId] = useState(null);

  const handleNodeDoubleClick = (node) => {
    setSelectedNodeForProps(node);
  };

  const showToast = (message, type = "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getCanvasData = () => ({
    nodes: nodes.map(({ id, title, subtitle, icon, status, assetId, category, allowedTargets, requiredBefore, maxOutgoing }) => ({
      id, title, subtitle, icon, status, assetId, category, allowedTargets, requiredBefore, maxOutgoing,
    })),
    connections,
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

  const handleMouseUp = () => setDragging(null);

  const handleBgClick = () => {
    setSelectedId(null);
    setConnectingFromId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "asset") {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newNodeId = Math.max(...nodes.map(n => typeof n.id === 'number' ? n.id : 0), 0) + 1;
        const newNode = {
          id: newNodeId,
          title: data.asset.label,
          subtitle: data.asset.description,
          icon: data.asset.icon,
          color: data.color,
          iconColor: data.iconColor,
          x: Math.max(0, x - 44),
          y: Math.max(0, y - 44),
          status: "Running",
          svgType: data.asset.svgType,
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
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((conn) => conn.from !== nodeId && conn.to !== nodeId)
    );
    setSelectedId(null);
  };

  const handlePortMouseDown = (nodeId) => {
    setConnectingFromId(nodeId);
  };

  const handleConnect = (nodeId) => {
    if (connectingFromId !== null && connectingFromId !== nodeId) {
      const exists = connections.some(
        (conn) => conn.from === connectingFromId && conn.to === nodeId
      );
      if (!exists) {
        setConnections((prev) => [...prev, { from: connectingFromId, to: nodeId }]);
      }
      setConnectingFromId(null);
    }
  };

  const isAIAgentNode = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node?.svgType === "svg3" ||
      node?.category === "NODE_TYPES.AI_AGENT" ||
      node?.assetId === "claude_opus_4_6";
  };

  const drawConnections = () => {
    if (connections.length === 0) return;
    const paths = [];

    connections.forEach((conn, i) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const toNode = nodes.find((n) => n.id === conn.to);
      if (!fromNode || !toNode) return;

      const x1 = fromNode.x + 44;
      const y1 = fromNode.y + 44;
      const x2 = toNode.x + 44;
      const y2 = toNode.y + 44;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const radius = 44;

      const startX = x1 + Math.cos(angle) * radius;
      const startY = y1 + Math.sin(angle) * radius;
      const endX = x2 - Math.cos(angle) * radius;
      const endY = y2 - Math.sin(angle) * radius;

      const isDotted = isAIAgentNode(conn.from) || isAIAgentNode(conn.to);

      paths.push(
        <g key={`conn-${i}`}>
          <circle cx={startX} cy={startY} r="4" fill="#7c6af7" />
          <line
            x1={startX} y1={startY}
            x2={endX} y2={endY}
            stroke="#7c6af7"
            strokeWidth="1.5"
            strokeDasharray={isDotted ? "6 4" : undefined}
            markerEnd="url(#arrowhead)"
          />
        </g>
      );
    });

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

      {connectingFromId && (
        <div style={{
          position: "fixed", top: "60px", left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, padding: "8px 16px", borderRadius: "8px",
          background: "#7c6af7", color: "white", fontSize: "12px",
          pointerEvents: "none",
        }}>
          Now click another node to connect
        </div>
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          padding: "12px 20px", borderRadius: "8px", fontSize: "13px",
          fontWeight: "500", color: "white", maxWidth: "360px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          background: toast.type === "success" ? "#2f855a" : "#b7791f",
          borderLeft: `4px solid ${toast.type === "success" ? "#48bb78" : "#f6ad55"}`,
        }}>
          {toast.message}
        </div>
      )}

      <div style={{ padding: "8px 16px", borderBottom: "1px solid #2a2a3d", display: "flex", gap: "8px", alignItems: "center", background: "#0d0d14" }}>
        <span style={{ fontSize: "12px", color: "#a0aec0" }}>
          Nodes: {nodes.length} | Connections: {connections.length}
        </span>
        <button
          onClick={exportCanvasAsJSON}
          style={{
            marginLeft: "auto", padding: "4px 12px", fontSize: "11px",
            background: "#4f8ef7", color: "white", border: "none",
            borderRadius: "4px", cursor: "pointer",
          }}
        >
          Export JSON
        </button>
      </div>

      <div className="canvas-area" style={{ flex: 1, overflow: "auto" }}>
        <div
          className="canvas-wrapper"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleBgClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ position: "relative", width: "100%", height: "100%", minHeight: "600px" }}
        >
          {nodes.length === 0 && (
            <div className="canvas-empty">
              <div className="canvas-empty__icon">🗺️</div>
              <p className="canvas-empty__text">Your canvas is empty</p>
              <p className="canvas-empty__sub">Drag assets from the left panel to begin</p>
            </div>
          )}

          <svg
            className="connections-svg"
            aria-hidden="true"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#7c6af7" />
              </marker>
            </defs>
            {drawConnections()}
          </svg>

          {nodes.map((node) => (
            <ArchNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onMouseDown={handleNodeMouseDown}
              onDelete={handleDeleteNode}
              onConnect={handleConnect}
              onDoubleClick={handleNodeDoubleClick}
              isConnecting={connectingFromId !== null && connectingFromId !== node.id}
              onPortMouseDown={handlePortMouseDown}
            />
          ))}
        </div>
      </div>

      <Property
        node={selectedNodeForProps}
        onClose={() => setSelectedNodeForProps(null)}
        onSave={(props) => console.log("Saved props:", props)}
      />
    </div>
  );
}
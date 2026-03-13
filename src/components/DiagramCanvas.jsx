import { useState, useRef, useEffect } from "react";
import ArchNode from "./ArchNode.jsx";
import Property from "./Property.jsx";
import { loadWorkflowData } from "../data/savedata.js";
import zoomInIcon from "../assets/zoomin.svg";
import zoomOutIcon from "../assets/zoomout.svg";

export default function DiagramCanvas({ nodes, setNodes, connections, setConnections, onPropertySave, onLoadWorkflow }) {
  const [selectedNodeId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedNodeForProps, setSelectedNodeForProps] = useState(null);
  const [connectingFromId, setConnectingFromId] = useState(null);
  const [dragConnection, setDragConnection] = useState(null);
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);
  const draggingRef = useRef(null);
  const dragConnectionRef = useRef(null);
  const nodesRef = useRef(nodes);
  const connectionsRef = useRef(connections);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { connectionsRef.current = connections; }, [connections]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (draggingRef.current) {
        const { nodeId, offsetX, offsetY } = draggingRef.current;
        setNodes((prev) =>
          prev.map((n) =>
            n.id === nodeId
              ? { ...n, x: (e.clientX - offsetX) / zoom, y: (e.clientY - offsetY) / zoom }
              : n
          )
        );
      }
      if (dragConnectionRef.current) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const updated = {
          ...dragConnectionRef.current,
          mouseX: (e.clientX - rect.left) / zoom,
          mouseY: (e.clientY - rect.top) / zoom,
        };
        dragConnectionRef.current = updated;
        setDragConnection({ ...updated });
      }
    };

    const onMouseUp = (e) => {
      draggingRef.current = null;
      setDragging(null);

      if (dragConnectionRef.current) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const mx = (e.clientX - rect.left) / zoom;
          const my = (e.clientY - rect.top) / zoom;
          const sizes = {
            svg1: { w: 88, h: 88 }, svg2: { w: 149, h: 90 },
            svg3: { w: 80, h: 80 }, svg4: { w: 64, h: 40 },
          };
          const fromId = dragConnectionRef.current.fromId;
          const fromNode = nodesRef.current.find((n) => n.id === fromId);

          const target = nodesRef.current.find((n) => {
            if (n.id === fromId) return false;
            const s = sizes[n.svgType] || { w: 88, h: 88 };
            return (
              mx >= n.x - 10 &&
              mx <= n.x + s.w + 10 &&
              my >= n.y - 10 &&
              my <= n.y + s.h + 40
            );
          });

          if (target && fromNode) {
            const exists = connectionsRef.current.some(
              (conn) => conn.from === fromId && conn.to === target.id
            );
            const allowedTargets = fromNode.allowedTargets || [];
            const isAllowed = allowedTargets.length === 0 || allowedTargets.includes(target.assetId);

            if (!exists && isAllowed) {
              setConnections((prev) => [...prev, { from: fromId, to: target.id }]);
            } else if (exists) {
              showToast("Connection already exists.", "warning");
            } else if (!isAllowed) {
              showToast(`${fromNode.title} cannot connect to ${target.title}.`, "warning");
            }
          }
        }
        dragConnectionRef.current = null;
        setDragConnection(null);
        setConnectingFromId(null);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [setNodes, setConnections, zoom]);

  const handleNodeDoubleClick = (node) => setSelectedNodeForProps(node);

  const showToast = (message, type = "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getCanvasData = () => ({
    nodes: nodes.map(({ id, title, subtitle, icon, status, assetId, allowedTargets, requiredBefore }) => ({
      id, title, subtitle, icon, status, assetId, allowedTargets, requiredBefore,
    })),
    connections,
    exportedAt: new Date().toISOString(),
  });

  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setSelectedId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    const d = { nodeId, offsetX: e.clientX - node.x * zoom, offsetY: e.clientY - node.y * zoom };
    draggingRef.current = d;
    setDragging(d);
  };

  const handleBgClick = () => {
    setSelectedId(null);
    setConnectingFromId(null);
    dragConnectionRef.current = null;
    setDragConnection(null);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "asset") {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        const newNodeId = Math.max(...nodes.map(n => typeof n.id === "number" ? n.id : 0), 0) + 1;
        setNodes((prev) => [...prev, {
          id: newNodeId,
          title: data.asset.label,
          icon: data.asset.icon,
          color: data.color,
          iconColor: data.iconColor,
          x: Math.max(0, x - 44),
          y: Math.max(0, y - 44),
          status: "Running",
          svgType: data.asset.svgType,
          assetId: data.asset.id,
          allowedTargets: data.asset.allowedTargets,
          requiredBefore: data.asset.requiredBefore,
        }]);
      }
    } catch (error) {
      console.error("Error parsing dropped data:", error);
    }
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((conn) => conn.from !== nodeId && conn.to !== nodeId));
    setSelectedId(null);
  };

  const handlePortMouseDown = (nodeId) => setConnectingFromId(nodeId);

  const handleConnect = (nodeId) => {
    if (connectingFromId !== null && connectingFromId !== nodeId) {
      const fromNode = nodes.find((n) => n.id === connectingFromId);
      const toNode = nodes.find((n) => n.id === nodeId);
      const exists = connections.some((conn) => conn.from === connectingFromId && conn.to === nodeId);
      const allowedTargets = fromNode?.allowedTargets || [];
      const isAllowed = allowedTargets.length === 0 || allowedTargets.includes(toNode?.assetId);

      if (!exists && isAllowed) {
        setConnections((prev) => [...prev, { from: connectingFromId, to: nodeId }]);
      } else if (exists) {
        showToast("Connection already exists.", "warning");
      } else if (!isAllowed) {
        showToast(`${fromNode?.title} cannot connect to ${toNode?.title}.`, "warning");
      }
      setConnectingFromId(null);
    }
  };

  const isAIAgentNode = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node?.svgType === "svg3" || node?.assetId === "claude_opus_4_6";
  };

  const handlePortDragStart = (nodeId, e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (!node) return;
    const sizes = {
      svg1: { w: 88, h: 88 }, svg2: { w: 149, h: 90 },
      svg3: { w: 80, h: 80 }, svg4: { w: 64, h: 40 },
    };
    const s = sizes[node.svgType] || { w: 88, h: 88 };
    const dc = {
      fromId: nodeId,
      fromX: node.x + s.w / 2,
      fromY: node.y + s.h,
      mouseX: (e.clientX - rect.left) / zoom,
      mouseY: (e.clientY - rect.top) / zoom,
    };
    dragConnectionRef.current = dc;
    setDragConnection(dc);
  };

  const drawConnections = () => {
    const paths = [];
    connections.forEach((conn, i) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const toNode = nodes.find((n) => n.id === conn.to);
      if (!fromNode || !toNode) return;
      const x1 = fromNode.x + 44, y1 = fromNode.y + 44;
      const x2 = toNode.x + 44, y2 = toNode.y + 44;
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
            x1={startX} y1={startY} x2={endX} y2={endY}
            stroke="#7c6af7" strokeWidth="1.5"
            strokeDasharray={isDotted ? "6 4" : undefined}
            markerEnd="url(#arrowhead)"
          />
        </g>
      );
    });

    if (dragConnection) {
      const isDotted = isAIAgentNode(dragConnection.fromId);
      paths.push(
        <g key="drag-preview" style={{ pointerEvents: "none" }}>
          <circle cx={dragConnection.fromX} cy={dragConnection.fromY} r="5" fill="#7c6af7" />
          <line
            x1={dragConnection.fromX} y1={dragConnection.fromY}
            x2={dragConnection.mouseX} y2={dragConnection.mouseY}
            stroke="#7c6af7" strokeWidth="1.5" opacity="0.75"
            strokeDasharray={isDotted ? "6 4" : "4 3"}
            markerEnd="url(#arrowhead)"
          />
        </g>
      );
    }
    return paths;
  };

  const exportCanvasAsJSON = () => {
    const blob = new Blob([JSON.stringify(getCanvasData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canvas-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadExistingWorkflow = () => {
    const workflow = loadWorkflowData();
    if (!workflow) {
      showToast("No saved workflow found. Build and save one first.", "warning");
      return;
    }
    const restoredNodes = workflow.nodes.map((n) => ({
      id: typeof n.id === "string" && !isNaN(n.id) ? Number(n.id) : n.id,
      title: n.title,
      icon: n.icon,
      iconType: n.iconType || "img",
      color: n.color,
      iconColor: n.iconColor,
      svgType: n.svgType || "svg1",
      assetId: n.assetId,
      category: n.category,
      allowedTargets: n.allowedTargets || [],
      requiredBefore: n.requiredBefore || [],
      maxOutgoing: n.maxOutgoing,
      x: n.x,
      y: n.y,
      status: n.status || "Running",
    }));
    const restoredConnections = (workflow.connections || []).map((e) => ({
      from: typeof e.from === "string" && !isNaN(e.from) ? Number(e.from) : e.from,
      to: typeof e.to === "string" && !isNaN(e.to) ? Number(e.to) : e.to,
    }));
    setNodes(restoredNodes);
    setConnections(restoredConnections);
    onLoadWorkflow?.(restoredNodes, restoredConnections, workflow.workflowName || workflow.name || "Untitled");
    showToast(`✅ Workflow restored! ${restoredNodes.length} nodes, ${restoredConnections.length} connections.`, "success");
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: "column" }}>

      {connectingFromId && (
        <div style={{
          position: "fixed", top: "60px", left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, padding: "8px 16px", borderRadius: "8px",
          background: "#7c6af7", color: "white", fontSize: "12px", pointerEvents: "none",
        }}>
          Now click another node to connect
        </div>
      )}

      {dragConnection && (
        <div style={{
          position: "fixed", top: "60px", left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, padding: "8px 16px", borderRadius: "20px",
          background: "rgba(124,106,247,0.15)", border: "1px solid #7c6af7",
          color: "#a78bfa", fontSize: "12px", pointerEvents: "none",
        }}>
          Drop onto a node to connect
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

      {/* Toolbar */}
      <div style={{
        padding: "8px 16px", borderBottom: "1px solid #2a2a3d",
        display: "flex", gap: "8px", alignItems: "center", background: "#0d0d14",
      }}>
        <button
          onClick={handleLoadExistingWorkflow}
          style={{
            padding: "4px 12px", fontSize: "11px",
            background: "transparent", color: "#a78bfa",
            border: "1px solid #7c6af7",
            borderRadius: "4px", cursor: "pointer",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(124,106,247,0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          Existing Workflow
        </button>

        <span style={{ marginLeft: "auto", color: "#4b5563", fontSize: "11px" }}>
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={exportCanvasAsJSON}
          style={{
            padding: "4px 12px", fontSize: "11px",
            background: "#4f8ef7", color: "white", border: "none",
            borderRadius: "4px", cursor: "pointer",
          }}
        >
          Export JSON
        </button>
      </div>

      {/* Canvas area */}
      <div className="canvas-area" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div
          ref={canvasRef}
          className="canvas-wrapper"
          onClick={handleBgClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
            minHeight: "600px",
            cursor: dragConnection ? "crosshair" : "default",
            userSelect: "none",
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          {/* Empty state */}
          {nodes.length === 0 && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "12px", pointerEvents: "none",
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                Drag and drop items here to configure
              </p>
              <button
                onClick={handleLoadExistingWorkflow}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: "transparent", border: "none",
                  color: "#6b7280", fontSize: "13px", cursor: "pointer",
                  pointerEvents: "all",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#a78bfa"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Use an existing template
              </button>
            </div>
          )}

          <svg className="connections-svg" aria-hidden="true"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
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
              isDragConnecting={!!dragConnection && dragConnection.fromId !== node.id}
              onPortDragStart={handlePortDragStart}
            />
          ))}
        </div>

        {/* Zoom buttons */}
        <div style={{
          position: "absolute", bottom: "24px", right: "24px",
          display: "flex", flexDirection: "column", gap: "4px",
          zIndex: 10,
        }}>
          <button
            onClick={() => setZoom((z) => Math.min(+(z + 0.1).toFixed(1), 2))}
            style={{
              width: "32px", height: "32px",
              background: "#1e293b", border: "1px solid #2a2a3d",
              borderRadius: "6px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#7c6af7"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2a2a3d"}
          >
            <img src={zoomInIcon} alt="Zoom In" width="16" height="16" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(+(z - 0.1).toFixed(1), 0.3))}
            style={{
              width: "32px", height: "32px",
              background: "#1e293b", border: "1px solid #2a2a3d",
              borderRadius: "6px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#7c6af7"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2a2a3d"}
          >
            <img src={zoomOutIcon} alt="Zoom Out" width="16" height="16" />
          </button>
        </div>
      </div>

      <Property
        node={selectedNodeForProps}
        onClose={() => setSelectedNodeForProps(null)}
        onSave={(props) => {
          onPropertySave?.({
            nodeId: selectedNodeForProps?.id,
            assetId: props.assetId,
            properties: props.properties,
          });
        }}
      />
    </div>
  );
}
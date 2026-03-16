import { useState } from "react";
import "./styles/global.css";
import "./App.css";
import Header from "./components/Header.jsx";
import AssetsLibrary from "./components/AssetsLibrary.jsx";
import DiagramCanvas from "./components/DiagramCanvas.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState();
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [nodeProperties, setNodeProperties] = useState({});
  const [currentWorkflowName, setCurrentWorkflowName] = useState("Untitled");

  const handlePropertySave = ({ nodeId, properties }) => {
    setNodeProperties((prev) => ({ ...prev, [nodeId]: properties }));
  };

  const handleLoadWorkflow = (restoredNodes, restoredConnections, workflowName) => {
    setNodes(restoredNodes);
    setConnections(restoredConnections);
    setNodeProperties({});
    if (workflowName) setCurrentWorkflowName(workflowName);
  };

  const handleClearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setNodeProperties({});
    setCurrentWorkflowName("Untitled");
  };

  // ── Export JSON using nodes + connections directly from state
  const handleLaunch = () => {
    const data = {
      workflowName: currentWorkflowName,
      exportedAt: new Date().toISOString(),
      nodes: nodes.map(({ id, title, subtitle, icon, status, assetId, allowedTargets, requiredBefore }) => ({
        id, title, subtitle, icon, status, assetId, allowedTargets, requiredBefore,
      })),
      connections,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("🚀 Workflow launched and exported.");
  };

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        nodes={nodes}
        connections={connections}
        nodeProperties={nodeProperties}
        onLoadWorkflow={handleLoadWorkflow}
        onClearCanvas={handleClearCanvas}
        currentWorkflowName={currentWorkflowName}
        onWorkflowNameChange={setCurrentWorkflowName}
        onLaunch={handleLaunch}
      />
      <div className="main-layout">
        <AssetsLibrary />
        <DiagramCanvas
          nodes={nodes}
          setNodes={setNodes}
          connections={connections}
          setConnections={setConnections}
          onPropertySave={handlePropertySave}
          onLoadWorkflow={handleLoadWorkflow}
        />
      </div>
    </div>
  );
}
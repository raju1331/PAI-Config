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
    // Blank canvas → Untitled, else use saved name
    setCurrentWorkflowName(
      restoredNodes.length === 0 ? "Untitled" : (workflowName || "Untitled")
    );
  };

  const handleClearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setNodeProperties({});
    setCurrentWorkflowName("Untitled");
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

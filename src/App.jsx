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

  const handlePropertySave = ({ nodeId, properties }) => {
    setNodeProperties((prev) => ({ ...prev, [nodeId]: properties }));
  };

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        nodes={nodes}
        connections={connections}
        nodeProperties={nodeProperties}
      />
      <div className="main-layout">
        <AssetsLibrary />
        <DiagramCanvas
          nodes={nodes}
          setNodes={setNodes}
          connections={connections}
          setConnections={setConnections}
          onPropertySave={handlePropertySave}
        />
      </div>
    </div>
  );
}
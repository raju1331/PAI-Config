import { useState } from "react";

// ── Global styles ──────────────────────────────────────────────────────────────
import "./styles/global.css";
import "./App.css";

// ── Components ─────────────────────────────────────────────────────────────────
import Header         from "./components/Header.jsx";
import AssetsLibrary  from "./components/AssetsLibrary.jsx";
import DiagramCanvas  from "./components/DiagramCanvas.jsx";

/**
 * App
 * Root component — composes the three main layout sections:
 *   1. Header        (top bar)
 *   2. AssetsLibrary (left sidebar)
 *   3. DiagramCanvas (canvas + right properties panel)
 */
export default function App() {
  const [activeTab, setActiveTab] = useState();
  const [nodes, setNodes] = useState([]); // Start with empty canvas

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="main-layout">
        <AssetsLibrary />
        <DiagramCanvas nodes={nodes} setNodes={setNodes} />
      </div>
    </div>
  );
}

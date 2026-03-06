import { useState } from "react";

export default function PropertiesPanel({ node, onClose, onSave }) {
  const [dataSources, setDataSources] = useState("PLM");
  const [ai, setAi] = useState("LLM Enablement");
  const [simParam, setSimParam] = useState("Cycle Time");
  const [xr, setXr] = useState("AVP");
  const [collab, setCollab] = useState("Single User");

  if (!node) return null;

  const handleSave = () => {
    onSave?.({ dataSources, ai, simParam, xr, collab });
    onClose?.();
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 998, background: "transparent",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, width: "320px", height: "100vh",
        background: "#000000", borderLeft: "1px solid #000000",
        zIndex: 999, display: "flex", flexDirection: "column",
        padding: "24px 20px", overflowY: "auto", fontFamily: "Arial, sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Property Panel</h2>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", color: "#a0aec0",
            fontSize: "18px", cursor: "pointer", padding: "4px",
          }}>✕</button>
        </div>

        {/* Data Sources */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#a0aec0", fontSize: "13px", display: "block", marginBottom: "10px" }}>Data Sources</label>
          <div style={{ display: "flex", gap: "16px" }}>
            {["PLM", "PDM", "PLC"].map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#e2e8f0", fontSize: "13px" }}>
                <input
                  type="radio" name="dataSources" value={opt}
                  checked={dataSources === opt}
                  onChange={() => setDataSources(opt)}
                  style={{ accentColor: "#7c3aed" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* AI */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#a0aec0", fontSize: "13px", display: "block", marginBottom: "10px" }}>AI</label>
          <select
            value={ai}
            onChange={(e) => setAi(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", background: "#1c1c2e",
              border: "1px solid #2a2a3d", borderRadius: "8px",
              color: "#e2e8f0", fontSize: "13px", cursor: "pointer",
            }}
          >
            <option>LLM Enablement</option>
            <option>Computer Vision</option>
            <option>Reinforcement Learning</option>
          </select>
        </div>

        {/* Simulation Parameters */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#a0aec0", fontSize: "13px", display: "block", marginBottom: "10px" }}>Simulation Parameters</label>
          <select
            value={simParam}
            onChange={(e) => setSimParam(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", background: "#1c1c2e",
              border: "1px solid #2a2a3d", borderRadius: "8px",
              color: "#e2e8f0", fontSize: "13px", cursor: "pointer",
            }}
          >
            <option>Cycle Time</option>
            <option>Throughput</option>
            <option>Resource Utilization</option>
          </select>
        </div>

        {/* XR */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#a0aec0", fontSize: "13px", display: "block", marginBottom: "10px" }}>XR</label>
          <div style={{ display: "flex", gap: "16px" }}>
            {["AVP", "Oculus"].map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#e2e8f0", fontSize: "13px" }}>
                <input
                  type="radio" name="xr" value={opt}
                  checked={xr === opt}
                  onChange={() => setXr(opt)}
                  style={{ accentColor: "#7c3aed" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Collaboration Modes */}
        <div style={{ marginBottom: "32px" }}>
          <label style={{ color: "#a0aec0", fontSize: "13px", display: "block", marginBottom: "10px" }}>Collaboration Modes</label>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Single User", "Multi User"].map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#e2e8f0", fontSize: "13px" }}>
                <input
                  type="radio" name="collab" value={opt}
                  checked={collab === opt}
                  onChange={() => setCollab(opt)}
                  style={{ accentColor: "#7c3aed" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #2a2a3d", marginBottom: "24px" }} />

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
     <button
  onClick={handleSave}
  style={{
    padding: "10px 20px", background: "#1c1c2e",
    border: "1px solid #2a2a3d", borderRadius: "8px",
    color: "#e2e8f0", fontSize: "13px", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "8px",
    transition: "all 0.2s",
  }}
  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#7c3aed"}
  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2a2a3d"}
>
  <img src="/src/assets/Icon.svg" alt="save" width="16" height="16" />
  Save
</button>
        </div>
      </div>
    </>
  );
}
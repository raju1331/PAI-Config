import { useState } from "react";
import paiLogo from "../assets/pai.svg";
import saveIcon from "../assets/icon.svg";
import sidebarIcon from "../assets/iconoir_sidebar-collapse.svg";
import backIcon from "../assets/lsicon_left-filled.svg";

export default function Header({ activeTab, onTabChange, nodes = [], connections = [], nodeProperties = {} }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (nodes.length === 0) {
      showToast("Add at least one node before saving.", "error");
      return;
    }

    const workflowData = {
      workflowName: `Workflow_${Date.now()}`,
      createdAt: new Date().toISOString(),
      nodes: nodes.map((node) => ({
        id: String(node.id),
        name: node.title,
        type: node.svgType,
        assetId: node.assetId,
        position: { x: node.x, y: node.y },
        properties: nodeProperties?.[node.id] || {},
      })),
      connections: connections.map((conn) => ({
        source: String(conn.from),
        target: String(conn.to),
      })),
    };

    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/workflow/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      showToast("Workflow saved successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save workflow.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          padding: "12px 20px", borderRadius: "8px", fontSize: "13px",
          fontWeight: "500", color: "white", maxWidth: "360px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          background: toast.type === "success" ? "#2f855a" : "#c53030",
          borderLeft: `4px solid ${toast.type === "success" ? "#48bb78" : "#fc8181"}`,
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <header className="header">
        <div className="header__left">
          <button className="header__back-btn">
            <img src={backIcon} alt="Back" className="header__icon" />
          </button>
          <div className="header__logo">
            <img src={paiLogo} alt="PAI" className="header__logo-img" />
            <span className="header__logo-text">Configurator</span>
          </div>
          <button className="header__sidebar-btn">
            <img src={sidebarIcon} alt="Sidebar" className="header__icon" />
          </button>
          <div className="header__divider" />
        </div>

        <div className="header__actions">
          {/* Save button */}
          <button
            className="btn-secondary"
            onClick={handleSave}
            disabled={saving}
            style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            {saving ? (
              <>
                <div style={{
                  width: "12px", height: "12px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Saving...
              </>
            ) : (
              <>
                <img src={saveIcon} alt="Save" className="header__btn-icon" />
                Save
              </>
            )}
          </button>

          {/* Launch button */}
          <button className="btn-primary">
            ▶ Launch
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </header>
    </>
  );
}
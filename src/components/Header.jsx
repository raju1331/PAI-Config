import { useState } from "react";
import paiLogo from "../assets/pai.svg";
import saveIcon from "../assets/icon.svg";
import sidebarIcon from "../assets/iconoir_sidebar-collapse.svg";
import backIcon from "../assets/lsicon_left-filled.svg";
import { saveWorkflowData } from "../data/savedata.js";

export default function Header({ activeTab, onTabChange, nodes = [], connections = [], nodeProperties = {}, onLoadWorkflow, onClearCanvas, currentWorkflowName, onWorkflowNameChange }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveClick = () => {
    if (nodes.length === 0) {
      showToast("Add at least one node before saving.", "error");
      return;
    }
    setWorkflowName(currentWorkflowName && currentWorkflowName !== "Untitled" ? currentWorkflowName : "");
    setDescription("");
    setShowPopup(true);
  };

  const handlePopupSave = async () => {
    if (!workflowName.trim()) {
      showToast("Please enter a workflow name.", "error");
      return;
    }

    const workflowData = {
      name: workflowName.trim(),
      description: description.trim(),
      nodes: nodes.map((node) => ({
        id: String(node.id),
        title: node.title,
        assetId: node.assetId,
        svgType: node.svgType,
        color: node.color,
        iconColor: node.iconColor,
        icon: node.icon,
        iconType: node.iconType || "img",
        category: node.category,
        allowedTargets: node.allowedTargets || [],
        requiredBefore: node.requiredBefore || [],
        maxOutgoing: node.maxOutgoing,
        position: { x: node.x, y: node.y },
        selectedProperties: nodeProperties?.[node.id] || {},
      })),
      connections: connections.map((conn) => ({
        from: String(conn.from),
        to: String(conn.to),
      })),
    };

    // Save to localStorage
    saveWorkflowData(nodes, connections, nodeProperties);

    // ── Close popup + update name immediately
    onWorkflowNameChange?.(workflowName.trim());
    setShowPopup(false);
    showToast("Saving workflow...", "success");

    // ── Save to backend in background
    try {
      const res = await fetch("http://localhost:5000/api/workflow/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      showToast("Workflow saved successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save.", "error");
    }
  };

  const handleDeleteCanvas = () => {
    if (window.confirm("Clear the current canvas? This cannot be undone.")) {
      onClearCanvas?.();
      onWorkflowNameChange?.("Untitled");
      setShowPopup(false);
      showToast("Canvas cleared.", "success");
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

      {/* Save Popup */}
      {showPopup && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 8000,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            background: "#000000", border: "1px solid #2a2a3d",
            borderRadius: "12px", padding: "28px",
            width: "460px", maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: "600", margin: 0 }}>
                Save Workflow
              </h3>
              <button onClick={() => setShowPopup(false)}
                style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "18px" }}>
                ✕
              </button>
            </div>

            {/* Workflow Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ color: "#9ca3af", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                Workflow Name *
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="e.g. Smart Factory Pipeline"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handlePopupSave(); }}
                style={{
                  width: "100%", padding: "9px 12px",
                  background: "#1a1a2e", border: "1px solid #2a2a3d",
                  borderRadius: "6px", color: "#e2e8f0", fontSize: "13px",
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#7c6af7"}
                onBlur={(e) => e.target.style.borderColor = "#2a2a3d"}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ color: "#9ca3af", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
                style={{
                  width: "100%", padding: "9px 12px",
                  background: "#1a1a2e", border: "1px solid #2a2a3d",
                  borderRadius: "6px", color: "#e2e8f0", fontSize: "13px",
                  outline: "none", resize: "vertical", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.style.borderColor = "#7c6af7"}
                onBlur={(e) => e.target.style.borderColor = "#2a2a3d"}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* Delete Canvas */}
              {/* <button
                onClick={handleDeleteCanvas}
                style={{
                  padding: "8px 18px", background: "transparent",
                  color: "#fc8181", border: "1px solid #fc8181",
                  borderRadius: "6px", cursor: "pointer", fontSize: "13px",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(252,129,129,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                🗑 Delete Canvas
              </button> */}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowPopup(false)}
                  style={{
                    padding: "8px 18px", background: "transparent",
                    color: "#6b7280", border: "1px solid #2a2a3d",
                    borderRadius: "6px", cursor: "pointer", fontSize: "13px",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handlePopupSave}
                  disabled={saving}
                  style={{
                    padding: "8px 24px",
                    background: "linear-gradient(135deg, #7c6af7, #4f8ef7)",
                    color: "white", border: "none",
                    borderRadius: "6px", cursor: saving ? "not-allowed" : "pointer",
                    fontSize: "13px", fontWeight: "500",
                    opacity: saving ? 0.7 : 1,
                    display: "flex", alignItems: "center", gap: "6px",
                  }}
                >
                  <img src={saveIcon} alt="Save" className="header__btn-icon" />
                  Save
                </button>
              </div>
            </div>
          </div>
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

          {/* ── Workflow name on LEFT side after divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
  <span style={{
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "500",
  }}>
    {currentWorkflowName || "Untitled"}
  </span>
  </div>
        </div>

        <div className="header__actions">
          <button
            className="btn-secondary"
            onClick={handleSaveClick}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <img src={saveIcon} alt="Save" className="header__btn-icon" />
            Save
          </button>

          <button className="btn-primary">▶ Launch</button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </header>
    </>
  );
}

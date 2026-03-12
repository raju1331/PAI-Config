import { useState, useEffect } from "react";

export default function Property({ node, onClose, onSave }) {

  const [config, setConfig] = useState(null);
  const [values, setValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch properties when node changes
  useEffect(() => {

    if (!node) return;

    setLoading(true);
    setError(null);
    setConfig(null);
    setValues({});
    setInitialValues({});

    fetch(`http://localhost:5000/api/properties/${node.assetId || node.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No properties found for this asset");
        return res.json();
      })
      .then((data) => {

        setConfig(data);

        // Default values
        const defaults = {};

        data.sections.forEach((section) => {
          defaults[section.title] = section.options[0];
        });

        setValues(defaults);
        setInitialValues(defaults); // store original values

      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [node?.assetId]);

  if (!node) return null;

  console.log("node object:", node);
  console.log("assetId:", node.assetId);


  const handleChange = (sectionTitle, value) =>
    setValues((prev) => ({ ...prev, [sectionTitle]: value }));

const handleSave = async () => {

  // Check if any property changed
  const hasChanges = Object.keys(values).some(
    (key) => values[key] !== initialValues[key]
  );

  if (!hasChanges) {
    console.log("No changes detected. API call skipped.");
    onClose?.();
    return;
  }

  const payload = {
    nodeId: node.id,
    assetId: node.assetId,
    properties: values
  };

  console.log("Payload to backend:", payload);

  try {

    const res = await fetch("http://localhost:5000/api/properties/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("Backend response:", data);

  } catch (error) {
    console.error("Error saving properties:", error);
  }

  onSave?.(payload);
  onClose?.();
};

  return (
    <div style={{
      position: "fixed",
      top: "52px", right: 0,
      width: "340px",
      height: "calc(100vh - 52px)",
      background: "#000000",
      borderLeft: "1px solid #2a2a3d",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      boxShadow: "-4px 0 24px rgba(0,0,0,0.5)",
    }}>

      {/* Header */}
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid #2a2a3d",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: "600" }}>
          Property Panel
        </span>

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
            padding: "2px 6px",
          }}
        >
          ✕
        </button>
      </div>


      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 20px" }}>

        {/* Loading */}
        {loading && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            gap: "12px",
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              border: "3px solid #2a2a3d",
              borderTop: "3px solid #7c6af7",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
              Loading properties...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            padding: "16px",
            marginTop: "8px",
            background: "rgba(252,129,74,0.08)",
            border: "1px solid rgba(252,129,74,0.3)",
            borderRadius: "8px",
          }}>
            <p style={{ color: "#fc814a", fontSize: "13px", margin: 0 }}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Sections */}
        {!loading && !error && config && (
          <>
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                fontSize: "11px",
                color: "#7c6af7",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                {config.label}
              </span>
            </div>

            {config.sections.map((section, idx) => (
              <div key={idx}>

                <div style={{ marginBottom: "20px" }}>
                  <p style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}>
                    {section.title}
                  </p>

                  {/* RADIO */}
                  {section.type === "radio" && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                      {section.options.map((opt) => (
                        <label key={opt}
                          onClick={() => handleChange(section.title, opt)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            cursor: "pointer",
                            color: "#e2e8f0",
                            fontSize: "13px",
                          }}>
                          <div style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: `2px solid ${values[section.title] === opt ? "#7c6af7" : "#4b5563"}`,
                            background: values[section.title] === opt
                              ? "radial-gradient(circle, #7c6af7 45%, transparent 50%)"
                              : "transparent",
                          }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* DROPDOWN */}
                  {section.type === "dropdown" && (
                    <select
                      value={values[section.title] || section.options[0]}
                      onChange={(e) => handleChange(section.title, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "#1a1a2e",
                        border: "1px solid #2a2a3d",
                        borderRadius: "6px",
                        color: "#e2e8f0",
                        fontSize: "13px",
                      }}
                    >
                      {section.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                </div>

                {idx < config.sections.length - 1 && (
                  <div style={{ borderBottom: "1px solid #2a2a3d", marginBottom: "20px" }} />
                )}

              </div>
            ))}
          </>
        )}

      </div>

      {/* Footer */}
      {!loading && !error && config && (
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid #2a2a3d",
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 28px",
              background: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid #2a2a3d",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Save
          </button>
        </div>
      )}

    </div>
  );
}
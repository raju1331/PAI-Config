import { useState } from "react";
import "../styles/CreateNodeModal.css";

/* ─── Static Config ──────────────────────────────────────── */
const ASSET_CONFIG = {
  OmniverseModels: {
    label: "Omniverse Models",
    icon: "/src/assets/modelss.svg",
    iconType: "img",
    color: "#12121f",
    iconColor: "#4f8ef7",
    svgType: "svg1",
  },
  Simulation: {
    label: "Simulation Engines",
    icon: "/src/assets/subtemp.svg",
    iconType: "img",
    color: "#12121f",
    iconColor: "#48bb78",
    svgType: "svg2",
  },
  AI_Agents: {
    label: "AI Agents",
    icon: "/src/assets/ai.svg",
    iconType: "img",
    color: "#12121f",
    iconColor: "#ed8936",
    svgType: "svg3",
  },
  Connectors: {
    label: "Connectors",
    icon: "/src/assets/Link.svg",
    iconType: "img",
    color: "#12121f",
    iconColor: "#fc8181",
    svgType: "svg4",
  },
};

// ALL_NODE_IDS is no longer a hardcoded array.  The parent component
// (AssetsLibrary) will pass in the current list of node IDs via props.
// This keeps the modal in sync with whatever assets are available in
// the library, whether they come from a static file or an API.


const toSnakeCase = (str) =>
  str.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

const toggleItem = (arr, val) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

const EMPTY_FORM = {
  asset: "",
  customAsset: "",
  label: "",
  containerId: "",
  dockerImageId: "",
  allowedTargets: [],
  requiredBefore: [],
  customAllowedTarget: "",
  customRequiredBefore: "",
  showCustomAllowed: false,
  showCustomRequired: false
};

// initial sample JSON shown when user opens the properties editor
const SAMPLE_JSON = `{
  "exampleKey": "exampleValue"
}`;

function Field({ label, required, accent, children }) {
  return (
    <div className="pai-field">
      <label className="pai-field__label">
        {label}
        {required && (
          <span className="pai-field__required" style={{ color: accent }}>
            {" "}*
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function PlusIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CreateNodeModal({ open, onClose, allNodeIds = [] }) {

  const [form, setForm] = useState(EMPTY_FORM);
  const [savedJson, setSavedJson] = useState(null);
  const [copied, setCopied] = useState(false);

  // new state for properties editor
  const [showProperties, setShowProperties] = useState(false);
  const [propertiesText, setPropertiesText] = useState(SAMPLE_JSON);

  /* Accent color fix */
  const accent =
    form.asset && ASSET_CONFIG[form.asset]
      ? ASSET_CONFIG[form.asset].iconColor
      : "#4f8ef7";

  const nodeId = toSnakeCase(form.label);

  const canSave =
    (form.asset !== "" || form.customAsset !== "") &&
    form.label;

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setSavedJson(null);
    setShowProperties(false);
    setPropertiesText(SAMPLE_JSON);
    onClose();
  };

  const handleSave = async () => {

    if (!canSave) return;

    const assetKey =
      form.asset === "Others"
        ? toSnakeCase(form.customAsset)
        : form.asset;

    const meta =
      ASSET_CONFIG[form.asset] || {
        label: form.customAsset,
        icon: "",
        iconType: "img",
        color: "#12121f",
        iconColor: "#4f8ef7",
        svgType: "svg1",
      };

    const allowedTargets = [
      ...form.allowedTargets,
      ...(form.customAllowedTarget
        ? [form.customAllowedTarget]
        : []),
    ];

    const requiredBefore = [
      ...form.requiredBefore,
      ...(form.customRequiredBefore
        ? [form.customRequiredBefore]
        : []),
    ];

    const result = {
      [assetKey]: {
        ...meta,
        nodes: {
          [nodeId]: {
            id: nodeId,
            label: form.label,
            containerId: form.containerId,
            dockerImageId: form.dockerImageId,
            allowedTargets,
            requiredBefore,
            svgType: meta.svgType,
          },
        },
      },
    };

    // attach properties if editor visible and contains valid JSON
    if (showProperties && propertiesText.trim()) {
      try {
        result[assetKey].nodes[nodeId].properties =
          JSON.parse(propertiesText);
      } catch (err) {
        console.error("Invalid JSON in properties field", err);
      }
    }

    setSavedJson(result);

    try {

      const resp = await fetch(
        "http://localhost:5000/api/importAssets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        }
      );

      if (!resp.ok) {
        console.error("Failed to save node", resp.statusText);
      } else {
        console.log("Node saved to backend");
      }

    } catch (err) {
      console.error("Error posting node to backend", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      JSON.stringify(savedJson, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <>
      <div className="pai-backdrop" onClick={handleClose} />

      <div className="pai-modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="pai-modal__header">

          <div className="pai-modal__header-left">

            <div
              className="pai-modal__icon-wrap"
              style={{
                background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
                border: `1px solid ${accent}44`,
              }}
            >
              <PlusIcon color={accent} />
            </div>

            <div>
              <p className="pai-modal__title">
                Create New Node
              </p>
              <p className="pai-modal__subtitle">
                Configure and export as JSON
              </p>
            </div>

          </div>

          <button
            className="pai-modal__close-btn"
            onClick={handleClose}
          >
            <CloseIcon />
          </button>

        </div>

        {/* Body */}
        <div className="pai-modal__body">

          {/* Asset Type */}
          <Field label="Asset Type" required accent={accent}>

            <select
              className="pai-select"
              value={form.asset}
              onChange={(e) =>
                setForm({ ...form, asset: e.target.value })
              }
            >

              <option value="">
                Select asset category…
              </option>

              {Object.entries(ASSET_CONFIG).map(
                ([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                )
              )}

              <option value="Others">
                Others
              </option>

            </select>

            {form.asset === "Others" && (
              <input
                className="pai-input"
                placeholder="Enter custom asset name"
                value={form.customAsset}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customAsset: e.target.value,
                  })
                }
              />
            )}

          </Field>

          {/* Node Label */}
          <Field label="Node Label" required accent={accent}>

            <input
              className="pai-input"
              placeholder="e.g. Custom Simulation Agent"
              value={form.label}
              onChange={(e) =>
                setForm({ ...form, label: e.target.value })
              }
            />

            {form.label && (
              <p className="pai-id-preview">
                id: "{nodeId}"
              </p>
            )}

          </Field>

          {/* Container ID */}
          <Field label="Container ID" accent={accent}>
            <input
              className="pai-input"
              placeholder="Enter Container ID"
              value={form.containerId}
              onChange={(e) =>
                setForm({
                  ...form,
                  containerId: e.target.value,
                })
              }
            />
          </Field>

          {/* Docker Image ID */}
          <Field label="Docker Image ID" accent={accent}>
            <input
              className="pai-input"
              placeholder="Enter Docker Image ID"
              value={form.dockerImageId}
              onChange={(e) =>
                setForm({
                  ...form,
                  dockerImageId: e.target.value,
                })
              }
            />
          </Field>

          {/* Allowed Targets */}
          <Field label="Allowed Targets" accent={accent}>

            <div className="pai-chips">

              {allNodeIds.map((id) => {

                const active =
                  form.allowedTargets.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    className={`pai-chip ${
                      active
                        ? "pai-chip--active-accent"
                        : ""
                    }`}
                    onClick={() =>
                      setForm({
                        ...form,
                        allowedTargets: toggleItem(
                          form.allowedTargets,
                          id
                        ),
                      })
                    }
                  >
                    {id}
                  </button>
                );
              })}

              <button
                type="button"
                className="pai-chip"
                onClick={() =>
                  setForm({
                    ...form,
                    showCustomAllowed:
                      !form.showCustomAllowed,
                  })
                }
              >
                Others
              </button>

            </div>

            {form.showCustomAllowed && (
              <input
                className="pai-input"
                placeholder="Enter custom target"
                value={form.customAllowedTarget}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customAllowedTarget:
                      e.target.value,
                  })
                }
              />
            )}

          </Field>

          {/* Required Before */}
          <Field label="Required Before" accent={accent}>

            <div className="pai-chips">

              {allNodeIds.map((id) => {

                const active =
                  form.requiredBefore.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    className={`pai-chip ${
                      active
                        ? "pai-chip--active-danger"
                        : ""
                    }`}
                    onClick={() =>
                      setForm({
                        ...form,
                        requiredBefore: toggleItem(
                          form.requiredBefore,
                          id
                        ),
                      })
                    }
                  >
                    {id}
                  </button>
                );
              })}

              <button
                type="button"
                className="pai-chip"
                onClick={() =>
                  setForm({
                    ...form,
                    showCustomRequired:
                      !form.showCustomRequired,
                  })
                }
              >
                Others
              </button>

            </div>

            {form.showCustomRequired && (
              <input
                className="pai-input"
                placeholder="Enter custom dependency"
                value={form.customRequiredBefore}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customRequiredBefore:
                      e.target.value,
                  })
                }
              />
            )}

          </Field>

          {/* Properties editor */}
          <div style={{ marginTop: "16px" }}>
            <button
              type="button"
              className="pai-btn-properties"
              onClick={() => setShowProperties(!showProperties)}
            >
              Properties
            </button>
          </div>

          {showProperties && (
            <Field label="Properties (JSON)" accent={accent}>
              <textarea
                className="pai-input"
                style={{ height: "120px" }}
                value={propertiesText}
                onChange={(e) =>
                  setPropertiesText(e.target.value)
                }
              />
            </Field>
          )}

        </div>

        {/* JSON Preview */}
        {savedJson && (
          <div className="pai-json-preview">

            <div className="pai-json-preview__bar">

              <span className="pai-json-preview__filename">
                output.json
              </span>

              <button
                className={`pai-json-preview__copy-btn ${
                  copied
                    ? "pai-json-preview__copy-btn--copied"
                    : ""
                }`}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>

            </div>

            <pre className="pai-json-preview__code">
              {JSON.stringify(savedJson, null, 2)}
            </pre>

          </div>
        )}

        {/* Footer */}
        <div className="pai-modal__footer">

          <button
            className="pai-btn pai-btn--ghost"
            onClick={handleClose}
          >
            Cancel
          </button>

          <button
            className="pai-btn pai-btn--primary"
            onClick={handleSave}
            disabled={!canSave}
            style={
              canSave
                ? {
                    background: `linear-gradient(135deg, ${accent}dd, ${accent}aa)`,
                    borderColor: `${accent}88`,
                    boxShadow: `0 4px 16px ${accent}33`,
                  }
                : {}
            }
          >
            Save Node
          </button>

        </div>

      </div>
    </>
  );
}

export default CreateNodeModal;
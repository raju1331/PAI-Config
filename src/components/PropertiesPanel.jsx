import { ASSET_CATEGORIES } from "../data/assets.js";

const totalAssets = ASSET_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);


export default function PropertiesPanel({ selectedNode, nodeCount, connectionCount }) {
  return (
    <aside className="properties-panel">
      <div className="properties-panel__header">
        <p className="properties-panel__title">
          {selectedNode ? "Properties" : "Overview"}
        </p>
      </div>

      <div className="properties-panel__content">
        {selectedNode ? (
          <>
            <div className="prop-group">
              <p className="prop-group__label">Component</p>
              <div className="prop-row">
                <span className="prop-row__key">Name</span>
                <span className="prop-row__val">{selectedNode.title}</span>
              </div>
              <div className="prop-row">
                <span className="prop-row__key">Type</span>
                <span className="prop-row__val">{selectedNode.subtitle}</span>
              </div>
              <div className="prop-row">
                <span className="prop-row__key">Status</span>
                <span className="badge badge--green">{selectedNode.status}</span>
              </div>
            </div>

            <div className="prop-group">
              <p className="prop-group__label">Config</p>
              <div className="prop-row">
                <span className="prop-row__key">Region</span>
                <span className="prop-row__val">us-east-1</span>
              </div>
              <div className="prop-row">
                <span className="prop-row__key">Tier</span>
                <span className="badge badge--blue">Standard</span>
              </div>
              <div className="prop-row">
                <span className="prop-row__key">HA</span>
                <span className="badge badge--orange">2-AZ</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="prop-group">
              <p className="prop-group__label">Architecture</p>
              <div className="prop-row">
                <span className="prop-row__key">Nodes</span>
                <span className="prop-row__val">{nodeCount}</span>
              </div>
              <div className="prop-row">
                <span className="prop-row__key">Connections</span>
                <span className="prop-row__val">{connectionCount}</span>
              </div>
              <div className="prop-row">
                <span className="prop-row__key">Assets</span>
                <span className="prop-row__val">{totalAssets}</span>
              </div>
            </div>

            <div className="prop-group">
              <p className="prop-group__label">Health</p>
              <div className="prop-row">
                <span className="prop-row__key">Services</span>
                <span className="badge badge--green">All OK</span>
              </div>
              <div className="prop-row">
                <span className="prop-row__key">Alerts</span>
                <span className="prop-row__val">0</span>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

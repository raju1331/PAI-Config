import { useState, useMemo, useEffect } from "react";
import AssetCategory from "./AssetCategory.jsx";
import CreateNodeModal from "./CreateNodeModal.jsx"; 
// import { ASSET_NODES } from "../data/assets.js";

export default function AssetsLibrary() {
  const [assets, setAssets] = useState({});
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState({ OmniverseModels: true });
  const [nodeModalOpen, setNodeModalOpen] = useState(false); // controls CreateNodeModal visibility

  
  const handleToggle = (id) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  
  useEffect(() => {
  
    fetch("http://localhost:5000/api/assets")
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data); 
        const { _id, ...categories } = data;
        setAssets(categories);
      })
      .catch(err => {
        console.error("Error fetching assets:", err);
      });
  
  }, []);

    useEffect(() => {
    fetch("http://localhost:5000/api/properties")
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data); 
      })
      .catch(err => {
        console.error("Error fetching properties:", err);
      });
  
  }, []);
  
console.log("Assets state:", assets);
const categories = useMemo(() => {

  const result = {};

  Object.entries(assets).forEach(([categoryKey, categoryData]) => {

    const nodes = Object.values(categoryData.nodes).filter((node) =>
      node.label.toLowerCase().includes(search.toLowerCase())
    );

    if (search === "" || nodes.length > 0) {

      result[categoryKey] = {
        ...categoryData,
        nodes: nodes.reduce((acc, node) => {
          acc[node.id] = node;
          return acc;
        }, {})
      };

    }

  });

  return result;

}, [assets, search]);
console.log("Categories for rendering:", categories);
  // derive a flat list of all node IDs from the raw `assets` object so
  // that the modal dropdowns always contain every defined node, even when
  // the user has a search filter applied in the sidebar.  Using `assets`
  // instead of `categories` also makes the dependency list simpler.
  const allNodeIds = useMemo(() => {
    return Object.values(assets).flatMap((cat) =>
      Object.keys(cat.nodes || {})
    );
  }, [assets]);

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <button className="pai-trigger-btn" onClick={() => setNodeModalOpen(true)}>
          + Create / Import Capabilities
        </button>
         
      </div>
      <div className="sidebar__header">
        <div className="sidebar__search">
          <input
            className="sidebar__search-input"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search assets"
          />
        </div>
      </div>

      <div className="sidebar__content">
        <CreateNodeModal
          open={nodeModalOpen}
          onClose={() => setNodeModalOpen(false)}
          allNodeIds={allNodeIds}
        />
       {Object.entries(categories).map(([key, category]) => (
          <AssetCategory
            key={key}
            category={{ id: key, ...category }}
            isOpen={!!openCategories[key]}
            onToggle={() => handleToggle(key)}
          />
        ))}

        {Object.keys(categories).length === 0 && (
          <p style={{ padding: "16px", fontSize: "12px", color: "#4a5568", textAlign: "center" }}>
            No assets match "{search}"
          </p>
        )}
      </div>
    </aside>
  );
}
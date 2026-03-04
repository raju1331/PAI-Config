import { useState } from "react";
import AssetCategory from "./AssetCategory.jsx";
import { ASSET_CATEGORIES } from "../data/assets.js";


export default function AssetsLibrary() {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState({ models: true });

  const handleToggle = (id) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredCategories = ASSET_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => search === "" || cat.items.length > 0);

  return (
    <aside className="sidebar">

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

      {/* ── Scrollable category list ── */}
      <div className="sidebar__content">
        {filteredCategories.map((cat) => (
          <AssetCategory
            key={cat.id}
            category={cat}
            isOpen={!!openCategories[cat.id]}
            onToggle={() => handleToggle(cat.id)}
          />
        ))}

        {filteredCategories.length === 0 && (
          <p style={{ padding: "16px", fontSize: "12px", color: "#4a5568", textAlign: "center" }}>
            No assets match "{search}"
          </p>
        )}
      </div>

    </aside>
  );
}

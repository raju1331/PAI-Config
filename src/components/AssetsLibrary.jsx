import { useState, useMemo } from "react";
import AssetCategory from "./AssetCategory.jsx";
import { ASSET_NODES } from "../data/assets.js";

export default function AssetsLibrary() {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState({ OmniverseModels: true });

  const handleToggle = (id) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const categories = useMemo(() => {
    return Object.entries(ASSET_NODES).map(([categoryKey, categoryData]) => {
      const items = Object.values(categoryData.nodes).map((node) => ({
        id: node.id,
        name: node.label,
        label: node.label,
        description: node.description,
        category: node.category,
        allowedTargets: node.allowedTargets,
        requiredBefore: node.requiredBefore,
        maxOutgoing: node.maxOutgoing,
        svgType: node.svgType,
      }));

      return {
        id: categoryKey,
        label: categoryData.label,
        icon: categoryData.icon,
        iconType: categoryData.iconType,
        color: categoryData.color,
        iconColor: categoryData.iconColor,
        items: items.filter((item) =>
          item.label.toLowerCase().includes(search.toLowerCase())
        ),
      };
    }).filter((cat) => search === "" || cat.items.length > 0);
  }, [search]);

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

      <div className="sidebar__content">
        {categories.map((cat) => (
          <AssetCategory
            key={cat.id}
            category={cat}
            isOpen={!!openCategories[cat.id]}
            onToggle={() => handleToggle(cat.id)}
          />
        ))}

        {categories.length === 0 && (
          <p style={{ padding: "16px", fontSize: "12px", color: "#4a5568", textAlign: "center" }}>
            No assets match "{search}"
          </p>
        )}
      </div>
    </aside>
  );
}
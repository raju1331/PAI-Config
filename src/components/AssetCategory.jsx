import AssetItem from "./AssetItem.jsx";

/**
 * AssetCategory
 * Collapsible category with a dynamic list of AssetItem children.
 * Adding more objects to `category.items` automatically renders them.
 *
 * Props:
 *  - category  { id, label, icon, color, iconColor, items[] }
 *  - isOpen    bool
 *  - onToggle  () => void
 */
export default function AssetCategory({ category, isOpen, onToggle }) {
  const { label, icon, color, iconColor, items } = category;

  return (
    <div className="asset-category">

      {/* ── Category header (click to expand / collapse) ── */}
      <div
        className="asset-category__header"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-controls={`cat-items-${category.id}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
      >
        <div className="asset-category__icon" style={{ background: color }}>
          {icon}
        </div>

        <span className="asset-category__label">{label}</span>

        {/* Count badge — reflects the live items array length */}
        <span className="asset-category__count">{items.length}</span>

        <span className={`asset-category__chevron ${isOpen ? "asset-category__chevron--open" : ""}`}>
          ▶
        </span>
      </div>

      {/* ── Dropdown items — scales automatically with items array ── */}
      <div
        id={`cat-items-${category.id}`}
        className={`asset-items ${isOpen ? "asset-items--open" : ""}`}
      >
        {items.map((item) => (
          <AssetItem
            key={item.id}
            item={item}
            catColor={color}
            catIconColor={iconColor}
          />
        ))}
      </div>

    </div>
  );
}

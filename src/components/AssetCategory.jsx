import AssetItem from "./AssetItem.jsx";

export default function AssetCategory({ category, isOpen, onToggle }) {
  const { id, label, icon, iconType, iconColor, nodes } = category;

  return (
    <div className="asset-category">
      <div
        className="asset-category__header"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
      >
        <span className={`asset-category__chevron ${isOpen ? "asset-category__chevron--open" : ""}`}>
          ›
        </span>
        <div className="asset-category__icon">
          {iconType === "img"
            ? <img src={icon} alt={label} className="asset-category__icon-img" />
            : <span>{icon}</span>
          }
        </div>
        <span className="asset-category__label">{label}</span>
      </div>

      <div className={`asset-items ${isOpen ? "asset-items--open" : ""}`}>
        {nodes && Object.values(nodes).map((item) => (
          <AssetItem
            key={item.id}
            item={item}
            catId={id}
            catIconColor={iconColor}
          />
        ))}
      </div>
    </div>
  );
}
/**
 * AssetItem
 * A single draggable asset row inside a category dropdown.
 *
 * Props:
 *  - item      { id, name, label, icon, description, category, allowedTargets, requiredBefore, maxOutgoing }
 *  - catColor  string  – background colour for the icon chip
 *  - catIconColor string – foreground colour for the icon chip
 */
export default function AssetItem({ item, catColor, catIconColor }) {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "asset",
        asset: {
          id: item.id,
          name: item.label,
          label: item.label,
          icon: item.icon,
          description: item.description,
          category: item.category,
          allowedTargets: item.allowedTargets,
          requiredBefore: item.requiredBefore,
          maxOutgoing: item.maxOutgoing,
          svgType: item.svgType,
        },
        color: catColor,
        iconColor: catIconColor,
      })
    );
  };

  return (
    <div
      className="asset-item"
      draggable
      title={`Drag to canvas: ${item.label}`}
      onDragStart={handleDragStart}
    >
      <div
        className="asset-item__icon"
        style={{ background: catColor, color: catIconColor }}
      >
        {item.icon}
      </div>

      <span className="asset-item__name">{item.label}</span>

      <span className="asset-item__drag-hint" aria-hidden="true">⠿</span>
    </div>
  );
}

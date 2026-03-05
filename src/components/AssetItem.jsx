const CATEGORY_ICONS = {
  "OmniverseModels": "/src/assets/models.svg",
  "Simulation": "/src/assets/subtemp.svg",
  "AI_Agents": "/src/assets/ai.svg",
  "Connectors": "/src/assets/Link.svg",
  "Functional": "/src/assets/functional.svg",
  "Repository": "/src/assets/repos.svg",
};

export default function AssetItem({ item, catIconColor, catId }) {
  const iconSrc = CATEGORY_ICONS[catId] || "/src/assets/models.svg";

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
          description: item.description,
          category: item.category,
          allowedTargets: item.allowedTargets,
          requiredBefore: item.requiredBefore,
          maxOutgoing: item.maxOutgoing,
          svgType: item.svgType,
        },
        iconColor: catIconColor,
      })
    );
  };

  return (
    <div className="asset-item" draggable title={`Drag to canvas: ${item.label}`} onDragStart={handleDragStart}>
      <div className="asset-item__icon">
        <img src={iconSrc} alt="" className="asset-item__icon-img" />
      </div>
      <span className="asset-item__name">{item.label}</span>
      <button className="asset-item__add-btn" onClick={(e) => e.stopPropagation()}>+</button>
    </div>
  );
}
const CATEGORY_ICONS = {
  "ItemIcon": "/src/assets/model.svg",
  "sub-templates": "/src/assets/subtemp.svg",
  "functional-building-blocks": "/src/assets/functionicon.svg",
  "connectors": "/src/assets/connector.svg",
  "ai-agents": "/src/assets/aiagent.svg",
  "repositories": "/src/assets/repos.svg",
};

export default function AssetItem({ item, catIconColor, catId }) {
  const iconSrc = CATEGORY_ICONS[catId] || "/src/assets/model.svg";

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "asset",
        asset: { id: item.id, name: item.name, tag: item.tag },
        iconColor: catIconColor,
      })
    );
  };

  return (
    <div className="asset-item" draggable title={`Drag to canvas: ${item.name}`} onDragStart={handleDragStart}>
      <div className="asset-item__icon">
        <img src={iconSrc} alt="" className="asset-item__icon-img" />
      </div>
      <span className="asset-item__name">{item.name}</span>
      <button className="asset-item__add-btn" onClick={(e) => e.stopPropagation()}>+</button>
    </div>
  );
}
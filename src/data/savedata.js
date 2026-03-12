const STORAGE_KEY = "existingWorkflow";

export const saveWorkflowData = (nodes, connections, nodeProperties) => {
  const workflowData = {
    savedAt: new Date().toISOString(),
    nodes: nodes.map((node) => ({
      id: node.id,
      assetId: node.assetId,
      title: node.title,
      icon: node.icon,
      iconType: node.iconType || "img",
      color: node.color,
      iconColor: node.iconColor,
      svgType: node.svgType || "svg1",
      category: node.category,
      allowedTargets: node.allowedTargets || [],
      requiredBefore: node.requiredBefore || [],
      maxOutgoing: node.maxOutgoing,
      x: node.x,
      y: node.y,
      status: node.status || "Running",
      selectedProperties: nodeProperties?.[node.id] || {},
    })),
    // ── Save connections as { from, to } — same format DiagramCanvas uses
    connections: connections.map((conn) => ({
      from: conn.from,
      to: conn.to,
    })),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflowData));
  console.log("💾 Workflow saved:", workflowData);
  return workflowData;
};

export const loadWorkflowData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (err) {
    console.error("Failed to parse saved workflow:", err);
    return null;
  }
};

export const clearWorkflowData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

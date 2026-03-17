const LAST_KEY = "lastWorkflow";
const SECOND_KEY = "secondLastWorkflow";

export const saveWorkflowData = (nodes, connections, nodeProperties, workflowName) => {
  const workflowData = {
    name: workflowName || "Untitled Prompt",
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
      width: node.width || 88,
      height: node.height || 88,
      x: node.x,
      y: node.y,
      status: node.status || "Running",
      selectedProperties: nodeProperties?.[node.id] || {},
    })),
    connections: connections.map((conn) => ({
      from: conn.from,
      to: conn.to,
    })),
  };

  // ── shift lastWorkflow → secondLastWorkflow
  try {
    const existing = localStorage.getItem(LAST_KEY);
    if (existing) {
      localStorage.setItem(SECOND_KEY, existing);
    }
  } catch (err) {
    console.warn("Could not shift workflow:", err);
  }

  localStorage.setItem(LAST_KEY, JSON.stringify(workflowData));
  console.log("💾 Workflow saved:", workflowData);
  return workflowData;
};

export const loadWorkflowData = () => {
  try {
    const saved = localStorage.getItem(LAST_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error("Failed to parse lastWorkflow:", err);
    return null;
  }
};

export const loadSecondLastWorkflow = () => {
  try {
    const saved = localStorage.getItem(SECOND_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error("Failed to parse secondLastWorkflow:", err);
    return null;
  }
};

export const getWorkflowOptions = () => ({
  last: loadWorkflowData(),
  secondLast: loadSecondLastWorkflow(),
});

export const clearWorkflowData = () => {
  localStorage.removeItem(LAST_KEY);
  localStorage.removeItem(SECOND_KEY);
};
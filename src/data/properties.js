export const ASSET_PROPERTIES = {
  nvidia_kit_app: {
    label: "Nvidia Kit App",
    sections: [
      {
        title: "Data Sources",
        type: "radio",
        options: ["PLM", "PDM", "PLC"],
      },
      {
        title: "AI Capability",
        type: "dropdown",
        options: ["LLM Enablement", "Computer Vision", "Reinforcement Learning"],
      },
      {
        title: "Rendering Engine",
        type: "dropdown",
        options: ["RTX Renderer", "Path Tracing", "Rasterization"],
      },
      {
        title: "XR",
        type: "radio",
        options: ["AVP", "Oculus"],
      },
      {
        title: "Collaboration Modes",
        type: "radio",
        options: ["Single User", "Multi User"],
      },
    ],
  },

  warehouse_layout_generator_kit_app: {
    label: "Warehouse Layout Designer",
    sections: [
      {
        title: "Data Sources",
        type: "radio",
        options: ["PLM", "PDM", "PLC"],
      },
      {
        title: "Layout Algorithm",
        type: "dropdown",
        options: ["Grid Based", "Flow Based", "Genetic Algorithm"],
      },
      {
        title: "Optimization Target",
        type: "dropdown",
        options: ["Throughput", "Space Utilization", "Energy Efficiency"],
      },
      {
        title: "XR",
        type: "radio",
        options: ["AVP", "Oculus"],
      },
      {
        title: "Collaboration Modes",
        type: "radio",
        options: ["Single User", "Multi User"],
      },
    ],
  },

  anylogic: {
    label: "Anylogic Simulation",
    sections: [
      {
        title: "Simulation Type",
        type: "dropdown",
        options: ["Discrete Event", "Agent Based", "System Dynamics"],
      },
      {
        title: "Output Format",
        type: "dropdown",
        options: ["JSON", "CSV", "XML", "Binary"],
      },
      {
        title: "Integration",
        type: "radio",
        options: ["REST API", "MQTT"],
      },
      {
        title: "Execution Mode",
        type: "radio",
        options: ["Real Time", "Fast Forward"],
      },
    ],
  },

  plantsim: {
    label: "Plant Simulation",
    sections: [
      {
        title: "Simulation Type",
        type: "dropdown",
        options: ["Discrete Event", "Continuous", "Hybrid"],
      },
      {
        title: "Output Format",
        type: "dropdown",
        options: ["JSON", "CSV", "XML", "Binary"],
      },
      {
        title: "Integration",
        type: "radio",
        options: ["REST API", "MQTT"],
      },
      {
        title: "Execution Mode",
        type: "radio",
        options: ["Real Time", "Fast Forward"],
      },
    ],
  },

  claude_opus_4_6: {
    label: "Claude Opus 4.6",
    sections: [
      {
        title: "AI Capability",
        type: "dropdown",
        options: ["LLM Enablement", "Computer Vision", "Reinforcement Learning"],
      },
      {
        title: "Model Version",
        type: "dropdown",
        options: ["Claude Opus 4.6", "Claude Sonnet 4.6", "Claude Haiku 4.5"],
      },
      {
        title: "Deployment",
        type: "radio",
        options: ["Cloud", "On-Prem"],
      },
      {
        title: "Response Mode",
        type: "radio",
        options: ["Streaming", "Batch"],
      },
    ],
  },

  mqtt: {
    label: "MQTT",
    sections: [
      {
        title: "QoS Level",
        type: "dropdown",
        options: [
          "QoS 0 - At most once",
          "QoS 1 - At least once",
          "QoS 2 - Exactly once",
        ],
      },
      {
        title: "Serialization Format",
        type: "dropdown",
        options: ["JSON", "Protobuf", "MessagePack", "Avro"],
      },
      {
        title: "Protocol Version",
        type: "radio",
        options: ["MQTT 3.1", "MQTT 5.0"],
      },
      {
        title: "Connection Mode",
        type: "radio",
        options: ["Persistent", "Transient"],
      },
    ],
  },
};
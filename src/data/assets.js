// ─── ASSET CATEGORIES ─────────────────────────────────────────────────────────
// To add more assets: just push a new object into any category's `items` array.
// The UI will automatically render them in the dropdown.
import ItemIcon from "../assets/model.svg";
import ModelIcon from "../assets/modelss.svg";
import SubTemplate from "../assets/subtemp.svg";
import Functional from"../assets/functional.svg";
import Connector from"../assets/Link.svg";
import AI from "../assets/ai.svg";
import Repository from "../assets/repos.svg";
export const ASSET_CATEGORIES = [
  {
    id: "models",
    label: "Models",
    icon: "/src/assets/modelss.svg",
    iconType:"img",
    color: "#12121f",
    iconColor: "#4f8ef7",
    items: [
      { id: "aas",       name: "AAS model for B2B warehouse",      },
      { id: "brain", name: "Brain of brains",           },
      { id: "fup",        name: "FUP(Behavioral) models for B2B warehouse",            },
      { id: "sysML",       name: "sysML V2 model for B2B warehouse",  },
    ],
  },
  {
    id: "sub-templates",
    label: "Sub-Templates",
   icon: "/src/assets/subtemp.svg",
    iconType:"img",
    color: "#12121f",
    iconColor: "#48bb78",
    items: [
      { id: "plant",  name: "PlantSim DES",   },
    
    ],
  },
  {
    id: "functional-building-blocks",
    label: "Functional Building Blocks",
    icon: "/src/assets/functional.svg",
    iconType:"img",
    color: "#12121f",
    iconColor: "#9f7aea",
    items: [
      { id: "layout",  name: "Warehouse layout Designer",  },
      { id: "design", name: "3D Design Assembler",            },
      { id: "visualize", name: "3D Scence Visualizer",    },
      
    ],
  },
  {
    id: "connectors",
    label: "Connectors",
    icon: "/src/assets/Link.svg",
    iconType:"img",
    color: "#000000",
    iconColor: "#ed8936",
    items: [
      { id: "simu",      name: "Simulation tool Connector",  },
      { id: "cad",    name: "CAD Connector"  },
    ],
  },
  {
    id: "ai-agents",
    label: "AI Agents",
    icon: "/src/assets/ai.svg",
    iconType:"img",
    color: "#12121f",
    iconColor: "#fc8181",
    items: [
      { id: "opt",   name: "Optimizer",     },
      { id: "orches",  name: "Orchestrator",    },
      { id: "edit", name: "Quick Edits for 3D Model", },
    ],
  },
  {
    id: "repositories",
    label: "Repositories",
    icon: "/src/assets/repos.svg",
    iconType:"img",
    color: "#12121f",
    iconColor: "#a55eea",
    items: [
      { id: "repos",   name: "3D Model Repository" },
      
    ],
  }
];

// ─── INITIAL DIAGRAM NODES ─────────────────────────────────────────────────────
export const INITIAL_NODES = [
  { id: 1, title: "API Gateway",   subtitle: "HTTP/2 · REST",       color: "#12121f", iconColor: "#4f8ef7", x: 60,  y: 60,  status: "Running" },
  { id: 2, title: "LLM Service",   subtitle: "Inference · GPU",     color: "#12121f", iconColor: "#ed8936", x: 300, y: 60,  status: "Running" },
  { id: 3, title: "Vector Store",  subtitle: "pgvector · 1536d",   color: "#12121f", iconColor: "#48bb78", x: 60,  y: 220, status: "Healthy" },
  { id: 4, title: "Cache Layer",   subtitle: "Redis · 6GB",      color: "#12121f", iconColor: "#48bb78", x: 300, y: 220, status: "Healthy" },
];

// ─── INITIAL CONNECTIONS ───────────────────────────────────────────────────────
export const INITIAL_CONNECTIONS = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
];
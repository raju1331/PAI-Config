import SVG1 from "./svgs/SVG1.jsx";
import SVG2 from "./svgs/SVG2.jsx";
import SVG3 from "./svgs/SVG3.jsx";
import SVG4 from "./svgs/SVG4.jsx";

/**
 * SVGNode
 * Renders an SVG shape with a label below it
 *
 * Props:
 *  - svgType     string ('svg1', 'svg2', 'svg3', 'svg4')
 *  - label       string - node title/label
 *  - color       string - SVG color/fill
 *  - iconColor   string - SVG accent color
 */
export default function SVGNode({ svgType = "svg1", label, color, iconColor }) {
  // Render the appropriate SVG component based on svgType
  const renderSVG = () => {
    switch (svgType) {
      case "svg1":
        return <SVG1 color={color} iconColor={iconColor} />;
      case "svg2":
        return <SVG2 color={color} iconColor={iconColor} />;
      case "svg3":
        return <SVG3 color={color} iconColor={iconColor} />;
      case "svg4":
        return <SVG4 color={color} iconColor={iconColor} />;
      default:
        return <SVG1 color={color} iconColor={iconColor} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ flexShrink: 0 }}>
        {renderSVG()}
      </div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: "500",
          color: "#e2e8f0",
          textAlign: "center",
          maxWidth: "100px",
          wordWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        {label}
      </div>
    </div>
  );
}

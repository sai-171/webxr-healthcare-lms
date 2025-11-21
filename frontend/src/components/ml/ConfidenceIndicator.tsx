// src/components/ml/ConfidenceIndicator.tsx
import React from "react";

interface ConfidenceIndicatorProps {
  confidence: number; // value between 0 and 1
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence }) => {
  const percent = Number((confidence * 100).toFixed(2));

  // Color scale from red (low confidence) to green (high confidence)
  const getColor = () => {
    if (confidence < 0.5) return "#e55353"; // red shades
    if (confidence < 0.75) return "#f0ad4e"; // orange
    return "#5cb85c"; // green
  };

  return (
    <div className="confidence-indicator">
      <label htmlFor="confidence-bar" className="sr-only">
        Confidence Level
      </label>
      <div
        id="confidence-bar"
        role="progressbar"
        aria-valuemin={Number(0)}
        aria-valuemax={Number(100)}
        aria-valuenow={Number(percent)}
        style={{
          width: "100%",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          height: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor: getColor(),
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <p style={{ marginTop: "4px", fontWeight: "bold", color: getColor() }}>
        Confidence: {percent}%
      </p>
    </div>
  );
};

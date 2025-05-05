import React from 'react';
import './CustomLegend.css';

function CustomLegend({ labels, colors, activeItems, setActiveItems }) {
  const handleToggle = (label) => {
    setActiveItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div className="custom-legend">
      {labels.map((label, i) => (
        <div
          key={label}
          className={`legend-item ${activeItems[label] === false ? 'inactive' : ''}`}
          onClick={() => handleToggle(label)}
        >
          <div className="color-box" style={{ backgroundColor: colors[i] }}></div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default CustomLegend;

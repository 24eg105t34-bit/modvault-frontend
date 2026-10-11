import React, { useState } from 'react';

export default function DonutChart({ breakdownData }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const items = [
    { label: 'Fuel', percentage: 42, amount: '₹ 7,875', color: '#2563eb' },
    { label: 'Maintenance', percentage: 21, amount: '₹ 3,940', color: '#10b981' },
    { label: 'Modifications', percentage: 19, amount: '₹ 3,560', color: '#f59e0b' },
    { label: 'Insurance', percentage: 10, amount: '₹ 1,875', color: '#06b6d4' },
    { label: 'Others', percentage: 8, amount: '₹ 1,500', color: '#64748b' }
  ];

  // SVG parameters
  const size = 150;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="donut-breakdown-wrapper">
      {/* SVG Donut */}
      <div className="donut-svg-wrapper">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {items.map((item, index) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += item.percentage;
            const isHovered = hoveredSlice === item.label;

            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredSlice(item.label)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="donut-center-label">
          <div className="donut-center-sub">Total</div>
          <div className="donut-center-val">
            {hoveredSlice
              ? items.find((i) => i.label === hoveredSlice)?.amount
              : '₹ 18,750'}
          </div>
        </div>
      </div>

      {/* Legend list */}
      <div className="breakdown-legend-list">
        {items.map((item) => (
          <div
            key={item.label}
            className="legend-row-item"
            onMouseEnter={() => setHoveredSlice(item.label)}
            onMouseLeave={() => setHoveredSlice(null)}
            style={{
              cursor: 'pointer',
              opacity: hoveredSlice && hoveredSlice !== item.label ? 0.45 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <div className="legend-left">
              <span className="legend-color-dot" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>

            <div className="legend-right-nums">
              <span style={{ color: '#64748b', fontSize: 11.5 }}>{item.percentage}%</span>
              <span>{item.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

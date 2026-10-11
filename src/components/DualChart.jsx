import React, { useState } from 'react';

export default function DualChart({ chartData }) {
  const [activeTab, setActiveTab] = useState('Fuel');
  const [timeRange, setTimeRange] = useState('Last 6 months');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const months = chartData?.labels || ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const barValues = chartData?.fuelCosts || [2100, 3200, 3800, 4500, 3900, 4320];
  const lineValues = chartData?.fuelEconomies || [11.8, 12.4, 12.2, 13.5, 12.9, 13.8];

  const maxBar = 6000;
  const maxLine = 20;

  // SVG dimensions
  const svgWidth = 540;
  const svgHeight = 170;
  const paddingX = 45;
  const paddingY = 25;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  const stepX = innerWidth / (months.length - 1);

  // Line points
  const points = months.map((_, i) => {
    const x = paddingX + i * stepX;
    const y = paddingY + innerHeight - (lineValues[i] / maxLine) * innerHeight;
    return { x, y, val: lineValues[i], barVal: barValues[i], month: months[i] };
  });

  const linePathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div style={{ width: '100%' }}>
      {/* Chart Top Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="fuel-expense-tabs">
          {['Fuel', 'Expenses', 'Maintenance', 'Cost per km'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#64748b' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#60a5fa' }}></span>
              Fuel Cost
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
              Fuel Economy (km/l)
            </span>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: 12,
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: '#fff',
              color: '#475569',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last 1 year</option>
          </select>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {/* Grid lines */}
          {[0, 2000, 4000, 6000].map((val, idx) => {
            const y = paddingY + innerHeight - (val / maxBar) * innerHeight;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text x={paddingX - 8} y={y + 3} fill="#94a3b8" fontSize="9" textAnchor="end">
                  ₹{val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Right Y-Axis: km/l labels */}
          {[0, 10, 15, 20].map((val, idx) => {
            const y = paddingY + innerHeight - (val / maxLine) * innerHeight;
            return (
              <text key={idx} x={svgWidth - paddingX + 8} y={y + 3} fill="#94a3b8" fontSize="9" textAnchor="start">
                {val}
              </text>
            );
          })}

          {/* Bar Columns */}
          {points.map((p, idx) => {
            const barH = (p.barVal / maxBar) * innerHeight;
            const barW = 28;
            const barX = p.x - barW / 2;
            const barY = paddingY + innerHeight - barH;
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={`bar-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={barX}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx="4"
                  fill={isHovered ? '#3b82f6' : '#93c5fd'}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Month label on X axis */}
                <text
                  x={p.x}
                  y={svgHeight - 4}
                  fill={isHovered ? '#1e293b' : '#64748b'}
                  fontWeight={isHovered ? '700' : '500'}
                  fontSize="10"
                  textAnchor="middle"
                >
                  {p.month}
                </text>
              </g>
            );
          })}

          {/* Green Spline Line for Fuel Economy */}
          <path
            d={linePathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes on Spline */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={`node-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                {isHovered && (
                  <circle cx={p.x} cy={p.y} r="9" fill="#10b981" fillOpacity="0.2" />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
              top: '10px',
              transform: 'translateX(-50%)',
              background: '#0f172a',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 11,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
              zIndex: 5,
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{points[hoveredIndex].month} 2025</div>
            <div style={{ color: '#93c5fd' }}>Fuel Cost: ₹{points[hoveredIndex].barVal.toLocaleString()}</div>
            <div style={{ color: '#34d399' }}>Mileage: {points[hoveredIndex].val} km/l</div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/pages/Dashboard/components/DonutChart.jsx
import React, { useMemo } from 'react';
import './DonutChart.scss';

const COLORS = {
  regularizado: '#22C55E',
  cadastroPendente: '#F59E0B',
  embargoAtivo: '#EF4444',
};

const DEFAULT_DATA = [
  { label: 'Regularizado', value: 4, color: COLORS.regularizado },
  { label: 'Cadastro Pendente', value: 1, color: COLORS.cadastroPendente },
  { label: 'Embargo Ativo', value: 2, color: COLORS.embargoAtivo },
];

function polarToCartesian(cx, cy, r, angleRad) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx, cy, outerR, innerR, startAngle, endAngle) {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

  const sweep = endAngle - startAngle;
  const largeArc = sweep > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

export default function DonutChart({
  title = 'Proporção por Gravidade',
  data = DEFAULT_DATA,
  size = 200,
  strokeWidth = 0,
  centerLabel = 'Casos',
}) {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const segments = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const outerR = (size - strokeWidth) / 2;
    const innerR = outerR * 0.7;
    const GAP = 0.03;

    let currentAngle = -Math.PI / 2;

    return data.map((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const startAngle = currentAngle + GAP / 2;
      const endAngle = currentAngle + sliceAngle - GAP / 2;
      const path = describeArc(cx, cy, outerR, innerR, startAngle, endAngle);
      currentAngle += sliceAngle;

      return {
        ...item,
        path,
        percentage: Math.round((item.value / total) * 100),
      };
    });
  }, [data, total, size, strokeWidth]);

  return (
    <div className="donut-chart">
      <h3 className="donut-chart__title">{title}</h3>

      <div className="donut-chart__body">
        <div className="donut-chart__svg-wrapper" style={{ width: size, height: size }}>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            height={size}
            className="donut-chart__svg"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={(size - strokeWidth) / 2}
              fill="#E2E8F0"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={((size - strokeWidth) / 2) * 0.7}
              fill="#FFFFFF"
            />

            {segments.map((seg, i) => (
              <path
                key={i}
                d={seg.path}
                fill={seg.color}
                className="donut-chart__segment"
              />
            ))}
          </svg>

          <div className="donut-chart__center">
            <span className="donut-chart__center-value">{total}</span>
            <span className="donut-chart__center-label">{centerLabel}</span>
          </div>
        </div>

        <ul className="donut-chart__legend">
          {segments.map((seg, i) => (
            <li key={i} className="donut-chart__legend-item">
              <div className="donut-chart__legend-left">
                <span
                  className="donut-chart__legend-dot"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="donut-chart__legend-label">{seg.label}</span>
              </div>
              <span className="donut-chart__legend-value">
                {seg.value} ({seg.percentage}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
import React, { useMemo } from 'react';

/** Tiny SVG sparkline for KPI cards. Expects an array of numbers. */
export const Sparkline = ({ data = [], color = '#5B3DF5', height = 32, className = '' }) => {
  const path = useMemo(() => {
    if (!data.length) return '';
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const w = 80;
    const h = height;
    const step = data.length > 1 ? w / (data.length - 1) : w;

    return data
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * (h - 4) - 2;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [data, height]);

  if (!data.length) {
    return (
      <svg viewBox="0 0 80 32" className={className} width="80" height={height} aria-hidden>
        <path d="M0,24 L80,24" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 80 ${height}`} className={className} width="80" height={height} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[dash_1s_ease-out_forwards]"
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 0,
        }}
      />
    </svg>
  );
};

export default Sparkline;

import React, { useEffect, useState } from 'react';

/**
 * Smooth count-up for KPI values. Supports plain numbers and currency-prefixed values.
 */
export const CountUp = ({
  value = 0,
  duration = 850,
  prefix = '',
  suffix = '',
  formatter,
  className = '',
}) => {
  const [display, setDisplay] = useState(0);
  const numeric = Number(value) || 0;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (numeric - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numeric, duration]);

  const formatted = formatter
    ? formatter(display)
    : `${prefix}${Math.round(display).toLocaleString('en-IN')}${suffix}`;

  return <span className={className}>{formatted}</span>;
};

export default CountUp;

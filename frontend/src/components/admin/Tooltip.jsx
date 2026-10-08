import React, { useState } from 'react';
import { cn } from '../../utils/helpers';

export const Tooltip = ({ content, children, side = 'bottom', className }) => {
  const [open, setOpen] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <div
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-[#111827] px-2 py-1 text-[11px] font-medium text-white shadow-md transition-all duration-150',
          positions[side],
          open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;

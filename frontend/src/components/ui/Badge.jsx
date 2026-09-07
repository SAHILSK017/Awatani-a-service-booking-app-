import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const variants = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shadow-xs',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200 font-bold shadow-xs',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold shadow-xs',
  info: 'bg-sky-50 text-sky-700 border border-sky-200 font-bold shadow-xs',
  default: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
  primary: 'bg-violet-50 text-violet-700 border border-violet-200 font-bold shadow-xs',
};

export const Badge = ({ className, variant = 'default', children, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

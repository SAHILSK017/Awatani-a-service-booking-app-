import React from 'react';
import { cn } from '../../utils/helpers';

const palette = [
  'bg-[#EEF2FF] text-[#5B3DF5]',
  'bg-emerald-50 text-emerald-700',
  'bg-sky-50 text-sky-700',
  'bg-amber-50 text-amber-700',
  'bg-rose-50 text-rose-700',
  'bg-slate-100 text-slate-700',
];

export const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const Avatar = ({ name = '', size = 'md', className }) => {
  const initials = getInitials(name);
  const tone = palette[(name?.charCodeAt(0) || 0) % palette.length];
  const sizes = {
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-10 w-10 text-sm',
  };

  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        sizes[size],
        tone,
        className
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
};

export default Avatar;

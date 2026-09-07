import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Input = React.forwardRef(({ className, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3 text-muted-foreground">
          <Icon size={18} />
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          Icon && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

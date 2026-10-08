import React from 'react';

export const AvataniLogo = ({
  className = '',
  showSubtitle = true,
  emblemOnly = false,
  size = 'default', // 'sm', 'default', 'lg'
}) => {
  const emblemHeights = {
    sm: 'h-7',
    default: 'h-9',
    lg: 'h-11',
  };

  if (emblemOnly) {
    return (
      <img
        src="/images/avatani-emblem.svg"
        alt="Avatani"
        className={`${emblemHeights[size] || 'h-9'} w-auto object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Ribbon A Emblem */}
      <img
        src="/images/avatani-emblem.svg"
        alt="Avatani Logo"
        className={`${emblemHeights[size] || 'h-9'} w-auto shrink-0 object-contain`}
      />

      {/* Typography: Avatani & — SERVICES — */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center leading-none">
          <span className="text-[19px] font-black tracking-tight text-[#111827]">
            Avatan
          </span>
          <span className="text-[19px] font-black tracking-tight text-[#111827] relative">
            ı
            <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#7C3AED]" />
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2.5 h-[1.2px] bg-slate-400 rounded-full" />
            <span className="text-[8.5px] font-extrabold text-slate-500 uppercase tracking-[0.28em] leading-none">
              SERVICES
            </span>
            <span className="w-2.5 h-[1.2px] bg-slate-400 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvataniLogo;

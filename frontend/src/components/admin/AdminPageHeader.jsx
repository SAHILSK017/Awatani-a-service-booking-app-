import React from 'react';
import { motion } from 'framer-motion';

export const AdminPageHeader = ({ badge, title, description, action, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
  >
    <div>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#5B3DF5] text-[11px] font-semibold tracking-wide border border-[#E0E7FF] mb-3">
          {Icon ? <Icon size={12} /> : null}
          {badge}
        </span>
      )}
      <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#111827] leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-[#64748B] mt-1.5 max-w-xl leading-relaxed">{description}</p>
      )}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </motion.div>
);

export default AdminPageHeader;

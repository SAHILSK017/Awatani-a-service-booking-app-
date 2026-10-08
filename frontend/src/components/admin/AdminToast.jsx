import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const AdminToast = ({ toast }) => (
  <AnimatePresence>
    {toast?.show && (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        className={cn(
          'fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md',
          toast.type === 'success'
            ? 'bg-white border-emerald-200 text-emerald-800'
            : 'bg-white border-rose-200 text-rose-800'
        )}
      >
        <div
          className={cn(
            'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
            toast.type === 'success' ? 'bg-[#10B981] text-white' : 'bg-[#EF4444] text-white'
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
        </div>
        <span className="text-sm font-medium tracking-tight">{toast.message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AdminToast;

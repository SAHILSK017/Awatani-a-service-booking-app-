import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const AdminModal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/45 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-[#E2E8F0]',
            maxWidth
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="px-5 sm:px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AdminModal;

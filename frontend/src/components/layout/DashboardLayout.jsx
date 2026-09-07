import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const DashboardLayout = ({ children, user }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex">
      <Sidebar role={user?.role} />
      
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full transition-all duration-300">
        <TopNavbar user={user} />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

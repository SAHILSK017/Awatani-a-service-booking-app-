import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Briefcase, CalendarCheck, User, Settings, Menu, X, CreditCard, Users, Activity, BarChart3, Hexagon
} from 'lucide-react';

const userMenu = [
  { name: 'Dashboard', path: '/user/home', icon: LayoutDashboard },
  { name: 'Services', path: '/user/services', icon: Briefcase },
  { name: 'My Bookings', path: '/user/mybookings', icon: CalendarCheck },
  { name: 'Profile', path: '/user/profile', icon: User },
];

const workerMenu = [
  { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
  { name: 'Available Jobs', path: '/worker/available-jobs', icon: Briefcase },
  { name: 'My Jobs', path: '/worker/bookings', icon: CalendarCheck },
  { name: 'Earnings', path: '/worker/earnings', icon: CreditCard },
  { name: 'Profile', path: '/worker/profile', icon: User },
];

const adminMenu = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Users', path: '/admin/users', icon: Users },
  { name: 'Manage Workers', path: '/admin/workers', icon: Briefcase },
  { name: 'Services', path: '/admin/services', icon: Activity },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  let menu;
  if (role === 'admin') menu = adminMenu;
  else if (role === 'worker') menu = workerMenu;
  else menu = userMenu;

  return (
    <>
      <div className="md:hidden fixed top-3 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 rounded-lg bg-background border border-border text-foreground shadow-sm focus:outline-none hover:bg-secondary">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -256, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -256, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r border-border shadow-sm flex flex-col transition-transform md:translate-x-0 overflow-hidden"
            style={{ x: isOpen || window.innerWidth >= 768 ? 0 : -256 }}
          >
            {/* Logo Area */}
            <div className="px-6 h-16 flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/30 text-white">
                  <Hexagon className="w-5 h-5 fill-white/20" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                    Avatani
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest -mt-1">Services</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                role === 'admin' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : role === 'worker' 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                    : 'bg-violet-100 text-violet-700 border border-violet-200'
              }`}>
                {role || 'User'}
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
              {menu.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 font-semibold'
                        : 'text-slate-600 hover:bg-violet-50/80 hover:text-violet-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-white" : "text-slate-500 group-hover:text-violet-600"
                        }`} 
                      />
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer Connect */}
            <div className="p-4 border-t border-border/60 bg-slate-50/50 shrink-0">
              <NavLink
                to="/settings"
                className="flex items-center px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-violet-50/80 hover:text-violet-900 rounded-xl transition-colors group"
              >
                <Settings className="mr-3 h-5 w-5 text-slate-500 group-hover:text-violet-600 transition-transform group-hover:rotate-45" />
                Settings
              </NavLink>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

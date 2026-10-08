import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Briefcase,
  CalendarCheck,
  User,
  Settings,
  Menu,
  X,
  CreditCard,
  Users,
  Activity,
  BarChart3,
  Hexagon,
  Crown,
  LogOut,
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Avatar } from '../admin/Avatar';

const userMenu = [
  { name: 'Dashboard', path: '/user/home', icon: LayoutGrid },
  { name: 'Services', path: '/user/services', icon: Briefcase },
  { name: 'My Bookings', path: '/user/mybookings', icon: CalendarCheck },
  { name: 'Profile', path: '/user/profile', icon: User },
];

const workerMenu = [
  { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutGrid },
  { name: 'Available Jobs', path: '/worker/available-jobs', icon: Briefcase },
  { name: 'My Jobs', path: '/worker/bookings', icon: CalendarCheck },
  { name: 'Earnings', path: '/worker/earnings', icon: CreditCard },
  { name: 'Profile', path: '/worker/profile', icon: User },
];

const adminMenu = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutGrid },
  { name: 'Manage Users', path: '/admin/users', icon: Users },
  { name: 'Manage Workers', path: '/admin/workers', icon: Briefcase },
  { name: 'Services', path: '/admin/services', icon: Activity },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

const roleBadgeStyles = {
  admin: 'bg-[#111827] text-white border-transparent',
  worker: 'bg-amber-50 text-amber-700 border-amber-200',
  user: 'bg-purple-50 text-[#5B3DF5] border-purple-100',
};

export const Sidebar = ({ role, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => {
      setIsDesktop(e.matches);
      if (e.matches) setIsOpen(false);
    };
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen && !isDesktop ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isDesktop]);

  let menu;
  if (role === 'admin') menu = adminMenu;
  else if (role === 'worker') menu = workerMenu;
  else menu = userMenu;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showSidebar = isDesktop || isOpen;

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="md:hidden fixed top-3.5 left-4 z-50 p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#1E293B] shadow-sm hover:bg-[#F8FAFC] transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={cn(
              'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between overflow-hidden select-none',
              !isDesktop && 'shadow-2xl'
            )}
          >
            {/* Top Brand Header */}
            <div>
              <div className="px-5 h-16 flex items-center justify-between border-b border-[#E2E8F0]/70 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B3DF5] to-[#7B5CFA] flex items-center justify-center text-white shadow-sm shadow-[#5B3DF5]/30 shrink-0">
                    <Hexagon className="w-5 h-5 fill-white/20" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[17px] font-black tracking-tight text-[#111827] leading-none">
                      Avatani
                    </span>
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mt-0.5">
                      Services
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0',
                    roleBadgeStyles[role] || roleBadgeStyles.user
                  )}
                >
                  {role || 'User'}
                </span>
              </div>

              {/* Main Navigation Links */}
              <nav className="px-3 py-4 space-y-1.5 overflow-y-auto">
                {menu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => !isDesktop && setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-[#5B3DF5] text-white shadow-md shadow-[#5B3DF5]/25'
                          : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={19}
                          strokeWidth={isActive ? 2.2 : 1.8}
                          className={cn(
                            'shrink-0 transition-transform duration-200',
                            isActive
                              ? 'text-white'
                              : 'text-[#64748B] group-hover:text-[#5B3DF5] group-hover:scale-105'
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom Actions Cluster */}
            <div className="p-3 border-t border-[#E2E8F0]/70 shrink-0 space-y-2">
              {/* Priority Support Promo Card (User role) */}
              {(!role || role === 'user') && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F5F3FF]/40 border border-[#E2E8F0] shadow-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Crown size={14} className="fill-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-[#111827]">Get Priority Support</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-snug">
                    Faster service, trusted experts, and exclusive offers.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDesktop) setIsOpen(false);
                      navigate('/user/services');
                    }}
                    className="w-full mt-3 py-2 bg-[#5B3DF5] hover:bg-[#4E30E5] text-white text-xs font-bold rounded-xl transition-all shadow-xs text-center active:scale-[0.98] cursor-pointer"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              {/* Settings Nav Item */}
              <NavLink
                to="/settings"
                onClick={() => !isDesktop && setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-[#5B3DF5] text-white shadow-md shadow-[#5B3DF5]/25'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Settings
                      size={19}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={cn(
                        'shrink-0 transition-transform duration-200',
                        isActive
                          ? 'text-white'
                          : 'text-[#64748B] group-hover:text-[#5B3DF5] group-hover:rotate-45'
                      )}
                    />
                    <span>Settings</span>
                  </>
                )}
              </NavLink>

              {/* Admin / Worker Profile & Logout footer */}
              {role === 'admin' && (
                <div className="mt-1 px-2.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={user?.name || 'Admin'} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#111827] truncate">
                        {user?.name || 'Admin'}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate capitalize">
                        {user?.role || 'admin'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-rose-50 transition-colors"
                      title="Log out"
                      aria-label="Log out"
                    >
                      <LogOut size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Settings,
  LayoutGrid,
  Briefcase,
  CalendarCheck,
} from 'lucide-react';
import { Tooltip } from '../admin/Tooltip';
import { cn } from '../../utils/helpers';

export const TopNavbar = ({ user: propUser }) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // Safe parse stored user if prop is missing or partial
  let localUser = {};
  try {
    localUser = JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    // fallback
  }
  const user = propUser || localUser;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (user?.role === 'admin') {
        navigate(`/admin/services?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/user/services?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isAdmin = user?.role === 'admin';
  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2E8F0]">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8 w-full gap-4">
        {/* Search Input Bar */}
        <div
          className={cn(
            'hidden md:flex items-center gap-2.5 px-3.5 h-10 rounded-xl transition-all duration-200 border flex-1 max-w-lg',
            isSearchFocused
              ? 'bg-white border-[#5B3DF5] ring-2 ring-[#5B3DF5]/15 shadow-sm'
              : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-slate-300'
          )}
        >
          <Search
            size={16}
            className={cn(
              'shrink-0 transition-colors',
              isSearchFocused ? 'text-[#5B3DF5]' : 'text-[#94A3B8]'
            )}
          />
          <input
            id="global-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder={
              isAdmin
                ? 'Search users, workers, services...'
                : 'Search for services (e.g. AC repair, electrician, carpenter...)'
            }
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-[#111827] placeholder:text-[#94A3B8] focus:ring-0"
          />
          <div className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-[#E2E8F0] text-[#94A3B8] shadow-2xs select-none shrink-0 whitespace-nowrap">
            ⌘ K
          </div>
        </div>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto pl-12 md:pl-0">
          {/* Notification Hub */}
          <div className="relative" ref={notifRef}>
            <Tooltip content="Notifications">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setMenuOpen(false);
                }}
                className="relative p-2.5 rounded-xl text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827] transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={19} strokeWidth={1.8} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-white" />
              </button>
            </Tooltip>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E2E8F0] bg-white shadow-xl overflow-hidden origin-top-right z-50"
                >
                  <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#111827]">Notifications</p>
                      <p className="text-[11px] text-[#64748B]">Platform updates and alerts</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5B3DF5]">
                      0 New
                    </span>
                  </div>
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-medium text-[#64748B]">You&apos;re all caught up!</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">No pending alerts</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-[#E2E8F0] hidden sm:block" />

          {/* Profile Identity & Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
            >
              <div className="flex flex-col items-end text-right min-w-0">
                <span className="text-[13px] font-bold text-[#111827] leading-tight truncate max-w-[120px]">
                  {user?.name || 'sahil'}
                </span>
                <span className="text-[11px] font-medium text-[#64748B] capitalize leading-none mt-0.5">
                  {user?.role || 'User'}
                </span>
              </div>

              {/* Avatar circle with online indicator */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-purple-50 border-2 border-[#5B3DF5]/30 flex items-center justify-center text-[#5B3DF5] font-extrabold text-sm shadow-xs group-hover:border-[#5B3DF5] transition-colors">
                  {userInitial}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <ChevronDown
                size={14}
                className={cn(
                  'text-[#94A3B8] group-hover:text-[#64748B] transition-transform duration-200',
                  menuOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E2E8F0] bg-white shadow-xl overflow-hidden origin-top-right py-1.5 z-50"
                >
                  <div className="px-3.5 py-2 border-b border-[#E2E8F0]/80 mb-1">
                    <p className="text-xs font-bold text-[#111827] truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{user?.email || 'user@avatani.com'}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(isAdmin ? '/admin/dashboard' : '/user/home');
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <LayoutGrid size={15} className="text-[#64748B]" />
                    Dashboard
                  </button>

                  {!isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/user/services');
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                      >
                        <Briefcase size={15} className="text-[#64748B]" />
                        Services
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/user/mybookings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                      >
                        <CalendarCheck size={15} className="text-[#64748B]" />
                        My Bookings
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(isAdmin ? '/admin/dashboard' : '/user/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <User size={15} className="text-[#64748B]" />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <Settings size={15} className="text-[#64748B]" />
                    Settings
                  </button>

                  <div className="my-1 h-px bg-[#E2E8F0]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

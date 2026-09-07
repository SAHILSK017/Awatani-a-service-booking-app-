import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User } from 'lucide-react';

export const TopNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 w-full">
        
        {/* Advanced Search Bar */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 border ${isSearchFocused ? 'bg-background border-primary ring-1 ring-primary/20' : 'bg-secondary/50 border-border hover:bg-secondary'}`}>
          <Search size={16} className={`transition-colors ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <input 
            type="text" 
            placeholder="Search..." 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-64 bg-transparent border-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground focus:ring-0"
          />
          <div className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-background border border-border text-muted-foreground shadow-sm">
            ⌘K
          </div>
        </div>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-4 ml-auto pl-12 md:pl-0">
          
          {/* Notification Hub */}
          <button className="relative p-2 rounded-full text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full border-2 border-white shadow-xs animate-pulse"></span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          
          {/* Profile Identity */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">{user?.name || 'User'}</span>
              <span className="text-xs font-semibold text-violet-600 capitalize bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">{user?.role}</span>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500 shadow-md shadow-violet-500/20">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {user?.name ? (
                    <span className="text-sm font-extrabold bg-gradient-to-tr from-violet-600 to-indigo-600 bg-clip-text text-transparent">{userInitial}</span>
                  ) : (
                    <User size={16} className="text-violet-600" />
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs"></div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="ml-1 p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

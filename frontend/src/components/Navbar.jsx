import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, LogOut } from 'lucide-react';
import { AvataniLogo } from './ui/AvataniLogo';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const getRoleLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/services', label: 'Services' },
          { to: '/admin/bookings', label: 'Bookings' },
        ];
      case 'worker':
        return [
          { to: '/worker/dashboard', label: 'Dashboard' },
          { to: '/worker/bookings', label: 'Bookings' },
        ];
      default:
        return [
          { to: '/user/home', label: 'Home' },
          { to: '/user/services', label: 'Services' },
          { to: '/user/booking', label: 'Book Service' },
          { to: '/user/mybookings', label: 'My Bookings' },
        ];
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={user ? (user.role === 'user' ? '/user/home' : `/${user.role}/dashboard`) : '/'}
              className="inline-flex items-center hover:opacity-90 transition-opacity"
            >
              <AvataniLogo size="default" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">

            {/* Links */}
            {user && getRoleLinks().map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 ${
                  location.pathname === to ? 'text-blue-600 bg-blue-50 font-semibold' : ''
                }`}
              >
                {label}
              </Link>
            ))}

            {/* 👇 USER INFO + LOGOUT */}
            {user ? (
              <div className="flex items-center gap-4">

                {/* User Info */}
                <div className="flex items-center gap-2">

                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>

                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-medium text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Login
              </Link>
            )}

          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-2">

            {user && getRoleLinks().map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 ${
                  location.pathname === to ? 'text-blue-600 bg-blue-50 font-semibold' : ''
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}

            {user && (
              <div className="px-4 py-3 border-t mt-2">

                {/* User Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>

              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
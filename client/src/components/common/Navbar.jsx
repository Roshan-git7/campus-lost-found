import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  Bell,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-navy-900 border-b border-navy-800 sticky top-0 z-40 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-black text-lg">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">
                  Campus Lost & Found
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 tracking-wider uppercase">
                  Centralized Recovery Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/browse"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive('/browse')
                  ? 'bg-navy-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              Browse Items
            </Link>
            <Link
              to="/report"
              className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                isActive('/report')
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-400 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Item</span>
            </Link>

            {isAuthenticated && (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive('/dashboard') || isActive('/admin')
                    ? 'bg-navy-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth / User Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-navy-800 transition focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 font-semibold text-xs uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left text-xs">
                      <span className="block font-medium text-white max-w-[120px] truncate">
                        {user?.name}
                      </span>
                      <span className="block text-[10px] text-slate-400 capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 border border-slate-200 z-50 text-slate-700 animate-in fade-in duration-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {isAdmin ? (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-xs hover:bg-slate-50 text-slate-700"
                        >
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span>Admin Console</span>
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-xs hover:bg-slate-50 text-slate-700"
                        >
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span>Student Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/my-reports"
                        className="flex items-center space-x-2 px-4 py-2 text-xs hover:bg-slate-50 text-slate-700"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>My Reports</span>
                      </Link>

                      <Link
                        to="/my-claims"
                        className="flex items-center space-x-2 px-4 py-2 text-xs hover:bg-slate-50 text-slate-700"
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span>My Claims</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-1.5 text-slate-300 hover:text-white"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-800 border-b border-navy-700 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-medium text-slate-200 hover:bg-navy-700"
          >
            Browse Items
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-medium text-blue-400 hover:bg-navy-700"
          >
            + Report Lost or Found Item
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-medium text-slate-200 hover:bg-navy-700"
              >
                {isAdmin ? 'Admin Console' : 'Student Dashboard'}
              </Link>
              <Link
                to="/my-reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-medium text-slate-200 hover:bg-navy-700"
              >
                My Reports
              </Link>
              <Link
                to="/my-claims"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-medium text-slate-200 hover:bg-navy-700"
              >
                My Claims
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-xs font-medium text-rose-400 hover:bg-navy-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-md text-xs font-medium bg-navy-700 text-white"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-md text-xs font-semibold bg-blue-600 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;


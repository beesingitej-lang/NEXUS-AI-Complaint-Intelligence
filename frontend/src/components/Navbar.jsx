import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Bell,
  User,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  FileText,
  Cpu,
  Menu,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, unreadCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-navy-900 border-b border-navy-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">NEXUS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-cyan-300 border border-cyan-400/30 px-1.5 py-0.5 rounded">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block -mt-1 font-medium">Complaint Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-white bg-navy-800' : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="/#features"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-navy-800/60 transition-colors"
                >
                  Features
                </a>
                <a
                  href="/#how-it-works"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-navy-800/60 transition-colors"
                >
                  How It Works
                </a>
              </>
            ) : isAdmin ? (
              /* Admin Navigation */
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/dashboard') ? 'text-white bg-blue-600' : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/complaints"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/complaints') ? 'text-white bg-blue-600' : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Manage Complaints
                </Link>
                <Link
                  to="/admin/ai-intelligence"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/ai-intelligence') ? 'text-white bg-blue-600' : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  AI Intelligence & Insights
                </Link>
              </>
            ) : (
              /* User Navigation */
              <>
                <Link
                  to="/user/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/user/dashboard') ? 'text-white bg-blue-600' : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/submit-complaint"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/submit-complaint')
                      ? 'bg-cyan-500 text-slate-900 font-semibold'
                      : 'text-white bg-blue-600 hover:bg-blue-500 shadow-sm'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Complaint
                </Link>
                <Link
                  to="/my-complaints"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-complaints') ? 'text-white bg-blue-600' : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Complaints
                </Link>
              </>
            )}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-navy-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Notifications Button */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold leading-tight text-white">{user.name}</p>
                      <p className="text-[10px] text-cyan-300 capitalize font-mono leading-tight">{user.role}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-1.5 border border-slate-200 text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-navy-800 px-4 pt-2 pb-4 space-y-2">
          {!user ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium bg-blue-600 text-white"
              >
                Get Started
              </Link>
            </>
          ) : isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                Manage Complaints
              </Link>
              <Link
                to="/admin/ai-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-cyan-300 hover:bg-navy-800"
              >
                AI Intelligence & Insights
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-navy-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                Dashboard
              </Link>
              <Link
                to="/submit-complaint"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-cyan-300 hover:bg-navy-800"
              >
                + Submit Complaint
              </Link>
              <Link
                to="/my-complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                My Complaints
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                Notifications ({unreadCount})
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-navy-800"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

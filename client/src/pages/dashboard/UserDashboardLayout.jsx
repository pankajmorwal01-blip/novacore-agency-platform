import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  FolderGit2,
  PlusCircle,
  User,
  LogOut,
  Shield,
  ArrowLeft
} from 'lucide-react';

const UserDashboardLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', end: true, icon: Layers },
    { name: 'Submit Project Request', path: '/dashboard/new-project', icon: PlusCircle },
    { name: 'My Project Requests', path: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Profile & Security', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-orange-500 flex items-center justify-center shadow-pill">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="m8.5 12 2.5 2.5 5-5"/>
              </svg>
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">NOVACORE</span>
              <span className="block text-[9px] font-mono text-slate-400">CLIENT PORTAL</span>
            </div>
          </Link>
          <Link
            to="/"
            title="Return to Public Site"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* User Card */}
        <div className="p-3.5 mx-4 my-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-accent font-bold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.company || user?.email}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-accent text-white shadow-pill'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-accent hover:bg-orange-50 border border-orange-200 transition-colors mt-4"
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Switch to Admin Console</span>
            </Link>
          )}
        </nav>

        {/* Bottom sign out */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-full text-xs text-rose-600 hover:bg-rose-50 transition-colors font-semibold text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Outlet Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;

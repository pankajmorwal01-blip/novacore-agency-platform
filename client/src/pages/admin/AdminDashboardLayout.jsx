import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  FolderKanban,
  Briefcase,
  Inbox,
  Users,
  Shield,
  LogOut,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

const AdminDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminNav = [
    { name: 'Executive Overview', path: '/admin', end: true, icon: BarChart3 },
    { name: 'Project Requests', path: '/admin/projects', icon: FolderKanban },
    { name: 'Portfolio CMS', path: '/admin/portfolio', icon: Briefcase },
    { name: 'Contact Inquiries', path: '/admin/contact', icon: Inbox },
    { name: 'User Management', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900 font-sans">
                NOVACORE <span className="text-accent text-[10px] font-mono">ADMIN</span>
              </span>
              <span className="block text-[9px] font-mono text-slate-400">OPERATIONS CONSOLE</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            title="Switch to Client View"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Administrator identity */}
        <div className="p-3.5 mx-4 my-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-orange-400 font-bold text-xs">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-orange-100 text-accent border border-orange-200 uppercase">
              Authorized Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {adminNav.map((item) => {
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

          <div className="pt-4 border-t border-slate-100 my-2">
            <Link
              to="/dashboard"
              className="flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <span>Client Portal View</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <span>Public Landing Page</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-full text-xs text-rose-600 hover:bg-rose-50 transition-colors font-semibold text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Terminate Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Outlet */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;

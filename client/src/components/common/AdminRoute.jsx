import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
        <span className="text-sm font-mono tracking-wider">VERIFYING ADMINISTRATIVE ACCESS...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-slate-400 max-w-md mb-8">
          You do not have administrative privileges required to access the Novacore operations console.
        </p>
        <a
          href="/dashboard"
          className="px-6 py-2.5 rounded-lg bg-dark-800 border border-slate-700 hover:border-accent text-white text-sm font-medium transition-colors"
        >
          Return to Client Portal
        </a>
      </div>
    );
  }

  return children;
};

export default AdminRoute;


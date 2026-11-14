import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  FolderGit2,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const AdminUsersPage = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';

    if (targetUser._id === currentAdmin._id) {
      alert('Security Protection: You cannot revoke your own administrative status.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to change the role of ${targetUser.email} to "${newRole.toUpperCase()}"?`
      )
    ) {
      return;
    }

    try {
      const res = await api.patch(`/admin/users/${targetUser._id}/role`, {
        role: newRole,
      });

      if (res.data.success) {
        setUsers(
          users.map((u) =>
            u._id === targetUser._id ? { ...u, role: newRole } : u
          )
        );
        setActionSuccess(`Role updated to ${newRole.toUpperCase()} for ${targetUser.email}`);
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
          IDENTITY & ACCESS MANAGEMENT
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          User Directory & Roles
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review registered client accounts, inspect engagement volumes, and manage administrative privileges.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or company..."
            className="w-full bg-dark-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
          />
        </div>
        <span className="text-xs font-mono text-slate-500 hidden sm:block">
          {filteredUsers.length} Registered Accounts
        </span>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-accent mb-3" />
          <span className="text-xs font-mono">LOADING USER DIRECTORY...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      ) : (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">User / Identity</th>
                  <th className="py-3.5 px-4">Contact & Company</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Projects</th>
                  <th className="py-3.5 px-4">Date Registered</th>
                  <th className="py-3.5 px-6 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((u) => {
                  const isCurrent = u._id === currentAdmin?._id;
                  const isAdminRole = u.role === 'admin';

                  return (
                    <tr key={u._id} className="hover:bg-dark-850/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] text-accent font-mono font-normal">
                                  (You)
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 font-mono text-[11px]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px]">
                        <div>{u.company || 'Individual / Personal'}</div>
                        <div className="text-slate-500">{u.phone || 'No phone'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isAdminRole
                              ? 'bg-accent/20 text-accent border border-accent/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isAdminRole && <ShieldCheck className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono">
                        <span className="px-2.5 py-1 rounded-md bg-dark-950 border border-slate-800 text-white font-semibold">
                          {u.projectCount || 0}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {!isCurrent ? (
                          <button
                            onClick={() => handleRoleToggle(u)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                              isAdminRole
                                ? 'bg-dark-850 border-slate-700 text-amber-300 hover:border-amber-400'
                                : 'bg-dark-850 border-slate-700 text-accent hover:border-accent'
                            }`}
                          >
                            {isAdminRole ? 'Demote to Client' : 'Promote to Admin'}
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">
                            Active Root Session
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;


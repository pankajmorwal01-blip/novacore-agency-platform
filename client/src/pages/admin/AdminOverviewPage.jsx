import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  CheckCircle2,
  Inbox,
  ArrowRight,
  Loader2
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';

const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve administrative analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
        <span className="text-xs font-mono">AGGREGATING ENTERPRISE METRICS...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs">
        {error || 'Error loading dashboard metrics.'}
      </div>
    );
  }

  const { stats, recentProjects, recentInquiries } = data;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
            AGENCY OPERATIONS
          </div>
          <h1 className="font-serif text-3xl font-normal text-slate-900 tracking-tight">
            Executive Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global pipeline, client requests, technical proposals, and portfolio management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            Manage Requests
          </Link>
          <Link
            to="/admin/portfolio"
            className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all"
          >
            Add Portfolio Item
          </Link>
        </div>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Users</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{stats.totalUsers}</div>
          <p className="text-[11px] text-slate-400 mt-1">Registered clients & leads</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Project Requests</span>
            <FolderKanban className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{stats.totalProjects}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">{stats.pendingProjects} pending review</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Sprints</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{stats.approvedProjects}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">{stats.completedProjects} delivered</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Contact Inquiries</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{stats.totalInquiries}</div>
          <p className="text-[11px] text-orange-600 mt-1 font-semibold">{stats.newInquiries} unread leads</p>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Project Submissions */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-lg font-normal text-slate-900">Recent Project Requests</h2>
              <p className="text-xs text-slate-500">Latest proposals awaiting or undergoing sprint cycles</p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All ({stats.totalProjects})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No project requests logged yet.</p>
            ) : (
              recentProjects.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent">
                        {p.requestId}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-500">
                      Client: <span className="text-slate-800 font-medium">{p.fullName}</span> ({p.companyName || p.email})
                    </p>
                  </div>

                  <Link
                    to={`/admin/projects/${p._id}`}
                    className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors shadow-xs shrink-0"
                  >
                    Manage Scope
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-lg font-normal text-slate-900">Recent Inquiries</h2>
              <p className="text-xs text-slate-500">Public web form submissions</p>
            </div>
            <Link
              to="/admin/contact"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No contact inquiries received yet.</p>
            ) : (
              recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{inq.name}</span>
                    <StatusBadge status={inq.status} size="xs" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    "{inq.message}"
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-200/60">
                    <span>{inq.email}</span>
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;

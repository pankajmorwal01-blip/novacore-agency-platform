import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Search,
  Filter,
  ArrowRight,
  Loader2,
  Trash2
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';

const statusOptions = [
  'all',
  'Submitted',
  'Under Review',
  'In Discussion',
  'Approved',
  'In Progress',
  'Completed',
  'Rejected',
  'Cancelled',
];

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (search) query.append('search', search);

      const res = await api.get(`/admin/projects?${query.toString()}`);
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve project requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/projects/${id}`);
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
          ENGAGEMENT PIPELINE
        </div>
        <h1 className="font-serif text-3xl font-normal text-slate-900 tracking-tight">
          Project Request Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review client briefs, update milestone statuses, and manage technical communication.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-soft">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, client, or company..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
          />
        </form>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-accent text-white shadow-pill'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Project Table / List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-accent mb-3" />
          <span className="text-xs font-mono">LOADING PIPELINE...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-soft">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            No projects match the selected criteria or query.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 sm:p-6 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-soft hover:shadow-card-hover"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                    {p.requestId}
                  </span>
                  <StatusBadge status={p.status} />
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-500">
                  <span>Client: <strong className="text-slate-800">{p.fullName}</strong> ({p.companyName || p.email})</span>
                  <span>Category: <strong className="text-slate-800">{p.serviceCategory}</strong></span>
                  <span>Budget: <strong className="text-accent font-semibold">{p.budgetRange}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-0 border-slate-100">
                <button
                  onClick={() => handleDeleteProject(p._id, p.title)}
                  className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                  title="Delete Request"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link
                  to={`/admin/projects/${p._id}`}
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Review & Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProjectsPage;

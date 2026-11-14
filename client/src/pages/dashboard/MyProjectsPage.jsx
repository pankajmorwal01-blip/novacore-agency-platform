import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';

const statusFilters = [
  'All',
  'Submitted',
  'Under Review',
  'In Discussion',
  'Approved',
  'In Progress',
  'Completed',
  'Rejected',
];

const MyProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/projects/my');
        if (res.data.success) {
          setProjects(res.data.projects);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.requestId.toLowerCase().includes(search.toLowerCase()) ||
      p.serviceCategory.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
            ENGAGEMENTS
          </div>
          <h1 className="font-serif text-3xl font-normal text-slate-900 tracking-tight">
            My Project Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status, review milestones, and collaborate on project scopes.
          </p>
        </div>

        <Link
          to="/dashboard/new-project"
          className="px-6 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, or category..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {statusFilters.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-accent text-white shadow-pill'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-accent mb-3" />
          <span className="text-xs font-mono">LOADING PROJECTS...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-soft">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {search || statusFilter !== 'All'
              ? 'No project requests match your current filters.'
              : 'You have not submitted any project requests yet.'}
          </p>
          {(search || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-soft hover:shadow-card-hover transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs text-accent font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                    {p.requestId}
                  </span>
                  <StatusBadge status={p.status} />
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-500">
                  <span>Category: <strong className="text-slate-800">{p.serviceCategory}</strong></span>
                  <span>Budget: <strong className="text-slate-800">{p.budgetRange}</strong></span>
                  <span>Deadline: <strong className="text-slate-800">{p.expectedDeadline}</strong></span>
                </div>
              </div>

              <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-slate-100 flex items-center justify-end">
                <Link
                  to={`/dashboard/projects/${p._id}`}
                  className="w-full md:w-auto px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Console</span>
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

export default MyProjectsPage;

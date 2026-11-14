import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Loader2,
  FileText,
  Activity
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';

const UserOverviewPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects/my');
        if (res.data.success) {
          setProjects(res.data.projects);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve project requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const total = projects.length;
  const underReview = projects.filter((p) => ['Submitted', 'Under Review', 'In Discussion'].includes(p.status)).length;
  const inProgress = projects.filter((p) => ['Approved', 'In Progress'].includes(p.status)).length;
  const completed = projects.filter((p) => p.status === 'Completed').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-soft">
        <div>
          <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
            CLIENT PORTAL OVERVIEW
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track development milestones, review architectural proposals, and communicate directly with lead engineers.
          </p>
        </div>

        <Link
          to="/dashboard/new-project"
          className="px-6 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project Request</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Requests</span>
            <FolderGit2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{total}</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">Under Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{underReview}</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-accent">Active Sprints</span>
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{inProgress}</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-sans text-slate-900">{completed}</div>
        </div>
      </div>

      {/* Recent Projects List */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-normal text-slate-900">Your Project Requests</h2>
            <p className="text-xs text-slate-500">All submissions associated with your account</p>
          </div>
          {projects.length > 0 && (
            <Link
              to="/dashboard/projects"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-accent mb-3" />
            <span className="text-xs font-mono">LOADING YOUR REQUESTS...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No Project Requests Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              You haven't submitted any software or AI project requests yet.
            </p>
            <Link
              to="/dashboard/new-project"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-accent text-white text-xs font-semibold shadow-pill"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Project Request</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-accent font-semibold">
                      {project.requestId}
                    </span>
                    <StatusBadge status={project.status} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{project.title}</h4>
                  <p className="text-xs text-slate-500">
                    {project.serviceCategory} • Budget: {project.budgetRange} • Target: {project.expectedDeadline}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/dashboard/projects/${project._id}`}
                    className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors shadow-xs"
                  >
                    Open Console
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverviewPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  Loader2,
  AlertCircle,
  Save,
  Trash2,
  FileText
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ProjectDiscussion from '../../components/common/ProjectDiscussion';
import api from '../../services/api';

const availableStatuses = [
  'Submitted',
  'Under Review',
  'In Discussion',
  'Approved',
  'In Progress',
  'Completed',
  'Rejected',
  'Cancelled',
];

const AdminProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status and Notes Form
  const [selectedStatus, setSelectedStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  const fetchProject = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/projects/${id}`);
      if (res.data.success) {
        setProject(res.data.project);
        setMessages(res.data.messages || []);
        setSelectedStatus(res.data.project.status);
        setAdminNotes(res.data.project.adminNotes || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve project specifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess('');

    try {
      const res = await api.patch(`/admin/projects/${id}/status`, {
        status: selectedStatus,
        adminNotes,
        comment: statusComment,
      });

      if (res.data.success) {
        setProject(res.data.project);
        setUpdateSuccess(`Status successfully updated to "${selectedStatus}". User notified.`);
        setStatusComment('');
        fetchProject();
        setTimeout(() => setUpdateSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update project status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete project "${project?.title}" and all associated discussion messages?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/projects/${id}`);
      if (res.data.success) {
        navigate('/admin/projects');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
        <span className="text-xs font-mono">LOADING ADMINISTRATIVE PROJECT RECORD...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl max-w-md mx-auto shadow-soft">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-serif text-xl font-normal text-slate-900 mb-2">Project Record Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">{error || 'This project does not exist.'}</p>
        <Link
          to="/admin/projects"
          className="px-6 py-2.5 rounded-full bg-slate-900 text-xs font-semibold text-white"
        >
          Return to Projects Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ALL REQUESTS</span>
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Request Record</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-accent px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200">
              {project.requestId}
            </span>
            <StatusBadge status={project.status} size="lg" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            Received {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mb-4">{project.title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">CLIENT NAME</span>
            <strong className="text-slate-900 font-bold">{project.fullName}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">EMAIL</span>
            <strong className="text-accent">{project.email}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">COMPANY</span>
            <strong className="text-slate-900 font-bold">{project.companyName || 'Not Specified'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">PHONE</span>
            <strong className="text-slate-700">{project.phone || 'None'}</strong>
          </div>
        </div>
      </div>

      {/* Status Controller Form */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2 font-sans">
          <Shield className="w-4 h-4 text-accent" />
          <span>Administrative Status Controller & Internal Notes</span>
        </h3>

        {updateSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{updateSuccess}</span>
          </div>
        )}

        <form onSubmit={handleStatusUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Project Milestone Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent font-semibold"
              >
                {availableStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status Change Note (Dispatched to client & logged in thread)
              </label>
              <input
                type="text"
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="e.g. Scope call completed. SOW approved by partner."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Internal Admin Notes <span className="text-orange-600 font-mono text-[11px] font-normal">(Confidential - Never exposed to client)</span>
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Private team notes: Estimated engineering hours, technical lead assignment, billing milestones..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updating}
              className="px-7 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {updating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Committing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Status & Notes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Specifications & Discussion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Specifications */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 font-sans">
            <FileText className="w-4 h-4 text-accent" />
            <span>Client Specifications</span>
          </h3>

          <div>
            <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-1">
              Project Description
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.problemToSolve && (
            <div>
              <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-1">
                Problem to Solve
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                {project.problemToSolve}
              </p>
            </div>
          )}

          {project.requiredFeatures && project.requiredFeatures.length > 0 && (
            <div>
              <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-2">
                Requested Features
              </h4>
              <div className="space-y-2">
                {project.requiredFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">CATEGORY</span>
              <strong className="text-slate-900">{project.serviceCategory}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">BUDGET</span>
              <strong className="text-accent font-semibold">{project.budgetRange}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">DEADLINE</span>
              <strong className="text-slate-900">{project.expectedDeadline}</strong>
            </div>
          </div>

          {project.attachments && project.attachments.length > 0 && (
            <div>
              <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-2">
                Attachments ({project.attachments.length})
              </h4>
              <div className="space-y-2">
                {project.attachments.map((file, i) => (
                  <a
                    key={i}
                    href={file.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <span className="truncate">{file.originalName || file.fileName}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Discussion Thread */}
        <div className="lg:col-span-5">
          <ProjectDiscussion
            projectId={project._id}
            initialMessages={messages}
            currentUserId={user?._id}
            isAdmin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProjectDetailPage;

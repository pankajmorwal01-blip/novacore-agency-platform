import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Paperclip,
  CheckCircle2,
  FileText,
  Loader2,
  Edit3,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ProjectDiscussion from '../../components/common/ProjectDiscussion';
import api from '../../services/api';

const statusSteps = [
  'Submitted',
  'Under Review',
  'In Discussion',
  'Approved',
  'In Progress',
  'Completed',
];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    problemToSolve: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.data.success) {
          setProject(res.data.project);
          setMessages(res.data.messages || []);
          setEditForm({
            title: res.data.project.title,
            description: res.data.project.description,
            problemToSolve: res.data.project.problemToSolve || '',
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await api.put(`/projects/${id}`, editForm);
      if (res.data.success) {
        setProject(res.data.project);
        setEditing(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to update specifications.');
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
        <span className="text-xs font-mono">RETRIEVING PROJECT SPECIFICATIONS...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-soft">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-serif text-xl font-normal text-slate-900 mb-2">Access Denied or Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">{error || 'This project does not exist or you do not have permission to view it.'}</p>
        <Link
          to="/dashboard/projects"
          className="px-6 py-2.5 rounded-full bg-slate-900 text-xs font-semibold text-white"
        >
          Return to My Projects
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(project.status);

  return (
    <div className="space-y-8">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO PROJECTS</span>
        </Link>

        {['Submitted', 'Under Review'].includes(project.status) && (
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editing ? 'Cancel Editing' : 'Edit Scope'}</span>
          </button>
        )}
      </div>

      {/* Project Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs text-accent font-semibold px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200">
              {project.requestId}
            </span>
            <StatusBadge status={project.status} size="lg" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            Submitted on {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProject} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Overview & Description
              </label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-5 py-1.5 rounded-full bg-accent text-xs font-semibold text-white shadow-pill"
              >
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mb-2">{project.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>
        )}

        {/* Milestone Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-4 font-semibold">
            Development Lifecycle
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {statusSteps.map((step, idx) => {
              const isPastOrCurrent = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-orange-50 border-orange-200 text-accent font-bold shadow-xs'
                      : isPastOrCurrent
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                      : 'bg-slate-50 border-slate-200/60 text-slate-400'
                  }`}
                >
                  <div className="text-[9px] font-mono mb-0.5">STEP 0{idx + 1}</div>
                  <div className="text-xs truncate">{step}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Requirements and Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 font-sans">
              <FileText className="w-4 h-4 text-accent" />
              <span>Project Requirements & Specifications</span>
            </h3>

            {project.problemToSolve && (
              <div>
                <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-1 font-semibold">
                  Problem to Solve
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                  {project.problemToSolve}
                </p>
              </div>
            )}

            {project.requiredFeatures && project.requiredFeatures.length > 0 && (
              <div>
                <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-2 font-semibold">
                  Required Features
                </h4>
                <div className="space-y-2">
                  {project.requiredFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                  Category
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {project.serviceCategory}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                  Budget
                </span>
                <span className="text-xs font-bold text-accent font-sans">
                  {project.budgetRange}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                  Deadline
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {project.expectedDeadline}
                </span>
              </div>
            </div>

            {project.preferredTechnology && (
              <div>
                <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-1 font-semibold">
                  Preferred Tech Stack
                </h4>
                <p className="text-xs font-mono text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
                  {project.preferredTechnology}
                </p>
              </div>
            )}

            {/* Attachments */}
            {project.attachments && project.attachments.length > 0 && (
              <div>
                <h4 className="text-[11px] font-mono text-slate-400 uppercase mb-2 font-semibold">
                  Attachments & Spec Files ({project.attachments.length})
                </h4>
                <div className="space-y-2">
                  {project.attachments.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 text-xs text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-accent shrink-0" />
                        <span className="truncate">{file.originalName || file.fileName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Discussion Thread */}
        <div className="lg:col-span-5">
          <ProjectDiscussion
            projectId={project._id}
            initialMessages={messages}
            currentUserId={user?._id}
            isAdmin={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

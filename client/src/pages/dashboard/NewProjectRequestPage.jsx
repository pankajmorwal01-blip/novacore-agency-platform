import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Plus,
  Trash2,
  Paperclip
} from 'lucide-react';
import api from '../../services/api';

const categories = [
  'AI Agent Development',
  'AI Automation and Workflow Integration',
  'Custom Web Application Development',
  'Android and iOS App Development',
  'SaaS Product Development',
  'Backend and API Development',
  'Database Design',
  'E-commerce Development',
  'Software Consulting and Maintenance',
  'Enterprise Solutions'
];

const budgetRanges = [
  '$5k - $15k',
  '$15k - $30k',
  '$30k - $60k',
  '$60k - $120k',
  '$120k+',
  'Flexible / To be scoped'
];

const deadlineOptions = [
  'Urgent (< 1 month)',
  '1 - 3 months',
  '3 - 6 months',
  '6+ months',
  'Ongoing partnership'
];

const NewProjectRequestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    title: searchParams.get('title') || '',
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.company || '',
    serviceCategory: searchParams.get('category') || 'AI Agent Development',
    description: '',
    problemToSolve: '',
    preferredTechnology: '',
    budgetRange: '$30k - $60k',
    expectedDeadline: '1 - 3 months',
    additionalRequirements: '',
  });

  const [featureInputs, setFeatureInputs] = useState(['']);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdProject, setCreatedProject] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        companyName: prev.companyName || user.company || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...featureInputs];
    updated[index] = value;
    setFeatureInputs(updated);
  };

  const addFeatureField = () => {
    setFeatureInputs([...featureInputs, '']);
  };

  const removeFeatureField = (index) => {
    if (featureInputs.length === 1) {
      setFeatureInputs(['']);
      return;
    }
    const updated = featureInputs.filter((_, i) => i !== index);
    setFeatureInputs(updated);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a project title.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please describe your project requirements.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const cleanFeatures = featureInputs.map((f) => f.trim()).filter(Boolean);
      data.append('requiredFeatures', JSON.stringify(cleanFeatures));

      attachments.forEach((file) => {
        data.append('attachments', file);
      });

      const res = await api.post('/projects', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setCreatedProject(res.data.project);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit project request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
          SYSTEMS SCOPING
        </div>
        <h1 className="font-serif text-3xl font-normal text-slate-900 tracking-tight">
          Submit New Project Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide your technical requirements, goals, and constraints. Our engineering leadership reviews all specifications within 24 hours.
        </p>
      </div>

      {createdProject ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-soft">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-mono text-accent px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
              REQUEST LOGGED: {createdProject.requestId}
            </span>
            <h2 className="font-serif text-2xl font-normal text-slate-900 mt-3">
              Project Successfully Initialized
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Your request for <strong className="text-slate-800">"{createdProject.title}"</strong> has been queued for architectural discovery.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/dashboard/projects/${createdProject._id}`}
              className="px-7 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill flex items-center justify-center gap-1.5"
            >
              <span>Open Project Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => {
                setCreatedProject(null);
                setFormData({
                  title: '',
                  fullName: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  companyName: user?.company || '',
                  serviceCategory: 'AI Agent Development',
                  description: '',
                  problemToSolve: '',
                  preferredTechnology: '',
                  budgetRange: '$30k - $60k',
                  expectedDeadline: '1 - 3 months',
                  additionalRequirements: '',
                });
                setFeatureInputs(['']);
                setAttachments([]);
              }}
              className="px-7 py-3 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-soft">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 font-sans">
              01. Project Classification & Scope
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Autonomous Customer Support & Triage Agent"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Service Category *
                </label>
                <select
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Technology / Stack <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="preferredTechnology"
                  value={formData.preferredTechnology}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, PyTorch, LangChain, PostgreSQL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 font-sans">
              02. Primary Point of Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Contact Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enterprise name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 font-sans">
              03. Detailed System Specifications
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Project Overview & Core Objective *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what the system will accomplish, user roles, core workflow, and expected outputs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Key Business Problem to Solve
              </label>
              <textarea
                name="problemToSolve"
                rows={3}
                value={formData.problemToSolve}
                onChange={handleChange}
                placeholder="What operational bottleneck or latency is this project addressing?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Required Features & Key Deliverables
                </label>
                <button
                  type="button"
                  onClick={addFeatureField}
                  className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-2">
                {featureInputs.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 w-5">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      placeholder={`Feature requirement #${idx + 1}`}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(idx)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 font-sans">
              04. Commercial Parameters & Deadlines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Budget Allocation Range *
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                >
                  {budgetRanges.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Production Deadline *
                </label>
                <select
                  name="expectedDeadline"
                  value={formData.expectedDeadline}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all"
                >
                  {deadlineOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attach Architecture Diagrams or Spec Docs <span className="text-slate-400 font-normal">(PDF, Images, ZIP up to 15MB)</span>
              </label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  {attachments.length > 0
                    ? `${attachments.length} file(s) selected: ${attachments.map((f) => f.name).join(', ')}`
                    : 'Click or drag files here to upload'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  PDF, DOCX, PNG, JPG, WEBP, ZIP
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              * Required fields
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Project Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewProjectRequestPage;

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';
import api from '../../services/api';

const categories = [
  'AI & Autonomous Agents',
  'Enterprise Web Apps',
  'Mobile Engineering',
  'SaaS Platforms',
  'Cloud & API Systems',
  'E-commerce & Payments'
];

const AdminPortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'AI & Autonomous Agents',
    client: '',
    description: '',
    fullDescription: '',
    technologies: '',
    impactMetrics: '',
    image: '',
    projectUrl: '',
    featured: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/portfolio');
      if (res.data.success) {
        setPortfolio(res.data.portfolio);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'AI & Autonomous Agents',
      client: '',
      description: '',
      fullDescription: '',
      technologies: '',
      impactMetrics: '',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      projectUrl: '',
      featured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      client: item.client || '',
      description: item.description,
      fullDescription: item.fullDescription || '',
      technologies: item.technologies.join(', '),
      impactMetrics: (item.impactMetrics || []).join('\n'),
      image: item.image || '',
      projectUrl: item.projectUrl || '',
      featured: item.featured || false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        impactMetrics: formData.impactMetrics.split('\n').map((m) => m.trim()).filter(Boolean),
      };

      if (editingItem) {
        await api.put(`/admin/portfolio/${editingItem._id}`, payload);
      } else {
        await api.post('/admin/portfolio', payload);
      }

      setModalOpen(false);
      fetchPortfolio();
    } catch (err) {
      alert(err.message || 'Failed to save portfolio case study.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete case study "${title}"?`)) return;

    try {
      await api.delete(`/admin/portfolio/${id}`);
      setPortfolio(portfolio.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete case study.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
            CONTENT MANAGEMENT
          </div>
          <h1 className="font-serif text-3xl font-normal text-slate-900 tracking-tight">
            Portfolio & Case Studies CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, edit, and curate technical case studies displayed on the public site.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Case Study</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-accent mb-3" />
          <span className="text-xs font-mono">LOADING PORTFOLIO ENTRIES...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
          {error}
        </div>
      ) : portfolio.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-soft">
          <p className="text-slate-500 text-xs mb-4">No portfolio items published yet.</p>
          <button
            onClick={openCreateModal}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Create First Case Study
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-soft hover:shadow-card-hover transition-all"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-700 shadow-xs">
                    {item.category}
                  </div>
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-accent text-white px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">{item.client}</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {item.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <a
                  href={`/portfolio/${item._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3 text-accent" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="p-1.5 rounded-full bg-white hover:bg-rose-50 border border-slate-200 text-rose-500"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-2xl my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-serif text-xl font-normal text-slate-900">
                {editingItem ? 'Edit Case Study' : 'Create New Portfolio Case Study'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Autonomous Multi-Agent Support Orchestrator"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. AeroSphere Logistics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary for cards and listing..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Architectural Deep Dive
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Comprehensive breakdown of system architecture, security models, and throughput..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="Python, FastAPI, LangChain, PostgreSQL, Docker"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Impact Metrics (one per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.impactMetrics}
                  onChange={(e) => setFormData({ ...formData, impactMetrics: e.target.value })}
                  placeholder="94% Reduction in Triage Time&#10;Zero Hallucination Protocol&#10;140,000+ Queries Daily"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-300 text-accent focus:ring-accent"
                />
                <label htmlFor="featured" className="text-xs text-slate-700 select-none font-medium">
                  Highlight as Featured Case Study on Landing Page
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Save Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolioPage;

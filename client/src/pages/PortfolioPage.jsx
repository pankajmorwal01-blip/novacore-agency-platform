import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';

const categories = [
  'All',
  'AI & Autonomous Agents',
  'Enterprise Web Apps',
  'Mobile Engineering',
  'SaaS Platforms',
  'Cloud & API Systems',
  'E-commerce & Payments'
];

const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError('');
      try {
        const query = activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : '';
        const res = await api.get(`/portfolio${query}`);
        if (res.data.success) {
          setProjects(res.data.portfolio);
        }
      } catch (err) {
        setError(err.message || 'Failed to load portfolio projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [activeCategory]);

  return (
    <div className="py-16 md:py-24 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 text-center mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-sans font-medium mb-4 shadow-xs">
            <span>•</span>
            <span>Case Studies & Track Record</span>
            <span>•</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-slate-900 tracking-tight mb-4">
            Our Completed Work
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
            Examine our architectural track record across autonomous agent swarms, high-frequency web platforms, and scaled systems.
          </p>
        </div>

        {/* Category Filters in Rounded Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-accent text-white shadow-pill'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
            <span className="text-xs font-mono tracking-wider">RETRIEVING CASE STUDIES...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <p className="text-slate-500 text-sm mb-4">No projects listed under this category yet.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="text-xs font-semibold text-accent hover:underline"
            >
              View All Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="bg-white border border-slate-100 hover:border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between shadow-soft hover:shadow-card-hover transition-all duration-300 group"
              >
                {/* Thumbnail */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={proj.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-700 shadow-xs">
                    {proj.category}
                  </div>
                  {proj.featured && (
                    <div className="absolute top-3 right-3 bg-accent text-white px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wide shadow-pill">
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 mb-1">{proj.client}</div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Impact metrics preview */}
                    {proj.impactMetrics && proj.impactMetrics.length > 0 && (
                      <div className="space-y-1 mb-5 p-3 rounded-xl bg-orange-50/50 border border-orange-100/70">
                        {proj.impactMetrics.slice(0, 2).map((metric, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-orange-700">
                            <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Technologies tags */}
                    <div className="flex flex-wrap gap-1 mb-5">
                      {proj.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/portfolio/${proj._id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;

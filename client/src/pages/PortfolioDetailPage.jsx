import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Code2,
  Building,
  Loader2,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const PortfolioDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/portfolio/${id}`);
        if (res.data.success) {
          setProject(res.data.project);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve case study details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
        <span className="text-xs font-mono tracking-wider">LOADING ARCHITECTURAL BRIEF...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Case Study Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">{error || 'The requested project could not be found.'}</p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Our Work</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-accent mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO OUR WORK</span>
        </Link>

        {/* Header Metadata */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
            <span className="px-3 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-accent font-semibold text-[11px]">
              {project.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {project.client}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-slate-900 tracking-tight mb-4 leading-tight">
            {project.title}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Hero image preview */}
        {project.image && (
          <div className="rounded-3xl overflow-hidden border border-slate-100 mb-12 shadow-card bg-slate-100">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto max-h-[520px] object-cover"
            />
          </div>
        )}

        {/* Impact Metrics Banner */}
        {project.impactMetrics && project.impactMetrics.length > 0 && (
          <div className="mb-12 bg-slate-50/70 border border-slate-100 rounded-2xl p-6 sm:p-8">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4 font-sans">
              Measurable Business Impact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.impactMetrics.map((metric, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 text-accent text-xs font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Metric #{i + 1}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{metric}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deep Dive & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-normal text-slate-900 mb-3">
                Architecture & Engineering Execution
              </h2>
              <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                <p>
                  {project.fullDescription || project.description}
                </p>
                <p>
                  Every component within this system was engineered around high-availability primitives: deterministic schema boundaries, comprehensive telemetry observability, and zero single-point-of-failure database replication topologies.
                </p>
              </div>
            </div>

            {project.projectUrl && (
              <div className="pt-2">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
                >
                  <span>Open Public Case Study URL</span>
                  <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                </a>
              </div>
            )}
          </div>

          {/* Tech Stack Sidebar */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 space-y-6 h-fit">
            <div>
              <h3 className="text-[11px] font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5 tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-accent" />
                Technologies Deployed
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-[11px] font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Deployment Model
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Containerized Microservices on Kubernetes with automated blue/green deployment pipelines.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to={`/dashboard/new-project?title=${encodeURIComponent(`Project inspired by ${project.title}`)}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all"
              >
                <span>Commission Similar Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailPage;

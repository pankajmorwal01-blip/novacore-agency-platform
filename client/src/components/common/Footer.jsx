import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Check } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-orange-500 flex items-center justify-center shadow-pill">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="m8.5 12 2.5 2.5 5-5"/>
                </svg>
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 font-sans">
                NOVACORE <span className="text-accent text-xs font-mono uppercase">SOFTWARE</span>
              </span>
            </Link>

            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              We build custom software, autonomous AI agent swarms, and high-concurrency cloud systems that move your business forward.
            </p>

            <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-accent" />
                <span>DSGVO / GDPR Compliant</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>SOC-2 Type II Certified</span>
              </div>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-4 font-sans">
              Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services#ai-agents" className="hover:text-slate-900 transition-colors">
                  AI Agent Swarms
                </Link>
              </li>
              <li>
                <Link to="/services#ai-automation" className="hover:text-slate-900 transition-colors">
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link to="/services#web-apps" className="hover:text-slate-900 transition-colors">
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/services#mobile" className="hover:text-slate-900 transition-colors">
                  Mobile Applications
                </Link>
              </li>
              <li>
                <Link to="/services#backend" className="hover:text-slate-900 transition-colors">
                  Cloud Infrastructure
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-4 font-sans">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="hover:text-slate-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-slate-900 transition-colors">
                  Case Studies & Proof
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-slate-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard/new-project" className="text-accent font-semibold hover:underline">
                  Start Your Project →
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Portal */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-4 font-sans">
              Client Portal
            </h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Track project milestones, view sprint deliverables, and message lead engineers.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs"
            >
              <span>Access Portal</span>
              <span className="text-accent">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Novacore Software Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-600">Privacy & DSGVO</Link>
            <Link to="/about" className="hover:text-slate-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

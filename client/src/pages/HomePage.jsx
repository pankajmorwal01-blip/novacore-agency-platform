import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  CalendarCheck,
  Code2,
  Server,
  MessageSquare,
  Cloud,
  Check,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Bot,
  Zap,
  Layers,
  Database,
  ExternalLink,
  Users
} from 'lucide-react';
import api from '../services/api';

const serviceCards = [
  {
    id: 'ai-agents',
    title: 'AI Agent Swarms',
    icon: Bot,
    description: 'Autonomous multi-agent swarms with deterministic task planning, tool-calling sandboxes, and verification.',
    link: '/services#ai-agents',
  },
  {
    id: 'ai-automation',
    title: 'Workflow Automation',
    icon: Zap,
    description: 'Automated event-driven AI reasoning pipelines that connect CRM, ERP, and databases to eliminate manual work.',
    link: '/services#ai-automation',
  },
  {
    id: 'web-apps',
    title: 'Software Development',
    icon: Code2,
    description: 'High-throughput, responsive web applications engineered with React, Next.js, and clean architecture in the cloud.',
    link: '/services#web-apps',
  },
  {
    id: 'backend',
    title: 'Cloud & API Infrastructure',
    icon: Server,
    description: 'Stateless microservices, Redis caching layers, and high-concurrency REST/GraphQL backends with sub-50ms latency.',
    link: '/services#backend',
  },
  {
    id: 'mobile',
    title: 'Mobile Applications',
    icon: MessageSquare,
    description: 'Native iOS and Android mobile engineering offering offline-first cryptographic synchronization and sensor telemetry.',
    link: '/services#mobile',
  },
  {
    id: 'saas',
    title: 'SaaS Platforms & Hosting',
    icon: Cloud,
    description: 'Multi-tenant cloud architectures with automated billing, tenant isolation, zero-downtime CI/CD, and 24/7 monitoring.',
    link: '/services#saas',
  },
];

const processPhases = [
  {
    number: '01',
    title: 'Architecture Discovery',
    description: 'We translate your business logic and security constraints into deterministic technical specifications and API schemas.',
  },
  {
    number: '02',
    title: 'Agile Systems Development',
    description: 'Two-week sprint cycles with live staging environments, continuous testing, and direct senior engineer communication.',
  },
  {
    number: '03',
    title: 'Hardening & QA Verification',
    description: 'Automated regression testing, OWASP penetration audits, and load stress benchmarks to guarantee production durability.',
  },
  {
    number: '04',
    title: 'Deployment & SLA Care',
    description: 'Zero-downtime containerized release, comprehensive telemetry observability, and dedicated ongoing maintenance SLAs.',
  },
];

const faqs = [
  {
    q: 'How does Novacore guarantee security and intellectual property protection?',
    a: 'Every engagement begins with a bilateral mutual NDA. Upon milestone completion, 100% of intellectual property, source code, repositories, and architecture documentation belong exclusively to your organization with zero vendor lock-in.',
  },
  {
    q: 'How do you prevent hallucinations in AI Agent deployments?',
    a: 'We architect AI systems with deterministic validation layers. Rather than trusting raw model outputs, our agents execute within constrained state machines featuring Pydantic schema validation, tool-call sandboxing, and retrieval-augmented verification (RAG).',
  },
  {
    q: 'What is your typical project timeline and commercial model?',
    a: 'Standard MVP deliveries span 4 to 8 weeks, while large-scale enterprise platforms run 3 to 6 months. We offer fixed-price milestone contracts or dedicated senior engineering sprint retainers.',
  },
  {
    q: 'Can our internal engineering team collaborate with Novacore?',
    a: 'Yes. We regularly embed with in-house engineering squads or operate as an autonomous specialized unit with daily Git commits and sprint reports.',
  },
];

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/portfolio?featured=true&limit=3');
        if (res.data.success && res.data.portfolio.length > 0) {
          setFeaturedProjects(res.data.portfolio);
        }
      } catch (err) {
        console.warn('Could not fetch featured portfolio:', err.message);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="relative overflow-hidden bg-white text-slate-900">
      {/* Subtle Light Grid Background matching screenshot */}
      <div className="absolute inset-0 bg-light-grid opacity-75 pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Badge matching `- GO-Soft Solutions -` in screenshot */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-sans font-medium mb-6 shadow-xs">
            <span>•</span>
            <span>Novacore Software Solutions</span>
            <span>•</span>
          </div>

          {/* Editorial Serif Headline matching reference screenshot */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-slate-900 tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto">
            We Build Software That Moves<br />
            Your <span className="italic font-normal">Business</span> Forward.
          </h1>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-7">
            <Link
              to="/dashboard/new-project"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold shadow-pill transition-all inline-flex items-center justify-center gap-1.5"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/portfolio"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center"
            >
              <span>See Our Work</span>
            </Link>
          </div>

          {/* Feature Checkmarks Row matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium mb-14">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-slate-800" strokeWidth={2.5} />
              <span>Based in Global Cloud</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-slate-800" strokeWidth={2.5} />
              <span>SOC-2 & DSGVO-compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-slate-800" strokeWidth={2.5} />
              <span>Fixed-price projects available</span>
            </div>
          </div>

          {/* Hero Visual Showcase matching screenshot duo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-4xl mx-auto text-left">
            {/* Left Image: Female Developer working in warm monitor glow */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-card border border-slate-100 bg-slate-900 h-72 sm:h-80 relative group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                alt="Novacore Lead Software Engineer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-white text-xs font-semibold block">Elena Rostova</span>
                  <span className="text-orange-300 text-[11px] font-mono">Lead Distributed Systems Engineer</span>
                </div>
              </div>
            </div>

            {/* Right Card: Hosting & Active Sessions Telemetry matching screenshot */}
            <div className="lg:col-span-5 bg-gradient-to-br from-amber-400/20 via-orange-500/30 to-amber-600/40 p-1.5 rounded-3xl shadow-card">
              <div className="bg-white rounded-[22px] p-5 h-full flex flex-col justify-between space-y-4">
                {/* Top Section: Hosting */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                    HOSTING
                  </div>
                  <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-100 text-center">
                    <div>
                      <div className="text-lg font-bold text-slate-900 font-sans">100%</div>
                      <div className="text-[9px] text-slate-400 uppercase font-medium">Uptime monitoring</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 font-sans">5%</div>
                      <div className="text-[9px] text-slate-400 uppercase font-medium">Disk space</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 font-sans">59%</div>
                      <div className="text-[9px] text-slate-400 uppercase font-medium">8 CPU cores</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Active Sessions & Gauge */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                    ACTIVE SESSIONS
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Circular Progress Gauge */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="#F1F5F9"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="#EA580C"
                          strokeWidth="5"
                          strokeDasharray="163"
                          strokeDashoffset="45"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-sm font-bold text-slate-900">33</span>
                        <span className="text-[7px] text-emerald-600 font-bold uppercase">Active</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <span>2W 4D estimated workload</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>14 contributors deployed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Client / Partner Proof Bar matching screenshot */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-8">
            Used by over 200+ companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-base font-extrabold tracking-tight text-slate-700 font-mono">ENREACH</span>
            <span className="text-base font-bold tracking-widest text-slate-700">SOPHOS</span>
            <span className="text-base font-black tracking-tight text-slate-700">ZEBRA</span>
            <span className="text-base font-medium tracking-tight text-slate-700">Microsoft Partner</span>
            <span className="text-base font-bold tracking-tight text-slate-700">AWS ADVANCED</span>
          </div>
        </div>
      </section>

      {/* 3. "Our Services" Section matching screenshot */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Editorial Serif Title */}
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Our Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
              Custom digital systems, autonomous reasoning agents, and scalable infrastructure.
            </p>
          </div>

          {/* 3-Column Card Grid matching screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {serviceCards.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white border border-slate-100 hover:border-slate-200/90 rounded-2xl p-7 flex flex-col justify-between hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div>
                    {/* Orange Line Icon inside soft container */}
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 border border-orange-100/80 flex items-center justify-center text-accent mb-5 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-accent" strokeWidth={1.8} />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* "Learn More ->" text link */}
                  <div>
                    <Link
                      to={service.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered Bottom CTA Button matching screenshot */}
          <div className="text-center">
            <Link
              to="/dashboard/new-project"
              className="inline-flex items-center gap-1.5 px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold shadow-pill transition-all"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Development Methodology */}
      <section className="py-20 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight mb-2">
              Our Engineering Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Deterministic milestones from architectural discovery to production handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processPhases.map((phase) => (
              <div
                key={phase.number}
                className="bg-white border border-slate-100 rounded-2xl p-6 relative flex flex-col justify-between shadow-soft"
              >
                <div>
                  <div className="text-3xl font-serif text-orange-200 mb-3 font-semibold">
                    {phase.number}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{phase.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{phase.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                  <Check className="w-3.5 h-3.5 text-accent" />
                  <span>Documented Sprint Handover</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Case Studies */}
      {featuredProjects.length > 0 && (
        <section className="py-20 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">
                  Selected Work
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Architectural case studies delivered for high-growth enterprises.
                </p>
              </div>
              <Link
                to="/portfolio"
                className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover"
              >
                <span>View all projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((proj) => (
                <div
                  key={proj._id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between group"
                >
                  <div className="h-48 overflow-hidden bg-slate-100 relative">
                    <img
                      src={proj.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-700 shadow-xs">
                      {proj.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block mb-1">{proj.client}</span>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{proj.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {proj.description}
                      </p>
                    </div>

                    <Link
                      to={`/portfolio/${proj._id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. FAQ Accordion */}
      <section className="py-20 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent answers regarding our engineering standards and IP ownership.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-soft"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="py-20 bg-white border-t border-slate-100 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight mb-4">
            Ready to Build Software That Moves Your Business?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-8">
            Tell us about your project specifications. Our engineering leadership responds within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard/new-project"
              className="px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold shadow-pill transition-all"
            >
              Start Your Project →
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

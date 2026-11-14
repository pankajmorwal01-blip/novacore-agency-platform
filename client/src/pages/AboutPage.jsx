import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  Check
} from 'lucide-react';

const coreValues = [
  {
    title: 'Zero Technical Debt Tolerance',
    description: 'We reject quick-fix shortcuts. Every codebase is constructed with strict TypeScript interfaces, comprehensive automated unit coverage, and deterministic architectures that stand the test of time.',
  },
  {
    title: 'Deterministic AI Systems',
    description: 'Generative models must not be black boxes. We wrap neural models in deterministic state graphs, Pydantic schemas, and tool-calling sandboxes to ensure 100% compliance and reliability.',
  },
  {
    title: 'Complete Client Code Ownership',
    description: 'No proprietary agency lock-ins. You receive 100% intellectual property, clean Git history, comprehensive API docs, and automated CI/CD configurations from day one.',
  },
  {
    title: 'Security-by-Design Baseline',
    description: 'All systems are architected to adhere to SOC-2 Type II standards, TLS 1.3 cryptography, parameterized queries, and defensive OWASP top-10 security primitives.',
  },
];

const leadershipTeam = [
  {
    name: 'Dr. Evelyn Ward',
    role: 'Chief AI Architect & Co-Founder',
    bio: 'Former Distributed Systems Researcher with over 14 years specializing in multi-agent orchestration, neural vector embeddings, and large language model safety constraints.',
    tags: ['Autonomous Agents', 'RAG Pipelines', 'PyTorch'],
  },
  {
    name: 'Alexander Chen',
    role: 'Head of Infrastructure & Cloud Systems',
    bio: 'Ex-Principal SRE who has orchestrated Kubernetes clusters processing over 80,000 requests per second. Expert in zero-downtime database topologies.',
    tags: ['Distributed Systems', 'Kubernetes', 'Go / Node.js'],
  },
  {
    name: 'Marcus Vance',
    role: 'Director of Product Engineering',
    bio: 'Veteran full-stack engineer and product architect with a deep focus on sub-50ms reactive web applications and accessible human-computer interfaces.',
    tags: ['React Architecture', 'TypeScript', 'WCAG AA Design'],
  },
];

const AboutPage = () => {
  return (
    <div className="py-16 md:py-24 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-sans font-medium mb-4 shadow-xs">
            <span>•</span>
            <span>About Novacore</span>
            <span>•</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-slate-900 tracking-tight mb-4 leading-tight">
            Engineers, Researchers, & Systems Architects.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Novacore Systems was established with a singular directive: to replace traditional, sluggish agency outsourcing with rigorous, elite full-stack software and AI systems engineering.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-soft">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-accent mb-6">
              <Cpu className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-slate-900 mb-2">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              To empower technology enterprises, startups, and institutions with robust digital infrastructure and autonomous AI reasoning systems that execute flawlessly in production environments.
            </p>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-soft">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-accent mb-6">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-slate-900 mb-2">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              A software industry where autonomous AI agents seamlessly integrate with secure distributed architectures, liberating engineering teams to build transformative products without operational fragility.
            </p>
          </div>
        </div>

        {/* Core Values / Development Philosophy */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight mb-2">
              Development Philosophy & Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The non-negotiable principles guiding every line of code we write.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl p-7 shadow-soft hover:shadow-card-hover transition-all"
              >
                <div className="text-accent font-mono font-bold text-[11px] mb-2 uppercase">
                  Standard 0{idx + 1}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{val.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Leadership Team */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight mb-2">
              Engineering Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Senior engineering specialists who actively architect systems and review every pull request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadershipTeam.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-soft hover:shadow-card-hover transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-accent font-bold font-mono text-sm mb-4">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{member.name}</h3>
                  <div className="text-xs text-accent font-semibold mb-3">{member.role}</div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {member.bio}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-4 border-t border-slate-100">
                  {member.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mb-2">
            Partner With Novacore on Your Next Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Let's discuss technical specifications, latency requirements, and system design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard/new-project"
              className="px-7 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all"
            >
              Start Your Project →
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-slate-300 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

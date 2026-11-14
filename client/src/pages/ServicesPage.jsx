import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Zap,
  Code2,
  Smartphone,
  Layers,
  Server,
  ShoppingCart,
  Shield,
  ArrowRight,
  Check,
  CheckCircle2,
  Terminal,
  Workflow
} from 'lucide-react';

const serviceDetails = [
  {
    id: 'ai-agents',
    title: 'AI Agent Development',
    tagline: 'Autonomous reasoning swarms with deterministic task execution',
    icon: Bot,
    categoryName: 'AI Agent Development',
    whatItDoes: 'We engineer autonomous AI agents capable of planning multi-step actions, invoking custom APIs, parsing complex documents, and interacting with human supervisors through deterministic state machines.',
    problemsSolved: [
      'Eliminates repetitive analytical and customer support tasks with sub-minute resolution.',
      'Prevents hallucination by constraining outputs against strict Pydantic/Zod schemas.',
      'Bridges the gap between unstructured LLM creativity and enterprise relational databases.',
    ],
    keyFeatures: [
      'Multi-agent role specialization (Researcher, Verifier, Executor)',
      'Vector Memory & Retrieval-Augmented Generation (RAG)',
      'Deterministic tool-calling sandbox with rate limiting and audit logging',
      'Human-in-the-loop fallback triggers for high-risk operations',
      'On-premise or cloud deployment (Llama 3, Claude, OpenAI)',
    ],
    developmentApproach: 'We start by decomposing workflows into deterministic state graphs. Models are fine-tuned and augmented with proprietary enterprise knowledge vectors, followed by adversarial testing for prompt injection resistance.',
    technologies: ['Python', 'FastAPI', 'LangChain', 'LlamaIndex', 'vLLM', 'PostgreSQL / pgvector', 'Redis', 'Docker'],
  },
  {
    id: 'ai-automation',
    title: 'AI Automation & Workflow Integration',
    tagline: 'Event-driven business intelligence replacing manual friction',
    icon: Zap,
    categoryName: 'AI Automation and Workflow Integration',
    whatItDoes: 'We connect your disjointed SaaS tools, databases, and operational pipelines using intelligent automated middleware that ingests events, extracts structured data, and executes downstream tasks autonomously.',
    problemsSolved: [
      'Eliminates manual data entry errors and cross-platform synchronization lag.',
      'Automates complex invoice, contract, and compliance document verification.',
      'Unifies scattered CRM, ERP, and communication tools into unified event buses.',
    ],
    keyFeatures: [
      'Asynchronous webhook listeners with automatic retry queues',
      'Optical Character Recognition (OCR) and document understanding pipelines',
      'Intelligent anomaly detection and real-time Slack/Teams incident alerts',
      'SOC-2 compliant data sanitization and audit logging',
    ],
    developmentApproach: 'We map your existing process bottlenecks, architect event queues with Kafka or RabbitMQ, and deploy resilient worker pools with automated health monitoring.',
    technologies: ['Node.js', 'Python', 'Apache Kafka', 'BullMQ', 'AWS Lambda', 'OpenSearch', 'Zapier/Make APIs'],
  },
  {
    id: 'web-apps',
    title: 'Custom Web Application Development',
    tagline: 'High-throughput, reactive platforms engineered for scale',
    icon: Code2,
    categoryName: 'Custom Web Application Development',
    whatItDoes: 'We design and build bespoke web portals, enterprise administrative consoles, and customer-facing web platforms with uncompromising speed, accessibility, and clean architecture.',
    problemsSolved: [
      'Replaces slow, monolithic legacy web interfaces with snappy single-page architectures.',
      'Solves complex state management and high-frequency real-time data streaming.',
      'Ensures consistent rendering across desktop, tablet, and mobile browsers.',
    ],
    keyFeatures: [
      'React & Next.js architectures with Server-Side Rendering (SSR) & streaming',
      'Tailwind CSS design systems with clean typography and WCAG AA accessibility',
      'End-to-end type safety with TypeScript and Zod validation',
      'Real-time bi-directional WebSockets for live telemetry and notifications',
    ],
    developmentApproach: 'Component-driven engineering utilizing atomic design principles. Every screen undergoes rigorous cross-browser testing and Lighthouse performance optimization.',
    technologies: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL', 'WebSockets', 'Playwright'],
  },
  {
    id: 'mobile',
    title: 'Android and iOS App Development',
    tagline: 'Native performance, cross-platform reach, and hardware integration',
    icon: Smartphone,
    categoryName: 'Android and iOS App Development',
    whatItDoes: 'We develop native and high-performance cross-platform mobile apps for iOS and Android, interfacing with onboard hardware sensors, Bluetooth peripherals, and cloud synchronization engines.',
    problemsSolved: [
      'Avoids the high cost of maintaining two separate codebases without sacrificing 60fps performance.',
      'Handles offline-first data caching and intermittent network connectivity.',
      'Navigates Apple App Store and Google Play Store compliance and approval protocols.',
    ],
    keyFeatures: [
      'React Native & Expo universal codebases with native Swift/Kotlin modules',
      'Offline-first SQLite/WatermelonDB storage with cryptographic synchronization',
      'Push notification pipelines with Firebase Cloud Messaging (FCM) and APNs',
      'Biometric authentication (FaceID, Fingerprint) and secure keychain storage',
    ],
    developmentApproach: 'Test-driven mobile development with continuous deployment through Fastlane. We test directly on physical device matrices to ensure zero frame drops.',
    technologies: ['React Native', 'Swift', 'Kotlin', 'Expo', 'SQLite', 'Fastlane', 'Firebase', 'Redux Toolkit'],
  },
  {
    id: 'saas',
    title: 'SaaS Product Development',
    tagline: 'Multi-tenant cloud platforms engineered for recurring revenue',
    icon: Layers,
    categoryName: 'SaaS Product Development',
    whatItDoes: 'We take SaaS products from concept to market-ready platforms complete with multi-tenant architecture, automated subscription billing, usage metering, and developer API hubs.',
    problemsSolved: [
      'Eliminates cross-tenant data leakage risks with rigorous tenant isolation.',
      'Reduces churn with intuitive self-serve onboarding and automated billing recovery.',
      'Enables third-party ecosystem growth via public developer APIs and webhooks.',
    ],
    keyFeatures: [
      'Multi-tenant database architectures (schema-per-tenant or row-level security)',
      'Integrated Stripe Billing (subscriptions, usage tiers, invoices, taxes)',
      'Granular Role-Based Access Control (RBAC) with organization workspaces',
      'API rate limiting, API key provisioning, and developer documentation hubs',
    ],
    developmentApproach: 'We architect SaaS backends around modular domain-driven design, ensuring independent feature expansion and seamless cloud horizontal autoscaling.',
    technologies: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Docker', 'Stripe Billing API', 'Kubernetes', 'SendGrid'],
  },
  {
    id: 'backend',
    title: 'Backend and API Development',
    tagline: 'Distributed microservices and high-concurrency data layers',
    icon: Server,
    categoryName: 'Backend and API Development',
    whatItDoes: 'We engineer rock-solid backend infrastructure, RESTful APIs, and GraphQL endpoints built to handle high transactional concurrency with sub-50ms response times.',
    problemsSolved: [
      'Overcomes database connection pool exhaustion and API throttling bottlenecks.',
      'Prevents cascading microservice failures with circuit breakers and retries.',
      'Protects backend endpoints against DDoS, parameter tampering, and injection vectors.',
    ],
    keyFeatures: [
      'Stateless microservice architectures optimized for Kubernetes autoscaling',
      'Redis distributed caching layers reducing database load by up to 85%',
      'Strict input sanitization, rate limiting, and Helmet security headers',
      'OpenAPI / Swagger interactive documentation and automated SDK generation',
    ],
    developmentApproach: 'We build backend services with clean separation of concerns: Routers, Controllers, Services, and Repositories, backed by automated integration tests.',
    technologies: ['Node.js', 'Express.js', 'Go', 'Docker', 'PostgreSQL', 'MongoDB', 'Redis', 'Prometheus / Grafana'],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Solutions',
    tagline: 'High-conversion headless shopping experiences and payment rails',
    icon: ShoppingCart,
    categoryName: 'E-commerce Development',
    whatItDoes: 'We build headless e-commerce storefronts, custom checkout funnels, and inventory orchestration backends designed to maximize cart conversion and withstand peak flash-sale traffic.',
    problemsSolved: [
      'Replaces sluggish monolithic store templates with instant Jamstack frontends.',
      'Resolves complex inventory sync between warehouses, retail POS, and online carts.',
      'Mitigates chargebacks and fraud with automated risk scoring.',
    ],
    keyFeatures: [
      'Headless commerce architecture with sub-second page transitions',
      'Stripe Radar fraud mitigation and multi-currency global checkouts',
      'Instant faceted product search and algorithmic recommendation engines',
      'Real-time inventory reserve locks and webhook warehouse sync',
    ],
    developmentApproach: 'Performance-first development focusing on Core Web Vitals, sub-second TTFB, and zero-distraction checkout flows proven to boost checkout completion.',
    technologies: ['React', 'Shopify Storefront API', 'Stripe', 'Node.js', 'Algolia', 'TailwindCSS', 'Redis'],
  },
  {
    id: 'consulting',
    title: 'Software Consulting and Maintenance',
    tagline: 'Institutional code audits, architecture reviews, and 24/7 SRE',
    icon: Shield,
    categoryName: 'Software Consulting and Maintenance',
    whatItDoes: 'We audit existing codebases for security vulnerabilities and performance bottlenecks, optimize cloud spending, and provide ongoing site reliability engineering (SRE) with guaranteed response times.',
    problemsSolved: [
      'Identifies and remediates critical security flaws before malicious exploitation.',
      'Slashing runaway AWS/GCP bills by eliminating idle resources and optimizing queries.',
      'Provides peace of mind with 24/7 incident response and proactive system patching.',
    ],
    keyFeatures: [
      'Comprehensive codebase security, concurrency, and architecture audit reports',
      'Cloud infrastructure right-sizing (typical 30% - 50% monthly cost reduction)',
      'Zero-downtime database upgrades and continuous dependency patching',
      'Guaranteed emergency response SLA with dedicated on-call engineers',
    ],
    developmentApproach: 'Non-destructive, observational profiling using APM telemetry, followed by prioritized architectural roadmap recommendations and hands-on remediation.',
    technologies: ['Datadog', 'Prometheus', 'AWS Well-Architected', 'Docker', 'Terraform', 'PostgreSQL Explain', 'OWASP'],
  },
];

const ServicesPage = () => {
  return (
    <div className="py-16 md:py-24 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 text-center mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-sans font-medium mb-4 shadow-xs">
            <span>•</span>
            <span>Engineering Offerings</span>
            <span>•</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-slate-900 tracking-tight mb-4">
            Custom Software & AI Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Every digital system we build is designed for production durability, extreme performance, and long-term maintainability.
          </p>
        </div>

        {/* Quick jump navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-6 mb-16 border-b border-slate-100">
          {serviceDetails.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-accent hover:border-orange-200 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>

        {/* Detailed Service Sections */}
        <div className="space-y-20">
          {serviceDetails.map((service, index) => {
            const Icon = service.icon;
            return (
              <section
                key={service.id}
                id={service.id}
                className="scroll-mt-28 bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-soft hover:shadow-card-hover transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left Column: Overview & Features */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-accent shadow-xs">
                        <Icon className="w-6 h-6 text-accent" strokeWidth={1.8} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                          Discipline 0{index + 1}
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {service.tagline}
                    </p>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
                        What It Does
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {service.whatItDoes}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-3 tracking-wider">
                        Key Features & Architecture
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.keyFeatures.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                            <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <Link
                        to={`/dashboard/new-project?category=${encodeURIComponent(service.categoryName)}`}
                        className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all"
                      >
                        <span>Start Scoping {service.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Problems Solved, Approach, Tech */}
                  <div className="lg:col-span-5 bg-slate-50/70 border border-slate-100 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase text-slate-500 mb-2.5 tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-accent" />
                        Problems Solved
                      </h4>
                      <ul className="space-y-2 mb-6">
                        {service.problemsSolved.map((prob, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                            <span className="text-orange-500 font-bold">•</span>
                            <span>{prob}</span>
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-[11px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider flex items-center gap-1.5">
                        <Workflow className="w-3.5 h-3.5 text-accent" />
                        Development Approach
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        {service.developmentApproach}
                      </p>

                      <h4 className="text-[11px] font-bold uppercase text-slate-500 mb-2 tracking-wider">
                        Technologies Deployed
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {service.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-mono text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-400 font-mono">
                      <span>Full Code Ownership • Zero Vendor Lock-in</span>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

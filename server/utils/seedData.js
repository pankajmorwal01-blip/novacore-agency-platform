const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const ProjectRequest = require('../models/ProjectRequest');
const Message = require('../models/Message');
const ContactInquiry = require('../models/ContactInquiry');
const config = require('../config/config');

const seedInitialData = async () => {
  try {
    console.log('[Seed] Checking database initialization status...');

    // 1. Check or Seed Admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    let adminUser;

    if (!existingAdmin) {
      console.log(`[Seed] Creating initial administrative account for ${config.ADMIN_EMAIL}...`);
      const salt = await bcrypt.genSalt(12);
      const adminPasswordHash = await bcrypt.hash(config.ADMIN_PASSWORD, salt);

      adminUser = await User.create({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL.toLowerCase(),
        passwordHash: adminPasswordHash,
        phone: config.ADMIN_PHONE,
        company: 'Novacore Systems HQ',
        role: 'admin',
      });
      console.log('✅ [Seed] Admin account created successfully.');
    } else {
      adminUser = existingAdmin;
      console.log(`[Seed] Existing admin account found: ${existingAdmin.email}`);
    }

    // 2. Check or Seed Demo Client User
    let demoClient = await User.findOne({ email: 'client@enterprise.com' });
    if (!demoClient) {
      const salt = await bcrypt.genSalt(12);
      const clientHash = await bcrypt.hash('ClientPass2026!', salt);

      demoClient = await User.create({
        name: 'Elena Rostova',
        email: 'client@enterprise.com',
        passwordHash: clientHash,
        phone: '+1 (415) 890-4421',
        company: 'Vanguard Biometrics',
        role: 'user',
      });
      console.log('✅ [Seed] Demo client account created (client@enterprise.com / ClientPass2026!).');
    }

    // 3. Check or Seed Portfolio Projects
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      console.log('[Seed] Seeding premier portfolio projects...');
      const portfolioItems = [
        {
          title: 'Autonomous Multi-Agent Enterprise Orchestrator',
          slug: 'autonomous-multi-agent-orchestrator',
          description: 'A distributed multi-agent swarm architecture automating triage, technical support, code verification, and Jira ticket routing for Fortune 500 engineering teams.',
          fullDescription: 'Architected an asynchronous pipeline using custom LLM agents with deterministic state machines. Reduced average ticket resolution time from 4.5 hours to 11 minutes while maintaining strict data governance and zero hallucination tolerances.',
          category: 'AI & Autonomous Agents',
          technologies: ['Python', 'FastAPI', 'LangChain', 'LlamaIndex', 'PostgreSQL', 'Docker', 'Redis'],
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          projectUrl: 'https://github.com/novacore-systems/agent-orchestrator-sample',
          client: 'AeroSphere Logistics',
          impactMetrics: ['94% Reduction in Triage Time', 'Zero Hallucination Protocol', '140,000+ Queries Processed Daily'],
          featured: true,
        },
        {
          title: 'Fintech Core: High-Frequency Banking & Analytics Portal',
          slug: 'fintech-core-banking-portal',
          description: 'Real-time financial clearinghouse and corporate cash flow predictive analytics dashboard engineered with sub-50ms latency.',
          fullDescription: 'Constructed an end-to-end institutional treasury platform featuring custom interactive charts, double-entry bookkeeping ledgers, and PCI-DSS compliant payment rails.',
          category: 'Enterprise Web Apps',
          technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Kafka'],
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          projectUrl: 'https://novacore.io/case-studies/fintech-core',
          client: 'Apex Global Capital',
          impactMetrics: ['$2.4B Transaction Volume Cleared', 'Sub-50ms Dashboard Renders', 'SOC-2 Type II Certified'],
          featured: true,
        },
        {
          title: 'HealthPulse Clinical Telemetry Suite (iOS & Android)',
          slug: 'healthpulse-clinical-telemetry',
          description: 'Cross-platform mobile application interfacing with Bluetooth Low Energy (BLE) vital sensors for real-time cardiac monitoring and alert dispatches.',
          fullDescription: 'Built with React Native and native swift/kotlin bridges, offering offline-first cryptographic synchronization and HIPAA-compliant doctor-patient chat telemetry.',
          category: 'Mobile Engineering',
          technologies: ['React Native', 'Swift', 'Kotlin', 'WebSockets', 'AWS Cognito', 'Node.js'],
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
          projectUrl: 'https://novacore.io/case-studies/healthpulse',
          client: 'CardioSync Therapeutics',
          impactMetrics: ['4.9 Stars on App Store', '350,000+ Active Patients', 'Instant Critical Alert Notifications'],
          featured: true,
        },
        {
          title: 'CloudGrid: Scaled Multi-Tenant SaaS Platform',
          slug: 'cloudgrid-saas-platform',
          description: 'Automated infrastructure orchestrator enabling dev teams to provision microservices, isolate tenant data, and meter compute usage dynamically.',
          fullDescription: 'Designed from day one for zero-downtime blue/green deployments, tiered subscription billing with Stripe, and granular role-based workspace permissions.',
          category: 'SaaS Platforms',
          technologies: ['Next.js', 'Go', 'Express', 'MongoDB', 'Redis', 'Kubernetes', 'Stripe Billing'],
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
          projectUrl: 'https://novacore.io/case-studies/cloudgrid',
          client: 'DevScale Inc.',
          impactMetrics: ['10x Infrastructure Deployment Speed', '99.99% Guaranteed SLA', '$3.2M ARR Enabled'],
          featured: true,
        },
        {
          title: 'QuantumEdge Distributed API Gateway & Microservices',
          slug: 'quantumedge-api-gateway',
          description: 'High-throughput edge routing layer handling 45,000 requests/sec with JWT token verification, dynamic rate limiting, and circuit breaking.',
          fullDescription: 'Engineered an ultra-lean proxy mesh that reduced latency variance and shielded internal microservices from DDoS spikes.',
          category: 'Cloud & API Systems',
          technologies: ['Node.js', 'Rust', 'Redis', 'Docker', 'Kong Gateway', 'Prometheus'],
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          projectUrl: 'https://novacore.io/case-studies/quantumedge',
          client: 'OmniStream Media',
          impactMetrics: ['45,000 Req/Sec Handled', '99.999% Service Reliability', 'Zero Data Leaks'],
          featured: false,
        },
        {
          title: 'Velocita Luxury Headless E-commerce Ecosystem',
          slug: 'velocita-luxury-ecommerce',
          description: 'Ultra-fast headless commerce platform featuring sub-second checkout, localized multi-currency pricing, and algorithmic product recommendations.',
          fullDescription: 'Integrated modern Jamstack architecture with micro-fulfillment warehouse APIs, Stripe Radar fraud detection, and instant global search.',
          category: 'E-commerce & Payments',
          technologies: ['React', 'Shopify Storefront API', 'Node.js', 'TailwindCSS', 'Algolia', 'Stripe'],
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          projectUrl: 'https://novacore.io/case-studies/velocita',
          client: 'Velocita Haute Horlogerie',
          impactMetrics: ['+44% Conversion Rate Surge', '0.7s Average Page Load', 'Multi-Region Currency Support'],
          featured: false,
        },
      ];

      await Portfolio.insertMany(portfolioItems);
      console.log(`✅ [Seed] Seeded ${portfolioItems.length} portfolio case studies.`);
    }

    // 4. Seed sample project request for demoClient if none exists
    const projectCount = await ProjectRequest.countDocuments();
    if (projectCount === 0 && demoClient) {
      console.log('[Seed] Seeding sample project request for demo user...');
      const sampleProject = await ProjectRequest.create({
        requestId: 'PRJ-A89F02',
        userId: demoClient._id,
        fullName: demoClient.name,
        email: demoClient.email,
        phone: demoClient.phone,
        companyName: demoClient.company,
        title: 'Biometric Access Control AI Agent & Dashboard',
        serviceCategory: 'AI Agent Development',
        description: 'We require an autonomous AI verification agent that integrates with our edge facial scanning cameras to authenticate authorized personnel, detect anomalies, and alert security leads instantly.',
        problemToSolve: 'Current manual security audits suffer from 8-minute human verification latency and high false alarm rates.',
        requiredFeatures: [
          'Real-time edge camera frame ingestion and facial embeddings matching',
          'Autonomous verification audit log with cryptographic signing',
          'Role-based access management dashboard with audit export (CSV & PDF)',
          'Instant WebSocket alerts dispatched to mobile security officer units',
        ],
        preferredTechnology: 'React, Node.js, PyTorch / OpenCV, MongoDB, WebSockets',
        budgetRange: '$30k - $60k',
        expectedDeadline: '1 - 3 months',
        status: 'In Progress',
        adminNotes: 'High-value account. Technical lead assigned: Sarah Vance. Initial architecture RFC approved by client.',
        history: [
          {
            status: 'Submitted',
            changedBy: demoClient._id,
            comment: 'Project request submitted via Client Portal.',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'Under Review',
            changedBy: adminUser._id,
            comment: 'Specifications analyzed by Principal AI Architect.',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'In Discussion',
            changedBy: adminUser._id,
            comment: 'Architectural scope call held with Vanguard Biometrics team.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'Approved',
            changedBy: adminUser._id,
            comment: 'Milestone 1 contract ratified. SOW signed.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'In Progress',
            changedBy: adminUser._id,
            comment: 'Sprint 1 commenced: Ingestion pipeline & neural embedding benchmarks.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      });

      // Seed discussion messages
      await Message.create([
        {
          projectRequestId: sampleProject._id,
          senderId: demoClient._id,
          senderName: demoClient.name,
          senderRole: 'user',
          receiverId: adminUser._id,
          message: 'Hello Novacore team. We have uploaded our camera hardware specs to the project brief. Looking forward to kick-off.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          projectRequestId: sampleProject._id,
          senderId: adminUser._id,
          senderName: adminUser.name,
          senderRole: 'admin',
          receiverId: demoClient._id,
          message: 'Welcome Elena. Our computer vision and backend systems leads have reviewed the camera documentation. The RTSP streams and ONVIF protocol support integrate directly into our edge inference pipeline.',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          projectRequestId: sampleProject._id,
          senderId: adminUser._id,
          senderName: adminUser.name,
          senderRole: 'admin',
          receiverId: demoClient._id,
          message: 'Sprint 1 is underway. You can track telemetry updates and upcoming deliverables directly from this portal.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ]);

      console.log('✅ [Seed] Sample project request and message history created.');
    }

    // 5. Seed sample contact inquiries
    const inquiryCount = await ContactInquiry.countDocuments();
    if (inquiryCount === 0) {
      console.log('[Seed] Seeding sample contact inquiries...');
      await ContactInquiry.create([
        {
          name: 'Marcus Sterling',
          email: 'marcus@hyperiondynamics.tech',
          phone: '+1 (212) 555-0143',
          company: 'Hyperion Dynamics',
          serviceCategory: 'AI Automation and Workflow Integration',
          budget: '$60k - $120k',
          timeline: '1 - 3 months',
          message: 'Looking to replace legacy robotic process automation scripts with autonomous LLM reasoning agents across our risk modeling workflows.',
          status: 'new',
        },
        {
          name: 'Sophia Chang',
          email: 'sophia@solarlux.energy',
          phone: '+1 (415) 555-8832',
          company: 'SolarLux Clean Energy',
          serviceCategory: 'SaaS Product Development',
          budget: '$30k - $60k',
          timeline: '3 - 6 months',
          message: 'We are seeking an engineering partner to architect an IoT energy management platform with real-time solar grid telematics.',
          status: 'contacted',
          adminNotes: 'Discovery call held on Wednesday. Preparing technical architecture proposal.',
        },
      ]);
      console.log('✅ [Seed] Sample contact inquiries created.');
    }

    console.log('✨ [Seed] Database initialization and seed check completed successfully.');
  } catch (error) {
    console.error('❌ [Seed Error]', error);
  }
};

module.exports = { seedInitialData };


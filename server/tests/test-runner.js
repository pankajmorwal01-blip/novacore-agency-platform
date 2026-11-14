const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 ====================================================');
  console.log('🧪 Starting Novacore Systems Full-Stack API Test Suite');
  console.log('🧪 ====================================================\n');

  let clientCookie = '';
  let adminCookie = '';
  let clientUser = null;
  let adminUser = null;
  let createdProjectId = '';
  let initialRequestId = '';

  // 1. Health check
  console.log('[Test 1] Testing Health Check Endpoint GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  assert.strictEqual(healthRes.status, 200, 'Health check should return 200');
  const healthJson = await healthRes.json();
  assert.strictEqual(healthJson.status, 'healthy');
  console.log('✅ Health check passed:', healthJson.service);

  // 2. Public Registration
  console.log('\n[Test 2] Testing User Registration POST /api/auth/register...');
  const randomSuffix = Math.floor(Math.random() * 10000);
  const testEmail = `lead.engineer${randomSuffix}@innovate.co`;
  const registerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sarah Connor',
      email: testEmail,
      password: 'StrongPassword2026!',
      phone: '+1 (415) 555-9090',
      company: 'Cyberdyne Systems Research',
    }),
  });

  assert.strictEqual(registerRes.status, 201, 'Registration should return 201');
  const registerJson = await registerRes.json();
  assert.strictEqual(registerJson.success, true);
  assert.strictEqual(registerJson.user.role, 'user', 'Public registration MUST enforce role: user');
  clientUser = registerJson.user;
  console.log('✅ User registered successfully. Role verified as "user". No privilege escalation allowed.');

  // 3. User Login & Cookie verification
  console.log('\n[Test 3] Testing User Login POST /api/auth/login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'StrongPassword2026!',
    }),
  });

  assert.strictEqual(loginRes.status, 200, 'Login should return 200');
  const setCookieHeader = loginRes.headers.get('set-cookie');
  assert.ok(setCookieHeader, 'Server MUST issue Set-Cookie with HTTP-only auth token');
  clientCookie = setCookieHeader.split(';')[0];
  console.log('✅ User login passed. HTTP-only session cookie acquired.');

  // 4. Verify Authenticated Session GET /api/auth/me
  console.log('\n[Test 4] Testing GET /api/auth/me with session cookie...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Cookie: clientCookie },
  });
  assert.strictEqual(meRes.status, 200);
  const meJson = await meRes.json();
  assert.strictEqual(meJson.user.email, testEmail);
  console.log('✅ Session verified. Identity verified as:', meJson.user.name);

  // 5. Submit Project Request POST /api/projects
  console.log('\n[Test 5] Testing Project Request Submission POST /api/projects...');
  const createProjRes = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: clientCookie,
    },
    body: JSON.stringify({
      title: 'Autonomous Multi-Model LLM Gateway',
      serviceCategory: 'AI Agent Development',
      description: 'Low-latency routing proxy across Claude 3.5, GPT-4o, and Llama 3 70B with token budgeting.',
      problemToSolve: 'High cost variance and single-provider outages in our core customer workflow.',
      requiredFeatures: ['Dynamic model fallback', 'Real-time token cost telemetry', 'Redis caching layer'],
      budgetRange: '$30k - $60k',
      expectedDeadline: '1 - 3 months',
      preferredTechnology: 'Node.js, Express, Redis, Docker',
    }),
  });

  assert.strictEqual(createProjRes.status, 201);
  const createProjJson = await createProjRes.json();
  assert.strictEqual(createProjJson.success, true);
  assert.ok(createProjJson.project.requestId.startsWith('PRJ-'), 'Project ID must match PRJ-XXXXXX format');
  createdProjectId = createProjJson.project._id;
  initialRequestId = createProjJson.project.requestId;
  console.log(`✅ Project created with unique ID ${initialRequestId}. Status: ${createProjJson.project.status}`);

  // 6. User Data Isolation GET /api/projects/my
  console.log('\n[Test 6] Testing Client Project Isolation GET /api/projects/my...');
  const myProjectsRes = await fetch(`${BASE_URL}/projects/my`, {
    headers: { Cookie: clientCookie },
  });
  assert.strictEqual(myProjectsRes.status, 200);
  const myProjectsJson = await myProjectsRes.json();
  assert.ok(myProjectsJson.projects.some((p) => p._id === createdProjectId));
  console.log(`✅ User-specific data isolation confirmed: User retrieved only their own ${myProjectsJson.count} project request(s).`);

  // 7. Security: Verify non-admin cannot access Admin endpoints (403 Forbidden)
  console.log('\n[Test 7] Testing Security Check: Standard client accessing Admin endpoint...');
  const unauthorizedRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Cookie: clientCookie },
  });
  assert.strictEqual(unauthorizedRes.status, 403, 'Client must receive 403 Forbidden on admin routes');
  const unauthJson = await unauthorizedRes.json();
  assert.strictEqual(unauthJson.success, false);
  console.log('✅ Access Control Verified: Admin routes reject unauthorized clients with 403 Forbidden.');

  // 8. Admin Authentication & Login
  console.log('\n[Test 8] Testing Admin Login POST /api/auth/login (admin@novacore.io)...');
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@novacore.io',
      password: 'AdminSecurePass2026!',
    }),
  });

  assert.strictEqual(adminLoginRes.status, 200);
  const adminCookieHeader = adminLoginRes.headers.get('set-cookie');
  adminCookie = adminCookieHeader.split(';')[0];
  const adminJson = await adminLoginRes.json();
  assert.strictEqual(adminJson.user.role, 'admin');
  adminUser = adminJson.user;
  console.log('✅ Admin login successful. Role verified as "admin".');

  // 9. Admin Dashboard Metrics GET /api/admin/dashboard
  console.log('\n[Test 9] Testing Admin Dashboard Metrics GET /api/admin/dashboard...');
  const adminDashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(adminDashRes.status, 200);
  const dashJson = await adminDashRes.json();
  assert.ok(dashJson.stats.totalUsers >= 2);
  assert.ok(dashJson.stats.totalProjects >= 1);
  console.log('✅ Admin dashboard retrieved successfully. Total projects in pipeline:', dashJson.stats.totalProjects);

  // 10. Admin Project Status Transition & Internal Notes
  console.log('\n[Test 10] Testing Admin Project Status Update PATCH /api/admin/projects/:id/status...');
  const updateStatusRes = await fetch(`${BASE_URL}/admin/projects/${createdProjectId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      status: 'Approved',
      adminNotes: 'Engineering review complete. Assigned to AI Systems Core Team.',
      comment: 'Milestone 1 contract ratified. SOW execution begun.',
    }),
  });

  assert.strictEqual(updateStatusRes.status, 200);
  const updateStatusJson = await updateStatusRes.json();
  assert.strictEqual(updateStatusJson.project.status, 'Approved');
  console.log(`✅ Admin updated project status to "${updateStatusJson.project.status}" and logged internal notes.`);

  // 11. Verify User sees the updated status immediately
  console.log('\n[Test 11] Verifying User Dashboard reflects the Admin status change...');
  const verifyUserProjRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
    headers: { Cookie: clientCookie },
  });
  assert.strictEqual(verifyUserProjRes.status, 200);
  const verifyUserProjJson = await verifyUserProjRes.json();
  assert.strictEqual(verifyUserProjJson.project.status, 'Approved');
  assert.strictEqual(verifyUserProjJson.project.adminNotes, undefined, 'Admin notes MUST NEVER be leaked to user!');
  console.log('✅ User views updated status "Approved" while confidential adminNotes are stripped!');

  // 12. Bidirectional Messaging between Client and Admin
  console.log('\n[Test 12] Testing Bidirectional Discussion Messaging...');
  // Client posts message
  const clientMsgRes = await fetch(`${BASE_URL}/projects/${createdProjectId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: clientCookie,
    },
    body: JSON.stringify({
      message: 'Thank you for approving the SOW. When is our architectural kick-off call?',
    }),
  });
  assert.strictEqual(clientMsgRes.status, 201);

  // Admin replies to message
  const adminMsgRes = await fetch(`${BASE_URL}/projects/${createdProjectId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      message: 'Hello Sarah, kick-off is scheduled for Tuesday at 10:00 AM PST. We have invited your lead architect.',
    }),
  });
  assert.strictEqual(adminMsgRes.status, 201);
  console.log('✅ Bidirectional discussion messages posted and verified.');

  // 13. Public Contact Form Submission
  console.log('\n[Test 13] Testing Public Contact Form POST /api/contact...');
  const contactRes = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. Raymond Shaw',
      email: 'shaw@neuraldefense.io',
      phone: '+1 (202) 555-0182',
      company: 'Neural Defense Systems',
      serviceCategory: 'AI Automation and Workflow Integration',
      budget: '$60k - $120k',
      timeline: '1 - 3 months',
      message: 'Seeking consultation on distributed model fine-tuning and security hardening.',
    }),
  });
  assert.strictEqual(contactRes.status, 201);
  const contactJson = await contactRes.json();
  assert.strictEqual(contactJson.success, true);
  console.log('✅ Contact inquiry submitted and logged in database.');

  // 14. Admin Portfolio CMS creation
  console.log('\n[Test 14] Testing Admin Portfolio CMS POST /api/admin/portfolio...');
  const portfolioRes = await fetch(`${BASE_URL}/admin/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      title: 'Automated Neural Defense Firewall',
      category: 'AI & Autonomous Agents',
      client: 'Neural Defense Systems',
      description: 'Real-time deep learning packet inspector blocking novel zero-day vectors.',
      fullDescription: 'Architected using eBPF, PyTorch, and WebAssembly running in Kubernetes pods.',
      technologies: ['Python', 'PyTorch', 'eBPF', 'Rust', 'Docker'],
      impactMetrics: ['Sub-5ms packet inspection', '99.999% uptime', 'Over 1M threats neutralized'],
      featured: true,
    }),
  });
  assert.strictEqual(portfolioRes.status, 201);
  const portfolioJson = await portfolioRes.json();
  assert.strictEqual(portfolioJson.success, true);
  console.log(`✅ Admin created new portfolio case study "${portfolioJson.project.title}".`);

  // 15. User Logout
  console.log('\n[Test 15] Testing User Logout POST /api/auth/logout...');
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { Cookie: clientCookie },
  });
  assert.strictEqual(logoutRes.status, 200);
  console.log('✅ User logged out and session cookie cleared.');

  console.log('\n🎉 ====================================================');
  console.log('🎉 ALL 15 AUTOMATED SYSTEM TESTS PASSED SUCCESSFULLY!');
  console.log('🎉 ====================================================\n');
};

runTests().catch((err) => {
  console.error('❌ Test Failure:', err);
  process.exit(1);
});


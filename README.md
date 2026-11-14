<<<<<<< HEAD
# Novacore Systems | Premium AI Solutions & Software Agency Platform

> Production-oriented, full-stack enterprise platform for an elite software engineering and AI solutions agency. Built with **React 18**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB & Mongoose**, with secure **JWT authentication via HTTP-only cookies**, role-based authorization, and real-time bidirectional messaging.

---

## 1. System Overview

Novacore Systems provides digital solutions to enterprises, startups, and institutions across 8 core disciplines:
1. **AI Agent Development** (Autonomous swarms, tool-calling sandboxes, deterministic state graphs)
2. **AI Automation and Workflow Integration** (Event queues, OCR pipelines, CRM/ERP auto-sync)
3. **Custom Web Application Development** (React, TypeScript, sub-second TTFB, SSR)
4. **Android and iOS App Development** (React Native, Swift, Kotlin, offline-first BLE sync)
5. **SaaS Product Development** (Multi-tenant DB isolation, Stripe billing, developer APIs)
6. **Backend and API Development** (Microservices, Redis caching, sub-50ms distributed APIs)
7. **Database Design & Architecture** (PostgreSQL, MongoDB, schema optimization, migrations)
8. **Software Consulting and Maintenance** (SOC-2 compliance, cloud right-sizing, 24/7 SRE)

---

## 2. Key Features

### 🌐 Public Website
- **Modern Landing Page**: Hero section, service matrix, featured case studies, 4-stage engineering methodology, interactive technology stack tabs, verifiable proof metrics, FAQ accordion, and contact CTA.
- **Deep-Dive Services Page**: Comprehensive specifications for all 8 engineering disciplines detailing problems solved, architectural features, approach, and tech stacks.
- **Dynamic Portfolio CMS**: Filterable case studies with quantitative impact metrics, client attribution, and project detail views.
- **Contact Page**: Multi-field inquiry form with real-time validation that saves directly into MongoDB.
- **About Page**: Mission, vision, core values, development philosophy, and technical leadership team.

### 🔒 Authentication & Role-Based Authorization
- **Security-First Architecture**: Passwords hashed with `bcrypt` (12 salt rounds).
- **HTTP-Only Cookies**: JWTs are transmitted exclusively via secure HTTP-only cookies, preventing XSS-based token theft.
- **Role-Based Access Control**: Strict `user` and `admin` roles. Client-side role spoofing is impossible; roles are enforced at the backend middleware and database query layers.
- **Password Reset Flow**: Cryptographically secure, expiring reset tokens with automated email notifications (or dev log dispatch).
- **Data Isolation**: Strict ownership checks ensure users can only ever access their own project requests and communications. Attempting to view another user's project ID returns `403 Forbidden`.

### 📊 Client Dashboard (`/dashboard`)
- **Executive Overview**: Total requests, under-review items, active sprints, and completed projects.
- **Interactive Multi-Section Project Request Form**:
  - Scope classification, requirements, features list, preferred tech, budget, deadline, and file attachments (PDF, DOCX, ZIP, images).
  - Automatically generates unique project identifier (`PRJ-XXXXXX`).
- **My Projects Directory**: Search and status filter tabs for all user requests.
- **Project Detail Console**: Full specifications, milestone progression stepper, and scope editor.
- **Bidirectional Discussion Thread**: Live communication between client and lead systems architect for each engagement.
- **Profile & Security Settings**: Update contact information, organization details, and change passwords.

### 🛡️ Administrative Console (`/admin`)
- **Separate Professional UI**: High-density management layout designed specifically for business operations.
- **Global KPI Analytics**: Aggregated counts for users, project pipeline, pending reviews, active sprints, and contact leads.
- **Project Request Management**: Search and filter all client proposals, change status (`Submitted`, `Under Review`, `In Discussion`, `Approved`, `In Progress`, `Completed`, `Rejected`, `Cancelled`), append internal private notes, and delete inappropriate requests with confirmation.
- **Portfolio CMS**: Create, edit, and delete case studies with cover images, impact metrics, and technology tags.
- **Inbound Lead Triage**: Review contact inquiries, update status (`new`, `contacted`, `converted`, `archived`), and add internal notes.
- **Identity & Access Management (IAM)**: Review registered accounts, project volume, and safely promote/demote administrative privileges (with self-demotion lockout safeguards).

---

## 3. Technology Stack

### Frontend
- **React.js 18**
- **Vite 6**
- **Tailwind CSS 3** (Custom dark charcoal & obsidian theme)
- **Framer Motion** (Subtle, purposeful transitions)
- **React Router 7**
- **Lucide React** (Clean, professional interface icons)
- **Axios** (Configured with `withCredentials: true`)

### Backend
- **Node.js 22** & **Express.js**
- **MongoDB** & **Mongoose** (With automatic in-memory fallback for immediate zero-config local runtimes)
- **bcryptjs** (Password hashing)
- **jsonwebtoken** (JWT session tokens)
- **cookie-parser** (HTTP-only cookie parser)
- **helmet** (Security headers)
- **cors** (Strict origin whitelisting)
- **express-rate-limit** (DDoS & brute-force throttling)
- **multer** (Sanitized file uploads)
- **nodemailer** (Email notifications)
- **dotenv** (Environment variable isolation)

---

## 4. Project Structure

```
├── client/                     # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, StatusBadge, ProjectDiscussion, ProtectedRoute, AdminRoute
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state & cookie session management
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── PortfolioPage.jsx
│   │   │   ├── PortfolioDetailPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── dashboard/      # Client Portal views
│   │   │   └── admin/          # Admin Operations Console
│   │   ├── services/
│   │   │   └── api.js          # Axios client with credentials
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                     # Backend API server
│   ├── config/
│   │   ├── config.js           # Environment parser
│   │   └── db.js               # Mongoose DB connector with resilient embedded fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── contactController.js
│   │   ├── portfolioController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js             # verifyToken, requireAdmin, optionalAuth
│   │   ├── rateLimiter.js      # Endpoint rate limiting
│   │   ├── upload.js           # Multer file sanitizer & validator
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── ProjectRequest.js
│   │   ├── ContactInquiry.js
│   │   ├── Message.js
│   │   └── Portfolio.js
│   ├── routes/                 # Express API routes
│   ├── scripts/
│   │   └── seed.js             # Standalone seed runner
│   ├── utils/
│   │   ├── emailService.js
│   │   └── seedData.js
│   ├── tests/
│   │   └── test-runner.js      # 15-point automated E2E test suite
│   ├── uploads/                # File uploads directory
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── API_DOCUMENTATION.md        # Full REST API specifications
├── README.md
└── package.json                # Root package for concurrently running client & server
```

---

## 5. Quick Start & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (Optional: The application includes an embedded in-memory MongoDB runner so it runs out-of-the-box even without a local `mongod` service!)

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```
*(Or navigate to `/server` and `/client` individually and run `npm install`)*

### Step 2: Configure Environment Variables
Copy the `.env.example` file in the `server` directory:
```bash
cp server/.env.example server/.env
```

Key environment variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/novacore_db
JWT_SECRET=novacore_super_secure_jwt_secret_key_938472938479238472938
JWT_EXPIRES_IN=7d
COOKIE_SECURE=false

ADMIN_NAME=Novacore Executive Admin
ADMIN_EMAIL=admin@novacore.io
ADMIN_PASSWORD=AdminSecurePass2026!
ADMIN_PHONE=+1 (800) 555-0199
```

### Step 3: Run Database Seed (Optional)
The server runs an automated seed check on startup. You can also trigger the seed script manually at any time:
```bash
cd server && npm run seed
```

### Step 4: Start the Application

Start the backend API server:
```bash
cd server && npm run dev
# Server will run on http://localhost:5000
```

In a separate terminal, start the frontend Vite development server:
```bash
cd client && npm run dev
# Client will run on http://localhost:5173
```

---

## 6. Pre-Configured Demo Credentials

The initial seed process configures two ready-to-test accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Executive Admin** | `admin@novacore.io` | `AdminSecurePass2026!` | Full Admin Console (`/admin`), Project Approvals, Portfolio CMS, User IAM |
| **Demo Client** | `client@enterprise.com` | `ClientPass2026!` | Client Portal (`/dashboard`), Project Requests, Live Discussion Thread |

> **Convenience Feature**: On the `/login` page, click either **"Fill Admin Demo"** or **"Fill Client Demo"** to auto-populate credentials with a single click.

---

## 7. Automated Testing Suite

The repository includes a comprehensive 15-point end-to-end test suite (`server/tests/test-runner.js`) that verifies:
1. Health check endpoint status
2. User registration and role enforcement (`role: 'user'`)
3. User login and HTTP-only cookie dispatch
4. Session authentication (`/api/auth/me`)
5. Project request creation with unique `PRJ-XXXXXX` IDs
6. Multi-tenant user data isolation (`/api/projects/my`)
7. Access control: verifying non-admin receives `403 Forbidden` on admin routes
8. Admin login and credential verification
9. Admin dashboard metrics aggregation
10. Admin project status updating and confidential internal notes
11. User perspective verification (confidential `adminNotes` stripped)
12. Bidirectional discussion messaging between client and engineer
13. Public contact inquiry submission and triage
14. Admin portfolio CMS creation
15. User session logout and cookie clearing

Run the test suite against the running server:
```bash
node server/tests/test-runner.js
```

---

## 8. Production Deployment

### Building Frontend
```bash
cd client && npm run build
```
This generates the optimized production bundle inside `client/dist`.

### Production Server Startup
When `NODE_ENV=production` is set in `server/.env`, the Express server automatically serves the compiled frontend assets from `client/dist`:
```bash
cd server
NODE_ENV=production npm start
```

### Security Checklist for Production
1. Update `JWT_SECRET` with a strong cryptographic 64-character random string.
2. Set `COOKIE_SECURE=true` (requires HTTPS / TLS 1.3).
3. Connect a persistent MongoDB instance via `MONGODB_URI` (e.g., MongoDB Atlas or dedicated replica set).
4. Configure production SMTP credentials (`EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`) in `server/.env`.
5. Set `CLIENT_URL` to your production domain for CORS whitelisting.

=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
>>>>>>> edc7f248badbb4f6140db710103d11e4bb08b1f5

# Novacore Systems

A full-stack agency web platform built for digital engineering and AI consultancy services. It includes a modern public marketing site, an interactive client portal with project tracking and discussions, and an admin backoffice for managing incoming leads, client requests, and portfolio case studies.

---

## Features

###  Public Site
- **Landing & Services**: Showcases service offerings, engineering processes, case studies, and customer FAQ.
- **Dynamic Portfolio**: Searchable, filterable case studies with detailed project breakdowns.
- **Lead Capture**: Contact form with server-side validation and automated lead logging.

###  Client Dashboard (`/dashboard`)
- **Project Submissions**: Multi-step request form (scope, budget, tech preferences, file attachments) with automatic `PRJ-XXXXXX` tracking IDs.
- **Project Tracking**: Status indicators (`Submitted`, `Under Review`, `Approved`, `In Progress`, `Completed`, etc.) and timeline milestones.
- **Direct Discussions**: Built-in chat thread per project between clients and project leads.
- **Account Settings**: Profile updates and password management.

### Admin Portal (`/admin`)
- **Operations Overview**: At-a-glance KPI metrics (active projects, pending requests, new leads).
- **Project Management**: Review proposals, update statuses, add internal team notes, and review attached files.
- **Lead Inbox**: Triage inbound messages, mark them contacted/converted, and log notes.
- **Portfolio Manager**: Create, edit, and publish new case studies directly from the UI.
- **User Management**: View registered users and manage role permissions safely.

###  Security & Auth
- JWT authentication stored securely in **HTTP-only, SameSite cookies** (no tokens exposed to `localStorage`).
- Role-based route protection on both frontend (`ProtectedRoute`, `AdminRoute`) and Express API middleware.
- Scoped data access — users can only query and interact with their own projects and threads.
- Password hashing with bcrypt, rate limiting on sensitive endpoints, and Helmet security headers.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v7, Framer Motion, Lucide Icons, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB via Mongoose *(includes an automatic in-memory MongoDB fallback if local Mongo isn't running)*
- **Auth & Security**: JWT (HTTP-only cookies), bcryptjs, Helmet, Express Rate Limit, Multer

---

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)
- *MongoDB is optional for local development* — if no local instance is running, the server automatically boots an in-memory database (`mongodb-memory-server`) so you can test immediately with zero setup.

### 1. Clone & Install Dependencies
Run the root helper script to install dependencies across root, server, and client:

```bash
npm run install:all
```

*(Alternatively, run `npm install` inside both `/server` and `/client` directories).*

### 2. Configure Environment Variables
Copy the sample `.env` file in the `server` folder:

```bash
# Windows PowerShell
copy server\.env.example server\.env

# Or bash / macOS / Linux
cp server/.env.example server/.env
```

The defaults in `.env.example` work out of the box for local development.

### 3. Seed Initial Data (Optional)
The server auto-seeds initial data on first boot if the database is empty, but you can also manually run:

```bash
npm run seed
```

### 4. Run the Dev Servers
Start both the backend and frontend in separate terminal windows:

**Backend (port 5000):**
```bash
npm run dev:server
# or: cd server && npm run dev
```

**Frontend (port 5173):**
```bash
npm run dev:client
# or: cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Demo Accounts

The seed script creates two pre-configured accounts for testing:

| Account | Email | Password | Role / Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@novacore.io` | `AdminSecurePass2026!` | Access to `/admin`, project review, lead triage, and portfolio CMS |
| **Client** | `client@enterprise.com` | `ClientPass2026!` | Access to `/dashboard`, project submissions, and message threads |

> **Tip**: On the `/login` page, click the **"Fill Admin Demo"** or **"Fill Client Demo"** buttons to auto-populate credentials in one click.

---

## Project Structure

```
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Shared UI (Navbars, Modals, Badges, Protected Routes)
│   │   ├── context/            # AuthContext (cookie-based session state)
│   │   ├── pages/              # Public pages, /dashboard, and /admin views
│   │   ├── services/           # Axios API instance with credentials enabled
│   │   └── App.jsx             # Router and layout configuration
│   └── tailwind.config.js
│
├── server/                     # Express REST API
│   ├── config/                 # DB connection (with embedded fallback) and env config
│   ├── controllers/            # Route controllers (auth, projects, leads, portfolio, admin)
│   ├── middleware/             # Auth verification, role checks, rate limiting, file upload
│   ├── models/                 # Mongoose schemas (User, ProjectRequest, Message, etc.)
│   ├── routes/                 # Express route definitions
│   ├── scripts/                # Database seed runner
│   ├── tests/                  # End-to-end integration test runner
│   └── server.js               # Entry point & Express configuration
│
├── API_DOCUMENTATION.md        # Detailed endpoint reference & payload formats
└── package.json                # Root orchestration scripts
```

---

## Helpful Scripts

| Command | Action |
| :--- | :--- |
| `npm run install:all` | Installs dependencies for root, server, and client |
| `npm run dev:server` | Starts the Express server with file watching on port 5000 |
| `npm run dev:client` | Starts Vite dev server with HMR on port 5173 |
| `npm run seed` | Seeds demo admin, client, project requests, and sample case studies |
| `npm run build:client` | Creates production build in `client/dist` |
| `node server/tests/test-runner.js` | Runs backend automated integration test suite |

---

## Integration Tests

To run the backend integration tests (verifies auth flow, cookie handling, access controls, project workflows, and lead triage):

```bash
node server/tests/test-runner.js
```

---

## Production Notes

1. **Frontend Build**: Run `npm run build:client`. The compiled static assets will be output to `client/dist`.
2. **Serving from Express**: When `NODE_ENV=production` is set in `server/.env`, Express automatically serves the static bundle from `client/dist`.
3. **Cookie Security**: Ensure `COOKIE_SECURE=true` is set when running behind HTTPS/TLS in production.
4. **CORS**: Set `CLIENT_URL` in `server/.env` to your production frontend domain.

---

## License

ISC

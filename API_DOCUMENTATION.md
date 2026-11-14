# Novacore Systems - API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `/api`

## Authentication & Security Protocols
- **Format**: RESTful JSON API
- **Session Mechanism**: JSON Web Token (JWT) transmitted via HTTP-only, SameSite secure cookies (`token`).
- **Authorization**: Role-Based Access Control (`user` vs `admin`).
- **Data Isolation**: Multi-tenant user boundaries are enforced at the database query layer (`{ userId: req.user._id }`).
- **Rate Limiting**: Throttling enabled on authentication, password reset, and contact submission endpoints.

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Access**: Public
- **Rate Limit**: 20 requests / 15 minutes
- **Request Body**:
  ```json
  {
    "name": "Jordan Scott",
    "email": "jordan@enterprise.com",
    "password": "StrongPassword2026!",
    "phone": "+1 (555) 019-2834",
    "company": "Nexus Systems"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful. Welcome to Novacore.",
    "token": "<JWT_STRING>",
    "user": {
      "_id": "675...abc",
      "name": "Jordan Scott",
      "email": "jordan@enterprise.com",
      "role": "user",
      "phone": "+1 (555) 019-2834",
      "company": "Nexus Systems",
      "createdAt": "2026-11-07T08:50:00.000Z"
    }
  }
  ```

### 1.2 Sign In
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Access**: Public
- **Rate Limit**: 20 requests / 15 minutes
- **Request Body**:
  ```json
  {
    "email": "jordan@enterprise.com",
    "password": "StrongPassword2026!"
  }
  ```
- **Response (200 OK)**:
  - Sets HTTP-only cookie: `token=<JWT>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`
  ```json
  {
    "success": true,
    "message": "Signed in successfully.",
    "user": { ... }
  }
  ```

### 1.3 Sign Out
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Access**: Public
- **Response (200 OK)**: Clears `token` cookie.

### 1.4 Get Authenticated User Identity
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Access**: Private (Authenticated)
- **Response (200 OK)**: Current user profile object.

### 1.5 Request Password Reset Token
- **Method**: `POST`
- **Path**: `/api/auth/forgot-password`
- **Access**: Public
- **Request Body**: `{ "email": "jordan@enterprise.com" }`
- **Response (200 OK)**: Generic confirmation message; dispatches token via email or system logs.

### 1.6 Reset Password With Token
- **Method**: `POST`
- **Path**: `/api/auth/reset-password`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "token": "<SHA256_HASHED_TOKEN>",
    "password": "NewStrongPassword2026!"
  }
  ```
- **Response (200 OK)**: Success status; logs in user with new session token.

---

## 2. User Profile Endpoints

### 2.1 Get Profile
- **Method**: `GET`
- **Path**: `/api/users/profile`
- **Access**: Private (Authenticated)

### 2.2 Update Profile
- **Method**: `PUT`
- **Path**: `/api/users/profile`
- **Access**: Private (Authenticated)
- **Request Body**: `{ "name": "...", "phone": "...", "company": "..." }`

### 2.3 Change Password
- **Method**: `PUT`
- **Path**: `/api/users/change-password`
- **Access**: Private (Authenticated)
- **Request Body**:
  ```json
  {
    "currentPassword": "...",
    "newPassword": "..."
  }
  ```

---

## 3. Project Request Endpoints

### 3.1 Submit Project Request
- **Method**: `POST`
- **Path**: `/api/projects`
- **Access**: Public (Optional Auth - linked to user if logged in)
- **Content-Type**: `multipart/form-data` or `application/json`
- **Fields**:
  - `title` (string, required)
  - `serviceCategory` (string, required)
  - `description` (string, required)
  - `problemToSolve` (string, optional)
  - `requiredFeatures` (JSON array or string list)
  - `preferredTechnology` (string, optional)
  - `budgetRange` (string, required)
  - `expectedDeadline` (string, required)
  - `attachments` (file upload array, max 5 files, 15MB each)
- **Response (201 Created)**: Returns created ProjectRequest with unique `requestId` (e.g. `PRJ-9B4F1A`).

### 3.2 Get User's Project Requests
- **Method**: `GET`
- **Path**: `/api/projects/my`
- **Access**: Private (User)
- **Security**: Only returns requests belonging to `req.user._id`. `adminNotes` are stripped.

### 3.3 Get Project Details by ID
- **Method**: `GET`
- **Path**: `/api/projects/:id`
- **Access**: Private (Project Owner or Admin)
- **Security**: Returns 403 Forbidden if non-admin attempts to access another user's project ID.

### 3.4 Update Project Scope
- **Method**: `PUT`
- **Path**: `/api/projects/:id`
- **Access**: Private (Project Owner or Admin)
- **Note**: Users can only edit scope if status is `Submitted` or `Under Review`. Non-admins cannot alter status or admin notes.

### 3.5 Post Discussion Message
- **Method**: `POST`
- **Path**: `/api/projects/:id/messages`
- **Access**: Private (Project Owner or Admin)
- **Request Body**: `{ "message": "Can we schedule an architecture review?" }`

---

## 4. Public Contact & Portfolio Endpoints

### 4.1 Submit Contact Inquiry
- **Method**: `POST`
- **Path**: `/api/contact`
- **Access**: Public
- **Rate Limit**: 15 requests / 30 minutes
- **Request Body**:
  ```json
  {
    "name": "Marcus Sterling",
    "email": "marcus@company.com",
    "phone": "+1 (555) 012-3456",
    "company": "Hyperion Labs",
    "serviceCategory": "AI Agent Development",
    "budget": "$30k - $60k",
    "timeline": "1 - 3 months",
    "message": "We need an autonomous document verification pipeline."
  }
  ```

### 4.2 Get Portfolio Projects
- **Method**: `GET`
- **Path**: `/api/portfolio`
- **Query Parameters**: `category`, `featured`, `limit`
- **Access**: Public

### 4.3 Get Single Portfolio Item
- **Method**: `GET`
- **Path**: `/api/portfolio/:id`
- **Access**: Public (Lookup by ObjectId or Slug)

---

## 5. Administrative Endpoints (Admin Role Required)

### 5.1 Executive Dashboard Metrics
- **Method**: `GET`
- **Path**: `/api/admin/dashboard`
- **Access**: Admin Only
- **Response**:
  ```json
  {
    "success": true,
    "stats": {
      "totalUsers": 12,
      "totalProjects": 8,
      "pendingProjects": 3,
      "approvedProjects": 3,
      "completedProjects": 2,
      "totalInquiries": 15,
      "newInquiries": 4
    },
    "recentProjects": [ ... ],
    "recentInquiries": [ ... ]
  }
  ```

### 5.2 Get All Project Requests
- **Method**: `GET`
- **Path**: `/api/admin/projects`
- **Query Parameters**: `status`, `category`, `search`, `page`, `limit`
- **Access**: Admin Only

### 5.3 Update Project Status & Internal Notes
- **Method**: `PATCH`
- **Path**: `/api/admin/projects/:id/status`
- **Access**: Admin Only
- **Request Body**:
  ```json
  {
    "status": "In Progress",
    "adminNotes": "Sprint 1 initiated. Technical Lead: Sarah Connor.",
    "comment": "Architecture ratified. Initial model benchmarks underway."
  }
  ```

### 5.4 Delete Project Request
- **Method**: `DELETE`
- **Path**: `/api/admin/projects/:id`
- **Access**: Admin Only

### 5.5 Manage Contact Inquiries
- **Method**: `GET` / `PATCH`
- **Path**: `/api/admin/contact` & `/api/admin/contact/:id`
- **Access**: Admin Only

### 5.6 User IAM Management
- **Method**: `GET` / `PATCH`
- **Path**: `/api/admin/users` & `/api/admin/users/:id/role`
- **Access**: Admin Only
- **Request Body (Role Update)**: `{ "role": "admin" }` or `{ "role": "user" }`
- **Lockout Prevention**: Admin cannot revoke their own admin status.

### 5.7 Portfolio Case Studies CMS
- **Methods**:
  - `POST /api/admin/portfolio`
  - `PUT /api/admin/portfolio/:id`
  - `DELETE /api/admin/portfolio/:id`
- **Access**: Admin Only


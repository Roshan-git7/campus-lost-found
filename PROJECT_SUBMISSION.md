# Full Stack Development-I: Project Submission Document

---

## 1. Project Title
**Campus Lost & Found Portal** — Centralized University Belonging Recovery & Verification System

---

## 2. Student & Course Submission Information

| Field | Detail |
| :--- | :--- |
| **Student Name** | `Roshan Kumar Das` |
| **University Roll No / UID** | `24BCS80363` |
| **Department / Branch** | `Computer Science & Engineering` |
| **Semester** | 5th Semester |
| **Course Code & Title** | Full Stack Development-I |
| **Faculty / Evaluator Name** | `Muskan Deswal` |
| **Date of Submission** | `12th November 2026` |
| **Live Deployed Application URL** | `https://campus-lost-found.vercel.app/` |
| **GitHub Repository URL** | `https://github.com/Roshan-git7/campus-lost-found` |

---

## 3. Executive Summary & Problem Statement

### Problem Statement
In higher education institutions and university campuses with thousands of daily students, faculty, and administrative staff, the misplacement and loss of personal belongings is a daily occurrence. Belongings lost on campus include:
- University Identity cards and library cards
- Wallets containing money, government IDs, and payment cards
- Electronics (mobile phones, laptops, wireless earbuds, smartwatches, chargers)
- Textbooks, scientific calculators, notebooks, backpacks, keys, and accessories

Traditionally, universities manage lost items through fragmented, decentralized channels such as:
1. Physical lost & found pinboards
2. Informal WhatsApp or Telegram groups
3. Individual campus security guard desks scattered across multiple departments

This traditional model suffers from **critical deficiencies**:
- **High Friction & Poor Searchability:** Students must physically travel to multiple department offices.
- **Privacy Vulnerabilities:** Public social groups frequently share photos of wallets or ID cards with unredacted sensitive phone numbers and registration numbers.
- **Zero Evidence Verification:** Anyone claiming to own a lost item can walk away with valuable electronics without verifiable ownership proof.
- **No Systemic Analytics:** Campus administration cannot track recovery rates or high-incident theft/loss hotspots.

### Proposed Solution
The **Campus Lost & Found Portal** is an end-to-end, production-grade MERN stack web platform designed to streamline, digitize, and secure the campus recovery lifecycle. The platform introduces:
1. **Centralized Incident Reporting:** Instant digital filing of lost and found belongings with photo evidence, categorical tagging, location, and timestamps.
2. **AI-Assisted Smart Item Matching Algorithm:** An automated multi-parameter similarity engine comparing category (30%), keyword overlap (30%), location proximity (20%), and date proximity (20%) to proactively suggest matches.
3. **Privacy-Preserving Ownership Claim Workflow:** Sensitive attributes (such as lock patterns, unique scratches, serial numbers, and internal wallet cards) remain hidden from public view and are submitted privately to campus administrators.
4. **Administrative Verification & Custody Management:** Administrators review submitted ownership claims, evaluate evidence, approve/reject claims, and record physical item handovers with audit trails.
5. **Real-time In-App Notification System:** Stored in MongoDB, alerting students whenever a potential match is found or an ownership claim is reviewed.

---

## 4. Key Features & Functional Modules

### A. Authentication & Role-Based Access Control (RBAC)
- **Role Separation:** Enforces separate access controls for `student`, `faculty`, and `admin`.
- **Public Registration Protection:** Self-registration is restricted to students and faculty; administrator accounts are shielded behind protected seed initialization or environment configuration.
- **Cryptographic Security:** Password hashing using `bcryptjs` with salt rounds; stateless JWT tokens with expiration; private routes protected by JWT middleware.

### B. Student Dashboard
- **Live Metric Counter:** Real-time metrics fetched from MongoDB (Total Items Reported, Items Lost by Student, Items Found by Student, Pending Claims in Review).
- **Quick Actions:** Single-click navigation to report lost/found items, browse campus inventory, and check active claims.
- **Recent Incident Activity:** Dynamically displays recent submissions and newly found campus items.

### C. Item Reporting & Management
- **Lost & Found Creation:** Rich forms capturing item title, category, type (`Lost` or `Found`), date, campus location, detailed descriptions, and image uploads.
- **Image Storage:** Multi-part file uploads supported via Cloudinary cloud storage with automatic local disk storage fallback.
- **Lifecycle Statuses:** Tracks each item across 5 formal states: `Open`, `Claim Pending`, `Claimed`, `Returned`, and `Closed`.
- **Author Ownership Protection:** Only the original author or university administrators can edit or delete a report.

### D. Advanced Search, Filtering & Pagination
- **Multi-Keyword Text Search:** Matches title, description, and location simultaneously.
- **Faceted Filters:** Filter by type (`Lost`/`Found`), Category (9 categories), Location keyword, and Date range.
- **Server-Side Pagination:** Efficient MongoDB `.skip()` and `.limit()` queries with custom page controls.

### E. AI Smart Item Matching Engine
- **Explainable Scoring Engine:** Calculates a transparent 0–100% similarity score:
  - **Category Match:** 30 Points (exact category alignment)
  - **Keywords Overlap:** 30 Points (tokenized text comparison with stopword elimination)
  - **Location Proximity:** 20 Points (campus zone matching)
  - **Date Proximity:** 20 Points (decay score based on days elapsed)
- **Interactive Breakdown:** Transparent explainability pill showing exact sub-scores to prevent black-box bias.

### F. Ownership Verification & Claim Management
- **Evidence Submission Modal:** Allows claimants to submit secret identifiers (serial numbers, wallpapers, receipts) and supporting photos.
- **Duplicate Prevention:** Enforces DB uniqueness preventing duplicate active claims on the same item by the same user.
- **Administrative Decision Protocol:** Administrators review submitted evidence with one-click Approval or Rejection, providing feedback notes and physical pickup instructions.

### G. Administrative Governance Console
- **Campus Analytics:** Recovery rate percentage, lost-vs-found ratio, category distribution charts.
- **User Account Management:** Search registered users, view student UIDs, and toggle account activation status.
- **Item Moderation:** Update statuses, verify handovers, or delete inappropriate reports.

---

## 5. System Architecture & Technology Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                       CLIENT LAYER                          │
   │  React.js 18 + Vite + Tailwind CSS + Lucide React + Axios   │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTPS / REST (JSON)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                       API / BACKEND                         │
   │  Node.js + Express.js REST Framework                        │
   │  • Middleware: JWT Auth, Helmet, CORS, Rate Limit, Multer   │
   │  • Services: Smart Matching Engine, Notification Engine     │
   └──────────────┬───────────────────────────────┬──────────────┘
                  │ Mongoose ORM                  │ Multi-part Stream
                  ▼                               ▼
   ┌─────────────────────────────┐ ┌─────────────────────────────┐
   │      DATABASE LAYER         │ │     CLOUD STORAGE LAYER     │
   │   MongoDB Atlas Cluster     │ │       Cloudinary CDN        │
   │   (Users, Items, Claims,    │ │     (Item Photos & Proof)   │
   │        Notifications)       │ │                             │
   └─────────────────────────────┘ └─────────────────────────────┘
```

### Technology Stack Details:
- **Frontend:** React 18, Vite, React Router Dom v6, Tailwind CSS, Lucide React, Axios, date-fns.
- **Backend:** Node.js v24, Express.js 4.x, Mongoose 8.x, JWT (`jsonwebtoken`), `bcryptjs`, Helmet, CORS, Morgan, Express-Rate-Limit.
- **Image Handling:** Multer + Cloudinary Storage + Local disk fallback.
- **Database:** MongoDB Atlas (Cloud NoSQL Database).
- **Testing:** Node.js native test runner (`node:test`, `node:assert`), `supertest`, `mongodb-memory-server`.
- **Deployment Platform:** Vercel (Frontend SPA + Serverless Backend API) or AWS/Azure.

---

## 6. Database Schema Design (Mongoose Models)

### A. User Schema (`User.js`)
```javascript
{
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  uid: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  timestamps: true
}
```

### B. Item Schema (`Item.js`)
```javascript
{
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 1000 },
  category: { 
    type: String, 
    required: true,
    enum: ['Electronics', 'Documents / ID Cards', 'Wallets', 'Keys', 'Bags', 'Books', 'Clothing', 'Accessories', 'Other']
  },
  type: { type: String, required: true, enum: ['Lost', 'Found'] },
  date: { type: Date, required: true },
  location: { type: String, required: true, maxlength: 150 },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['Open', 'Claim Pending', 'Claimed', 'Returned', 'Closed'], default: 'Open' },
  reportedBy: { type: ObjectId, ref: 'User', required: true },
  claimedBy: { type: ObjectId, ref: 'User', default: null },
  timestamps: true
}
```

### C. Claim Schema (`Claim.js`)
```javascript
{
  itemId: { type: ObjectId, ref: 'Item', required: true },
  claimantId: { type: ObjectId, ref: 'User', required: true },
  proofOfOwnership: { type: String, required: true, maxlength: 1000 },
  additionalDescription: { type: String, default: '' },
  supportingImage: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },
  reviewedBy: { type: ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  adminNotes: { type: String, default: '' },
  timestamps: true
}
```

### D. Notification Schema (`Notification.js`)
```javascript
{
  recipient: { type: ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['claim_submitted', 'claim_approved', 'claim_rejected', 'item_returned', 'match_found', 'general']
  },
  relatedItem: { type: ObjectId, ref: 'Item', default: null },
  isRead: { type: Boolean, default: false },
  timestamps: true
}
```

---

## 7. REST API Documentation

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student or faculty account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT |
| `POST` | `/api/auth/logout` | Private | Terminate authenticated session |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `GET` | `/api/items` | Public | Search and filter campus items (with pagination) |
| `POST` | `/api/items` | Private | Report a lost or found item (with image upload) |
| `GET` | `/api/items/:id` | Public | Retrieve item details (privacy-protected) |
| `PUT` | `/api/items/:id` | Private | Update report (Author or Admin only) |
| `DELETE`| `/api/items/:id` | Private | Delete report and cascade delete claims |
| `GET` | `/api/items/my-reports`| Private | Retrieve all items reported by active user |
| `GET` | `/api/items/matches/:id`| Public | Compute AI smart matches and similarity scores |
| `POST` | `/api/claims` | Private | Submit private ownership verification claim |
| `GET` | `/api/claims/my-claims`| Private | Retrieve claims submitted by user |
| `GET` | `/api/claims/:id` | Private | Retrieve single claim details |
| `PUT` | `/api/claims/:id/cancel`| Private| Cancel user's pending claim |
| `GET` | `/api/admin/dashboard` | Admin Only | Get analytics, recovery stats & recent activity |
| `GET` | `/api/admin/users` | Admin Only | Search & view registered campus members |
| `PUT` | `/api/admin/users/:id/toggle-status` | Admin Only | Deactivate or reactivate user account |
| `GET` | `/api/admin/claims` | Admin Only | View all claims submitted across campus |
| `PUT` | `/api/admin/claims/:id/review` | Admin Only | Approve or reject claim with feedback |
| `PUT` | `/api/admin/items/:id/status` | Admin Only | Update item status or record handover |
| `GET` | `/api/notifications` | Private | Get user notifications & unread count |
| `PUT` | `/api/notifications/:id/read` | Private | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | Private | Mark all notifications as read |
| `GET` | `/api/health` | Public | Server uptime and health check |

---

## 8. Verification & Automated Test Results

The backend includes an automated integration test suite written with `node:test`, `supertest`, and `mongodb-memory-server`:

```
▶ Campus Lost & Found Portal API Test Suite
  ✔ POST /api/auth/register - Register a student successfully
  ✔ POST /api/auth/register - Fail on mismatched passwords
  ✔ POST /api/auth/login - Login successfully with valid credentials
  ✔ POST /api/auth/login - Fail on incorrect password
  ✔ GET /api/auth/me - Access protected current user profile
  ✔ GET /api/auth/me - Reject request without token
  ✔ Create an admin user directly for test validation
  ✔ GET /api/admin/dashboard - Prevent student from accessing admin route
  ✔ GET /api/admin/dashboard - Allow admin user access
  ✔ POST /api/items - Report a Lost Item
  ✔ POST /api/items - Report a Found Item
  ✔ GET /api/items - List items with category and type filtering
  ✔ GET /api/items/matches/:id - Smart Match Engine scores potential matches
  ✔ PUT /api/items/:id - Update item report
  ✔ GET /api/items/my-reports - Retrieve current user reports
  ✔ POST /api/claims - Submit an ownership claim with evidence
  ✔ POST /api/claims - Prevent duplicate active claims by same user
  ✔ GET /api/claims/my-claims - View user claims
  ✔ PUT /api/admin/claims/:id/review - Admin approves ownership claim
  ✔ PUT /api/admin/items/:id/status - Mark item as Returned
  ✔ GET /api/notifications - User receives notifications for claim updates
  ✔ PUT /api/notifications/read-all - Mark all notifications read
  ✔ GET /api/admin/users - List users with search
  ✔ PUT /api/admin/users/:id/toggle-status - Toggle account status
✔ Campus Lost & Found Portal API Test Suite (24 tests passed across 7 suites, 0 failures)
```

**Frontend Production Build Verification:**
- Vite production build executed with zero errors:
  - `dist/index.html` (0.99 kB)
  - `dist/assets/index-C0yAE1rO.css` (32.09 kB)
  - `dist/assets/index-BakfCgcp.js` (365.76 kB)

---

## 9. Cloud Deployment & Setup Instructions

### Architecture Overview
- **Frontend & Serverless Backend:** Deployed to **Vercel** utilizing `@vercel/node` and SPA rewrites.
- **Database:** Hosted on **MongoDB Atlas** M0 Cluster.
- **Media CDN:** Hosted on **Cloudinary**.

### Environment Variables for Production
Set the following environment variables in the Vercel Project Dashboard:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_lost_found?retryWrites=true&w=majority
JWT_SECRET=production_strong_secret_key_2026
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

---

## 10. Future Enhancements
1. **QR Code Tagging:** Provide printable campus asset QR codes for student IDs, bottles, and laptop covers.
2. **Push Notifications & Email Alerts:** Integrate Nodemailer and Web Push for instant off-platform notifications.
3. **Campus Map Geo-Tagging:** Interactive campus leaflet map pinpointing exact benches, classrooms, and grounds.
4. **AI Image Recognition:** Integrate Cloudinary AI / Google Cloud Vision to detect object labels automatically from photos.


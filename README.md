# Campus Lost & Found Portal 🎓🔍

A modern, production-grade **MERN Stack** web application engineered for universities and colleges to streamline reporting, identifying, verifying, and recovering lost campus belongings.

---

## 🌟 Key Features

- **🔐 Robust Authentication & Role-Based Access Control:** Secure registration, JWT-based stateless sessions, password hashing with `bcryptjs`, and distinct roles (`student`, `faculty`, `admin`).
- **📊 Real-Time Student Dashboard:** Live metrics tracking reported items, lost cases, found items, and active claims directly from MongoDB.
- **📦 Comprehensive Item Management:** Report Lost/Found items with images, multi-field categories, date, campus locations, and status lifecycle (`Open`, `Claim Pending`, `Claimed`, `Returned`, `Closed`).
- **🔍 Advanced Search & Faceted Filtering:** Search by keywords across title and description, filter by category (9 options), location, lost/found type, date, and paginate through server-side queries.
- **✨ AI-Assisted Smart Item Matching Engine:** Automatically calculates an explainable similarity score (0–100%) based on:
  - Category Match: 30 pts
  - Keyword Overlap: 30 pts
  - Campus Location: 20 pts
  - Date Proximity: 20 pts
- **🛡️ Privacy-Preserving Ownership Claim Workflow:** Protects student privacy by not exposing personal numbers or card numbers publicly. Students submit private proof (serial numbers, wallpapers, receipts) for administrative review.
- **👮 Dedicated Administrator Console:** Review evidence, approve or reject claims with custom feedback notes, manage user accounts (deactivate/reactivate), and inspect recovery analytics.
- **🔔 In-App Notification Center:** Stored in MongoDB, alerting students whenever an item matches their report or their claim is reviewed.
- **☁️ Cloud Image Uploads:** Seamless Multer integration supporting Cloudinary with automatic fallback to local disk storage for zero-config local development.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, React Router Dom v6, Axios, date-fns |
| **Backend** | Node.js (v24), Express.js, REST API Architecture, Helmet, CORS, Morgan, Express-Rate-Limit |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JWT (`jsonwebtoken`), bcryptjs |
| **File Storage** | Cloudinary & Multer (with local fallback storage) |
| **Testing** | Node.js native test runner (`node:test`, `node:assert`), Supertest, MongoMemoryServer |
| **Deployment** | Vercel (Frontend SPA + Serverless Backend API) or AWS/Azure |

---

## 📂 Folder Structure

```
campus-lost-found/
├── api/
│   └── index.js              # Serverless entry point for Vercel deployment
├── client/                   # React.js + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Badges, Cards, Modals, Loading Skeletons
│   │   ├── context/          # AuthContext & NotificationContext
│   │   ├── layouts/          # MainLayout & DashboardLayout (with Sidebar)
│   │   ├── pages/            # Home, Browse, Details, Report, Dashboards, Admin
│   │   ├── routes/           # ProtectedRoute with RBAC guards
│   │   ├── services/         # Axios API Client with JWT interceptors
│   │   ├── App.jsx           # Application Router
│   │   ├── main.jsx          # React DOM entry point
│   │   └── index.css         # Tailwind base and custom utilities
│   ├── tailwind.config.js    # Tailwind styling config
│   ├── vite.config.js        # Vite dev server & proxy settings
│   ├── package.json
│   └── .env.example
├── server/                   # Node.js + Express.js Backend
│   ├── config/               # Database & Cloudinary configurations
│   ├── controllers/          # Auth, Items, Claims, Admin, Notifications
│   ├── middleware/           # JWT Protect, RBAC Authorize, Upload, Error Handler
│   ├── models/               # Mongoose Schemas (User, Item, Claim, Notification)
│   ├── routes/               # Modular Express API Routes
│   ├── services/             # Smart Matching Engine algorithm
│   ├── tests/                # Automated API Integration Test Suite
│   ├── utils/                # Database seed script (`seed.js`)
│   ├── app.js                # Express app configuration & middleware
│   ├── server.js             # Local HTTP server entry point
│   ├── package.json
│   └── .env.example
├── vercel.json               # Vercel cloud deployment rewrite rules
├── package.json              # Monorepo task runner scripts
├── PROJECT_SUBMISSION.md     # Academic project submission document
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js:** v18.0.0 or higher (v24 recommended)
- **npm:** v9.0.0 or higher
- **MongoDB Atlas Account:** Free tier (M0) cluster URL (or local MongoDB)
- **Cloudinary Account:** (Optional; local disk storage is enabled by default)

---

## 🚀 Quick Start (Local Setup)

### 1. Clone or Open Workspace
```bash
cd "c:\Users\Asus Zenbook\OneDrive\Desktop\CODING\5th  semester\fullstack\campus-lost-found"
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_lost_found?retryWrites=true&w=majority
JWT_SECRET=campus_lost_found_jwt_super_secret_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary credentials (leave blank for local disk storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=/api
```

### 3. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Seed Database with Realistic Demo Data
Populate realistic student accounts, campus administrators, lost/found items, and sample claims:
```bash
cd ../server
npm run seed
```

> **Demo Accounts generated by seed:**
> - **Campus Admin:** `admin@campus.edu` / `Admin123!`
> - **Student 1:** `student@campus.edu` / `Student123!`
> - **Student 2:** `priya.patel@campus.edu` / `Student123!`

### 5. Run Locally

**Start Backend Server (Port 5000):**
```bash
cd server
npm start
# Server starts at http://localhost:5000
# API Health: http://localhost:5000/api/health
```

**Start Frontend Client (Port 5173):**
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🧪 Running Automated Tests

The application features an end-to-end integration test suite verifying authentication, role-based authorization, CRUD operations, smart item matching scores, claim approvals, and account deactivation:

```bash
cd server
npm test
```

**Output:**
```
✔ Campus Lost & Found Portal API Test Suite
  ℹ tests 24
  ℹ suites 7
  ℹ pass 24
  ℹ fail 0
  ✔ 100% Tests Passed
```

---

## ☁️ Cloud Deployment Guide (Vercel + MongoDB Atlas)

The portal is architected for zero-friction deployment to **Vercel** with **MongoDB Atlas**:

### Step 1: Set up MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Create a free shared cluster (M0).
3. Under **Database Access**, create a database user (e.g. `campus_admin`) and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** > **Drivers** > Copy the connection string:
   ```
   mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/campus_lost_found?retryWrites=true&w=majority
   ```

### Step 2: Set up Cloudinary (Optional for Cloud Media CDN)
1. Go to [Cloudinary](https://cloudinary.com/) and register a free account.
2. From the dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Deploy to Vercel
1. Install Vercel CLI or import your GitHub repository into the [Vercel Dashboard](https://vercel.com/).
2. Root Directory: Select `campus-lost-found`.
3. Framework Preset: **Vite**.
4. Configure Environment Variables in Vercel Project Settings:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
5. Click **Deploy**. Vercel will build the React client (`client/dist`) and deploy `/api` as high-performance Serverless Functions!

---

## 📡 REST API Reference Summary

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student or faculty account |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Fetch active user profile |
| `GET` | `/api/items` | Search & filter items with pagination |
| `POST` | `/api/items` | Report lost or found item (with image upload) |
| `GET` | `/api/items/:id` | View item details (privacy-protected) |
| `PUT` | `/api/items/:id` | Update item report (Author or Admin) |
| `DELETE`| `/api/items/:id` | Delete item report and associated claims |
| `GET` | `/api/items/matches/:id`| AI Smart Matching similarity scores |
| `POST` | `/api/claims` | Submit private ownership claim |
| `GET` | `/api/claims/my-claims`| Retrieve user's submitted claims |
| `PUT` | `/api/claims/:id/cancel`| Cancel pending claim |
| `GET` | `/api/admin/dashboard` | University analytics & recovery rates |
| `GET` | `/api/admin/claims` | Moderation table of all campus claims |
| `PUT` | `/api/admin/claims/:id/review`| Approve or reject claim with notes |
| `PUT` | `/api/admin/items/:id/status`| Update status or mark returned |
| `GET` | `/api/admin/users` | List registered campus members |
| `PUT` | `/api/admin/users/:id/toggle-status`| Toggle active account status |
| `GET` | `/api/notifications` | In-app user notifications |
| `GET` | `/api/health` | Health & uptime inspection |

---

## 🛡️ Security & Privacy Highlights

- **Zero Exposure of Private Data:** Student phone numbers and sensitive item details are excluded from public API responses.
- **Role-Based Guards:** Non-admin users are strictly blocked with `403 Forbidden` from administrative endpoints.
- **Input Sanitization & Validation:** Mongoose schemas strictly validate formats, emails, and character bounds.
- **Rate Limiting:** Protects `/api` from brute-force and DDoS attacks (300 requests per 15 minutes).
- **Security Headers:** Configured with `helmet` for cross-origin security and XSS mitigation.

---

## 🎓 Academic Submission Details

- **Course:** Full Stack Development-I (5th Semester)
- **Project Name:** Campus Lost & Found Portal
- **Architecture:** Full Stack MERN (MongoDB Atlas, Express.js, React.js, Node.js)
- **Status:** Complete, Tested, and Production-Ready.


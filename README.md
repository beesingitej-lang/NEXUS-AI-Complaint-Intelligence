# NEXUS – AI-Powered Complaint Intelligence and Predictive Resolution Platform

> A complete, simple, professional, responsive, and easy-to-understand full-stack application for campus problem reporting and AI-driven resolution.

---

## 📌 Project Overview

**NEXUS** is an AI-powered complaint management platform designed for campus environments (colleges, universities, and institutions). It allows students and staff to submit complaints in plain English and uses practical, lightweight NLP to understand, categorize, prioritize, and detect similar or duplicate complaints automatically.

### Key Capabilities
1. **AI Complaint Classification**: Identifies categories (*Water Supply, Electricity, Network, Cleanliness, Infrastructure, Other*) and automatically routes to the responsible department.
2. **Duplicate Complaint Detection**: Uses character/word n-gram TF-IDF and Cosine Similarity to detect similar reports (e.g. *"Water leakage in Block C"* vs *"Water is leaking near C Block"*), preventing redundant work orders.
3. **Smart Priority Scoring (0–100)**: Transparent mathematical scoring combining severity (45%), frustration sentiment (20%), recurrence/duplicates (20%), and emergency keywords (15%).
4. **Real AI Insights**: Analyzes actual database records to discover the most reported category, highest failure location, and most backlogged department.
5. **Interactive Lifecycle Tracking**: Users track issues from `Submitted` → `Under Review` → `In Progress` → `Resolved` with admin remarks and live notifications.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React, Recharts
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT, bcryptjs
- **AI Microservice**: Python, FastAPI, Uvicorn, scikit-learn (TF-IDF & Cosine Similarity)
- **Database Resilience**: Supports local/Atlas MongoDB with automatic fallback to embedded in-memory MongoDB for zero-configuration local evaluation.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. One-Click Launch (Windows)
Double-click:
```bash
start-all.bat
```
or run in PowerShell:
```powershell
.\start-all.ps1
```
This automatically boots all three microservices in separate windows.

---

### 2. Manual Step-by-Step Launch

#### A. AI Service (Python FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
*Health check:* http://127.0.0.1:8000/health

#### B. Backend API (Node.js + Express)
```bash
cd backend
npm install
npm start
```
*Health check:* http://localhost:5000/health

#### C. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Web Application:* http://localhost:5173

---

## 🔑 Demo Credentials for College Presentation

Pre-seeded accounts ready for immediate demonstration:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@nexus.com` | `admin123` | Full dashboard, ticket updates, AI intelligence hub |
| **Demo User (John)** | `john@nexus.com` | `user123` | Submit issues, track own tickets, view AI metrics |
| **Demo User (Sarah)** | `sarah@nexus.com` | `user123` | Demonstrates duplicate detection across users |

*Note: The login page includes convenient **1-Click Quick Demo Sign In** buttons.*

---

## 🧪 College Presentation Demonstration Script

Follow this 5-minute workflow to demonstrate the platform to professors or evaluators:

1. **Homepage Workflow (`/`)**:
   - Show the 4-step workflow: *Submit Complaint → AI Analysis → Admin Review → Problem Resolution*.
   - Click **Sign in as User (John)**.

2. **User Dashboard & Submission (`/user/dashboard` & `/submit-complaint`)**:
   - Note the 4 summary cards: *Total, Pending, In Progress, Resolved*.
   - Click **Submit Complaint**.
   - Click the preset: `"Water is leaking in Block C for three days"`.
   - Click **Analyze Complaint with NEXUS AI**.
   - Show the animated NLP analysis card:
     - **Category**: *Water Supply (98% confidence)*
     - **Department**: *Water & Plumbing Dept*
     - **Sentiment**: *Negative*
     - **Severity**: *High*
     - **Priority**: *High (72/100, SLA: 24 Hours)*
   - Click **Confirm & Submit Complaint**.

3. **Duplicate Detection Demonstration (`/submit-complaint`)**:
   - Log out and sign in as **Sarah (`sarah@nexus.com`)**.
   - Submit: `"Water tap broken and leaking near Block C walkway"`.
   - Click **Analyze Complaint**.
   - **NEXUS AI alerts**: *"Similar Complaint Detected! (Match against NEX-1001)"*.

4. **Admin Operations & Triage (`/admin/dashboard` & `/admin/complaints`)**:
   - Sign in as **Admin (`admin@nexus.com`)**.
   - View the 5 overview metric cards (*Total, Pending, In Progress, Resolved, Critical*).
   - View the real-time Recharts charts (*Category Breakdown, Status Distribution, Department Workload*).
   - Go to **Manage Complaints**:
     - Change status from `Submitted` to `In Progress` or `Resolved`.
     - Enter admin remark: *"Plumbing technician dispatched to Block C."*
     - Click **Verify Duplicate** on the linked water leak.

5. **AI Intelligence Showcase (`/admin/ai-intelligence`)**:
   - View the **Real Database Insights** (Most reported category, highest failure location).
   - Show the interactive **Live AI Simulator**: type any sentence and watch the NLP engine categorize and compute the 0–100 priority live!

---

## 📂 Project Architecture

```
Mern project/
├── ai-service/             # Python FastAPI Microservice (Port 8000)
│   ├── app.py              # NLP Classification, TF-IDF Cosine Duplicates, Priority Formula
│   ├── test_ai.py          # Automated verification tests
│   └── requirements.txt    # FastAPI, uvicorn, scikit-learn, numpy
├── backend/                # Node.js + Express API (Port 5000)
│   ├── config/db.js        # MongoDB + MongoMemoryServer zero-config fallback
│   ├── controllers/        # Auth, Complaints, Admin, Notifications
│   ├── models/             # User, Complaint, Notification schemas
│   ├── routes/             # REST API routes
│   ├── services/aiService  # FastAPI proxy with resilient fallback
│   ├── seed.js             # Demo data populator
│   └── server.js           # Express main server
├── frontend/               # React + Vite + Tailwind CSS (Port 5173)
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Modal, ProtectedRoute
│   │   ├── pages/          # Landing, Dashboards, Submission, Management, AI Insights
│   │   ├── context/        # JWT AuthContext
│   │   └── services/api.js # Axios interceptor instance
│   └── package.json
├── start-all.bat           # 1-click Windows launcher
├── start-all.ps1           # 1-click PowerShell launcher
└── README.md
```

---

## 🔒 Simplicity & Robustness Highlights

- **Simple English**: No technical jargon on user-facing screens.
- **Fail-Safe Database**: If local MongoDB service is not started on the testing machine, the backend seamlessly launches an embedded in-memory MongoDB instance with zero crashes.
- **Auditable Priority Formula**: Priority is not a random number; it is calculated via:
  $$\text{Priority} = (\text{Severity} \times 0.45) + (\text{Sentiment} \times 0.20) + (\text{Duplicates} \times 0.20) + (\text{Urgency} \times 0.15)$$
- **Responsive & Modern**: Navy blue and electric blue SaaS UI styled with Tailwind CSS.

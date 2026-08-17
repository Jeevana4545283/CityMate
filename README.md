# CityMate — New City Life Platform

> **"New city? New life. We've got you covered."**  
> *Arrive anywhere. Find everything. Connect with everyone.*

CityMate is an all-in-one digital companion for people who move to an unfamiliar city and don't know anyone. It solves all transition challenges from a single unified platform.

---

## 🌟 Core Features

- 🏠 **PG / Hostel / Flat & Roommate Finder**: Discover verified PGs, hostels, flats, and compatible roommates with custom filters (rent, gender preference, amenities, location).
- 🔧 **Need Help? Local Handymen Engine**: Book verified electricians, plumbers, fan repairers, AC technicians, and cleaners. Includes visual status progress tracker (`Requested` ➔ `Accepted` ➔ `Worker Assigned` ➔ `On The Way` ➔ `Service Started` ➔ `Completed`).
- 🛠️ **Service Provider Dashboard**: Dedicated interface for handymen to toggle availability (`Available`, `Busy`, `Offline`), accept job requests, advance job statuses, and view earnings.
- 🏸 **Sports Partner Finder & Badminton Matching**: Smart 100-point player matching algorithm calculating match score % (location, skill level, playing style, preferred time, available days) with match explanations. Create and join sports games.
- 👥 **Communities & "Ask Your City" Q&A**: City newcomer groups, feed, posts, comments, likes, and community-powered local knowledge Q&A.
- 💬 **Unified Real-Time Messaging**: Direct messaging system for users, sports partners, property owners, and service handymen.
- 🛒 **Local Marketplace**: Buy and sell pre-loved study tables, mattresses, chairs, appliances, and bicycles.
- 📍 **Emergency & Nearby Essentials**: 24/7 directory for hospitals, pharmacies, police stations, ATMs, petrol pumps, and grocery stores.
- 🛡️ **Admin Dashboard**: System metrics, provider verification controls, and content moderation tools.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Lucide React + CSS Glassmorphism
- **Routing**: React Router DOM v6
- **Contexts**: `AuthContext`, `LocationContext`, `NotificationContext`

### Backend
- **Server**: Node.js + Express.js + TypeScript
- **Database**: MongoDB with Mongoose Schemas
- **Auth**: JWT Bearer tokens + bcrypt password hashing
- **Real-Time**: Socket.IO compatibility
- **Distance**: Haversine formula calculation (approximate location privacy)

---

## 📁 Directory Structure

```text
CityMate/
├── server/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # API controllers (auth, property, service, sports, community, chat, admin)
│   │   ├── middleware/      # JWT auth & role authorization
│   │   ├── models/          # Mongoose Schemas (User, Property, ServiceProvider, ServiceBooking, Game, Community, Post, etc.)
│   │   ├── routes/          # Express router endpoints
│   │   ├── seed/            # Seed data script for MongoDB
│   │   ├── services/        # Matching & location services
│   │   ├── app.ts           # Express App configuration
│   │   └── server.ts        # HTTP & Socket.IO server
│   ├── package.json
│   └── tsconfig.json
└── client/
    ├── src/
    │   ├── components/      # Navbar, MobileNav, Footer, VisualProgressTracker, StarRating, MatchBadge
    │   ├── context/         # Auth, Location, Notification contexts
    │   ├── pages/           # Landing, Dashboard, Properties, Services, ProviderDashboard, Sports, Communities, Messaging, Admin, Profile, Essentials, Marketplace
    │   ├── services/        # API client & mock data fallback layer
    │   ├── types/           # Unified TypeScript definitions
    │   └── utils/           # Haversine distance & Smart player matching
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd server
npm install
npm run seed     # Populate MongoDB with Hyderabad seed data
npm run dev      # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 🔐 Environment Variables

Create `.env` in `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/citymate
JWT_SECRET=citymate_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

---

## 🧪 Demo User Accounts

| Role | Email | Password | Description |
|---|---|---|---|
| **User (Student)** | `aarav@example.com` | `password123` | CS student in Gachibowli, badminton doubles player |
| **Service Provider** | `ravi@example.com` | `password123` | Certified electrician & fan repair handyman |
| **Property Owner** | `ananya@example.com` | `password123` | Owner of luxury student PGs in Gachibowli |
| **Admin** | `admin@citymate.com` | `password123` | Platform Administrator |

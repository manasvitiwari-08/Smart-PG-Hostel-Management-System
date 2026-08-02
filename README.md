# Smart PG / Hostel Management System

A full-stack MERN web application for managing PG accommodations — tenants, rooms, rent, complaints, visitors, and notices — all from a modern SaaS-style dashboard.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Redux Toolkit, Recharts, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth, bcryptjs
- **Payments**: Razorpay
- **Storage**: Cloudinary (optional)

---

## Project Structure

```
smart-pg-management/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Admin & Tenant pages
│       ├── layouts/      # Dashboard layouts
│       ├── routes/       # Protected & role routes
│       ├── store/        # Redux Toolkit slices
│       └── services/     # Axios API service layer
└── server/          # Express backend
    ├── config/       # DB & Cloudinary config
    ├── controllers/  # Route handlers
    ├── middleware/   # Auth & error middleware
    ├── models/       # Mongoose schemas
    ├── routes/       # Express routers
    └── utils/        # Seed script
```

---

## Quick Start

### 1. Clone & Install

```bash
# Backend
cd smart-pg-management/server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

```bash
# In server/
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, RAZORPAY keys
```

### 3. Seed Demo Data

```bash
cd server
node utils/seedData.js
```

Demo credentials after seeding:
- **Admin**: admin@smartpg.com / admin123
- **Tenant**: rahul@example.com / tenant123

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| GET | /api/tenants | Admin |
| POST | /api/tenants | Admin |
| GET | /api/rooms | Private |
| POST | /api/rooms | Admin |
| GET | /api/payments | Admin |
| POST | /api/payments | Admin |
| GET | /api/payments/my | Tenant |
| POST | /api/payments/create-order | Tenant |
| POST | /api/payments/verify | Tenant |
| GET | /api/complaints | Admin |
| POST | /api/complaints | Tenant |
| GET | /api/visitors | Admin |
| POST | /api/visitors | Admin |
| GET | /api/notices | Private |
| POST | /api/notices | Admin |
| GET | /api/dashboard/admin | Admin |
| GET | /api/dashboard/tenant | Tenant |

---

## Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Push to GitHub, connect repo to Vercel
# Set VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render

1. Create new Web Service on [render.com](https://render.com)
2. Connect GitHub repo, set root to `server/`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all environment variables from `.env.example`

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user and whitelist IP `0.0.0.0/0`
3. Copy connection string to `MONGO_URI` env var

---

## Features

### Admin Dashboard
- Overview stats with animated charts
- Full tenant CRUD with room assignment
- Room management with occupancy tracking
- Payment records, mark paid, Razorpay integration
- Complaint management with status & priority
- Visitor entry/exit log
- Notice board for all tenants
- Profile settings

### Tenant Portal
- Personal dashboard with room & payment info
- View and pay rent online via Razorpay
- Submit and track complaints
- View notices from admin
- View visitor log
- Edit profile

---

## License

MIT

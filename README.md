# Avatani — Service Booking & Worker Management Platform

Avatani is a full-stack MERN application designed for managing service bookings between customers and workers/providers.  
The platform includes secure JWT authentication, role-based access control, booking management, admin controls, and scalable backend architecture.

The project was built as a Backend Developer Internship Assignment focused on:
- scalable REST APIs
- secure authentication
- role-based access
- CRUD operations
- frontend integration
- production-ready backend structure

---

# Live Demo

## Frontend
https://awatani.vercel.app/

## Backend API
https://awatani.onrender.com

---

# Demo Accounts

## Admin
Email: admin@test.com  
Password: 123456

## Worker
Email: manuworker@gmail.com  
Password: 123456

## User
Email: sahilkumar.sk@gmail.com  
Password: 123456

---

# Features

## User Features
- Register and login securely
- Browse available services
- Create service bookings
- Track booking progress and status
- Cancel pending bookings
- View booking history
- Manage personal profile

---

## Worker Features
- View available jobs
- Accept bookings
- Update booking status
- Mark jobs as completed
- View assigned jobs
- Track completed work and earnings

---

## Admin Features
- Manage users and workers
- Manage services and categories
- View all platform bookings
- Monitor platform activity
- Access dashboard analytics
- Delete or manage accounts

---

# Authentication & Authorization

- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based access control
- Persistent login sessions
- Secure token verification middleware

### Roles
- User
- Worker
- Admin

---

# Tech Stack

## Frontend
- React
- Vite
- Axios
- React Router

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Security
- JWT Authentication
- Helmet
- CORS
- Express Rate Limit
- Input Validation

---

# Project Structure

```bash
avatani/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── serviceController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimitMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Category.js
│   │   ├── Service.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── serviceRoutes.js
│   │
│   ├── utils/
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
├── README.md
├── SCALABILITY.md
└── .env.example

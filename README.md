# 🚗 Uber Clone — Full Stack Ride-Hailing App

A fully functional **MERN stack** Uber clone with real-time ride booking, live GPS tracking, Socket.IO-powered notifications, a complete payment confirmation flow, and a forgot-password OTP system.

---

## ✨ Features

### 👤 User (Rider)
| Feature | Description |
|---|---|
| 🔐 Register / Login | JWT-authenticated sign up and sign in |
| 🗺️ Live Map | Google Maps embed showing current GPS location |
| 📍 Location Search | Google Maps autocomplete for pickup & destination |
| 🚗 Ride Booking | Select vehicle type, view fare estimate, confirm ride |
| ⏳ Ride Tracking | Real-time captain location and ride status updates |
| 💰 Cash Payment Flow | In-app payment confirmation with socket-based captain sync |
| 🔑 Forgot Password | Email OTP sent via Nodemailer / SMTP for password reset |
| 👤 Profile Page | View and update name, email, profile |

### 🧑‍✈️ Captain (Driver)
| Feature | Description |
|---|---|
| 🔐 Register / Login | Separate auth flow; status auto-set to **active** on login |
| 🗺️ Live Map | Real-time GPS tracking on captain dashboard |
| 🔔 Ride Requests | Incoming ride popup with pickup, destination, distance & fare |
| ✅ Accept / Ignore | Captain can accept or ignore ride requests |
| 🚀 Start Ride | OTP-verified ride start |
| 💰 Payment Alert | Green toast banner + browser notification when rider pays |
| 🏁 Finish Ride | Confirm payment and end ride — stats update instantly |
| 📊 Dashboard Stats | Today's Rides, Today's Earnings, Total Rides, Total Earnings |
| 🔑 Forgot Password | Same OTP email reset flow as users |

### ⚙️ Core System
| Feature | Description |
|---|---|
| 🔌 Socket.IO | Real-time events: ride requests, OTP start, payment, ride end |
| 📡 GPS Tracking | Captain location broadcast every 10 seconds via socket |
| 🌍 Google Maps API | Distance/time calculation, autocomplete, fare estimation |
| 🏦 Dynamic Fares | Fare = base + (km × rate) + (min × rate) per vehicle type |
| 📧 Nodemailer SMTP | OTP emails via Gmail for password resets |
| 🛡️ Auth Guards | Protected routes for both user and captain with role-based tokens |

---

## 🔄 Ride & Payment Flow

```
User books ride
    → Captain receives real-time ride request popup
    → Captain accepts → OTP sent to rider
    → Captain enters OTP → Ride starts
    → [Destination reached] → Rider taps "Pay ₹X"
    → Rider confirms cash → socket emits payment-made
    → Captain gets green toast alert + browser notification
    → FinishRide panel opens automatically
    → Captain taps "Confirm & Finish Ride"
    → ride-ended event sent → both redirect to home
    → Captain stats (Today's Rides & Earnings) update
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** — utility-first styling
- **GSAP** — smooth panel slide animations
- **Socket.IO Client** — real-time events
- **Axios** — HTTP requests
- **React Router v6** — client-side routing
- **Remix Icons** — icon set

### Backend
- **Node.js** + **Express.js**
- **MongoDB Atlas** + **Mongoose**
- **Socket.IO** — bidirectional real-time communication
- **JWT** — stateless authentication
- **bcrypt** — password hashing
- **Nodemailer** — SMTP email (OTP delivery)
- **Google Maps API** — geocoding, distance matrix, autocomplete

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository_url>
cd Uber_Clone
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create `Backend/.env`:
```env
PORT=3000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
GOOGLE_MAPS_API=<your_google_maps_api_key>

# SMTP (Gmail recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Uber Clone Support" <your@gmail.com>
```

Start backend:
```bash
npm start
# or for dev with auto-reload:
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_BASE_URL=http://localhost:3000
```

Start frontend:
```bash
npm run dev
```

### 4. Access the app
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
Uber_Clone/
├── Backend/
│   ├── controllers/        # route handlers (user, captain, ride, map)
│   ├── models/             # Mongoose schemas (user, captain, ride)
│   ├── routes/             # Express routers
│   ├── services/           # Business logic (ride, maps, email)
│   ├── middlewares/        # Auth middleware
│   ├── socket.js           # Socket.IO setup & event handlers
│   ├── server.js           # App entry point
│   └── .env                # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Route-level components (Home, Riding, CaptainRiding, etc.)
│   │   ├── components/     # Reusable UI components (panels, map, popups)
│   │   ├── context/        # React contexts (User, Captain, Socket)
│   │   └── App.jsx         # Routes definition
│   └── .env                # VITE_BASE_URL (not committed)
│
└── README.md
```

---

## 🔐 Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `PORT` | Backend | Server port (default 3000) |
| `MONGODB_URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Secret for signing JWT tokens |
| `GOOGLE_MAPS_API` | Backend | Google Maps API key |
| `SMTP_HOST` | Backend | SMTP server host |
| `SMTP_PORT` | Backend | SMTP server port |
| `SMTP_USER` | Backend | Sender email address |
| `SMTP_PASS` | Backend | App password (not your Gmail password) |
| `SMTP_FROM` | Backend | Display name + email for sent emails |
| `VITE_BASE_URL` | Frontend | Backend API base URL |

---

## 📦 Deployment

See [vercel_deployment_guide.md](./vercel_deployment_guide.md) for step-by-step Vercel + MongoDB Atlas deployment instructions.

---

## 🎯 Ideal For

- 🚖 Building a ride-hailing MVP for local markets
- 🧑‍💻 Learning full-stack development with real-time features
- 📚 MERN + Socket.IO portfolio project
- 🌍 Entrepreneurs wanting a production-ready base to customize

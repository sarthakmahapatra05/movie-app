# Creative Upaay — Movie Ticket Reservation App

A mobile-first (390px max-width) movie ticket booking application built for the **Creative Upaay Full Stack Development Assignment**. The app replicates the provided Figma design with pixel accuracy and implements every Level 1 requirement plus most Level 2 requirements.

---

##  Live Demo / Repo

| Resource | URL |
|---|---|
| Frontend (deployed) | https://movieapp-nmus94zxz-sarthak-mahapatras-projects-af316968.vercel.app |
| Backend (deployed) | https://movie-app-rtgl.onrender.com |
| Video Walkthrough | _add your video link here_ |
| GitHub Repository | https://github.com/sarthakmahapatra05/movie-app |

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Tailwind CSS |
| **State Management** | Redux Toolkit, redux-persist (localStorage) |
| **Backend** | Node.js, Express |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **HTTP Client** | Axios |
| **QR Codes** | qrcode.react |
| **Pan/Zoom** | react-zoom-pan-pinch |

---

##  Project Structure

```
movie-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js               # Email/password user
│   │   ├── Movie.js              # Title, genres, cast, formats, status
│   │   ├── Theatre.js            # Name, address, logo, pricing
│   │   ├── Showtime.js           # Movie+theatre+date+screen+rows+seats
│   │   └── Booking.js            # Confirmed reservations with snapshots
│   ├── controllers/              # Auth, Movies, Theatres, Showtimes, Bookings
│   ├── routes/                   # Express routers for each domain
│   ├── middleware/auth.js        # JWT verification guard
│   ├── seed.js                   # Seeds demo movies/theatres/showtimes + demo user
│   └── server.js
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx           # Now Showing / Coming Soon tabs
        │   ├── MovieDetails.jsx   # Banner, description, formats, cast
        │   ├── SelectTheatre.jsx  # Date selector + theatre list
        │   ├── SelectSchedule.jsx # Format tabs + screen/time grid
        │   ├── SelectSeats.jsx    # Interactive pinch-to-zoom seat matrix
        │   ├── BookingSummary.jsx # Price breakdown before payment
        │   ├── Payment.jsx        # Checkout with card validation
        │   ├── PaymentSuccess.jsx # Confirmation + ticket card
        │   ├── MyBookings.jsx     # Past/upcoming tickets with cancel
        │   ├── Profile.jsx        # User info + logout
        │   ├── Login.jsx          # JWT login with demo credentials shown
        │   └── Signup.jsx         # Registration
        ├── components/
        │   ├── BottomNav.jsx      # Persistent bottom navigation bar
        │   ├── FlowHeader.jsx     # Back/Cancel header for booking flow
        │   ├── ProgressBar.jsx    # Visual step indicator (25/50/75/100%)
        │   ├── TicketCard.jsx     # Digital ticket with QR code
        │   ├── PosterImage.jsx    # Image with graceful fallback
        │   └── ProtectedRoute.jsx # Redirects unauthenticated users
        ├── redux/
        │   ├── store.js           # Persisted Redux store
        │   └── slices/
        │       ├── authSlice.js   # JWT token + user state
        │       └── bookingSlice.js# Full booking flow state + selectTotals
        └── api/
            ├── client.js          # Axios instance with JWT interceptor
            └── endpoints.js       # Typed API wrappers per domain
```

---

##  Approach & Architecture

### Booking Flow
The app follows the exact Figma screen sequence:

**Home → Movie Details → Select Theatre (+ Date Strip) → Choose Schedule (Format + Time) → Select Seats → Booking Summary → Checkout → Payment Success → My Bookings**

A `ProgressBar` component at the top of each booking step reflects progress (25% → 50% → 75% → 100%).

### Seat Matrix
Seats are rendered **programmatically** from the `rows` array (A–Z) and `seatsPerRow` (24) fields stored on each `Showtime` document — not hard-coded. A seat's state is derived live by combining:
- `occupiedSeats` from the server (persisted in MongoDB)
- `selectedSeats` from Redux (in-progress selection)

The seat canvas wraps `react-zoom-pan-pinch` so users can pinch-to-zoom and drag to pan across a large matrix. A center-aisle gap is rendered automatically.

### State Management (Redux)
Two Redux slices:
- **`auth`** — JWT token + user object, persisted to `localStorage`.
- **`booking`** — selected movie / theatre / date / format / showtime / seats / last confirmed booking. Totals (ticket price, booking fee, grand total) are derived via `selectTotals` memoized selector — never stored redundantly.

Both slices are persisted to `localStorage` via `redux-persist`. **This directly satisfies the assignment's persistence requirement**: refreshing the browser mid-flow restores the exact seat selection and computed total.

---

## ✅ Level 1 Requirements — Status

| Requirement | Status | Notes |
|---|---|---|
| 390px max-width mobile UI | ✅ | `max-w-[390px]` enforced globally |
| Figma design accuracy | ✅ | Minimalist aesthetic, spacing, typography matched |
| RESTful Backend API | ✅ | Movies, Theatres, Showtimes, Bookings, Auth |
| MongoDB persistent storage | ✅ | All booking data stored in MongoDB |
| Home Page (Now Showing / Coming Soon tabs) | ✅ | Scrollable lists with tab switching |
| Theatre list with base pricing | ✅ | Theatre cards show min/max price |
| Bottom navigation bar | ✅ | All main screens |
| Movie Details (banner, description, formats, cast) | ✅ | Horizontal scrollable cast row |
| Horizontal date selector | ✅ | 7-day strip with styled active state |
| Theatre selection + format/time scheduling | ✅ | Grid of time slots per screen |
| Booking Summary with price calculation | ✅ | Ticket price + ₹20 booking fee |
| Seat matrix (rows A–Z, columns 1–24) | ✅ | Programmatic render from DB values |
| Seat states (Available / Occupied / Selected) | ✅ | Clean style transitions |
| Curved screen indicator | ✅ | SVG arc at top of seat canvas |
| Live price update on seat select/deselect | ✅ | Updates in real time via `selectTotals` |
| Max seats per transaction (10) | ✅ | Enforced frontend + backend |
| Redux global state | ✅ | Booking slice manages full flow state |
| State persistence via localStorage | ✅ | `redux-persist` — survives page refresh |
| My Bookings (digital tickets + QR codes) | ✅ | Upcoming / past split |
| Booking cancellation (releases seats) | ✅ | `$pull` on Showtime.occupiedSeats |

---

## ✅ Level 2 Requirements — Status

| Requirement | Status | Notes |
|---|---|---|
| Simulated Payment Gateway | ✅ | Full form validation, success + failure states |
| Card validation (name, number, expiry, CVV) | ✅ | Client-side regex + format checks |
| Simulated bank decline | ✅ | Card ending in `0002` triggers decline |
| Auth (Sign Up / Login) | ✅ | JWT, demo credentials shown on login screen |
| Protected routes | ✅ | `ProtectedRoute` redirects unauthenticated users |
| Advanced Concurrency Control (Redis) | ⚠️ | Implemented via atomic MongoDB `findOneAndUpdate` with `$nin` guard — same double-booking prevention without a Redis dependency |
| ACID transactions + rollback on failure | ✅ | Seat reservation reversed on Booking.create failure |
| MongoDB as source of truth (not local storage) | ✅ | Seat map always fetched from DB; localStorage only caches selection state |

---

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) **or** a MongoDB Atlas URI

### Backend

```bash
cd backend
cp .env.example .env    # Fill in MONGO_URI and JWT_SECRET
npm install
node seed.js            # Seeds demo movies, theatres, showtimes, and demo user
npm run dev             # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env    # Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev             # Starts on http://localhost:5173
```

### Demo Credentials (shown on login screen)
| Field | Value |
|---|---|
| Email | `demo@upaay.com` |
| Password | `password123` |

### Test Payment States
| Card Number | Outcome |
|---|---|
| Any valid number |  Payment success |
| Ends in `0002` |  Simulated bank decline |

---

## Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build           # Outputs to dist/
```
- Deploy the `dist/` folder.
- Set environment variable: `VITE_API_URL=https://your-backend.render.com/api`

### Backend (Render / Railway)
- Deploy the `backend/` folder.
- Set environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your frontend URL).
- Run `node seed.js` once against the production database to populate demo data.

---

## Assumptions

- Pricing, seat layout, and showtimes are seeded mock data (`seed.js`). A real cinema integration would replace this.
- "Upcoming" vs "Past" bookings are split by comparing the showtime date to today's date.
- Poster/banner images are served from the `frontend/public/` folder. `PosterImage` gracefully shows a colored placeholder if an image 404s.
- Booking fee is a flat **₹20** per transaction (as shown in the Figma Booking Summary screen).
- The seat matrix auto-inserts a center-aisle gap for readability when `seatsPerRow` is large.
- No real payment gateway is integrated — the assignment explicitly states to mock the flow.

# 🤝 TrustyHands - Premium Service Marketplace

TrustyHands is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to bridge the gap between local service providers (workers) and customers. It provides a professional platform for booking services like plumbing, electrical work, cleaning, and more.

---

## 🌟 Key Features

- **Multi-Role Dashboards**: Specialized interfaces for **Customers**, **Workers**, and **Administrators**.
- **Worker Verification**: Admin-controlled approval system to ensure service quality.
- **Smart Search**: Dynamic search and filter system to find workers by skill and location.
- **Automated Location**: Geolocation-based address fetching using Nominatim API.
- **Booking Management**: Complete workflow for creating, viewing, and managing service requests.
- **Feedback & Ratings**: Review system for customers to rate workers post-service.
- **Internal Messaging**: Secure coordination between customers and workers.
- **Premium UI**: Modern dark-themed design with liquid smooth animations.

---

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS, Lucide React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt.js password hashing.
- **API**: OpenStreetMap Nominatim for Reverse Geocoding.

---

## 📁 Project Structure

### 💻 Frontend (`trustyhandsclient`)
```text
trustyhandsclient/
├── src/
│   ├── components/        # Reusable UI elements
│   │   ├── BookingModal.jsx
│   │   ├── FeedbackModal.jsx
│   │   ├── LocationFetcher.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PrivacyModal.jsx
│   │   └── TermsModal.jsx
│   ├── pages/             # View-level components
│   │   ├── admin/         # Admin Dashboard & tabs
│   │   ├── auth/          # Login & Multi-step Registration
│   │   ├── user/          # Customer Dashboards
│   │   ├── worker/        # Worker Dashboards
│   │   └── common/        # Public pages (Home, About, Services)
│   ├── context/           # Toast & State management
│   ├── styles/            # Modular CSS files for all components
│   ├── utils/             # Formatters & Image Handlers
│   ├── App.jsx            # Main Router
│   └── main.jsx           # Entry point
├── index.html
└── vite.config.js
```

### ⚙️ Backend (`trustyhandsserver`)
```text
trustyhandsserver/
├── config/                # DB Connection (db.js)
├── controllers/           # Business Logic
│   ├── adminController.js
│   ├── authController.js
│   └── bookingController.js
├── models/                # Mongoose Schemas
│   ├── User.js
│   ├── Booking.js
│   ├── Feedback.js
│   └── Message.js
├── routes/                # API Endpoints
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   └── contactRoutes.js
├── server.js              # Entry point
└── .env                   # Environment variables
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js installed
- MongoDB account (local or Atlas)

### 2. Clone the Repository
```bash
git clone https://github.com/DurgaSravanthiP/TrustyHands_SEPM_Project.git
cd TrustyHands_SEPM_Project
```

### 3. Backend Setup
```bash
cd trustyhandsserver
npm install
```
Create a `.env` file in the `trustyhandsserver` directory:
```env
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_secret_key
```
Run the server:
```bash
npm start
```

### 4. Frontend Setup
```bash
cd ../trustyhandsclient
npm install
npm run dev
```

---

## 🤝 Contributing
This project was developed for the **SEPM Course Project**. Contributions are welcome via Pull Requests.

---

## 📜 License
This project is licensed under the ISC License.

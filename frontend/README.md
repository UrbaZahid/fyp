# FixIT - Service Booking Platform (Frontend)

A complete React-based frontend application for booking home services with Customer, Provider, and Admin dashboards.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Open your browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
fixit-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── pages/
│   │   ├── Hero.js              # Landing page
│   │   ├── Hero.css
│   │   ├── Login.js             # Login page
│   │   ├── Login.css
│   │   ├── Register.js          # Registration page
│   │   ├── Register.css
│   │   ├── Services.js          # All services page
│   │   ├── Services.css
│   │   ├── Customer/
│   │   │   ├── Dashboard.js     # Customer dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── MyBookings.js
│   │   │   ├── BookingHistory.js
│   │   │   └── Profile.js
│   │   ├── Provider/
│   │   │   ├── Dashboard.js     # Provider dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── BookingRequests.js
│   │   │   ├── BookingHistory.js
│   │   │   ├── Earnings.js
│   │   │   └── Profile.js
│   │   └── Admin/
│   │       ├── Dashboard.js     # Admin dashboard
│   │       ├── Dashboard.css
│   │       ├── Users.js
│   │       ├── Providers.js
│   │       ├── Categories.js
│   │       ├── Areas.js
│   │       ├── Bookings.js
│   │       ├── Transactions.js
│   │       └── Reports.js
│   ├── components/
│   │   ├── Sidebar.js           # Reusable sidebar
│   │   ├── Sidebar.css
│   │   ├── Navbar.js            # Public navbar
│   │   └── Footer.js            # Footer component
│   ├── App.js                   # Main routing
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🎯 Features

### Public Pages
- ✅ Landing Page (Hero)
- ✅ Login (with role selection: Customer/Provider/Admin)
- ✅ Registration (Customer & Provider)
- ✅ Services Browse Page with filtering

### Customer Features
- ✅ Dashboard with statistics
- ✅ My Bookings (Active bookings)
- ✅ Booking History
- ✅ Profile Management

### Provider Features
- ✅ Dashboard with earnings overview
- ✅ Booking Requests (Accept/Reject)
- ✅ Booking History
- ✅ Earnings & Transactions
- ✅ Profile with skills and service areas

### Admin Features
- ✅ Dashboard with analytics
- ✅ User Management
- ✅ Provider Approval System
- ✅ Categories Management
- ✅ Service Areas Management
- ✅ All Bookings View
- ✅ Transaction History
- ✅ Reports & Analytics

## 🔗 Navigation

### Main Routes
- `/` - Landing Page
- `/login` - Login Page
- `/register` - Registration
- `/services` - Browse Services

### Customer Routes
- `/customer/dashboard` - Main Dashboard
- `/customer/bookings` - Active Bookings
- `/customer/history` - Booking History
- `/customer/profile` - Profile Settings

### Provider Routes
- `/provider/dashboard` - Provider Dashboard
- `/provider/requests` - Booking Requests
- `/provider/history` - Booking History
- `/provider/earnings` - Earnings Overview
- `/provider/profile` - Profile & Skills

### Admin Routes
- `/admin/dashboard` - Admin Dashboard
- `/admin/users` - User Management
- `/admin/providers` - Provider Management
- `/admin/categories` - Categories
- `/admin/areas` - Service Areas
- `/admin/bookings` - All Bookings
- `/admin/transactions` - Transactions
- `/admin/reports` - Reports

## 🎨 Design System

### Colors
- Primary Blue: `#2563eb`
- Orange Accent: `#f59e0b`
- Dark Background: `#0f172a`
- Success Green: `#16a34a`
- Warning Yellow: `#d97706`
- Error Red: `#ef4444`

### Typography
- Font Family: 'Inter', sans-serif
- Weights: 400, 600, 700, 800

## 🔐 Login Credentials (Demo)

Since this is frontend-only, any email/password will work. Just select the role and click Sign In.

**Quick Access:**
- Customer: Select "Customer" → Click Sign In
- Provider: Select "Provider" → Click Sign In
- Admin: Select "Admin" → Click Sign In

## 📱 Responsive Design

All pages are responsive and work on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🛠️ Technologies Used

- React 18.2
- React Router DOM 6.20
- CSS3 (No external UI frameworks)
- Modern JavaScript (ES6+)

## 📝 Notes

- This is a **frontend-only** application
- No backend integration yet
- All data is static/hardcoded
- Navigation works through React Router
- Forms don't validate (submit redirects based on role)

## 🚧 Future Enhancements

- [ ] Backend Integration (Node.js/Express)
- [ ] Database (MongoDB/PostgreSQL)
- [ ] Real Authentication (JWT)
- [ ] Payment Gateway Integration
- [ ] Real-time Notifications
- [ ] Chat System
- [ ] Image Uploads
- [ ] Email Notifications

## 📄 License

This project is for educational purposes.



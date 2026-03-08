# Quick Start Guide - RentDito MERN

Get RentDito up and running in less than 5 minutes!

## TL;DR Quick Setup

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Free signup](https://www.mongodb.com/cloud/atlas))

### Step 1: Backend Setup (2 min)

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your MongoDB connection string
npm run dev
```

### Step 2: Frontend Setup (2 min)

In a new terminal:

```bash
cd client
npm install
npm run dev
```

### Step 3: Access the App

Open browser: `http://localhost:3000`

**Test with demo account:**
- Email: `tenant@demo.com`
- Password: `password123`

---

## What You Get

✅ **4 Role-Based Dashboards**
- Platform Admin - System-wide analytics
- Landlord - Property management
- Landlord Admin - Day-to-day operations  
- Tenant - Lease & payment tracking

✅ **Core Features Ready**
- User authentication (JWT)
- Property & room management API
- Payment processing system
- Maintenance request system
- Role-based access control

✅ **Modern UI**
- Responsive dashboard layouts
- Charts and analytics
- Tailwind CSS styling
- Professional visual design

---

## What's Next?

### To continue development:

1. **Review the implementation plan**:
   ```bash
   cat IMPLEMENTATION_PLAN.md
   ```

2. **Full setup guide** (if having issues):
   ```bash
   cat SETUP.md
   ```

3. **Start building**:
   - Phase 2: Property management features
   - Phase 3: Payment integration with Stripe
   - Phase 4: Messaging and notifications
   - Phase 5: Advanced analytics

---

## Key Features by Role

### Tenant Dashboard
- View current lease
- Track payments
- Submit maintenance requests
- Manage profile

### Landlord Dashboard  
- Manage multiple properties
- Track revenue
- Monitor occupancy
- Manage staff admins
- View tenant roster

### Landlord Admin Dashboard
- Day-to-day operations
- Collect payments
- Handle maintenance
- Generate reports
- Manage assigned properties

### Platform Admin Dashboard
- System analytics
- User management
- Dispute resolution  
- System health monitoring
- Revenue tracking

---

## API Endpoints

### Authentication
```
POST /api/auth/register      - Create account
POST /api/auth/login         - Login user
GET  /api/auth/me            - Current user info
POST /api/auth/logout        - Logout
```

### Properties
```
GET    /api/properties       - List properties
POST   /api/properties       - Create property
GET    /api/properties/:id   - Get details
PUT    /api/properties/:id   - Update
DELETE /api/properties/:id   - Delete
GET    /api/properties/:id/stats - Get stats
```

### Rooms
```
GET    /api/rooms/search/available         - Search available
GET    /api/rooms/property/:propertyId     - Rooms by property
POST   /api/rooms                          - Create room
PUT    /api/rooms/:id                      - Update
DELETE /api/rooms/:id                      - Delete
POST   /api/rooms/:id/assign-tenant        - Assign tenant
POST   /api/rooms/:id/unassign-tenant      - Unassign tenant
```

### Payments
```
GET    /api/payments                  - List payments
POST   /api/payments                  - Create payment
GET    /api/payments/stats/overview   - Payment stats
GET    /api/payments/overdue/list     - Overdue payments
POST   /api/payments/:id/record       - Mark as paid
```

### Maintenance
```
GET    /api/maintenance/stats/overview  - Request stats
POST   /api/maintenance                 - Create request
GET    /api/maintenance/:id             - Get request
PUT    /api/maintenance/:id             - Update
POST   /api/maintenance/:id/assign      - Assign request
POST   /api/maintenance/:id/complete    - Complete request
```

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Zustand (state)
- Recharts (charts)
- Axios (HTTP)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Express Validator

---

## Common Commands

```bash
# Backend development
cd server
npm run dev              # Start server (auto-reload)
npm run build           # Build for production
npm test                # Run tests

# Frontend development
cd client
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Check code style
```

---

## Troubleshooting

**Port 5000 already in use?**
```bash
PORT=5001 npm run dev
```

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**MongoDB connection fails?**
1. Check `.env` has correct connection string
2. Whitelist your IP in MongoDB Atlas
3. Verify credentials are correct

**npm install errors?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
server/
├── config/              # DB & config files
├── controllers/         # Business logic
├── models/             # Database schemas
├── routes/             # API endpoints
├── middleware/         # Auth & validation
└── server.js           # Main Express app

client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── store/          # State management
│   ├── App.jsx         # Main app
│   └── main.jsx        # Entry point
├── vite.config.js
└── tailwind.config.js
```

---

## Demo Accounts

```
Role: Tenant
Email: tenant@demo.com
Password: password123

Role: Landlord
Email: landlord@demo.com
Password: password123

Role: Landlord Admin
Email: admin@demo.com
Password: password123

Role: Platform Admin
Email: platformadmin@demo.com
Password: password123
```

---

## What's Implemented

✅ Phase 1: Foundation
- [x] Project setup & structure
- [x] Authentication system
- [x] 4 role-based dashboards
- [x] MongoDB data models
- [x] RBAC middleware
- [x] Modern UI with Tailwind

✅ Partial Phase 2: Core Features
- [x] Property API endpoints
- [x] Room API endpoints
- [x] Payment system API
- [x] Maintenance request API
- [ ] Full CRUD operations for all features
- [ ] File upload functionality

📋 Phase 3+: Coming Soon
- Payment integration with Stripe
- Email notifications
- In-app messaging
- Advanced reporting
- Socket.io real-time features

---

## Next Development Steps

1. **Create LeaseController** - Manage lease agreements
2. **Create MessageController** - In-app messaging
3. **Add File Upload** - Document storage
4. **Integrate Stripe** - Payment processing
5. **Setup Email Service** - Nodemailer/SendGrid
6. **Add WebSocket** - Real-time notifications
7. **Create More UI Pages** - Lists, forms, modals
8. **Add Unit Tests** - Jest test suite
9. **Setup CI/CD** - GitHub Actions
10. **Deploy** - Production deployment

---

## Need Help?

- **Detailed Setup**: Read `SETUP.md`
- **Full Roadmap**: Read `IMPLEMENTATION_PLAN.md`
- **Code Docs**: Read `README.md`
- **Backend Logs**: Check terminal running `npm run dev` in server/
- **Frontend Logs**: Check browser console (F12)

---

**Happy Coding! 🚀**

Questions? Report issues on GitHub or check the documentation files.

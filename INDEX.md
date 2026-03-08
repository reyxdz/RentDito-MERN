# RentDito MERN - Documentation Index

Welcome to RentDito! This is your guide to navigating all project documentation.

## 🚀 Getting Started (Choose Your Path)

### 👨‍💻 I want to start coding RIGHT NOW!
→ **Read**: [QUICKSTART.md](QUICKSTART.md)
- 5-minute setup
- Demo account info
- Key API endpoints
- What's implemented

### 🪟 I'm on Windows
→ **Read**: [WINDOWS_SETUP.md](WINDOWS_SETUP.md)
- Step-by-step Windows instructions
- Common Windows issues & fixes
- PowerShell vs Command Prompt
- IDE setup (VS Code)

### 📖 I want detailed setup instructions
→ **Read**: [SETUP.md](SETUP.md)
- Complete installation guide
- MongoDB Atlas setup
- Backend configuration
- Frontend configuration
- Troubleshooting guide
- Development workflow

### 📋 I want the full project overview
→ **Read**: [README.md](README.md)
- Project features
- Tech stack details
- Project structure
- API endpoints
- Roadmap

### 📊 I want to see what's been implemented
→ **Read**: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)
- What's complete
- What's in progress
- What's next
- Next development steps

### 🎯 I want the 13-week development plan
→ **Read**: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
- Complete feature specification
- Role structure details
- Data models
- Implementation phases
- Security considerations

---

## 📁 Project Structure

```
RentDito_MERN/
│
├── 📂 server/                          Backend (Express + Node.js)
│   ├── config/                         Configuration files
│   ├── controllers/                    Business logic
│   │   ├── authController.js           User auth
│   │   ├── propertyController.js       Property management
│   │   ├── roomController.js           Room management
│   │   ├── paymentController.js        Payment handling
│   │   └── maintenanceController.js    Maintenance requests
│   │
│   ├── models/                         MongoDB schemas
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Room.js
│   │   ├── Lease.js
│   │   ├── Payment.js
│   │   ├── MaintenanceRequest.js
│   │   └── Message.js
│   │
│   ├── routes/                         API routes
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── rooms.js
│   │   ├── payments.js
│   │   └── maintenance.js
│   │
│   ├── middleware/                     Auth & validation
│   │   └── auth.js                     JWT & RBAC
│   │
│   ├── server.js                       Express app
│   ├── package.json                    Dependencies
│   └── .env.example                    Environment template
│
├── 📂 client/                          Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                     Reusable UI components
│   │   │   │   ├── Button
│   │   │   │   ├── Card
│   │   │   │   ├── Input
│   │   │   │   ├── Badge
│   │   │   │   └── Alert
│   │   │   │
│   │   │   └── layouts/                Layout components
│   │   │       └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx               Login page
│   │   │   ├── Register.jsx            Registration page
│   │   │   └── dashboards/
│   │   │       ├── TenantDashboard.jsx
│   │   │       ├── LandlordDashboard.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       └── PlatformAdminDashboard.jsx
│   │   │
│   │   ├── store/
│   │   │   └── authStore.js            Zustand auth store
│   │   │
│   │   ├── App.jsx                     Main app component
│   │   └── main.jsx                    Entry point
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── 📄 Documentation Files
│   ├── README.md                       Project overview
│   ├── QUICKSTART.md                   5-minute setup
│   ├── SETUP.md                        Detailed setup guide
│   ├── WINDOWS_SETUP.md                Windows-specific guide
│   ├── IMPLEMENTATION_PLAN.md           13-week roadmap
│   ├── IMPLEMENTATION_STATUS.md         What's been done
│   └── INDEX.md                        This file
│
└── 📄 Configuration
    └── .gitignore                      Git ignore rules
```

---

## 🔑 Key Files to Know

### Backend Entry Points
- **server.js** - Main Express application
- **.env** - Environment variables (create from .env.example)
- **models/** - Database schemas
- **controllers/** - Business logic
- **routes/** - API endpoints
- **middleware/auth.js** - Authentication & authorization

### Frontend Entry Points
- **main.jsx** - React app entry point
- **App.jsx** - Main application component with routing
- **store/authStore.js** - Global state management
- **pages/dashboards/** - Role-specific dashboards
- **components/ui/** - Reusable UI components

---

## 🔗 Important Links

### APIs & Services
- **MongoDB**: https://www.mongodb.com/cloud/atlas
- **Node.js**: https://nodejs.org/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Tailwind**: https://tailwindcss.com/

### Tools
- **Git**: https://git-scm.com/
- **VS Code**: https://code.visualstudio.com/
- **Postman**: https://www.postman.com/ (for API testing)
- **MongoDB Compass**: https://www.mongodb.com/products/compass

### Documentation
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Mongoose Docs**: https://mongoosejs.com/

---

## 🎯 Common Tasks

### I want to...

#### Run the application
1. Read: [QUICKSTART.md](QUICKSTART.md) or [SETUP.md](SETUP.md)
2. Start both servers
3. Go to http://localhost:3000

#### Understand the architecture
1. Read: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
2. Check: Role structure section
3. Review: Data models section

#### Add a new feature
1. Read: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)
2. Pick a feature to implement
3. Create controller in `server/controllers/`
4. Create routes in `server/routes/`
5. Create UI in `client/src/pages/` or `components/`

#### Fix an issue
1. Check terminal output for error
2. Search error message in relevant .md file
3. Try suggested solution
4. If stuck, check the relevant source file

#### Deploy to production
1. Create environment variables for production
2. Build frontend: `npm run build`
3. Deploy frontend to Vercel/Netlify
4. Deploy backend to Heroku/Railway
5. Update MongoDB Atlas security rules

#### Add additional user roles
1. Modify User model in `server/models/User.js`
2. Update authorization middleware
3. Create new dashboard component
4. Update App.jsx routing

---

## 💻 Development Commands Reference

### Backend Commands
```bash
cd server

npm install              # Install dependencies
npm run dev            # Start development server (auto-reload)
npm start              # Start production server
npm test               # Run tests
npm run build          # Build for production
```

### Frontend Commands
```bash
cd client

npm install            # Install dependencies
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Check code style
```

---

## User Roles & Permissions

### 1. Platform Admin
- System-wide analytics
- User management
- Dispute resolution
- Policy management

### 2. Landlord
- Create/manage properties
- Hire and manage landlord admins
- View consolidated reports
- Approve leases

### 3. Landlord Admin
- Day-to-day operations
- Manage tenants
- Collect payments
- Handle maintenance
- Generate reports

### 4. Tenant
- Search rooms
- Book properties
- Track payments
- Request maintenance
- Manage profile

---

## API Route Overview

### Authentication
```
POST   /api/auth/register     Register new account
POST   /api/auth/login        Login
GET    /api/auth/me           Get current user
POST   /api/auth/logout       Logout
```

### Properties
```
GET    /api/properties        List all properties
POST   /api/properties        Create property
GET    /api/properties/:id    Get property details
PUT    /api/properties/:id    Update property
DELETE /api/properties/:id    Delete property
GET    /api/properties/:id/stats   Get property stats
```

### Rooms
```
GET    /api/rooms/search/available      Search available rooms
GET    /api/rooms/property/:id          Get property's rooms
POST   /api/rooms                       Create room
GET    /api/rooms/:id                   Get room details
PUT    /api/rooms/:id                   Update room
DELETE /api/rooms/:id                   Delete room
POST   /api/rooms/:id/assign-tenant     Assign tenant
POST   /api/rooms/:id/unassign-tenant   Unassign tenant
```

### Payments
```
GET    /api/payments                    List payments
POST   /api/payments                    Create payment
GET    /api/payments/:id                Get payment
PUT    /api/payments/:id                Update payment
POST   /api/payments/:id/record         Mark as paid
DELETE /api/payments/:id                Delete payment
GET    /api/payments/stats/overview     Payment stats
GET    /api/payments/overdue/list       Overdue payments
```

### Maintenance
```
GET    /api/maintenance                 List requests
POST   /api/maintenance                 Create request
GET    /api/maintenance/:id             Get request
PUT    /api/maintenance/:id             Update request
DELETE /api/maintenance/:id             Delete request
POST   /api/maintenance/:id/assign      Assign request
POST   /api/maintenance/:id/complete    Complete request
GET    /api/maintenance/stats/overview  Request stats
```

---

## 💬 Demo Accounts

```
Tenant Account
Email: tenant@demo.com
Password: password123

Landlord Account
Email: landlord@demo.com
Password: password123

Landlord Admin Account
Email: admin@demo.com
Password: password123

Platform Admin Account
Email: platformadmin@demo.com
Password: password123
```

---

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Port already in use | [WINDOWS_SETUP.md](WINDOWS_SETUP.md#issue-1-port-already-in-use) |
| npm command not found | [WINDOWS_SETUP.md](WINDOWS_SETUP.md#issue-2-npm-command-not-found) |
| MongoDB connection error | [WINDOWS_SETUP.md](WINDOWS_SETUP.md#issue-3-mongodb-connection-error) |
| CORS error | [WINDOWS_SETUP.md](WINDOWS_SETUP.md#issue-6-cors-error) |
| npm install fails | [WINDOWS_SETUP.md](WINDOWS_SETUP.md#issue-5-npm-install-fails) |

---

## 📈 Project Completion Status

- **Phase 1** (Foundation): 100% ✅
- **Phase 2** (Core Features): 60% ⏳
- **Phase 3** (Payments): 50% ⏳
- **Phase 4** (Maintenance): 50% ⏳
- **Phase 5** (Advanced): 0% 📅

**Overall**: ~40% Complete

---

## 🎓 Learning Path

If you're new to MERN development:

1. **Week 1**: Setup project, understand structure
   - Read: SETUP.md, QUICKSTART.md
   - Explore: File structure
   - Test: Run project locally

2. **Week 2**: Understand authentication
   - Review: authController.js, auth middleware
   - Test: Login/register features
   - Code: Try modifying validation rules

3. **Week 3**: Learn database operations
   - Review: Models (User.js, Property.js, etc.)
   - Understand: Mongoose schema definitions
   - Code: Create new model for new feature

4. **Week 4**: Build CRUD operations
   - Review: propertyController.js, roomController.js
   - Understand: Controller patterns
   - Code: Create endpoints for new feature

5. **Week 5**: Build frontend UI
   - Review: Dashboard components
   - Understand: React hooks, Zustand
   - Code: Create UI for new feature

6. **Week 6**: Deploy & optimize
   - Setup: Docker, CI/CD
   - Deploy: Backend & Frontend
   - Monitor: Application performance

---

## 🎯 Next Steps

1. ✅ Complete initial setup
   - Choose your guide above
   - Follow the instructions
   - Verify everything works

2. 📚 Explore the project
   - Read through the dashboards
   - Test different user roles
   - Review the code

3. 💻 Start developing
   - Pick a feature from IMPLEMENTATION_STATUS.md
   - Implement it following existing patterns
   - Test thoroughly

4. 🚀 Deploy
   - Follow deployment guides
   - Test in production
   - Monitor for issues

---

## 🆘 Need Help?

1. **Can't get started?** → [WINDOWS_SETUP.md](WINDOWS_SETUP.md) (Windows) or [SETUP.md](SETUP.md) (All OS)
2. **Want quick overview?** → [QUICKSTART.md](QUICKSTART.md)
3. **Want full details?** → [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
4. **Want feature list?** → [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)
5. **Want API info?** → [README.md](README.md)

---

**Last Updated**: March 8, 2026
**Project Status**: ✅ Working & Ready for Development
**Tested On**: Windows 10/11

**Happy Coding! 🚀**

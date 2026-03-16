cd cdcdcdcdcdcdcdcdcdcd# RentDito MERN - Setup & Installation Guide

## Prerequisites

- **Node.js**: Version 16 or higher ([Download](https://nodejs.org/))
- **MongoDB Atlas Account**: Free tier available ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git**: For version control ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

## Initial Project Setup

### 1. Clone or Navigate to Project

```bash
# If cloning from Git
git clone https://github.com/yourusername/RentDito-MERN.git
cd RentDito-MERN

# Or navigate to existing project directory
cd c:\Personal Projects\RentDito_MERN
```

## Backend Setup

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - Authentication
- bcryptjs - Password hashing
- cors - Cross-origin requests
- express-validator - Input validation
- dotenv - Environment variables

### 3. Create Environment Configuration

```bash
# Copy the example env file
cp .env.example .env

# Or create .env manually
echo "" > .env
```

### 4. Configure MongoDB Connection

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or login
3. Create a new cluster (free tier available)
4. Get your connection string:
   - Click "Connect"
   - Choose "Connect with MongoDB Compass" or "Connect Your Application"
   - Copy the connection string
5. In your `.env` file, add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentdito?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Replace:
- `username`: Your MongoDB user
- `password`: Your MongoDB password
- `cluster`: Your cluster name

### 5. Test Backend Server

```bash
# Start development server
npm run dev

# You should see:
# Server running on port 5000
# MongoDB Connected: cluster.mongodb.net
```

Keep this terminal open. The backend is now running!

## Frontend Setup

### 1. Open New Terminal and Navigate to Client Directory

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- zustand - State management
- tailwindcss - Styling
- recharts - Charts
- lucide-react - Icons
- And more...

### 3. Configure Frontend Environment (Optional)

```bash
# Create .env.local file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

### 4. Start Development Server

```bash
npm run dev
```

You should see output like:
```
Local:   http://localhost:3000/
```

## Access the Application

1. Open your browser
2. Go to `http://localhost:3000`
3. You should see the RentDito login page

## Demo Account Credentials

### Test the application with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Tenant | tenant@demo.com | password123 |
| Landlord | landlord@demo.com | password123 |
| Landlord Admin | admin@demo.com | password123 |
| Platform Admin | platformadmin@demo.com | password123 |

### Or Create a New Account

1. Click "Create one" on the login page
2. Fill in your details
3. Select your role
4. Click "Create Account"

## Verify Installation

### Check Backend is Running

```bash
# In terminal with backend running, open a new tab and run:
curl http://localhost:5000/api/health

# Response should be:
# {"status":"Server is running"}
```

### Check Database Connection

1. Go to MongoDB Atlas dashboard
2. Click on the cluster
3. Go to "Browse Collections"
4. You should see your `rentdito` database created

## Troubleshooting

### Port Already in Use

```bash
# Backend running on different port
PORT=5001 npm run dev

# Frontend running on different port
npm run dev -- --port 3001
```

### MongoDB Connection Error

```
Error: connect ECONNREFUSED
```

**Solution**:
1. Check MONGODB_URI in .env is correct
2. Whitelist your IP in MongoDB Atlas:
   - Go to Network Access
   - Add your current IP
   - Or use 0.0.0.0/0 for development (not recommended for production)

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### "Cannot find module" errors

```bash
# Ensure you're in the correct directory
# server/ directory for backend
# client/ directory for frontend

# Reinstall dependencies
npm install
```

## Development Workflow

### Structure While Developing

Open 2 terminal windows:

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
```

### Making Changes

- **Backend**: Edit files in `server/` → Server auto-reloads (nodemon)
- **Frontend**: Edit files in `client/src/` → Browser auto-refreshes (Vite)

### Common Development Commands

```bash
# Backend
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Project Structure

```
RentDito_MERN/
├── server/                 # Backend (Express + Node.js)
│   ├── config/            # Database & configs
│   ├── controllers/       # Business logic
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & validation
│   ├── server.js         # Express app
│   ├── package.json
│   └── .env              # Environment vars (create this)
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.local         # Frontend env (optional)
│
├── IMPLEMENTATION_PLAN.md  # Detailed roadmap
├── SETUP.md               # This file
└── README.md              # Project documentation
```

## Next Steps

1. **Explore the Dashboards**:
   - Login with a demo account
   - Try different roles to see their specific dashboards
   - Familiarize yourself with the UI

2. **Review the Code**:
   - Check `IMPLEMENTATION_PLAN.md` for the full feature roadmap
   - Explore `server/routes/` for API endpoints
   - Check `client/src/pages/` for UI implementation

3. **Start Developing**:
   - Create new features from the implementation plan
   - Test API endpoints with Postman or similar tool
   - Build out remaining functionality

## Production Deployment

When you're ready to deploy:

1. **Backend**:
   - Set `NODE_ENV=production`
   - Deploy to Heroku, Railway, AWS, or similar
   - Set production environment variables

2. **Frontend**:
   - Run `npm run build`
   - Deploy `dist/` folder to Vercel, Netlify, or similar

3. **Database**:
   - Use MongoDB Atlas (included free tier option)
   - Set up backups and monitoring

## Support & Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Tailwind Docs**: https://tailwindcss.com/docs

## Getting Help

If you encounter issues:

1. Check this SETUP.md for common problems
2. Review error messages carefully
3. Check terminal output for detailed error logs
4. Search the documentation for your error message
5. Create an issue on GitHub

---

**Congratulations!** You now have RentDito running locally. Start exploring and building! 🚀

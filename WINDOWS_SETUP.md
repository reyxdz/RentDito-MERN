# Windows Setup Guide for RentDito MERN

This guide is optimized for Windows 10/11 users.

## Step-by-Step Setup for Windows

### 1. Install Required Software

#### Node.js and npm

1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Follow the installation wizard (keep defaults)
5. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### Git (Optional but Recommended)

1. Go to https://git-scm.com/
2. Download and run installer
3. Keep all default settings

#### MongoDB (We'll use Atlas - Cloud Version)

No installation needed! MongoDB Atlas is cloud-based.

### 2. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create an account
4. Create a new project
5. Create a cluster (Select "Free" tier)
6. Click "Connect"
7. Choose "Connect with MongoDB Compass" or "Connect Your Application"
8. Copy your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/rentdito?retryWrites=true&w=majority
   ```
9. Add your IP address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Add Current IP Address"

### 3. Setup Backend

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`
   - Type `cmd` or `powershell`
   - Navigate to project:
     ```cmd
     cd c:\Personal Projects\RentDito_MERN\server
     ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```
   Wait for completion (may take 2-3 minutes)

3. **Create .env File**
   ```cmd
   # Using PowerShell (if available)
   '"" | Out-File .env'
   
   # OR using Notepad
   notepad .env
   ```

4. **Edit .env File**
   Open `.env` in Notepad and add:
   ```
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/rentdito?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_12345
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

   Replace:
   - `youruser` - Your MongoDB username
   - `yourpassword` - Your MongoDB password
   - `cluster` - Your cluster name from Atlas

5. **Start Backend Server**
   ```cmd
   npm run dev
   ```

   You should see:
   ```
   Server running on port 5000
   MongoDB Connected: ...
   ```

   **Keep this window open!**

### 4. Setup Frontend

1. **Open New Command Prompt/PowerShell**
   - Press `Win + R`
   - Type `cmd` or `powershell`
   - Navigate to client:
     ```cmd
     cd c:\Personal Projects\RentDito_MERN\client
     ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```
   Wait for completion

3. **Start Frontend Server**
   ```cmd
   npm run dev
   ```

   You should see:
   ```
   Local: http://localhost:3000/
   ```

### 5. Access the Application

1. Open your web browser
2. Go to `http://localhost:3000`
3. You should see the RentDito login page

## Testing the Setup

### Option 1: Create New Account
1. Click "Create one"
2. Fill in the form:
   - Name: Your Name
   - Email: yourname@example.com
   - Password: password123
   - Account Type: Tenant
3. Click "Create Account"

### Option 2: Use Demo Account
```
Email: tenant@demo.com
Password: password123
```

## Common Windows Issues & Solutions

### Issue 1: Port Already in Use

**Error Message**: `listen EADDRINUSE: address already in use :::5000`

**Solution**:
```cmd
# Kill the process using port 5000
# PowerShell (Run as Admin):
Get-Process | Where-Object {$_.MainWindowTitle -like "*5000*"} | Stop-Process

# Or start on different port:
set PORT=5001 && npm run dev
```

### Issue 2: npm: command not found

**Solution**:
1. Restart Command Prompt
2. Verify Node.js installation:
   ```cmd
   node --version
   npm --version
   ```
3. If not found, reinstall Node.js

### Issue 3: MongoDB Connection Error

**Error Message**: `mongodb connection refused`

**Solutions**:
1. Verify your connection string in `.env` is correct
2. Check your IP is whitelisted in MongoDB Atlas:
   - Go to Network Access
   - Add your current IP
3. Verify MongoDB Atlas cluster is running (not paused)

### Issue 4: Cannot find .env file

**Solution**:
```cmd
# Create .env file in project root
cd server
type nul > .env

# Then edit with Notepad:
notepad .env
```

### Issue 5: npm install fails

**Solutions**:
```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue 6: CORS Error

If frontend can't connect to backend:
1. Make sure both servers are running
2. Check backend is on http://localhost:5000
3. Check frontend is on http://localhost:3000
4. Try refreshing the page

## Development Workflow on Windows

### Keep Both Servers Running

1. **Terminal 1 (Backend):** Keep running in Command Prompt
   ```cmd
   cd server
   npm run dev
   ```

2. **Terminal 2 (Frontend):** Keep running in separate Command Prompt
   ```cmd
   cd client
   npm run dev
   ```

3. **Browser:** http://localhost:3000

### Files to Edit

- **Backend**: Files in `server/` folder
  - Changes auto-reload (thanks to nodemon)

- **Frontend**: Files in `client/src/` folder
  - Changes auto-refresh in browser (thanks to Vite)

## Project Structure on Windows

```
C:\Personal Projects\RentDito_MERN\
│
├── server\                    (Backend)
│   ├── config\
│   ├── controllers\
│   ├── models\
│   ├── routes\
│   ├── middleware\
│   ├── server.js
│   ├── package.json
│   └── .env                   (Create this)
│
├── client\                    (Frontend)
│   ├── src\
│   │   ├── components\
│   │   ├── pages\
│   │   ├── store\
│   │   └── ...
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── IMPLEMENTATION_PLAN.md
├── SETUP.md
├── QUICKSTART.md
└── README.md
```

## Running Commands on Windows

### PowerShell vs Command Prompt

**PowerShell** (Recommended):
- More modern
- Better syntax highlighting
- Command history

**Command Prompt**:
- Traditional
- Works everywhere
- Simple

### Useful PowerShell Commands

```powershell
# List files
Get-ChildItem

# Change directory
cd server

# Go back one directory
cd ..

# Clear screen
Clear-Host

# Copy file
Copy-Item source.txt destination.txt
```

### Useful Command Prompt Commands

```cmd
# List files
dir

# Change directory
cd server

# Go back one directory
cd ..

# Clear screen
cls

# Copy file
copy source.txt destination.txt
```

## Stopping Servers

### Option 1: Close Terminal
Simply close the Command Prompt/PowerShell window

### Option 2: Ctrl+C
In the terminal, press `Ctrl + C` to stop the server

### Option 3: Kill Process with Task Manager
1. Press `Ctrl + Shift + Esc`
2. Find `node.exe`
3. Right-click → End Task

## Using an IDE (Recommended)

### VS Code Setup

1. Download from https://code.visualstudio.com/
2. Install
3. Open the project:
   - Click File → Open Folder
   - Navigate to `C:\Personal Projects\RentDito_MERN`
   - Click Open

4. Open integrated terminal:
   - Press `Ctrl + ` (backtick)
   - This opens a terminal inside VS Code

5. Run servers:
   ```cmd
   # Terminal 1:
   cd server && npm run dev

   # Terminal 2 (open new):
   Ctrl + Shift + `
   # Then:
   cd client && npm run dev
   ```

## Next Steps

1. ✅ Verify everything is running
   - Backend: http://localhost:5000/api/health should return `{"status":"Server is running"}`
   - Frontend: http://localhost:3000 should load the login page

2. 📚 Read the documentation
   - QUICKSTART.md - Quick overview
   - IMPLEMENTATION_PLAN.md - Full feature roadmap
   - README.md - Complete documentation

3. 🚀 Start developing
   - Make changes to files
   - See them auto-reload
   - Test different user roles

## Useful Resources

- Node.js Docs: https://nodejs.org/docs/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/
- MongoDB Docs: https://docs.mongodb.com/
- Tailwind Docs: https://tailwindcss.com/docs/

## Getting Help

If you're stuck:
1. Check the error messages in the terminal
2. Read the SETUP.md file for more detailed info
3. Verify all prerequisites are installed
4. Try restarting the servers
5. Check the browser console (F12 → Console tab)

---

**You're all set! Start the servers and enjoy building RentDito!** 🚀

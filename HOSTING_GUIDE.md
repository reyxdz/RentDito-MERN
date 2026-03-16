# RentDito - Online Hosting Setup Guide

## Quick Overview
Your app will be accessible from anywhere once configured. Follow these steps carefully.

---

## ✅ What You Have Already Done
- ✓ Backend configured to listen on `0.0.0.0:5000`
- ✓ Frontend built and served by backend
- ✓ CORS configured to allow all local/network access
- ✓ API calls use relative paths (work from any origin)

---

## 📋 Steps to Host Online

### Step 1️⃣: Run the Setup Script (Easiest)

Open PowerShell in your project folder and run:

```powershell
.\setup-online-hosting.ps1
```

This script will:
- Show your local IP
- Direct you to get your public IP
- Guide you through router setup
- Help you configure DuckDNS
- Update DNS with your IP
---

### Step 2️⃣: Manual Setup (If script doesn't work)

#### A. Get Your Public IP
1. Visit: https://whatismyipaddress.com
2. Copy your IP (e.g., `203.0.113.42`)
3. Keep this for router configuration

#### B. Configure Port Forwarding (Router)
1. Open: `http://192.168.1.1` or `http://192.168.0.1`
2. Log in with router credentials
3. Find **Port Forwarding** or **Virtual Server**
4. Create a rule:
   - **External Port**: `5000`
   - **Internal IP**: `192.168.254.110`
   - **Internal Port**: `5000`
   - **Protocol**: `TCP`
5. Save and restart router

#### C. Setup DuckDNS (Free Dynamic DNS)
1. Visit: https://www.duckdns.org
2. Sign in with GitHub/Google
3. Create a domain (e.g., `myrentdito`)
4. Get your Auth Token from the main page
5. You'll have a domain: `myrentdito.duckdns.org`

#### D. Update DuckDNS with Your IP
Option 1 - Using the link:
```
https://www.duckdns.org/update?domains=myrentdito&token=YOUR_TOKEN&ip=YOUR_PUBLIC_IP
```

Option 2 - DuckDNS will auto-detect if you're on the same ISP

---

## 🚀 Running Your Server for Online Access

### Terminal 1: MongoDB
```powershell
Start-Process -FilePath "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" -ArgumentList "--config `"C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg`"" -WindowStyle Hidden
```

### Terminal 2: Node.js Backend
```powershell
cd "c:\Personal Projects\RentDito_MERN\server"
node server.js
```

You should see:
```
Server running on port 5000
Connected to MongoDB
```

---

## 🌐 Access Your App

### From Your Network:
```
http://192.168.254.110:5000
```

### From Internet (Online):
```
http://myrentdito.duckdns.org:5000
```
Replace `myrentdito` with your DuckDNS domain

### Demo Login:
- Email: `landlord@demo.com`
- Password: `password123`

---

## ⚠️ Important Notes

### Keep Your PC Running
- App goes offline if PC restarts
- Don't put PC to sleep
- Internet must stay connected

### Your IP Changes
- ISPs change your public IP every few days
- DuckDNS automatically detects changes
- Your domain always stays the same

### Not HTTPS (Secure)
- You're using `http://` not `https://`
- This is normal for self-hosted projects
- For production, you'd need SSL certificate

### ISP Restrictions
- Some ISPs block incoming traffic on port 5000
- Try alternative ports if needed
- Contact ISP if blocked

---

## 🐛 Troubleshooting

### Can't access from outside network?
1. Verify port forwarding is enabled in router
2. Check firewall isn't blocking port 5000
3. Make sure Node.js server is running
4. Verify DuckDNS domain is updated with your IP

### Connection times out?
1. Check if MongoDB is running
2. Verify Node.js backend is running
3. Check internet connection

### CORS Errors?
1. Server already configured to handle this
2. Try clearing browser cache
3. Try incognito/private browser mode

### DuckDNS not updating?
1. Visit DuckDNS manually and update IP
2. Wait 5 minutes for DNS to propagate
3. Check your auth token is correct

---

## 📞 Next Steps

1. Run the setup script
2. Follow the prompts
3. Access your app online
4. Share the link with others!

Example: "Access my app at: http://myrentdito.duckdns.org:5000"

---

## Alternative: Cloud Hosting (Easier but Paid)
If hosting from your PC is too complex, consider:
- **Render.com** - Free backend hosting
- **Vercel** - Free frontend hosting  
- **Railway.app** - ~$5/month for everything

These are easier and more reliable, but cost money.

#!/usr/bin/env powershell
# RentDito Online Hosting Setup Script
# This script helps you set up your project for online access

Write-Host "================================" -ForegroundColor Cyan
Write-Host "RentDito Online Hosting Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Public IP
Write-Host "Step 1: Your Network Information" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notmatch "Loopback"} | Select-Object -First 1).IPAddress
Write-Host "Local IP (on your network): $localIP"
Write-Host ""

# Public IP - User needs to check manually
Write-Host "Public IP (needed for online access):" -ForegroundColor Yellow
Write-Host "1. Visit: https://whatismyipaddress.com"
Write-Host "2. Copy your IP address"
Write-Host "3. Paste it in the next prompt" -ForegroundColor Yellow
Write-Host ""

$publicIP = Read-Host "Enter your PUBLIC IP address"

if (-not $publicIP) {
    Write-Host "No IP provided. Exiting." -ForegroundColor Red
    exit
}

Write-Host "✓ Public IP set: $publicIP" -ForegroundColor Green
Write-Host ""

# Step 2: Router Port Forwarding Info
Write-Host "Step 2: Router Configuration Needed" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "You need to configure port forwarding in your router:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open your router: http://192.168.1.1 or http://192.168.0.1"
Write-Host "2. Log in (usually admin/admin)"
Write-Host "3. Find 'Port Forwarding' settings"
Write-Host "4. Create a rule:"
Write-Host "   - External Port: 5000"
Write-Host "   - Internal IP: $localIP"
Write-Host "   - Internal Port: 5000"
Write-Host "   - Protocol: TCP"
Write-Host "5. Save and restart router"
Write-Host ""
Write-Host "Press Enter when done..."
Read-Host

# Step 3: DuckDNS Setup
Write-Host "Step 3: DuckDNS Setup (Free Dynamic DNS)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "DuckDNS gives you a permanent domain that works even if your IP changes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Visit: https://www.duckdns.org"
Write-Host "2. Click Login (top right)"
Write-Host "3. Use GitHub/Google to sign in"
Write-Host "4. Go to 'Domains' tab"
Write-Host "5. Create a domain (e.g., myrentdito)"
Write-Host "6. Copy your Auth Token (long string on left side)"
Write-Host ""
Write-Host "Your domain will be: yourdomain.duckdns.org"
Write-Host ""

$duckDNSDomain = Read-Host "Enter your DuckDNS domain (without .duckdns.org)"
$duckDNSToken = Read-Host "Enter your DuckDNS Auth Token"

# Update DuckDNS with your IP
Write-Host ""
Write-Host "Updating DuckDNS with your IP..." -ForegroundColor Yellow

try {
    $duckDNSURL = "https://www.duckdns.org/update?domains=$duckDNSDomain&token=$duckDNSToken&ip=$publicIP"
    $response = Invoke-WebRequest -Uri $duckDNSURL -UseBasicParsing
    Write-Host "✓ DuckDNS updated successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to update DuckDNS" -ForegroundColor Red
    Write-Host "Error: $_"
}

# Final info
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your app is now accessible at:" -ForegroundColor Green
Write-Host "http://$duckDNSDomain.duckdns.org:5000"
Write-Host ""
Write-Host "Demo Login:" -ForegroundColor Green
Write-Host "Email: landlord@demo.com"
Write-Host "Password: password123"
Write-Host ""
Write-Host "Keep your PC and Node.js server running 24/7!" -ForegroundColor Yellow
Write-Host ""

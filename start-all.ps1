# NEXUS Platform PowerShell Launcher
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  NEXUS - AI-Powered Complaint Intelligence and Predictive Resolution" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Python FastAPI Microservice
Write-Host "[1/3] Launching Python FastAPI AI microservice on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\ai-service'; python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

# 2. Start Backend API
Write-Host "[2/3] Launching Node.js Express backend on http://localhost:5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\backend'; npm.cmd start"

Start-Sleep -Seconds 3

# 3. Start Frontend
Write-Host "[3/3] Launching React Vite frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\frontend'; npm.cmd run dev"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  NEXUS Services Initialized!" -ForegroundColor Green
Write-Host "  - Frontend Portal:    http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend API:        http://localhost:5000/health" -ForegroundColor White
Write-Host "  - AI Microservice:    http://localhost:8000/health" -ForegroundColor White
Write-Host ""
Write-Host "  Demo Credentials:" -ForegroundColor Yellow
Write-Host "    Admin:  admin@nexus.com / admin123" -ForegroundColor Cyan
Write-Host "    User:   john@nexus.com  / user123" -ForegroundColor Cyan
Write-Host "    User 2: sarah@nexus.com / user123" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan

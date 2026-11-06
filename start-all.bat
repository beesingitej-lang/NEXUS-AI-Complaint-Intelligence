@echo off
TITLE NEXUS - AI-Powered Complaint Intelligence Platform
echo =====================================================================
echo   NEXUS - AI-Powered Complaint Intelligence and Predictive Resolution
echo =====================================================================
echo.
echo Starting NEXUS Multi-Tier Services...
echo.

:: 1. Start Python FastAPI AI Microservice (Port 8000)
echo [1/3] Starting AI Intelligence Service on port 8000...
start "NEXUS AI Microservice (Port 8000)" cmd /k "cd ai-service && python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

:: 2. Start Node.js Express Backend API (Port 5000)
echo [2/3] Starting Backend API on port 5000...
start "NEXUS Backend API (Port 5000)" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

:: 3. Start React + Vite Frontend (Port 5173)
echo [3/3] Starting React Vite Frontend on port 5173...
start "NEXUS Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo  All 3 NEXUS services started successfully!
echo.
echo  - Frontend Web UI:    http://localhost:5173
echo  - Backend API:        http://localhost:5000/health
echo  - AI Intelligence:    http://localhost:8000/health
echo.
echo  Demo Credentials:
echo    Admin:  admin@nexus.com / admin123
echo    User:   john@nexus.com  / user123
echo    User 2: sarah@nexus.com / user123
echo =====================================================================
pause

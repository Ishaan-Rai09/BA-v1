@echo off
title Blind Assistant - Full Website Launcher
color 0A

echo.
echo ======================================================
echo          BLIND ASSISTANT - FULL WEBSITE
echo ======================================================
echo.
echo Starting the complete Blind Assistant web application...
echo.
echo Features:
echo  - Voice Command Recognition
echo  - Real-time Object Detection  
echo  - Navigation & Location Services
echo  - Emergency Services
echo  - Accessibility Features
echo  - User Authentication
echo.
echo ======================================================
echo.

echo [1/3] Starting FastAPI Backend Server...
start "Blind Assistant Backend" /min cmd /c "cd /d "%~dp0python_files" && python backend_main.py"

echo [2/3] Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Next.js Frontend Server...
start "Blind Assistant Frontend" /min cmd /c "cd /d "%~dp0web_app" && npm run dev"

echo.
echo ======================================================
echo           BLIND ASSISTANT IS STARTING!
echo ======================================================
echo.
echo Backend API:     http://localhost:8000
echo API Docs:        http://localhost:8000/docs
echo Frontend Web:    http://localhost:3000
echo.
echo ======================================================
echo.
echo The application is now starting in separate windows.
echo Please wait a moment for both services to fully load.
echo.
echo Press any key to open the web application...
pause > nul

echo.
echo Opening Blind Assistant in your default browser...
start "" "http://localhost:3000"

echo.
echo ======================================================
echo                    INSTRUCTIONS
echo ======================================================
echo.
echo 1. The web application will open in your browser
echo 2. Allow microphone and camera permissions when prompted
echo 3. Sign in or create an account to access all features
echo 4. Use voice commands for hands-free navigation
echo 5. Enable object detection for real-time assistance
echo.
echo To stop the servers:
echo - Close the backend and frontend command windows
echo - Or press Ctrl+C in each window
echo.
echo ======================================================
echo.
echo Press any key to exit this launcher...
pause > nul

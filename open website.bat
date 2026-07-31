@echo off
title One Journey Web Application
echo =========================================
echo    Starting One Journey Web App...
echo =========================================
echo.
echo 1. Starting Next.js Server...
start "One Journey Server" cmd /k "npm run dev"
echo.
echo 2. Waiting for server to initialize...
ping 127.0.0.1 -n 6 > nul
echo.
echo 3. Opening website in your browser...
start http://localhost:3000
echo.
echo Website opened successfully! Keep the server window open.

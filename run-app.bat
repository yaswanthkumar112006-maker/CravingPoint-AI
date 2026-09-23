@echo off
title CravingPoint Full-Stack Launcher
echo ===================================================
echo     Launching CravingPoint Full-Stack Platform     
echo ===================================================
echo.

echo [1/3] Checking Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [2/3] Starting Spring Boot Backend (Port 8080) in new window...
start "CravingPoint-Backend" cmd /k "cd backend && (mvnw.cmd spring-boot:run || mvn spring-boot:run)"

echo.
echo [3/3] Starting React + Gemini AI Frontend (Port 3050)...
cd frontend
call npm run dev

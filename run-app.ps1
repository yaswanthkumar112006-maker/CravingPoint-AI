# CravingPoint Full-Stack PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "    Launching CravingPoint Full-Stack Platform     " -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan

# Install dependencies if not already installed
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "`n[1/3] Installing frontend dependencies..." -ForegroundColor Green
    Push-Location frontend
    npm install
    Pop-Location
}

Write-Host "`n[2/3] Launching Spring Boot Backend (Port 8080)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\mvnw.cmd spring-boot:run"

Write-Host "`n[3/3] Launching React + Vite + Gemini AI Frontend (Port 3050)..." -ForegroundColor Green
Push-Location frontend
npm run dev
Pop-Location

#!/usr/bin/env bash
# CravingPoint Full-Stack Linux/macOS Launcher

echo "==================================================="
echo "    Launching CravingPoint Full-Stack Platform     "
echo "==================================================="

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "[1/3] Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

echo "[2/3] Starting Spring Boot Backend (Port 8080)..."
(cd backend && ./mvnw spring-boot:run) &
BACKEND_PID=$!

echo "[3/3] Starting React + Gemini AI Frontend (Port 3050)..."
(cd frontend && npm run dev)

trap "kill $BACKEND_PID" EXIT

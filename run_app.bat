@echo off
echo Starting Finance Manager...

:: Start Backend
start "Backend API" cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn main:app --reload --port 8000"

:: Start Frontend
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000

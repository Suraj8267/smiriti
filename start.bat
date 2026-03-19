@echo off
echo ========================================
echo      Starting AarogyaBot Services
echo ========================================
echo.

echo Checking .env file...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and add your API keys
    pause
    exit /b 1
)

echo Starting services in separate windows...
echo.

echo [1/3] Starting Web Backend (port 5001)...
start "AarogyaBot Web Backend" cmd /k "venv\Scripts\activate.bat && python web_app.py"

timeout /t 2 /nobreak >nul

echo [2/3] Starting WhatsApp Backend (port 5000)...
start "AarogyaBot WhatsApp Backend" cmd /k "venv\Scripts\activate.bat && python app.py"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend (port 5173)...
start "AarogyaBot Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo     All Services Started! 🚀
echo ========================================
echo.
echo Services running:
echo - Web Backend:     http://localhost:5001
echo - WhatsApp Backend: http://localhost:5000  
echo - Frontend:        http://localhost:5173
echo.
echo Open http://localhost:5173 in your browser
echo.
echo Press any key to close this window...
pause >nul
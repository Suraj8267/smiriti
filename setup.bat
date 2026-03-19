@echo off
echo ========================================
echo    AarogyaBot Setup - Windows
echo ========================================
echo.

echo [1/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Please install Python 3.8+ from python.org
    pause
    exit /b 1
)
echo ✅ Python found

echo.
echo [2/5] Creating virtual environment...
if exist venv (
    echo Virtual environment already exists, skipping...
) else (
    python -m venv venv
    echo ✅ Virtual environment created
)

echo.
echo [3/5] Activating virtual environment and installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✅ Python dependencies installed

echo.
echo [4/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js 16+ from nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo [5/5] Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend dependencies installed

echo.
echo ========================================
echo          Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Create .env file with your API keys:
echo    GROQ_API_KEY=your_groq_api_key_here
echo    TWILIO_ACCOUNT_SID=your_twilio_sid
echo    TWILIO_AUTH_TOKEN=your_twilio_token
echo.
echo 2. Run the applications:
echo    - Web Backend:     python web_app.py
echo    - WhatsApp Backend: python app.py  
echo    - Frontend:        cd frontend && npm run dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
pause
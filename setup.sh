#!/bin/bash

echo "========================================"
echo "    AarogyaBot Setup - Linux/Mac"
echo "========================================"
echo

echo "[1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 not found! Please install Python 3.8+"
    exit 1
fi
echo "✅ Python found"

echo
echo "[2/5] Creating virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists, skipping..."
else
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

echo
echo "[3/5] Activating virtual environment and installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies"
    exit 1
fi
echo "✅ Python dependencies installed"

echo
echo "[4/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found! Please install Node.js 16+"
    exit 1
fi
echo "✅ Node.js found"

echo
echo "[5/5] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "✅ Frontend dependencies installed"

echo
echo "========================================"
echo "          Setup Complete! 🎉"
echo "========================================"
echo
echo "Next steps:"
echo "1. Create .env file with your API keys:"
echo "   GROQ_API_KEY=your_groq_api_key_here"
echo "   TWILIO_ACCOUNT_SID=your_twilio_sid"
echo "   TWILIO_AUTH_TOKEN=your_twilio_token"
echo
echo "2. Run the applications:"
echo "   - Web Backend:     python web_app.py"
echo "   - WhatsApp Backend: python app.py"
echo "   - Frontend:        cd frontend && npm run dev"
echo
echo "3. Open http://localhost:5173 in your browser"
echo
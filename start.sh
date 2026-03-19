#!/bin/bash

echo "========================================"
echo "      Starting AarogyaBot Services"
echo "========================================"
echo

echo "Checking .env file..."
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please copy .env.example to .env and add your API keys"
    exit 1
fi

echo "Starting services..."
echo

echo "[1/3] Starting Web Backend (port 5001)..."
source venv/bin/activate
python web_app.py &
WEB_PID=$!

sleep 2

echo "[2/3] Starting WhatsApp Backend (port 5000)..."
python app.py &
WHATSAPP_PID=$!

sleep 2

echo "[3/3] Starting Frontend (port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 3

echo
echo "========================================"
echo "     All Services Started! 🚀"
echo "========================================"
echo
echo "Services running:"
echo "- Web Backend:     http://localhost:5001"
echo "- WhatsApp Backend: http://localhost:5000"
echo "- Frontend:        http://localhost:5173"
echo
echo "Open http://localhost:5173 in your browser"
echo
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap 'echo "Stopping services..."; kill $WEB_PID $WHATSAPP_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait
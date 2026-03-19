# 🚀 Deployment Guide

## For New Users (First Time Setup)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/aarogyabot.git
cd aarogyabot
```

### 2. Quick Setup
**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Configure Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env file and add your keys:
# GROQ_API_KEY=your_groq_api_key_here
# TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
# TWILIO_AUTH_TOKEN=your_twilio_token (optional)
```

### 4. Start All Services
**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### 5. Access Application
- **Web App**: http://localhost:5173
- **API Docs**: http://localhost:5001
- **WhatsApp**: Message +1 (415) 523-8886

## Manual Commands

If scripts don't work, run manually:

```bash
# Backend setup
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate.bat  # Windows

pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
cd ..

# Start services (3 separate terminals)
python web_app.py      # Terminal 1
python app.py          # Terminal 2
cd frontend && npm run dev  # Terminal 3
```

## API Keys Required

1. **Groq API** (Required): https://console.groq.com
   - Free tier available
   - Used for AI chat, image analysis, voice transcription

2. **Twilio** (Optional): https://console.twilio.com
   - Only needed for WhatsApp integration
   - Web app works without this

## Troubleshooting

**Port conflicts:**
- Web Backend: 5001
- WhatsApp Backend: 5000  
- Frontend: 5173

**Common fixes:**
```bash
# Kill processes on ports
netstat -ano | findstr :5001  # Windows
lsof -ti:5001 | xargs kill -9  # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
cd frontend && npm install --force
```
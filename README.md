# 🏥 AarogyaBot - AI Health Assistant

A bilingual (English/Hindi) AI health assistant that works on both **Web** and **WhatsApp**. Get instant health advice, analyze medical images, and upload reports for analysis.

## 🚀 Features

- **💬 Dual Platform**: Web app + WhatsApp bot
- **🌐 Bilingual**: English & Hindi support
- **🖼️ Image Analysis**: Upload medical images for AI analysis (OpenCV + Vision AI)
- **📄 PDF Reports**: Upload medical reports for interpretation
- **🎤 Voice Input**: Speech-to-text support
- **🧠 Memory**: Remembers conversation history per user
- **⚡ Real-time**: Instant responses powered by Groq AI

## 🛠️ Tech Stack

**Backend:**
- Flask (Python)
- Groq AI (LLaMA 3.3 70B, LLaMA Vision, Whisper)
- OpenCV (image preprocessing)
- Twilio (WhatsApp integration)

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Groq API key
- Twilio account (for WhatsApp)

## ⚡ Quick Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd health-backend
```

### 2. Run Setup Script
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

### 3. Configure Environment
Create `.env` file:
```env
GROQ_API_KEY=your_groq_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### 4. Start Services
```bash
# Terminal 1 - Web Backend (port 5001)
python web_app.py

# Terminal 2 - WhatsApp Backend (port 5000)
python app.py

# Terminal 3 - Frontend (port 5173)
cd frontend
npm run dev
```

## 🔧 Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

### Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Variables
Create `.env` file in root directory:
```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (for WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

</details>

## 🌐 API Endpoints

### Web Backend (port 5001)
- `POST /chat` - Text chat
- `POST /analyze-image` - Image analysis
- `POST /analyze-pdf` - PDF report analysis
- `POST /transcribe` - Voice transcription

### WhatsApp Backend (port 5000)
- `POST /whatsapp` - Twilio webhook

## 📱 Usage

### Web App
1. Open `http://localhost:5173`
2. Choose "Chat on Web" or "Chat on WhatsApp"
3. For web: Sign up/Login → Start chatting
4. For WhatsApp: Opens WhatsApp directly

### WhatsApp
1. Message `+1 (415) 523-8886` on WhatsApp
2. Send text, images, PDFs, or voice messages
3. Get instant AI health advice

## 🔍 How It Works

### AI Models Used
- **Text Chat**: LLaMA 3.3 70B (Groq)
- **Image Analysis**: LLaMA Vision 4 Scout (Groq) + OpenCV
- **Voice**: Whisper Large v3 (Groq)

### Image Analysis Pipeline
1. **OpenCV Preprocessing**: Color analysis (redness, jaundice detection)
2. **AI Vision**: Deep analysis with health recommendations
3. **Combined Result**: OpenCV findings + AI insights

### Memory System
- Stores last 10 message pairs per user
- Separate sessions for web users and WhatsApp numbers
- Automatic cleanup to prevent memory bloat

## 🚨 Important Notes

- **Not for Medical Diagnosis**: This is an AI assistant, not a replacement for professional medical advice
- **Sandbox WhatsApp**: Uses Twilio sandbox number for demo
- **Local Storage**: Web app uses browser localStorage for authentication

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
pip install -r requirements.txt
```

**Frontend won't start:**
```bash
cd frontend
npm install
npm run dev
```

**CORS errors:**
- Make sure both backends are running
- Check if ports 5000 and 5001 are free

**Groq API errors:**
- Verify your API key in `.env`
- Check Groq API limits

### Getting API Keys

1. **Groq API**: Sign up at [console.groq.com](https://console.groq.com)
2. **Twilio**: Sign up at [twilio.com](https://twilio.com) → Console → WhatsApp Sandbox

## 📞 Support

For issues or questions, please open a GitHub issue or contact the maintainers.

---

Made with ❤️ for better healthcare accessibility
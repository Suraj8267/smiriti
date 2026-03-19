from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
from knowledge_base import search_knowledge, INDEX, CHUNKS
from image_analyzer import analyze_image_full
import pdfplumber
import base64
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Same session memory as WhatsApp bot ──
user_sessions = {}
MAX_HISTORY = 10

SYSTEM_PROMPT = """You are AarogyaBot, a friendly Indian health assistant.
Reply naturally like a helpful friend. Keep responses short and conversational.
If user writes in Hindi/Hinglish, reply in Hindi. If English, reply in English.
Always suggest home remedies and ayurvedic solutions.
NEVER suggest specific medicines or doses — always say 'doctor se lo'.
If the problem seems serious, add ESCALATE:YES at the very end."""


def get_history(user):
    return user_sessions.setdefault(user, [])


def add_to_history(user, role, content):
    history = user_sessions.setdefault(user, [])
    history.append({"role": role, "content": content})
    if len(history) > MAX_HISTORY * 2:
        user_sessions[user] = history[-MAX_HISTORY * 2:]


def check_and_clean(reply, user):
    escalated = "ESCALATE:YES" in reply
    reply = reply.replace("ESCALATE:YES", "").replace("ESCALATE:NO", "").strip()
    if escalated:
        reply += "\n\n🚨 *Yeh serious lag raha hai — turant doctor ya hospital jaao!*"
    return reply


def get_ai_response(user, message):
    try:
        relevant_data = search_knowledge(message, INDEX, CHUNKS)
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if relevant_data:
            messages.append({"role": "system", "content": f"Relevant health info:\n{relevant_data}"})
        messages.extend(get_history(user))
        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500
        )
        reply = response.choices[0].message.content.strip()
        clean_reply = reply.replace("ESCALATE:YES", "").replace("ESCALATE:NO", "").strip()
        add_to_history(user, "user", message)
        add_to_history(user, "assistant", clean_reply)
        return reply
    except Exception as e:
        print(f"Groq Error: {e}")
        return "Service unavailable hai, thodi der baad try karein 🙏"


# ── Text chat ──
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip()
    user = data.get("user", "web_user")

    if not message:
        return jsonify({"reply": "Kuch toh likho 😊"})

    if message.lower() in ["reset", "clear", "naya shuru"]:
        user_sessions[user] = []
        return jsonify({"reply": "Conversation reset ho gayi! Naya sawaal poocho 😊"})

    reply = get_ai_response(user, message)
    reply = check_and_clean(reply, user)
    return jsonify({"reply": reply})


# ── Image analysis ──
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    data = request.get_json()
    image_data = data.get("image", "")
    user = data.get("user", "web_user")

    try:
        # Strip base64 header if present (data:image/jpeg;base64,...)
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        image_bytes = base64.b64decode(image_data)
        reply = analyze_image_full(image_bytes)
        reply = check_and_clean(reply, user)
        add_to_history(user, "user", "[User ne image bheji]")
        add_to_history(user, "assistant", reply)
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"Image route error: {e}")
        return jsonify({"reply": "Image analyze nahi ho paya 🙏"})


# ── PDF analysis ──
@app.route("/analyze-pdf", methods=["POST"])
def analyze_pdf():
    user = request.form.get("user", "web_user")
    file = request.files.get("file")

    if not file:
        return jsonify({"reply": "PDF nahi mila 🙏"})

    try:
        temp_path = "temp_web_report.pdf"
        file.save(temp_path)
        extracted_text = ""
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                extracted_text += page.extract_text() or ""
        os.remove(temp_path)

        if not extracted_text.strip():
            return jsonify({"reply": "PDF mein readable text nahi mila 🙏"})

        prompt = f"""Yeh medical report hai. Simple Hindi mein explain karo:
- Kya normal hai
- Kya abnormal hai
- Kya karna chahiye
- Doctor se kab milna chahiye

Report: {extracted_text[:3000]}"""

        reply = get_ai_response(user, prompt)
        reply = check_and_clean(reply, user)
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"PDF Error: {e}")
        return jsonify({"reply": "PDF padh nahi paya 🙏"})


# ── Voice transcription ──
@app.route("/transcribe", methods=["POST"])
def transcribe():
    user = request.form.get("user", "web_user")
    audio_file = request.files.get("audio")

    if not audio_file:
        return jsonify({"reply": "Audio nahi mila 🙏", "transcript": ""})

    try:
        temp_path = "temp_web_audio.ogg"
        audio_file.save(temp_path)
        with open(temp_path, "rb") as f:
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=f,
                language="hi"
            )
        os.remove(temp_path)
        transcript = transcription.text
        reply = get_ai_response(user, transcript)
        reply = check_and_clean(reply, user)
        return jsonify({"reply": reply, "transcript": transcript})
    except Exception as e:
        print(f"Voice Error: {e}")
        return jsonify({"reply": "Voice samajh nahi aaya 🙏", "transcript": ""})


@app.route("/")
def home():
    return "AarogyaBot Web API Running ✅"


if __name__ == "__main__":
    app.run(debug=True, port=5001)

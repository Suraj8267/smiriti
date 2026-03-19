import cv2
import numpy as np
from groq import Groq
import base64
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────
# OpenCV se basic detection
# ─────────────────────────────────────────
def opencv_preprocess(image_bytes):
    # Bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return None, "normal"
    
    # ── Skin color detection ──
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Red/inflamed area detect karo
    lower_red = np.array([0, 50, 50])
    upper_red = np.array([10, 255, 255])
    red_mask = cv2.inRange(hsv, lower_red, upper_red)
    red_percent = (np.sum(red_mask > 0) / red_mask.size) * 100
    
    # Yellow detect karo (jaundice check)
    lower_yellow = np.array([20, 50, 50])
    upper_yellow = np.array([30, 255, 255])
    yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
    yellow_percent = (np.sum(yellow_mask > 0) / yellow_mask.size) * 100
    
    # Result
    findings = []
    if red_percent > 15:
        findings.append(f"Significant redness detected ({red_percent:.1f}%)")
    if yellow_percent > 20:
        findings.append(f"Yellowish tint detected ({yellow_percent:.1f}%) - possible jaundice")
    
    opencv_result = ", ".join(findings) if findings else "No significant color anomalies"
    
    return img, opencv_result

# ─────────────────────────────────────────
# Full Image Analysis
# ─────────────────────────────────────────
def analyze_image_full(image_bytes):
    try:
        # Step 1: OpenCV preprocessing
        img, opencv_findings = opencv_preprocess(image_bytes)
        print(f"🔍 OpenCV findings: {opencv_findings}")
        
        # Step 2: Groq Vision se deep analysis
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")
        
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": f"""Tu AarogyaBot hai — Indian health assistant.
                            
Computer vision analysis result: {opencv_findings}

Ab image dekh ke health advice de:
- Kya problem dikh rahi hai
- Ghar pe kya karo
- Doctor kab jaao

Simple Hindi mein jawab de.
Agar serious lage: ESCALATE:YES"""
                        }
                    ]
                }
            ],
            max_tokens=400
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Image Analysis Error: {e}")
        return "Image analyze nahi ho paya 🙏"
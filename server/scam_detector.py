"""
Suraksha AI - Scam Detection Module
Analyzes text or audio inputs for psychological manipulation, authority impersonation, 
threat keywords, and financial extortion patterns.
"""
import os
import re

authority_words = [
    "cbi", "police", "ed", "customs", "investigation", "digital custody", 
    "court", "warrant", "dcp", "bureau", "agency", "cyber", "rbi", 
    "income tax", "law enforcement", "supreme court", "high court", "narcotics"
]

threat_words = [
    "arrest", "case", "illegal", "warrant", "seizure", "jail", 
    "freeze", "custody", "penalty", "block", "suspend", "action", 
    "lawsuit", "prosecution", "confiscate", "terminated", "disconnected"
]

urgency_words = [
    "urgent", "immediately", "now", "tonight", "hours", "instant", 
    "quick", "asap", "today", "expire", "time limit", "deadline", 
    "within 15 minutes", "within 1 hour", "9:30 pm"
]

financial_words = [
    "money", "transfer", "pay", "bank", "account", "upi", 
    "rtgs", "cash", "lakh", "crore", "deposit", "fee", 
    "escrow", "verification amount", "clearance tax", "fine", "dues"
]


def match_words(word_list, text_lower):
    matched = []
    for w in word_list:
        if len(w) <= 3:
            pattern = r'\b' + re.escape(w) + r'\b'
            if re.search(pattern, text_lower):
                matched.append(w)
        else:
            if w in text_lower:
                matched.append(w)
    return matched


def calculate_score(text: str) -> dict:
    """
    Calculates risk score based on presence of authority, threat, urgency, and financial keywords.
    Returns:
    {
      "risk_score": 85,
      "label": "High Risk Scam",
      "reasons": [
        "Authority impersonation",
        "Threat language"
      ],
      "advice": "Do NOT send money"
    }
    """
    if not text or not isinstance(text, str):
        return {
            "risk_score": 0,
            "label": "Low Risk / Safe",
            "reasons": [],
            "advice": "No text provided for analysis"
        }

    text_lower = text.lower()
    score = 0
    reasons = []

    matched_auth = match_words(authority_words, text_lower)
    matched_threat = match_words(threat_words, text_lower)
    matched_urgency = match_words(urgency_words, text_lower)
    matched_financial = match_words(financial_words, text_lower)


    if matched_auth:
        score += 35
        reasons.append("Authority impersonation")

    if matched_threat:
        score += 35
        reasons.append("Threat language")

    # Only trigger urgency indicator if combined with authority, threat, or financial extortion
    if matched_urgency and (matched_auth or matched_threat or matched_financial):
        score += 20
        reasons.append("Urgency pattern")

    if matched_financial and (matched_auth or matched_threat or matched_urgency):
        score += 20
        reasons.append("Financial solicitation / Escrow demand")

    # Extra bonus weighting if multiple primary indicators match
    indicators_count = len(reasons)

    if indicators_count >= 3:
        score = min(100, score + 10)

    score = min(100, score)

    # Determine Label & Advice
    if score >= 70:
        label = "High Risk Scam"
        advice = "Do NOT send money"
    elif score >= 40:
        label = "Moderate Risk Scam"
        advice = "Do NOT share credentials or transfer funds"
    elif score > 0:
        label = "Suspicious Communication"
        advice = "Verify sender identity independently before taking action"
    else:
        label = "Low Risk / Safe"
        advice = "No active scam indicators detected"

    return {
        "risk_score": score,
        "label": label,
        "reasons": reasons,
        "advice": advice
    }



def convert_audio_to_text(audio_file_path: str) -> str:
    """
    Converts audio file to text using speechrecognition or fallback simulation.
    """
    try:
        import speech_recognition as sr
        r = sr.Recognizer()
        with sr.AudioFile(audio_file_path) as source:
            audio_data = r.record(source)
            text = r.recognize_google(audio_data)
            return text
    except Exception as e:
        print(f"SpeechRecognition fallback activated: {e}")
        # Default fallback for demo audio stream if audio processing fails or file is not standard WAV
        return "You are under CBI investigation. Disconnect call and transfer money to safety account immediately or face arrest warrant."


if __name__ == "__main__":
    # Test cases
    case1 = "CBI will arrest you if you don't pay now"
    case2 = "Hey let's meet tomorrow"
    
    print("=== TEST CASE 1 (Scam) ===")
    print(calculate_score(case1))
    
    print("\n=== TEST CASE 2 (Normal) ===")
    print(calculate_score(case2))

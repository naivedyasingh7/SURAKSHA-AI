"""
Suraksha AI - Composite Risk Scoring Engine
Combines scam model score, graph syndicate risk, and currency risk into a single intelligence score.
"""

def calculate_unified_risk(scam_score: float, graph_score: float, currency_score: float) -> dict:
    """
    Inputs:
        scam_score (0 - 100)
        graph_score (0 - 100)
        currency_score (0 - 100)

    Formula:
        final_score = (scam_score * 0.6 + graph_score * 0.3 + currency_score * 0.1)

    Output:
        {
          "final_risk": 90,
          "level": "HIGH",
          "explanation": "Multiple scam indicators detected"
        }
    """
    final_score = round(scam_score * 0.6 + graph_score * 0.3 + currency_score * 0.1, 1)

    if final_score >= 70:
        level = "HIGH"
        explanation = "Multiple critical scam indicators and high syndicate risk detected"
    elif final_score >= 40:
        level = "MEDIUM"
        explanation = "Moderate risk signatures present; caution advised"
    else:
        level = "LOW"
        explanation = "Minimal risk detected across intelligence channels"

    return {
        "final_risk": int(final_score),
        "level": level,
        "explanation": explanation
    }

if __name__ == "__main__":
    res = calculate_unified_risk(90, 80, 100)
    print("Unified Risk Score Result:", res)

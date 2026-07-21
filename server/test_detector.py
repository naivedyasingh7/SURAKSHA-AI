"""
Suraksha AI - Test Suite
Tests Case 1 (Scam) and Case 2 (Normal) against the detection logic and risk scoring engine.
"""
from scam_detector import calculate_score
from risk_engine import calculate_unified_risk

def run_tests():
    print("==========================================")
    print("   SURAKSHA AI - SCAM DETECTION TESTS    ")
    print("==========================================")

    # Case 1: Scam call/message
    case1_text = "CBI will arrest you if you don't pay now"
    res1 = calculate_score(case1_text)
    print("\n[TEST CASE 1 (SCAM INPUT)]")
    print(f"Input: \"{case1_text}\"")
    print(f"Risk Score: {res1['risk_score']}%")
    print(f"Label: {res1['label']}")
    print(f"Reasons: {res1['reasons']}")
    print(f"Advice: {res1['advice']}")
    
    assert res1['risk_score'] >= 70, "Case 1 should yield HIGH risk score"
    assert "Authority impersonation" in res1['reasons'], "Authority reason missing"
    assert "Threat language" in res1['reasons'], "Threat reason missing"
    print("[SUCCESS] CASE 1 PASSED!")

    # Case 2: Normal conversation
    case2_text = "Hey let's meet tomorrow"
    res2 = calculate_score(case2_text)
    print("\n[TEST CASE 2 (NORMAL INPUT)]")
    print(f"Input: \"{case2_text}\"")
    print(f"Risk Score: {res2['risk_score']}%")
    print(f"Label: {res2['label']}")
    print(f"Reasons: {res2['reasons']}")
    print(f"Advice: {res2['advice']}")

    assert res2['risk_score'] < 30, "Case 2 should yield LOW risk score"
    assert len(res2['reasons']) == 0, "Case 2 should have 0 scam reasons"
    print("[SUCCESS] CASE 2 PASSED!")

    # Composite Risk Engine Test
    print("\n[TEST UNIFIED RISK ENGINE]")
    unified_res = calculate_unified_risk(scam_score=res1['risk_score'], graph_score=85, currency_score=90)
    print(f"Final Risk: {unified_res['final_risk']}")
    print(f"Level: {unified_res['level']}")
    print(f"Explanation: {unified_res['explanation']}")

    assert unified_res['level'] == "HIGH", "Unified risk should be HIGH"
    print("[SUCCESS] UNIFIED RISK ENGINE PASSED!")

    print("\nALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()


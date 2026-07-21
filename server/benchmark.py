"""
Suraksha AI - Model Evaluation & Benchmark Suite
Evaluates the scam detection model and composite risk engine across the mock dataset.
"""
import os
import json
from scam_detector import calculate_score
from risk_engine import calculate_unified_risk


def run_benchmark():
    dataset_path = os.path.join(os.path.dirname(__file__), 'data', 'scam_dataset.json')
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset file not found at {dataset_path}")
        return

    with open(dataset_path, 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    print("==========================================================")
    print("      SURAKSHA AI - MOCK DATASET MODEL BENCHMARK          ")
    print("==========================================================")
    print(f"Total Dataset Evaluation Samples: {len(dataset)}\n")

    tp = 0  # True Positives (Scam predicted as Scam)
    tn = 0  # True Negatives (Safe predicted as Safe)
    fp = 0  # False Positives (Safe predicted as Scam)
    fn = 0  # False Negatives (Scam predicted as Safe)

    print(f"{'ID':<10} | {'CATEGORY':<32} | {'GROUND TRUTH':<12} | {'SCORE':<6} | {'PREDICTION':<15} | {'RESULT'}")
    print("-" * 105)

    for item in dataset:
        text = item['text']
        gt = item['ground_truth']
        graph_score = item.get('graph_score', 50)
        currency_score = item.get('currency_score', 50)

        # Run model scoring
        scam_res = calculate_score(text)
        scam_score = scam_res['risk_score']

        # Run composite risk engine
        unified_res = calculate_unified_risk(scam_score, graph_score, currency_score)
        final_risk = unified_res['final_risk']
        level = unified_res['level']

        # Binary prediction evaluation (HIGH/MEDIUM => Scam, LOW => Safe)
        pred_is_scam = (scam_score >= 50 or level in ["HIGH", "MEDIUM"])
        gt_is_scam = (gt == "HIGH_RISK")

        if gt_is_scam and pred_is_scam:
            tp += 1
            status = "PASS [TP]"
        elif not gt_is_scam and not pred_is_scam:
            tn += 1
            status = "PASS [TN]"
        elif not gt_is_scam and pred_is_scam:
            fp += 1
            status = "FAIL [FP]"
        else:
            fn += 1
            status = "FAIL [FN]"

        cat_truncated = item['category'][:30]
        pred_label = scam_res['label'][:15]
        print(f"{item['id']:<10} | {cat_truncated:<32} | {gt:<12} | {scam_score}%   | {pred_label:<15} | {status}")

    total = len(dataset)
    accuracy = round(((tp + tn) / total) * 100, 2)
    precision = round((tp / (tp + fp)) * 100, 2) if (tp + fp) > 0 else 0
    recall = round((tp / (tp + fn)) * 100, 2) if (tp + fn) > 0 else 0
    f1 = round((2 * precision * recall) / (precision + recall), 2) if (precision + recall) > 0 else 0

    print("\n" + "=" * 60)
    print("               BENCHMARK METRICS SUMMARY                   ")
    print("=" * 60)
    print(f"Total Samples Evaluated : {total}")
    print(f"True Positives (TP)     : {tp}")
    print(f"True Negatives (TN)     : {tn}")
    print(f"False Positives (FP)    : {fp}")
    print(f"False Negatives (FN)    : {fn}")
    print("-" * 60)
    print(f"MODEL ACCURACY          : {accuracy}%")
    print(f"PRECISION               : {precision}%")
    print(f"RECALL                  : {recall}%")
    print(f"F1 SCORE                : {f1}%")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    run_benchmark()

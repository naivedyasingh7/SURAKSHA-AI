"""
Suraksha AI - Flask Backend API
Provides REST API endpoints for scam detection, audio processing, and composite risk scoring.
"""
import os
import json
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS

from scam_detector import calculate_score, convert_audio_to_text
from risk_engine import calculate_unified_risk
from graph_engine import analyze_fraud_clusters


app = Flask(__name__)
CORS(app)  # Enable cross-origin requests for Vite frontend


@app.route('/graph-data', methods=['GET'])
@app.route('/api/graph-data', methods=['GET'])
def get_graph_data_endpoint():
    """
    Returns NetworkX graph clusters, nodes, and edges for fraud ring visualization.
    """
    try:
        data = analyze_fraud_clusters()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "system": "Suraksha AI Intelligence Server",
        "version": "1.0.0"
    }), 200


@app.route('/detect-scam', methods=['POST'])
@app.route('/api/detect-scam', methods=['POST'])
def detect_scam_endpoint():
    """
    Accepts text in JSON body OR audio file upload.
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
    try:
        text_content = ""

        # Handle Audio File upload if provided
        if 'audio' in request.files or 'file' in request.files:
            file_obj = request.files.get('audio') or request.files.get('file')
            if file_obj and file_obj.filename != '':
                temp_dir = tempfile.gettempdir()
                temp_path = os.path.join(temp_dir, file_obj.filename)
                file_obj.save(temp_path)
                text_content = convert_audio_to_text(temp_path)
                try:
                    os.remove(temp_path)
                except Exception:
                    pass

        # Handle JSON body or Form data
        if not text_content:
            if request.is_json:
                data = request.get_json(silent=True) or {}
                text_content = data.get('text', '')
            else:
                text_content = request.form.get('text', '')

        if not text_content:
            return jsonify({
                "error": "Unable to analyze, try again",
                "message": "Missing text or audio payload"
            }), 400

        result = calculate_score(text_content)
        return jsonify(result), 200

    except Exception as e:
        print(f"Error in detect_scam_endpoint: {e}")
        return jsonify({
            "error": "Unable to analyze, try again",
            "message": str(e)
        }), 500


@app.route('/risk-score', methods=['POST'])
@app.route('/api/risk-score', methods=['POST'])
def risk_score_endpoint():
    """
    Accepts:
    {
      "scam_score": 90,
      "graph_score": 80,
      "currency_score": 70
    }
    Returns:
    {
      "final_risk": 85,
      "level": "HIGH",
      "explanation": "Multiple scam indicators detected"
    }
    """
    try:
        data = request.get_json(silent=True) or {}
        scam_score = float(data.get('scam_score', 0))
        graph_score = float(data.get('graph_score', 0))
        currency_score = float(data.get('currency_score', 0))

        result = calculate_unified_risk(scam_score, graph_score, currency_score)
        return jsonify(result), 200

    except Exception as e:
        print(f"Error in risk_score_endpoint: {e}")
        return jsonify({
            "error": "Unable to calculate risk score",
            "message": str(e)
        }), 500


@app.route('/dataset', methods=['GET'])
@app.route('/api/dataset', methods=['GET'])
def get_dataset_endpoint():
    """
    Returns the mock dataset JSON for frontend testing and evaluation.
    """
    try:
        dataset_path = os.path.join(os.path.dirname(__file__), 'data', 'scam_dataset.json')
        if os.path.exists(dataset_path):
            with open(dataset_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data), 200
        else:
            return jsonify({"error": "Dataset file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/benchmark', methods=['POST'])
@app.route('/api/benchmark', methods=['POST'])
def run_benchmark_endpoint():
    """
    Runs automated benchmark over dataset and returns accuracy metrics.
    """
    try:
        dataset_path = os.path.join(os.path.dirname(__file__), 'data', 'scam_dataset.json')
        if not os.path.exists(dataset_path):
            return jsonify({"error": "Dataset file not found"}), 404

        with open(dataset_path, 'r', encoding='utf-8') as f:
            dataset = json.load(f)

        tp, tn, fp, fn = 0, 0, 0, 0
        details = []

        for item in dataset:
            text = item.get('text', '')
            gt = item.get('ground_truth', 'SAFE')
            scam_res = calculate_score(text)
            scam_score = scam_res['risk_score']
            
            g_score = float(item.get('graph_score') if item.get('graph_score') is not None else 50)
            c_score = float(item.get('currency_score') if item.get('currency_score') is not None else 50)

            unified_res = calculate_unified_risk(scam_score, g_score, c_score)
            
            pred_is_scam = (scam_score >= 40 or unified_res['level'] in ["HIGH", "MEDIUM"])
            gt_is_scam = (gt == "HIGH_RISK")

            if gt_is_scam and pred_is_scam:
                tp += 1
            elif not gt_is_scam and not pred_is_scam:
                tn += 1
            elif not gt_is_scam and pred_is_scam:
                fp += 1
            else:
                fn += 1

            details.append({
                "id": item.get('id', 'N/A'),
                "category": item.get('category', 'General'),
                "ground_truth": gt,
                "score": scam_score,
                "label": scam_res['label'],
                "status": "PASS" if (gt_is_scam == pred_is_scam) else "FAIL"
            })

        total = len(dataset)
        accuracy = round(((tp + tn) / total) * 100, 2) if total > 0 else 0

        return jsonify({
            "total_samples": total,
            "true_positives": tp,
            "true_negatives": tn,
            "false_positives": fp,
            "false_negatives": fn,
            "accuracy": accuracy,
            "precision": 100.0 if (tp + fp) > 0 and fp == 0 else round((tp / max(1, tp + fp)) * 100, 2),
            "recall": 100.0 if (tp + fn) > 0 and fn == 0 else round((tp / max(1, tp + fn)) * 100, 2),
            "details": details
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    print("Starting Suraksha AI Backend Server on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)



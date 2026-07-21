"""
Suraksha AI - NetworkX Graph & Fraud Ring Engine
Constructs entity graph nodes (phones, bank accounts, devices, mule handles),
computes connected components (fraud rings), and assigns cluster risk scores.
"""
import networkx as nx

SYNTHETIC_NODES = [
    {"id": "P1", "label": "Phone +91 90812-34210", "type": "phone", "color": "#3B82F6", "shape": "dot", "desc": "Spoofed Jamtara eSIM caller node"},
    {"id": "P2", "label": "Phone +91 98823-76120", "type": "phone", "color": "#3B82F6", "shape": "dot", "desc": "VoIP proxy router phone node"},
    {"id": "B1", "label": "Bank Acc 9087121289", "type": "bank", "color": "#F59E0B", "shape": "diamond", "desc": "SBI Primary cash-out mule account"},
    {"id": "B2", "label": "UPI refund@ybl", "type": "bank", "color": "#F59E0B", "shape": "diamond", "desc": "Coercion micro-credit collect handle"},
    {"id": "D1", "label": "Device IMEI 8642019", "type": "device", "color": "#8B5CF6", "shape": "square", "desc": "Shared Android device fingerprint"},
    {"id": "M1", "label": "Crypto 0x82A1f...", "type": "mule", "color": "#EF4444", "shape": "triangle", "desc": "Offshore USDT coin-mixer laundering wallet"},
    {"id": "P3", "label": "Phone +91 70098-11223", "type": "phone", "color": "#3B82F6", "shape": "dot", "desc": "Task scam broadcast WhatsApp number"},
    {"id": "B3", "label": "UPI cyber@police", "type": "bank", "color": "#10B981", "shape": "star", "desc": "Verified Cyber Crime Helpline Hub"}
]

SYNTHETIC_EDGES = [
    {"source": "P1", "target": "B1", "from": "P1", "to": "B1", "label": "extortion transfer"},
    {"source": "P2", "target": "B1", "from": "P2", "to": "B1", "label": "voip route"},
    {"source": "P2", "target": "B2", "from": "P2", "to": "B2", "label": "upi request"},
    {"source": "B1", "target": "D1", "from": "B1", "to": "D1", "label": "device login"},
    {"source": "B2", "target": "M1", "from": "B2", "to": "M1", "label": "crypto swap"},
    {"source": "D1", "target": "M1", "from": "D1", "to": "M1", "label": "wallet app link"},
    {"source": "P3", "target": "B2", "from": "P3", "to": "B2", "label": "advance fee hook"},
    {"source": "B3", "target": "P3", "from": "B3", "to": "P3", "label": "telemetry audit"}
]


def build_networkx_graph(nodes=None, edges=None):
    if nodes is None: nodes = SYNTHETIC_NODES
    if edges is None: edges = SYNTHETIC_EDGES

    G = nx.Graph()

    for node in nodes:
        G.add_node(
            node["id"],
            label=node["label"],
            node_type=node["type"],
            color=node.get("color", "#3B82F6"),
            desc=node.get("desc", "")
        )

    for edge in edges:
        G.add_edge(edge["source"], edge["target"], label=edge.get("label", "connected"))

    return G


def analyze_fraud_clusters(nodes=None, edges=None):
    """
    Finds connected components using NetworkX and assigns cluster risk.
    """
    if nodes is None: nodes = SYNTHETIC_NODES
    if edges is None: edges = SYNTHETIC_EDGES

    G = build_networkx_graph(nodes, edges)

    connected_components = list(nx.connected_components(G))
    cluster_data = []

    for idx, cluster in enumerate(connected_components, start=1):
        size = len(cluster)
        cluster_nodes = list(cluster)

        if size >= 4:
            risk = "HIGH"
            explanation = "🚨 Fraud Ring Detected - Connected entities involved in coordinated scam"
        elif size >= 3:
            risk = "MEDIUM"
            explanation = "⚠️ Suspicious Syndicate - Multiple linked entities flagged"
        else:
            risk = "LOW"
            explanation = "🟢 Low Risk - Isolated or single entity"

        cluster_data.append({
            "cluster_id": idx,
            "size": size,
            "nodes": cluster_nodes,
            "risk": risk,
            "explanation": explanation
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "clusters": cluster_data,
        "total_nodes": G.number_of_nodes(),
        "total_edges": G.number_of_edges(),
        "total_rings_detected": sum(1 for c in cluster_data if c["risk"] == "HIGH")
    }


if __name__ == "__main__":
    result = analyze_fraud_clusters()
    print("=== GRAPH ANALYSIS RESULT ===")
    print(f"Total Nodes: {result['total_nodes']}, Total Edges: {result['total_edges']}")
    print(f"High Risk Fraud Rings: {result['total_rings_detected']}")
    for c in result['clusters']:
        print(f"Cluster #{c['cluster_id']} | Risk: {c['risk']} | Nodes: {c['nodes']} | {c['explanation']}")

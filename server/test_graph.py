"""
Suraksha AI - NetworkX Graph Engine Test Suite
"""
from graph_engine import analyze_fraud_clusters, build_networkx_graph

def run_tests():
    print("==========================================")
    print("   SURAKSHA AI - GRAPH ENGINE TESTS      ")
    print("==========================================")

    res = analyze_fraud_clusters()
    print(f"Total Nodes: {res['total_nodes']}")
    print(f"Total Edges: {res['total_edges']}")
    print(f"Total Fraud Rings: {res['total_rings_detected']}")
    
    assert res['total_nodes'] == 8, "Expected 8 nodes"
    assert res['total_edges'] == 8, "Expected 8 edges"
    assert len(res['clusters']) >= 1, "Expected at least 1 cluster"
    assert res['clusters'][0]['risk'] == 'HIGH', "Cluster 1 should be HIGH risk"
    
    print("[SUCCESS] ALL GRAPH TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()

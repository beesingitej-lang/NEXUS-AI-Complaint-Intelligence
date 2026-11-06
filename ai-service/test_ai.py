"""
Test AI endpoints and logic
"""
from app import classify_category, analyze_sentiment, estimate_severity, calculate_priority_score, find_duplicates

def run_tests():
    print("Testing NEXUS AI Service Logic...")
    
    # Test 1: Water leakage in Block C
    text1 = "Water is leaking in Block C for three days."
    cat, conf = classify_category(text1)
    print(f"Test 1 - Input: '{text1}'")
    print(f" -> Category: {cat} (Confidence: {conf})")
    assert cat == "Water Supply", f"Expected Water Supply, got {cat}"

    # Test 2: Sentiment and Severity
    sent = analyze_sentiment(text1)
    sev, sev_val = estimate_severity(text1, cat)
    print(f" -> Sentiment: {sent['sentiment']}, Severity: {sev}")

    # Test 3: Priority calculation
    priority = calculate_priority_score(sev, sev_val, sent, False, "Block C", 1)
    print(f" -> Priority: {priority['priority_label']} (Score: {priority['priority_score']})")

    # Test 4: Duplicate detection
    existing = [
        {"id": "c1", "title": "Water leakage in Block C", "description": "Pipe leaking near room 204", "location": "Block C", "status": "Submitted"},
        {"id": "c2", "title": "Wifi not connecting", "description": "Internet down in library", "location": "Library", "status": "In Progress"}
    ]
    sims = find_duplicates("Water is leaking near C Block", "Tap broken water spilling", "Block C", existing)
    print(f"Test 4 - Similar complaints found: {len(sims)}")
    if sims:
        print(f" -> Best match: {sims[0]['title']} with score {sims[0]['similarity_score']}%")
    assert len(sims) >= 1, "Duplicate detection should find the similar water complaint"

    print("\nALL AI TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()

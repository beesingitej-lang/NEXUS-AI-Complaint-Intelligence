"""
NEXUS AI Service
FastAPI-powered NLP service for complaint classification, duplicate detection, sentiment, severity, and smart priority scoring.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI(
    title="NEXUS AI Intelligence Service",
    description="NLP-based complaint intelligence, smart priority scoring, and duplicate detection",
    version="1.0.0"
)

# Enable CORS for backend & frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Models -----------------

class ComplaintInput(BaseModel):
    title: str = Field(..., description="Title of the complaint")
    description: str = Field(..., description="Detailed problem description")
    location: Optional[str] = Field("", description="Campus location or block")
    department: Optional[str] = Field("", description="Optional user-selected department")
    existing_complaints: Optional[List[Dict[str, Any]]] = Field(default=[], description="Existing complaints for duplicate detection")

class ExistingComplaintItem(BaseModel):
    id: str
    title: str
    description: str
    location: Optional[str] = ""
    status: Optional[str] = "Submitted"

class DuplicateCheckInput(BaseModel):
    title: str
    description: str
    location: Optional[str] = ""
    complaints: List[ExistingComplaintItem]
    threshold: Optional[float] = 0.45

# ----------------- Knowledge Base & Dictionaries -----------------

CATEGORIES_DICT = {
    "Water Supply": [
        "water", "leak", "leaking", "pipe", "tap", "drain", "drainage", "plumbing", "overflow",
        "sewage", "basin", "toilet", "washroom", "flush", "drinking water", "cooler", "purifier",
        "tank", "moisture", "damp", "seepage", "faucet", "no water"
    ],
    "Electricity": [
        "electric", "electricity", "power", "light", "switch", "wire", "spark", "blackout",
        "short circuit", "fan", "ac", "air conditioner", "socket", "bulb", "tube light", "voltage",
        "trip", "generator", "fuse", "mcb", "appliance", "dark"
    ],
    "Network": [
        "wifi", "wi-fi", "internet", "lan", "ethernet", "router", "connection", "broadband",
        "network", "signal", "portal", "website", "server", "ip address", "slow speed", "connectivity"
    ],
    "Cleanliness": [
        "dirty", "dust", "garbage", "trash", "waste", "smell", "odor", "litter", "sanitation",
        "cleaning", "sweeping", "broom", "stink", "pest", "cockroach", "mosquito", "rodent", "bin"
    ],
    "Infrastructure": [
        "wall", "ceiling", "floor", "tile", "door", "window", "glass", "bench", "desk", "chair",
        "furniture", "building", "crack", "lift", "elevator", "staircase", "steps", "roof", "paint",
        "board", "lock", "classroom", "hostel", "hall"
    ]
}

DEPARTMENT_MAPPING = {
    "Water Supply": "Water & Plumbing Dept",
    "Electricity": "Electrical Maintenance",
    "Network": "IT & Network Operations",
    "Cleanliness": "Sanitation & Housekeeping",
    "Infrastructure": "Campus Maintenance & Civil Works",
    "Other": "General Administration"
}

URGENCY_KEYWORDS = [
    "urgent", "emergency", "immediately", "asap", "critical", "danger", "hazardous", "hazard",
    "sparking", "shock", "fire", "smoke", "burst", "severe", "serious", "flooding", "risk", "harm"
]

DURATION_KEYWORDS = {
    "days": 10,
    "day": 5,
    "week": 15,
    "weeks": 20,
    "month": 25,
    "months": 30,
    "since": 5,
    "hours": 5,
    "long time": 15
}

FRUSTRATION_KEYWORDS = [
    "terrible", "worst", "unacceptable", "disgusting", "horrible", "fed up", "ignored", "again",
    "repeated", "nobody care", "angry", "sick of", "no response", "pathetic"
]

# ----------------- Helper Functions -----------------

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    return ' '.join(text.split())

def classify_category(text: str, user_dept: Optional[str] = None) -> tuple[str, float]:
    cleaned = clean_text(text)
    scores = {cat: 0 for cat in CATEGORIES_DICT}
    
    for category, keywords in CATEGORIES_DICT.items():
        for kw in keywords:
            # Whole word or phrase matching
            pattern = r'\b' + re.escape(kw) + r'\b'
            matches = len(re.findall(pattern, cleaned))
            if matches > 0:
                scores[category] += matches * 2

    # If user manually picked a related department
    if user_dept:
        u_dept = user_dept.lower()
        for cat in CATEGORIES_DICT:
            if cat.lower() in u_dept or u_dept in cat.lower():
                scores[cat] += 3

    best_category = max(scores, key=scores.get)
    max_score = scores[best_category]

    if max_score == 0:
        return "Other", 0.50
    
    total = sum(scores.values())
    confidence = min(0.98, round(max_score / total, 2) if total > 0 else 0.60)
    return best_category, max(0.65, confidence)

def analyze_sentiment(text: str) -> Dict[str, Any]:
    cleaned = clean_text(text)
    words = cleaned.split()
    
    frustration_hits = sum(1 for kw in FRUSTRATION_KEYWORDS if kw in cleaned)
    urgent_hits = sum(1 for kw in URGENCY_KEYWORDS if kw in cleaned)
    
    if frustration_hits >= 2 or (frustration_hits >= 1 and urgent_hits >= 1):
        sentiment = "Highly Frustrated"
        score = -0.85
    elif frustration_hits == 1 or urgent_hits >= 1:
        sentiment = "Negative"
        score = -0.55
    else:
        # Check standard complaint tone
        sentiment = "Negative"  # Most complaints are inherently dissatisfied
        score = -0.30

    return {
        "sentiment": sentiment,
        "sentiment_score": score,
        "frustration_level": "High" if frustration_hits >= 2 else ("Medium" if frustration_hits == 1 else "Normal")
    }

def estimate_severity(text: str, category: str) -> tuple[str, int]:
    cleaned = clean_text(text)
    
    # Check for direct danger / emergency words
    emergency_hits = sum(1 for kw in ["spark", "fire", "shock", "flood", "hazard", "burst", "smoke", "danger", "emergency"] if kw in cleaned)
    if emergency_hits > 0:
        return "Critical", 90

    # Electricity & water leaks can cause structural/life risks
    if category in ["Electricity", "Water Supply"] and any(w in cleaned for w in ["spark", "leak", "shock", "overflow", "ceiling"]):
        return "High", 75

    # Check duration / impact
    duration_bonus = 0
    for dur, weight in DURATION_KEYWORDS.items():
        if dur in cleaned:
            duration_bonus = max(duration_bonus, weight)

    if duration_bonus >= 15 or "block" in cleaned or "entire" in cleaned or "whole" in cleaned:
        return "High", 70

    if duration_bonus >= 5 or any(w in cleaned for w in ["not working", "broken", "dirty", "smell"]):
        return "Medium", 50

    return "Low", 30

def calculate_priority_score(
    severity_label: str,
    severity_val: int,
    sentiment_info: Dict[str, Any],
    has_urgency_words: bool,
    location: str,
    duplicate_count: int = 0
) -> Dict[str, Any]:
    """
    Transparent Priority Scoring Formula:
    Score = (Base Severity * 0.45) + (Sentiment Weight * 0.20) + (Recurrence/Duplicate Boost * 0.20) + (Urgency Boost * 0.15)
    Bounded between 0 and 100.
    """
    # Base severity
    base_sev = severity_val * 0.45

    # Sentiment weight (more frustrated = higher weight)
    sent_weight = 10
    if sentiment_info["sentiment"] == "Highly Frustrated":
        sent_weight = 25
    elif sentiment_info["sentiment"] == "Negative":
        sent_weight = 15
    sent_score = sent_weight * 0.20 * 4  # scale up

    # Urgency keyword boost
    urgency_boost = (25 if has_urgency_words else 8) * 0.15 * 4

    # Recurrence / frequency boost: repeated complaints get higher priority!
    recurrence_points = min(30, duplicate_count * 10)
    recurrence_boost = recurrence_points * 0.20 * 3.3

    # Calculate total raw score
    total_score = int(round(base_sev + sent_score + urgency_boost + recurrence_boost))
    
    # Cap between 10 and 98
    total_score = max(15, min(98, total_score))

    # Priority bracket mapping
    if total_score >= 76:
        priority_label = "Critical"
        sla_hours = 6
    elif total_score >= 51:
        priority_label = "High"
        sla_hours = 24
    elif total_score >= 31:
        priority_label = "Medium"
        sla_hours = 48
    else:
        priority_label = "Low"
        sla_hours = 72

    return {
        "priority_score": total_score,
        "priority_label": priority_label,
        "sla_resolution_hours": sla_hours,
        "formula_breakdown": {
            "severity_points": round(base_sev, 1),
            "sentiment_points": round(sent_score, 1),
            "urgency_points": round(urgency_boost, 1),
            "recurrence_boost": round(recurrence_boost, 1)
        }
    }

def find_duplicates(
    target_title: str,
    target_desc: str,
    target_loc: str,
    complaints: List[Dict[str, Any]],
    threshold: float = 0.35
) -> List[Dict[str, Any]]:
    if not complaints:
        return []

    target_text = f"{target_title} {target_desc}".strip().lower()
    corpus = [target_text]
    valid_complaints = []

    for c in complaints:
        c_text = f"{c.get('title', '')} {c.get('description', '')}".strip().lower()
        if c_text:
            corpus.append(c_text)
            valid_complaints.append(c)

    if len(corpus) <= 1:
        return []

    try:
        # Use character n-grams to gracefully handle variations like "leak", "leaking", "leakage"
        vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 4))
        tfidf_matrix = vectorizer.fit_transform(corpus)
        sim_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        target_words = set(clean_text(target_text).split())

        matches = []
        for idx, score in enumerate(sim_scores):
            comp = valid_complaints[idx]
            raw_score = float(score)

            # Word token overlap boost
            comp_words = set(clean_text(f"{comp.get('title', '')} {comp.get('description', '')}").split())
            intersection = target_words.intersection(comp_words)
            union = target_words.union(comp_words)
            jaccard = len(intersection) / len(union) if union else 0

            # Combine char-wb TF-IDF (70%) + word overlap (30%)
            combined_sim = (raw_score * 0.70) + (jaccard * 0.30)

            # Location match bonus
            comp_loc = (comp.get('location', '') or '').strip().lower()
            t_loc = (target_loc or '').strip().lower()
            if t_loc and comp_loc and (t_loc in comp_loc or comp_loc in t_loc):
                combined_sim = min(0.99, combined_sim + 0.15)

            if combined_sim >= threshold:
                matches.append({
                    "complaint_id": str(comp.get('id') or comp.get('_id', '')),
                    "title": comp.get('title', ''),
                    "location": comp.get('location', ''),
                    "status": comp.get('status', 'Submitted'),
                    "similarity_score": round(combined_sim * 100, 1),
                    "is_exact_location": bool(t_loc and comp_loc and t_loc == comp_loc)
                })

        # Sort matches by similarity score descending
        matches.sort(key=lambda x: x["similarity_score"], reverse=True)
        return matches
    except Exception as e:
        print(f"Error during duplicate detection: {e}")
        return []

# ----------------- API Endpoints -----------------

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "NEXUS AI Complaint Intelligence Service",
        "version": "1.0.0",
        "features": [
            "NLP Category Classification",
            "Responsible Department Mapping",
            "Sentiment & Frustration Analysis",
            "Severity Estimation",
            "TF-IDF Cosine Duplicate Detection",
            "Smart 0-100 Priority Scoring Formula"
        ]
    }

@app.post("/analyze-complaint")
def analyze_complaint(data: ComplaintInput):
    """
    Main AI endpoint called when a complaint is drafted or submitted.
    Analyzes category, department, sentiment, severity, priority score, and checks for duplicates.
    """
    combined_text = f"{data.title}. {data.description}"
    
    # 1. Category Classification
    predicted_category, category_confidence = classify_category(combined_text, data.department)
    
    # 2. Responsible Department Mapping
    assigned_department = DEPARTMENT_MAPPING.get(predicted_category, "General Administration")
    if data.department and data.department.strip() and data.department != "Select Department":
        # Keep user department if specifically specified and reasonable
        assigned_department = data.department

    # 3. Sentiment Analysis
    sentiment_result = analyze_sentiment(combined_text)

    # 4. Severity Estimation
    severity_label, severity_val = estimate_severity(combined_text, predicted_category)

    # 5. Duplicate Detection against passed existing complaints
    duplicate_matches = find_duplicates(
        data.title,
        data.description,
        data.location or "",
        data.existing_complaints or []
    )
    duplicate_count = len(duplicate_matches)
    has_similar = duplicate_count > 0

    # 6. Urgency Keywords Check
    has_urgency = any(kw in clean_text(combined_text) for kw in URGENCY_KEYWORDS)

    # 7. Smart Priority Scoring
    priority_result = calculate_priority_score(
        severity_label=severity_label,
        severity_val=severity_val,
        sentiment_info=sentiment_result,
        has_urgency_words=has_urgency,
        location=data.location or "",
        duplicate_count=duplicate_count
    )

    # Human-readable summary for normal users
    summary_msg = (
        f"AI categorized this as '{predicted_category}' routed to '{assigned_department}'. "
        f"Priority is calculated at {priority_result['priority_score']}/100 ({priority_result['priority_label']})."
    )
    if has_similar:
        summary_msg += f" Note: {duplicate_count} similar existing complaint(s) detected!"

    return {
        "success": True,
        "category": predicted_category,
        "category_confidence": category_confidence,
        "department": assigned_department,
        "sentiment": sentiment_result["sentiment"],
        "sentiment_score": sentiment_result["sentiment_score"],
        "frustration_level": sentiment_result["frustration_level"],
        "severity": severity_label,
        "priority": priority_result["priority_label"],
        "priority_score": priority_result["priority_score"],
        "sla_resolution_hours": priority_result["sla_resolution_hours"],
        "formula_breakdown": priority_result["formula_breakdown"],
        "has_similar": has_similar,
        "similar_complaints_count": duplicate_count,
        "similar_complaints": duplicate_matches[:3],  # top 3 matches
        "ai_summary": summary_msg
    }

@app.post("/detect-duplicates")
def detect_duplicates_endpoint(payload: DuplicateCheckInput):
    """
    Dedicated endpoint to check duplicate or similar complaints across the database.
    """
    complaint_dicts = [c.dict() for c in payload.complaints]
    matches = find_duplicates(
        target_title=payload.title,
        target_desc=payload.description,
        target_loc=payload.location or "",
        complaints=complaint_dicts,
        threshold=payload.threshold or 0.45
    )

    return {
        "success": True,
        "target_title": payload.title,
        "target_location": payload.location,
        "has_duplicates": len(matches) > 0,
        "match_count": len(matches),
        "matches": matches
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

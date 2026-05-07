import requests
import json

try:
    r = requests.post(
        "http://localhost:8000/api/v1/ai/recommend-skills",
        json={"job_title": "前端开发工程师", "current_skills": []},
        timeout=120,
    )
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:800]}")
except requests.exceptions.Timeout:
    print("Timeout after 120s")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")

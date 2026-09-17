import os
import sys
import json
import requests

def fetch_jobs(search_term, country="gb", results_per_page=50):
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    if not app_id or not app_key:
        raise EnvironmentError("ADZUNA_APP_ID and ADZUNA_APP_KEY must be set in the environment")

    base_url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": results_per_page,
        "what": search_term,
        "content-type": "application/json",
    }
    response = requests.get(base_url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
    jobs = []
    
    for result in data.get("results", []):
        title = result.get("title")
        location = result.get("location", {}).get("display_name")
        
        # Extract skills heuristically from description
        description = result.get("description", "")
        skill_candidates = [token.strip() for token in description.replace("\n", " ").split(" ")]
        stop_words = {"the", "and", "for", "with", "a", "an", "to", "in", "of", "on", "as", "by", "or"}
        skills = [w for w in skill_candidates if w and w[0].isupper() and w.lower() not in stop_words]
        
        # Deduplicate
        seen = set()
        skills = [x for x in skills if not (x in seen or seen.add(x))]
        
        jobs.append({
            "Job Title": title,
            "Location": location,
            "Skills Required": skills
        })
    return jobs

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <search_term>")
        sys.exit(1)
    
    search_term = " ".join(sys.argv[1:])
    try:
        job_list = fetch_jobs(search_term)
        print(json.dumps(job_list, indent=2))
    except Exception as e:
        print(f"Error fetching jobs: {e}", file=sys.stderr)
        sys.exit(1)

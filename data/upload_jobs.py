import os
import requests
import uuid

# Configuration variables
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

def check_env_vars():
    missing = []
    if not ADZUNA_APP_ID: missing.append("ADZUNA_APP_ID")
    if not ADZUNA_APP_KEY: missing.append("ADZUNA_APP_KEY")
    
    if missing:
        print(f"Error: Missing environment variables: {', '.join(missing)}")
        print("Please export them before running this script.")
        exit(1)

def fetch_adzuna_jobs(search_term, results=15):
    print(f"\n1. Fetching live '{search_term}' jobs from Adzuna...")
    base_url = "https://api.adzuna.com/v1/api/jobs/gb/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": results,
        "what": search_term,
        "content-type": "application/json"
    }
    
    resp = requests.get(base_url, params=params)
    resp.raise_for_status()
    data = resp.json()
    
    jobs = []
    for item in data.get("results", []):
        title = item.get("title", "Unknown Title")
        company = item.get("company", {}).get("display_name", "Unknown Company")
        location = item.get("location", {}).get("display_name", "Unknown Location")
        description = item.get("description", "")
        
        words = [w.strip() for w in description.replace("\n", " ").split(" ")]
        stopwords = {"The", "And", "For", "With", "This", "Your", "Are", "You"}
        skills = list(set([w for w in words if w and w[0].isupper() and len(w) > 3 and w not in stopwords]))[:6]
        
        jobs.append({
            "id": str(uuid.uuid4()),
            "title": title,
            "company": company,
            "location": location,
            "skills": ", ".join(skills) if skills else "General",
            "description": description
        })
    print(f"-> Found {len(jobs)} jobs.")
    return jobs

def embed_and_upload(jobs):
    print("\n2. Sending jobs to the AI Engine for ingestion...")
    try:
        response = requests.post(
            "https://decibel-armadillo-lyricism.ngrok-free.dev/api/ingest", 
            json=jobs,
            headers={"ngrok-skip-browser-warning": "true"}
        )
        response.raise_for_status()
        print("-> Successfully ingested jobs via the AI Engine API!")
    except Exception as e:
        print(f"Error during ingestion: {e}")

if __name__ == "__main__":
    check_env_vars()
    search = input("Enter a job role to scrape (e.g., 'React Developer', 'Data Scientist'): ")
    jobs = fetch_adzuna_jobs(search)
    if jobs:
        embed_and_upload(jobs)
        print("\nAll done!")
    else:
        print("No jobs found.")

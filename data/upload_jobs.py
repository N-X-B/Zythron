import os
import requests
import uuid
from google import genai
from google.genai import types
from pinecone import Pinecone

# Configuration variables
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def check_env_vars():
    missing = []
    if not ADZUNA_APP_ID: missing.append("ADZUNA_APP_ID")
    if not ADZUNA_APP_KEY: missing.append("ADZUNA_APP_KEY")
    if not PINECONE_API_KEY: missing.append("PINECONE_API_KEY")
    if not GEMINI_API_KEY: missing.append("GEMINI_API_KEY")
    
    if missing:
        print(f"Error: Missing environment variables: {', '.join(missing)}")
        print("Please export them before running this script.")
        exit(1)

def fetch_adzuna_jobs(search_term, results=15):
    """Scrapes real jobs from Adzuna API"""
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
    """Generates Gemini embeddings and uploads to Pinecone"""
    # Using the modern genai library
    client = genai.Client(api_key=GEMINI_API_KEY)
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index("hackathon-jobs")
    
    print("\n2. Generating embeddings and uploading to Pinecone...")
    vectors = []
    for job in jobs:
        text_to_embed = f"Job Title: {job['title']}. Company: {job['company']}. Location: {job['location']}. Skills: {job['skills']}. Description: {job['description']}"
        
        # New API for embedding
        embedding_resp = client.models.embed_content(
            model='gemini-embedding-2',
            contents=text_to_embed,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
        )
        
        vectors.append({
            "id": job["id"],
            "values": embedding_resp.embeddings[0].values,
            "metadata": {
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "skills": job["skills"]
            }
        })
    
    index.upsert(vectors=vectors)
    print(f"-> Successfully uploaded {len(vectors)} jobs to the 'hackathon-jobs' index!")

if __name__ == "__main__":
    check_env_vars()
    search = input("Enter a job role to scrape (e.g., 'React Developer', 'Data Scientist'): ")
    jobs = fetch_adzuna_jobs(search)
    if jobs:
        embed_and_upload(jobs)
        print("\nAll done! You can now chat with your AI backend and it will recommend these real jobs!")
    else:
        print("No jobs found for that search term.")

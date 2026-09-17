import re

with open("data/upload_jobs.py", "r") as f:
    content = f.read()

new_embed = """def embed_and_upload(jobs):
    print("\\n2. Sending jobs to the AI Engine for ingestion...")
    import requests
    try:
        response = requests.post("http://localhost:8000/api/ingest", json=jobs)
        response.raise_for_status()
        print("-> Successfully ingested jobs via the AI Engine API!")
    except Exception as e:
        print(f"Error during ingestion: {e}")
"""

content = re.sub(r'def embed_and_upload\(jobs\):.*?print\("No jobs found for that search term."\)', new_embed + '\nif __name__ == "__main__":\n    search = "Frontend Developer"\n    jobs = fetch_adzuna_jobs(search)\n    if jobs:\n        embed_and_upload(jobs)\n        print("\\nAll done!")\n    else:\n        print("No jobs found.")', content, flags=re.DOTALL)

with open("data/upload_jobs.py", "w") as f:
    f.write(content)

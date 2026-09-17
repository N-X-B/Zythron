from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv
from pinecone import Pinecone
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="Career & Livelihood Agent API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INITIALIZE DATABASES & AI ---
try:
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    pinecone_index = pc.Index("hackathon-jobs") 
except Exception as e:
    print(f"Pinecone Error: {e}")

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
llm_model = genai.GenerativeModel('gemini-1.5-flash')

# --- DATA MODELS ---
class UserProfile(BaseModel):
    user_id: str
    skills: List[str]
    location: str
    preferred_language: str = "en"

class JobRecommendation(BaseModel):
    title: str
    company: str
    location: str
    match_score: float
    required_skills: List[str]
    missing_skills: List[str]

class ChatRequest(BaseModel):
    user_id: str
    message: str
    language: str = "en"

class JoinMeetingRequest(BaseModel):
    meeting_url: str
    bot_name: str = "Career Agent Bot"

# --- ENDPOINTS ---
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Career Agent Core Engine is running."}

@app.post("/api/join-meeting")
def join_meeting(request: JoinMeetingRequest):
    import requests
    api_key = os.getenv("MEETING_BAAS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="MEETING_BAAS_API_KEY not configured in backend.")
    
    url = "https://api.meetingbaas.com/v2/bots"
    headers = {
        "x-meeting-baas-api-key": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "meeting_url": request.meeting_url,
        "bot_name": request.bot_name,
        "transcription_enabled": True
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MeetingBaaS Error: {str(e)}")

@app.post("/api/match-jobs", response_model=List[JobRecommendation])
def match_jobs(profile: UserProfile):
    return [
        JobRecommendation(
            title="Junior Frontend Developer", company="TechCorp India",
            location="Remote", match_score=0.85,
            required_skills=["React", "Tailwind", "JavaScript"],
            missing_skills=["Next.js"]
        )
    ]

@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    try:
        # 1. Turn user message into a vector using Gemini Embeddings
        embedding_resp = genai.embed_content(
            model="models/gemini-embedding-2",
            content=request.message,
            task_type="retrieval_query"
        )
        vector = embedding_resp['embedding']

        # 2. Search Pinecone for jobs that match the vector
        # (This will safely return empty if Member 2 hasn't uploaded data yet)
        search_results = pinecone_index.query(vector=vector, top_k=3, include_metadata=True)
        
        # 3. Format the retrieved job data into a context string
        context = "Here are some relevant jobs from our database:\n"
        if 'matches' in search_results and len(search_results['matches']) > 0:
            for match in search_results['matches']:
                meta = match.get('metadata', {})
                context += f"- Job: {meta.get('title', 'Unknown')} at {meta.get('company', 'Unknown')}. Skills: {meta.get('skills', 'N/A')}\n"
        else:
            context = "No specific jobs found in the database yet. Give general career advice."

        # 4. Generate the AI Response
        prompt = f"""You are a helpful, professional Career Guidance Agent for a hackathon project. 
        Use the following job database context to answer the user's question. 
        If the context doesn't have relevant jobs, offer general, encouraging career advice.
        
        Context from our Database:
        {context}
        
        User's Message: {request.message}
        """
        
        response = llm_model.generate_content(prompt)
        
        return {
            "reply": response.text,
            "language_detected": request.language
        }
    except Exception as e:
        return {"reply": f"AI Engine Error: {str(e)}", "language_detected": request.language}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

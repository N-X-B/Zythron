from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv
from pinecone import Pinecone

# Load environment variables
load_dotenv()

app = FastAPI(title="Career & Livelihood Agent API", version="1.0")

# Setup CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INITIALIZE VECTOR DB ---
try:
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    # The name of the index Member 2 will upload to
    pinecone_index = pc.Index("hackathon-jobs") 
    print("✅ Successfully connected to Pinecone!")
except Exception as e:
    print(f"⚠️ Pinecone Connection Error: {e}")


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

# --- ENDPOINTS ---
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Career Agent Core Engine is running."}

@app.post("/api/match-jobs", response_model=List[JobRecommendation])
def match_jobs(profile: UserProfile):
    """
    Called by Frontend to generate the Adaptive Roadmap.
    """
    # TODO: Turn profile.skills into a vector and query Pinecone
    
    # Mock data to unblock frontend
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
    """
    Core AI Logic: RAG Pipeline
    1. Turn user message into vector
    2. Search Pinecone for relevant jobs/schemes
    3. Send job data + user message to LLM (Gemini)
    """
    
    # --- RAG PIPELINE PLACEHOLDER ---
    # Once Member 2 pushes data to Pinecone, we will uncomment this logic:
    
    # 1. user_vector = get_gemini_embedding(request.message)
    # 2. search_results = pinecone_index.query(vector=user_vector, top_k=3, include_metadata=True)
    # 3. context = format_results(search_results)
    # 4. final_reply = call_gemini_agent(prompt=request.message, context=context)
    
    return {
        "reply": f"Hello! You said: '{request.message}'. I have successfully connected to our Vector Database. I am waiting for Member 2 to upload the job data, and for our Gemini API key to activate my brain!",
        "language_detected": request.language
    }

if __name__ == "__main__":
    print("Starting the Core Engine API on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

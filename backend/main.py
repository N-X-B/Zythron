from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables (API Keys, etc.)
load_dotenv()

app = FastAPI(title="Career & Livelihood Agent API", version="1.0")

# Allow Frontend (Member 3) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS (Contracts for Member 2 & 3) ---

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
    Member 3 (Frontend) will call this to generate the Adaptive Roadmap.
    Currently returns mock data. We will connect this to Pinecone/Qdrant later.
    """
    # MOCK RESPONSE to unblock frontend
    mock_jobs = [
        JobRecommendation(
            title="Junior Frontend Developer",
            company="TechCorp India",
            location="Remote",
            match_score=0.85,
            required_skills=["React", "Tailwind", "JavaScript"],
            missing_skills=["Next.js"]
        ),
        JobRecommendation(
            title="Data Entry / Backend Support",
            company="GovTech Services",
            location=profile.location,
            match_score=0.70,
            required_skills=["Python", "Excel"],
            missing_skills=["FastAPI"]
        )
    ]
    return mock_jobs

@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    """
    Member 2 (Voice) and Member 3 (Frontend) will use this endpoint
    to send messages to the Antigravity Agent.
    """
    # TODO: Connect to actual Antigravity Agent via SDK
    return {
        "reply": f"Hello! I received your message: '{request.message}'. I am the Career Agent. I am currently operating in mock mode.",
        "language_detected": request.language
    }

if __name__ == "__main__":
    print("Starting the Core Engine API on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

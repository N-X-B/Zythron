import re

with open("backend/main.py", "r") as f:
    content = f.read()

models_code = """
class JoinMeetingRequest(BaseModel):
    meeting_url: str
    bot_name: str = "Career Agent Bot"
"""

endpoints_code = """
@app.post("/api/join-meeting")
def join_meeting(request: JoinMeetingRequest):
    import requests
    import os
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
"""

# Insert models
content = content.replace("class ChatRequest(BaseModel):", models_code + "\nclass ChatRequest(BaseModel):")

# Insert endpoints
content = content.replace("@app.get(\"/\")", endpoints_code + "\n@app.get(\"/\")")

with open("backend/main.py", "w") as f:
    f.write(content)

print("Injected Member 2's code successfully.")

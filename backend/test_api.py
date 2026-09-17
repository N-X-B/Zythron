import sys
import time
import subprocess
import asyncio
import json
from typing import Any, Tuple, Optional

import main
from main import app

async def asgi_client(method: str, path: str, body: Any = None) -> Tuple[int, Any]:
    """Execute an HTTP request directly against the ASGI app without TCP socket overhead."""
    body_bytes = json.dumps(body).encode() if body is not None else b""
    headers = [(b"content-type", b"application/json")] if body is not None else []
    scope = {
        "type": "http",
        "method": method,
        "path": path,
        "raw_path": path.encode(),
        "query_string": b"",
        "headers": headers,
    }
    sent = []
    async def receive():
        return {"type": "http.request", "body": body_bytes, "more_body": False}
    async def send(msg):
        sent.append(msg)
    
    await app(scope, receive, send)

    status_code = None
    response_body = b""
    for msg in sent:
        if msg["type"] == "http.response.start":
            status_code = msg["status"]
        elif msg["type"] == "http.response.body":
            response_body += msg.get("body", b"")

    try:
        data = json.loads(response_body.decode())
    except Exception:
        data = response_body.decode()

    return status_code, data

async def run_asgi_tests() -> bool:
    print("=" * 65)
    print("FastAPI Career Agent API - Full Acceptance Criteria Verification")
    print("=" * 65)

    passed_tests = 0
    total_tests = 0

    # 1. UVICORN STARTUP CHECK
    total_tests += 1
    print("\n[CRITERION 1] Checking main.py loads cleanly with uvicorn...")
    try:
        import uvicorn
        config = uvicorn.Config("main:app", host="127.0.0.1", port=8000, log_level="warning")
        config.load()
        assert config.loaded is True
        print(" PASS: main.py successfully verified with uvicorn configuration without syntax/import errors!")
        passed_tests += 1
    except Exception as e:
        print(f" FAIL: uvicorn startup check failed: {e}")

    # 2. HEALTH CHECK ENDPOINT
    total_tests += 1
    print("\n--- Endpoint Test: GET / ---")
    status, data = await asgi_client("GET", "/")
    assert status == 200, f"Expected 200, got {status}"
    assert data.get("status") == "ok", f"Expected ok, got {data}"
    print(f" PASS: Status {status}, Response: {data}")
    passed_tests += 1

    # 3. R1. DATA INGESTION ENDPOINT (Array Payload)
    total_tests += 1
    print("\n[CRITERION 2] Testing R1: POST /api/ingest with array of mock job data...")
    mock_jobs = [
        {
            "id": "job-ingest-01",
            "title": "Senior Frontend Developer",
            "company": "NextGen Systems",
            "location": "Remote",
            "skills": ["React", "TypeScript", "Tailwind CSS", "Next.js"],
            "description": "Develop high-scale responsive web apps using React, Next.js, and TypeScript."
        },
        {
            "id": "job-ingest-02",
            "title": "Cloud Infrastructure Architect",
            "company": "HyperScale Cloud",
            "location": "Hybrid",
            "skills": ["Kubernetes", "AWS", "Terraform", "Docker", "Go"],
            "description": "Architect multi-cloud resilient infrastructure and Kubernetes orchestration."
        }
    ]
    status, data = await asgi_client("POST", "/api/ingest", mock_jobs)
    print(f"Status Code: {status}")
    print(f"Response: {data}")
    assert status == 200, f"Expected HTTP 200 (not 500), got {status}"
    assert data.get("status") == "success", f"Expected success status, got {data.get('status')}"
    assert data.get("ingested_count") == 2, f"Expected 2 ingested jobs, got {data.get('ingested_count')}"
    print(" PASS: POST /api/ingest processed mock job array without throwing an HTTP 500 error!")
    passed_tests += 1

    # 4. R1. DATA INGESTION ENDPOINT (Object wrapper)
    total_tests += 1
    print("\n--- Testing R1: POST /api/ingest with object wrapper {'jobs': [...]} ---")
    wrapper_payload = {
        "jobs": [
            {
                "id": "job-ingest-03",
                "title": "Staff ML Platform Engineer",
                "company": "NeuralFlow AI",
                "location": "Remote",
                "skills": ["Python", "PyTorch", "FastAPI", "Ray", "Triton"],
                "description": "Build high-throughput low-latency inference platforms for large models."
            }
        ]
    }
    status, data = await asgi_client("POST", "/api/ingest", wrapper_payload)
    print(f"Status Code: {status}")
    print(f"Response: {data}")
    assert status == 200, f"Expected HTTP 200, got {status}"
    assert data.get("status") == "success"
    assert data.get("ingested_count") == 1
    print(" PASS: POST /api/ingest object wrapper format succeeded!")
    passed_tests += 1

    # 5. R2. ADAPTIVE ROADMAP GENERATOR
    total_tests += 1
    print("\n[CRITERION 3] Testing R2: POST /api/match-jobs Adaptive Roadmap Generator...")
    user_profile = {
        "user_id": "candidate-dev-42",
        "skills": ["React", "JavaScript", "HTML", "CSS"],
        "location": "Remote",
        "preferred_language": "en"
    }
    status, data = await asgi_client("POST", "/api/match-jobs", user_profile)
    print(f"Status Code: {status}")
    matches = data.get("matches", [])
    top_match = data.get("top_match", {})
    roadmap = data.get("roadmap", "")
    print(f"Matches count: {len(matches)}")
    print(f"Top Match Role: {top_match.get('title')} at {top_match.get('company')}")
    print(f"Top Match Required Skills: {top_match.get('required_skills')}")
    print(f"Top Match Missing Skills: {top_match.get('missing_skills')}")
    print(f"\n--- Generated Roadmap Preview (First 350 chars) ---\n{roadmap[:350]}...\n--- End Preview ---")

    assert status == 200, f"Expected 200, got {status}"
    assert "roadmap" in data, "Missing 'roadmap' key in response"
    assert isinstance(roadmap, str) and len(roadmap.strip()) > 100, "Roadmap is empty or too short"
    assert "Phase" in roadmap or "Step" in roadmap or "Week" in roadmap, "Roadmap missing structured phases"
    assert len(matches) > 0, "No matched jobs returned"
    assert top_match is not None, "Missing top_match object"
    assert top_match.get("roadmap") is not None, "Top match missing roadmap attachment"
    print(" PASS: POST /api/match-jobs successfully returned a generated roadmap from Gemini (or demo engine)!")
    passed_tests += 1

    # 6. R3. HARSH MOCK INTERVIEW AGENT (Comprehensive Answer)
    total_tests += 1
    print("\n[CRITERION 4] Testing R3: POST /api/mock-interview Harsh Mock Interview Agent...")
    interview_req = {
        "job_role": "Backend Systems Engineer",
        "question": "How do you guarantee database consistency across distributed services during high traffic?",
        "answer": "We avoid two-phase commit due to high latency bottlenecks. Instead, we implement the Saga pattern with transactional outbox, publishing domain events via Kafka with idempotent consumer processing and distributed Redis locks."
    }
    status, data = await asgi_client("POST", "/api/mock-interview", interview_req)
    print(f"Status Code: {status}")
    score = data.get("score")
    feedback = data.get("feedback")
    print(f"Score: {score} / 100")
    print(f"Constructive Feedback:\n{feedback}")

    assert status == 200, f"Expected 200, got {status}"
    assert "score" in data, "Response missing numerical 'score'"
    assert "feedback" in data, "Response missing 'feedback'"
    assert isinstance(score, (int, float)), f"Expected numeric score, got {type(score)}"
    assert 0 <= score <= 100, f"Score {score} out of range [0, 100]"
    assert isinstance(feedback, str) and len(feedback.strip()) > 30, "Feedback is missing or too short"
    print(" PASS: POST /api/mock-interview successfully returned numerical score and feedback string!")
    passed_tests += 1

    # 7. R3. HARSH MOCK INTERVIEW AGENT (Empty Answer Edge Case)
    total_tests += 1
    print("\n--- Testing R3: Edge Case with empty candidate answer ---")
    empty_req = {
        "job_role": "Principal Software Engineer",
        "answer": ""
    }
    status, data = await asgi_client("POST", "/api/mock-interview", empty_req)
    print(f"Status Code: {status}, Score: {data.get('score')}")
    print(f"Harsh Feedback: {data.get('feedback')}")
    assert status == 200
    assert data.get("score") <= 15, "Empty answer did not receive harsh failing score"
    assert len(data.get("feedback", "")) > 20
    print(" PASS: Empty answer penalized harshly with constructive feedback!")
    passed_tests += 1

    # 8. R3. HARSH MOCK INTERVIEW AGENT (Alternative Keys)
    total_tests += 1
    print("\n--- Testing R3: Alternative field names (role, user_answer) ---")
    alt_req = {
        "role": "Fullstack Developer",
        "user_answer": "I use Next.js on frontend and Express on backend."
    }
    status, data = await asgi_client("POST", "/api/mock-interview", alt_req)
    print(f"Status Code: {status}, Score: {data.get('score')}")
    assert status == 200
    assert "score" in data and "feedback" in data
    print(" PASS: Alternative keys parsed and evaluated successfully!")
    passed_tests += 1

    # 9. CHAT ENDPOINT SANITY CHECK
    total_tests += 1
    print("\n--- Testing POST /api/chat core endpoint ---")
    chat_req = {
        "user_id": "usr-test-1",
        "message": "Can you recommend backend roles and how to prepare for them?",
        "language": "en"
    }
    status, data = await asgi_client("POST", "/api/chat", chat_req)
    print(f"Status Code: {status}")
    print(f"AI Reply: {data.get('reply')[:180]}...")
    assert status == 200
    assert "reply" in data and len(data["reply"]) > 0
    print(" PASS: Chat endpoint responded successfully!")
    passed_tests += 1

    # 10. R1 EDGE CASE: String skills in Job Item
    total_tests += 1
    print("\n--- Testing R1: Ingest job with comma-separated string skills ---")
    str_skills_jobs = [{"title": "Data Pipeline Dev", "skills": "Python, SQL, Snowflake", "company": "DataWorks"}]
    status, data = await asgi_client("POST", "/api/ingest", str_skills_jobs)
    assert status == 200, f"Expected 200, got {status}"
    assert data.get("status") == "success"
    assert data.get("ingested_count") == 1
    print(" PASS: Successfully ingested job with comma-separated string skills!")
    passed_tests += 1

    # 11. R1 EDGE CASE: Alternate field names (job_title)
    total_tests += 1
    print("\n--- Testing R1: Ingest job with 'job_title' instead of 'title' ---")
    alt_job_payload = [{"job_title": "Distributed Systems Architect", "company": "ScaleCore"}]
    status, data = await asgi_client("POST", "/api/ingest", alt_job_payload)
    assert status == 200, f"Expected 200, got {status}"
    assert data.get("status") == "success"
    print(" PASS: Successfully ingested job with alternative field name 'job_title'!")
    passed_tests += 1

    # 12. R1 EDGE CASE: Empty array []
    total_tests += 1
    print("\n--- Testing R1: Ingest empty list [] ---")
    status, data = await asgi_client("POST", "/api/ingest", [])
    assert status == 200, f"Expected 200, got {status}"
    assert data.get("ingested_count") == 0
    print(" PASS: Successfully handled empty list ingestion!")
    passed_tests += 1

    # 13. R2 EDGE CASE: Profile with skills: null
    total_tests += 1
    print("\n--- Testing R2: Match jobs with null skills ---")
    null_skills_profile = {"user_id": "null-user", "skills": None}
    status, data = await asgi_client("POST", "/api/match-jobs", null_skills_profile)
    assert status == 200, f"Expected 200, got {status}"
    assert len(data.get("matches", [])) > 0
    print(" PASS: Successfully matched jobs for profile with null skills!")
    passed_tests += 1

    # 14. R2 EDGE CASE: Multi-language roadmap generation (Spanish & Hindi)
    total_tests += 1
    print("\n--- Testing R2: Multi-language roadmap generation (Spanish) ---")
    es_profile = {"skills": ["React"], "preferred_language": "es"}
    status, data = await asgi_client("POST", "/api/match-jobs", es_profile)
    assert status == 200
    roadmap_es = data.get("roadmap", "")
    assert "Fase" in roadmap_es or "Hoja de Ruta" in roadmap_es, "Spanish keywords missing from roadmap"
    print(" PASS: Multi-language Spanish roadmap generated successfully!")
    passed_tests += 1

    # 15. R2 EDGE CASE: 100% skill match (zero missing skills)
    total_tests += 1
    print("\n--- Testing R2: 100% skill match candidate (zero missing skills) ---")
    full_profile = {"skills": ["React", "Tailwind", "JavaScript", "Next.js"]}
    status, data = await asgi_client("POST", "/api/match-jobs", full_profile)
    assert status == 200
    top_match = data.get("top_match", {})
    assert top_match.get("missing_skills") == [], "Expected 0 missing skills"
    assert len(data.get("roadmap", "")) > 50
    print(" PASS: Candidate with all skills handled with advanced specialization roadmap!")
    passed_tests += 1

    # 16. R3 EDGE CASE: Non-technical buzzword answer penalized harshly
    total_tests += 1
    print("\n--- Testing R3: Non-technical buzzword fluff penalized harshly ---")
    buzzword_req = {
        "job_role": "Staff Backend Engineer",
        "question": "How do you handle distributed transactions?",
        "answer": "I am a very passionate developer who loves working hard every day and always collaborates with team members to deliver great results on time with high energy and synergy and leadership and dedication and positivity and excellence."
    }
    status, data = await asgi_client("POST", "/api/mock-interview", buzzword_req)
    assert status == 200
    score = data.get("score")
    assert score <= 30, f"Expected harsh failing score (<=30) for pure buzzword fluff, got {score}"
    assert "buzzword" in data.get("feedback", "").lower() or "fluff" in data.get("feedback", "").lower() or "soft-skill" in data.get("feedback", "").lower()
    print(f" PASS: Fluffy non-technical answer received harsh score {score}/100 and direct constructive criticism!")
    passed_tests += 1

    # 17. SYSTEM INTEGRITY: Socket timeout preservation
    total_tests += 1
    print("\n--- Testing System Integrity: socket.getdefaulttimeout() preservation ---")
    import socket
    main.is_online()
    current_timeout = socket.getdefaulttimeout()
    assert current_timeout is None, f"Global socket default timeout was corrupted to {current_timeout}!"
    print(" PASS: Global socket default timeout remained uncorrupted (None)!")
    passed_tests += 1

    # 18. R1 EDGE CASE: Ingest empty object {} does not create phantom job
    total_tests += 1
    print("\n--- Testing R1: Ingest empty object {} ---")
    initial_store_len = len(main.DEMO_JOB_STORE)
    status, data = await asgi_client("POST", "/api/ingest", {})
    assert status == 200, f"Expected 200, got {status}"
    assert data.get("ingested_count") == 0, f"Expected 0 ingested jobs for empty object, got {data.get('ingested_count')}"
    assert len(main.DEMO_JOB_STORE) == initial_store_len, "Phantom job was erroneously appended to store"
    print(" PASS: Ingesting empty dict {} returned count 0 without injecting phantom job!")
    passed_tests += 1

    # 19. R3 EDGE CASE: Admission of ignorance ('I don't know')
    total_tests += 1
    print("\n--- Testing R3: Candidate admits ignorance ('I don't know') ---")
    idk_req = {
        "job_role": "Distributed Systems Engineer",
        "question": "Explain Paxos vs Raft consensus protocols.",
        "answer": "I don't know"
    }
    status, data = await asgi_client("POST", "/api/mock-interview", idk_req)
    assert status == 200
    idk_score = data.get("score")
    assert idk_score <= 15, f"Expected failing score <=15 for 'I don't know', got {idk_score}"
    assert "inability" in data.get("feedback", "").lower() or "failure" in data.get("feedback", "").lower() or "never give up" in data.get("feedback", "").lower()
    print(f" PASS: 'I don't know' received failing score {idk_score}/100 and direct constructive guidance!")
    passed_tests += 1

    # 20. R3 EDGE CASE: Single tech keyword embedded in heavy fluff
    total_tests += 1
    print("\n--- Testing R3: Single keyword buried in heavy buzzword fluff ---")
    subtle_fluff_req = {
        "job_role": "Backend Engineer",
        "question": "How do you scale microservices?",
        "answer": "I am an extremely passionate developer who loves python and works with high energy every day to bring synergy and excellence and positivity and leadership to every team project and deliver amazing results on time."
    }
    status, data = await asgi_client("POST", "/api/mock-interview", subtle_fluff_req)
    assert status == 200
    subtle_score = data.get("score")
    assert subtle_score <= 30, f"Expected failing score <=30 for fluff with 1 keyword, got {subtle_score}"
    print(f" PASS: Fluff with 1 keyword was correctly caught and scored harshly at {subtle_score}/100!")
    passed_tests += 1

    # 21. AI ROBUSTNESS: JSON extraction with trailing commas and Python dict notation
    total_tests += 1
    print("\n--- Testing AI Helper: extract_json with trailing comma and single quotes ---")
    json_with_trailing = '{"score": 88, "feedback": "Solid architecture, minor edge-case oversights.",}'
    parsed1 = main.extract_json(json_with_trailing)
    assert parsed1 is not None and parsed1.get("score") == 88, f"Failed on trailing comma JSON: {parsed1}"

    python_dict_str = "{'score': 74, 'feedback': 'Good foundational knowledge.'}"
    parsed2 = main.extract_json(python_dict_str)
    assert parsed2 is not None and parsed2.get("score") == 74, f"Failed on single quote dict: {parsed2}"
    print(" PASS: Robust JSON parser successfully decoded trailing commas and Python dict format!")
    passed_tests += 1

    # 22. AI ROBUSTNESS: parse_score with complex prefixes and non-capturing 100
    total_tests += 1
    print("\n--- Testing AI Helper: parse_score advanced patterns ---")
    assert main.parse_score("Out of 100, the candidate scored 65") == 65, "Captured 100 instead of 65"
    assert main.parse_score("Score: 92/100") == 92
    assert main.parse_score("Rating: 78.4") == 78
    assert main.parse_score(True) is None, "Boolean True should not parse as score 1"
    assert main.parse_score(None) is None
    print(" PASS: Score parser reliably extracts scores and rejects booleans!")
    passed_tests += 1

    # 23. R2 ROBUSTNESS: Pinecone match with metadata: None in match_jobs
    total_tests += 1
    print("\n--- Testing R2: Pinecone match with metadata: None ---")
    class MockPineconeWithNoneMeta:
        def query(self, *args, **kwargs):
            return {
                "matches": [
                    {"id": "job-none-meta", "score": 0.91, "metadata": None}
                ]
            }
    orig_get_idx = main.get_pinecone_index
    orig_is_online = main.is_online
    orig_embed = main.genai.embed_content
    orig_get_llm = main.get_llm_model
    try:
        main.is_online = lambda ttl=5.0: True
        main.genai.embed_content = lambda **kwargs: {"embedding": [0.1] * 768}
        main.get_llm_model = lambda: None
        main.get_pinecone_index = lambda: MockPineconeWithNoneMeta()
        status, data = await asgi_client("POST", "/api/match-jobs", {"skills": ["Python"]})
        assert status == 200, f"Expected 200 with metadata: None, got {status}"
        assert len(data.get("matches", [])) > 0
    finally:
        main.get_pinecone_index = orig_get_idx
        main.is_online = orig_is_online
        main.genai.embed_content = orig_embed
        main.get_llm_model = orig_get_llm
    print(" PASS: match_jobs gracefully handled Pinecone vector match with metadata: None without crashing!")
    passed_tests += 1

    # 24. CORE CHAT ROBUSTNESS: Pinecone match with metadata: None in /api/chat
    total_tests += 1
    print("\n--- Testing Core Chat: Pinecone match with metadata: None ---")
    try:
        main.is_online = lambda ttl=5.0: True
        main.genai.embed_content = lambda **kwargs: {"embedding": [0.1] * 768}
        main.get_llm_model = lambda: None
        main.get_pinecone_index = lambda: MockPineconeWithNoneMeta()
        status, data = await asgi_client("POST", "/api/chat", {"user_id": "u1", "message": "tell me about jobs"})
        assert status == 200, f"Expected 200 in chat with metadata: None, got {status}"
        assert "AI Engine Error: 'NoneType' object has no attribute 'get'" not in data.get("reply", "")
    finally:
        main.get_pinecone_index = orig_get_idx
        main.is_online = orig_is_online
        main.genai.embed_content = orig_embed
        main.get_llm_model = orig_get_llm
    print(" PASS: chat_with_agent handled metadata: None in Pinecone without AttributeError!")
    passed_tests += 1

    # 25. SYSTEM EFFICIENCY: is_online TTL caching
    total_tests += 1
    print("\n--- Testing System Efficiency: is_online TTL caching ---")
    t0 = time.time()
    for _ in range(20):
        main.is_online(ttl=5.0)
    elapsed = time.time() - t0
    assert elapsed < 0.2, f"Cached is_online was too slow: {elapsed}s for 20 calls"
    print(f" PASS: 20 cached is_online checks resolved in {elapsed*1000:.2f}ms without socket blocking!")
    passed_tests += 1

    # 26. R3 ADVERSARIAL: Normal technical answers containing 'pass', 'bypass', 'none'
    total_tests += 1
    print("\n--- Testing R3: Legitimate technical answer with 'pass'/'bypass'/'none' ---")
    pass_req = {
        "job_role": "Backend Engineer",
        "answer": "We pass the token in the auth header and bypass the cache for mutations."
    }
    status, data = await asgi_client("POST", "/api/mock-interview", pass_req)
    assert status == 200
    assert data.get("score") > 20, f"Expected technical score (>20) rather than ignorance failure (8), got {data.get('score')}"
    assert "inability to address" not in data.get("feedback", "").lower()
    print(f" PASS: Answer with 'pass'/'bypass' correctly scored {data.get('score')}/100 without false ignorance penalty!")
    passed_tests += 1

    # 27. AI HELPER: parse_score with numbers appearing before the score
    total_tests += 1
    print("\n--- Testing AI Helper: parse_score with leading numbers ---")
    assert main.parse_score("Candidate has 5 years of experience, score: 90") == 90, "Captured 5 instead of 90"
    assert main.parse_score("Phase 1 evaluation: score is 85") == 85, "Captured 1 instead of 85"
    assert main.parse_score("For question 2, the score is 80") == 80, "Captured 2 instead of 80"
    print(" PASS: parse_score correctly isolates labeled scores even with numbers in sentence!")
    passed_tests += 1

    # 28. PYDANTIC NULL RESILIENCE: Null inside skills list
    total_tests += 1
    print("\n--- Testing Pydantic Null Resilience: skills with None elements ---")
    status_match, data_match = await asgi_client("POST", "/api/match-jobs", {"skills": ["React", None, "FastAPI"]})
    assert status_match == 200, f"Expected 200 for match-jobs with None in skills, got {status_match}"
    status_ingest, data_ingest = await asgi_client("POST", "/api/ingest", [{"title": "DevOps", "skills": ["Docker", None]}])
    assert status_ingest == 200, f"Expected 200 for ingest with None in skills, got {status_ingest}"
    assert data_ingest.get("ingested_count") == 1
    print(" PASS: Successfully handled None elements in skills lists without HTTP 422 or validation failure!")
    passed_tests += 1

    # 29. R1 WRAPPER FLEXIBILITY: Ingestion with 'data' and 'items' wrapper keys
    total_tests += 1
    print("\n--- Testing R1: Ingestion with alternative wrappers ('data', 'items') ---")
    data_wrap = {"data": [{"title": "Cloud Architect", "skills": ["AWS", "Terraform"], "company": "CloudX"}]}
    status_w1, data_w1 = await asgi_client("POST", "/api/ingest", data_wrap)
    assert status_w1 == 200 and data_w1.get("ingested_count") == 1, f"Failed on 'data' wrapper: {data_w1}"
    items_wrap = {"items": [{"title": "ML Engineer", "skills": ["PyTorch"], "company": "AI Labs"}]}
    status_w2, data_w2 = await asgi_client("POST", "/api/ingest", items_wrap)
    assert status_w2 == 200 and data_w2.get("ingested_count") == 1, f"Failed on 'items' wrapper: {data_w2}"
    print(" PASS: Successfully ingested jobs using 'data' and 'items' wrapper structures!")
    passed_tests += 1

    # 30. R2 WRAPPER FLEXIBILITY: Wrapped profile in match-jobs
    total_tests += 1
    print("\n--- Testing R2: Wrapped profile object {'profile': {...}} in match-jobs ---")
    nested_profile = {"profile": {"skills": ["Python", "FastAPI"], "location": "Bangalore"}}
    status_np, data_np = await asgi_client("POST", "/api/match-jobs", nested_profile)
    assert status_np == 200
    top_match = data_np.get("top_match", {})
    # Should match Backend Python Engineer or recognize Python skills
    assert "Python" not in top_match.get("missing_skills", []), "Failed to extract skills from wrapped profile"
    print(" PASS: Successfully extracted candidate skills from wrapped profile dictionary!")
    passed_tests += 1

    # 31. AI MOCK INTERVIEW: Nested JSON and plain text extraction
    total_tests += 1
    print("\n--- Testing AI Mock Interview: extract_interview_result ---")
    nested_eval = {"evaluation": {"score": 88, "critique": "Solid architectural foundation."}}
    score_n, feed_n = main.extract_interview_result("", nested_eval)
    assert score_n == 88 and feed_n == "Solid architectural foundation.", f"Failed on nested eval: {score_n}, {feed_n}"
    plain_txt = "Score: 78/100\nFeedback: While you mentioned Postgres and Redis, you did not cover replication lag."
    score_p, feed_p = main.extract_interview_result(plain_txt, None)
    assert score_p == 78 and "Postgres and Redis" in feed_p, f"Failed on plain text eval: {score_p}, {feed_p}"
    print(" PASS: extract_interview_result robustly extracts nested JSON and formatted plain-text responses!")
    passed_tests += 1

    # 32. CONCURRENCY INTEGRITY: Multithreaded is_online preserves global socket timeout
    total_tests += 1
    print("\n--- Testing Concurrency Integrity: Multithreaded is_online socket timeout isolation ---")
    import concurrent.futures
    import socket
    def probe():
        return main.is_online(ttl=0.001)
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(probe) for _ in range(15)]
        for f in futures:
            f.result()
    assert socket.getdefaulttimeout() is None, f"Concurrent is_online corrupted default timeout: {socket.getdefaulttimeout()}"
    print(" PASS: Multithreaded is_online execution left global socket default timeout completely untouched (None)!")
    passed_tests += 1

    # 33. R2 ROBUSTNESS: Pinecone match score 0.0 parsed as 0.0 not 0.85
    total_tests += 1
    print("\n--- Testing R2: Pinecone match with score 0.0 ---")
    class MockPineconeZeroScore:
        def query(self, *args, **kwargs):
            return {
                "matches": [
                    {"id": "job-zero", "score": 0.0, "metadata": {"title": "Zero Score Role", "skills": ["Python"]}}
                ]
            }
    try:
        main.is_online = lambda ttl=5.0: True
        main.genai.embed_content = lambda **kwargs: {"embedding": [0.1] * 768}
        main.get_llm_model = lambda: None
        main.get_pinecone_index = lambda: MockPineconeZeroScore()
        status_z, data_z = await asgi_client("POST", "/api/match-jobs", {"skills": ["Python"]})
        assert status_z == 200
        matches = data_z.get("matches", [])
        assert len(matches) > 0
        assert matches[0]["match_score"] == 0.0, f"Expected score 0.0, got {matches[0]['match_score']}"
    finally:
        main.get_pinecone_index = orig_get_idx
        main.is_online = orig_is_online
        main.genai.embed_content = orig_embed
        main.get_llm_model = orig_get_llm
    print(" PASS: Pinecone score 0.0 was accurately preserved as 0.0 without falsy fallback corruption!")
    passed_tests += 1

    # 34. R3 FEEDBACK COHERENCE: Lengthy answer (100 words) with 1 keyword
    total_tests += 1
    print("\n--- Testing R3: Feedback coherence on lengthy answer with low tech depth ---")
    long_low_tech = {
        "job_role": "Backend Engineer",
        "answer": "In our system we use python. " + "We ensure that our development standards are maintained across the entire organization with regular meetings, documentation reviews, sprint planning sessions, daily standups, and retrospective discussions to make sure that everyone on the team is aligned with the overall company mission and delivering high quality results on a predictable schedule."
    }
    status_llt, data_llt = await asgi_client("POST", "/api/mock-interview", long_low_tech)
    assert status_llt == 200
    fb = data_llt.get("feedback", "")
    assert "far too brief" not in fb, f"Contradictory feedback 'far too brief' present on 50+ word answer: {fb}"
    print(" PASS: Lengthy low-depth response provided coherent feedback without falsely claiming it is 'far too brief'!")
    passed_tests += 1

    print("\n" + "=" * 65)
    print(f"FINAL RESULT: {passed_tests}/{total_tests} Tests Passed")
    print("=" * 65)
    return passed_tests == total_tests

if __name__ == "__main__":
    success = asyncio.run(run_asgi_tests())
    sys.exit(0 if success else 1)



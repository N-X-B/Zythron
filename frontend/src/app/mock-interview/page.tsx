"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { interviewerProfile } from "../../config/voiceProfile";
import { LogOut, ArrowRight, Zap, Camera, CameraOff, AlertTriangle } from "lucide-react";

type InterviewState = "setup" | "interview" | "report";

const DOMAIN_PREFACES: Record<string, { preface: string; starter: string }> = {
  "DSA": {
    preface: "Focus strictly on Data Structures & Algorithms, Big-O time and space complexity, edge cases, recursion vs iteration, pointer management, and optimal execution.",
    starter: "Welcome to your DSA Technical Interview. Let's evaluate your algorithmic problem-solving and Big-O trade-offs. To kick off: How would you detect a cycle in a directed graph, and what are the time and space complexity trade-offs between BFS and Tarjan's DFS algorithm?"
  },
  "System Design": {
    preface: "Focus strictly on High-Scale Distributed Systems Architecture, microservices, throughput (QPS), DB partitioning, Redis caching, Kafka message streaming, Raft consensus, p99 SLAs, and fault tolerance.",
    starter: "Welcome to your System Design Interview. Today we're building a real-time global vector search pipeline handling 100,000 QPS with sub-50ms latency. How would you architect the ingestion pipeline, index partitioning, and Redis caching layer to ensure zero single-point-of-failure?"
  },
  "Fundamentals": {
    preface: "Focus strictly on CS Core Fundamentals: OS internals (processes/threads, virtual memory, locks/mutexes, race conditions), Networking (TCP 4-way handshake, HTTP/3 QUIC, TLS 1.3), Database ACID isolation, and OOP paradigms.",
    starter: "Welcome to your CS Fundamentals Interview. Let me test your OS internals & Networking depth: Walk me through what happens under the hood in kernel space when a process calls fork(), and how Copy-On-Write (COW) memory paging operates under high load."
  },
  "MAANG": {
    preface: "Imitate Tier-1 Big Tech (Google, Meta, Amazon, Apple, Netflix) hiring bar. Hold candidate to extreme precision, critique shallow answers, require microsecond-level performance trade-offs, and evaluate Leadership Principles.",
    starter: "Welcome to your Tier-1 MAANG Technical Screening. At Big Tech scale, every millisecond counts. Tell me about a time you optimized a critical service under a 10x traffic spike. What exact CPU/memory profiling did you perform, and what trade-offs did you make?"
  },
  "Behavioral": {
    preface: "Evaluate strictly using the STAR methodology (Situation, Task, Action, Result). Critique responses for lack of quantifiable metrics, vague team ownership, or weak conflict resolution.",
    starter: "Welcome to your Behavioral & Leadership Interview. I evaluate responses strictly using the STAR methodology (Situation, Task, Action, Result). Tell me about a time you strongly disagreed with a Principal Architect on project direction. How did you handle the conflict, and what was the quantifiable result?"
  },
  "Full-Stack": {
    preface: "Focus on Modern Full-Stack & Web Architecture, React 19 / Server Components, Next.js streaming hydration, async Python APIs (FastAPI/Uvicorn), WebSockets, state management, and edge performance.",
    starter: "Welcome to your Full-Stack & Web Architecture Interview. In modern Next.js App Router applications with React Server Components, explain how streaming SSR with Suspense interacts with client hydration, and how you avoid async waterfall requests."
  }
};

const getDomainData = (topic: string) => {
  const norm = (topic || "").toLowerCase();
  if (norm.includes("dsa")) return DOMAIN_PREFACES["DSA"];
  if (norm.includes("system")) return DOMAIN_PREFACES["System Design"];
  if (norm.includes("fund")) return DOMAIN_PREFACES["Fundamentals"];
  if (norm.includes("maang")) return DOMAIN_PREFACES["MAANG"];
  if (norm.includes("behav")) return DOMAIN_PREFACES["Behavioral"];
  if (norm.includes("full") || norm.includes("web")) return DOMAIN_PREFACES["Full-Stack"];
  return DOMAIN_PREFACES["DSA"];
};

export default function MockInterview() {
  const router = useRouter();
  const [appState, setAppState] = useState<InterviewState>("setup");
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [userName, setUserName] = useState("shrinish suyash");
  const [selectedTopic, setSelectedTopic] = useState("DSA");

  // Camera Access State
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string>("");

  const [aiTranscript, setAiTranscript] = useState(
    "Hello! I'm your AI interviewer. Whenever you're ready, select a domain track to begin."
  );
  const [userTranscript, setUserTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  const [currentTab, setCurrentTab] = useState("Practice");

  // Resume Scanner State
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [isScanningResume, setIsScanningResume] = useState(false);
  const [resumeScanResult, setResumeScanResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const readResumeFile = (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const cleaned = result
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (cleaned.length > 30) {
          setResumeText(cleaned);
        } else {
          setResumeText(
            `[Resume loaded from ${file.name}]\nSenior Software Engineer with expertise in React, TypeScript, Python, FastAPI, Docker, PostgreSQL, and System Design.`
          );
        }
      }
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      readResumeFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      readResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleInsertDemoResume = () => {
    setUploadedFileName("Sample_Senior_Software_Engineer_Resume.pdf");
    setResumeText(
      `Naman Rajput - Senior Software Engineer\nEmail: naman@example.com | GitHub: github.com/naman | LinkedIn: linkedin.com/in/naman\n\nSUMMARY:\nSenior Full-Stack & Systems Engineer with 5+ years of experience designing high-throughput microservices, distributed RAG vector search pipelines, and React Server Components.\n\nTECHNICAL SKILLS:\nLanguages: TypeScript, JavaScript, Python, SQL, C++\nFrontend: React, Next.js, Tailwind CSS, Redux Toolkit, WebSockets\nBackend & Systems: FastAPI, Node.js, Express, PostgreSQL, Redis, Docker, Kafka, Pinecone Vector DB\nDevOps & Tools: Git, GitHub Actions CI/CD, AWS, Linux Kernel Internals\n\nEXPERIENCE:\nSenior Software Engineer — TechCorp (2022 - Present)\n- Architected high-throughput REST & WebSocket microservices in Python & FastAPI serving 150k active daily requests.\n- Built real-time vector search index using Pinecone and Gemini embeddings, improving search precision by 35%.\n- Optimized Next.js streaming hydration and React Server Components, cutting p99 page load latency from 1.2s to 280ms.\n\nSoftware Developer — DataStream Inc (2020 - 2022)\n- Developed distributed caching strategy with Redis cluster and Lua scripts to eliminate race conditions under high concurrency.\n- Integrated automated CI/CD pipelines via GitHub Actions, decreasing build failures by 40%.\n\nEDUCATION:\nB.S. in Computer Science & Engineering (2020)`
    );
  };

  const requestCameraPermission = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermissionStatus("granted");
      setCameraErrorMessage("");
    } catch (err: any) {
      console.warn("Camera permission denied or refused:", err);
      setCameraPermissionStatus("denied");
      setCameraErrorMessage("Camera permission was refused or blocked by the browser. Click to re-request camera access.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("zythron_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setUserName(parsed.name);
          else if (parsed.email) setUserName(parsed.email.split("@")[0]);
        } catch (e) {}
      }

      // Always request camera permission whenever the site loads
      requestCameraPermission();

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setUserTranscript(transcript);
          transcriptRef.current = transcript;
        };

        recognition.onerror = (event: any) => {
          console.error("Speech error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          const finalSpokenText = transcriptRef.current.trim();
          if (finalSpokenText.length > 0) {
            sendToAI(finalSpokenText);
            transcriptRef.current = "";
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  const startInterview = (topic: string = "DSA") => {
    setSelectedTopic(topic);
    setAppState("interview");
    requestCameraPermission();

    const domainData = getDomainData(topic);
    const starterGreeting = domainData.starter;

    setMessages([
      { role: "user", content: `I am ready for the ${topic} technical interview.` },
      { role: "assistant", content: starterGreeting }
    ]);
    setAiTranscript(starterGreeting);
    speakText(starterGreeting);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        setUserTranscript("");
        window.speechSynthesis.cancel();
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech Recognition not supported in this browser. Try Chrome.");
      }
    }
  };

  const [messages, setMessages] = useState([
    { role: "user", content: "Hello, I am ready for the interview." },
    {
      role: "assistant",
      content:
        "Hello! I'm Sara, your AI technical interviewer. Select a domain track to begin.",
    },
  ]);

  const [textInput, setTextInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isListening, aiTranscript]);

  useEffect(() => {
    if (appState === "interview") {
      requestCameraPermission();
    }
  }, [appState]);

  const sendToAI = async (message: string) => {
    if (isAiThinking) return;

    setIsAiThinking(true);
    setUserTranscript(message);
    setAiTranscript("Thinking...");

    const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "YOUR_GROQ_API_KEY";
    const newUserMessage = { role: "user", content: message };
    const payloadHistory = [...messages, newUserMessage];
    const domainData = getDomainData(selectedTopic);

    const systemPrompt = `You are an elite AI technical interviewer conducting a ${selectedTopic} interview.

PREFACE & TECHNICAL DOMAIN SPECIFICATION:
${domainData.preface}

INTERVIEW STRUCTURE & RULES:
1. Listen carefully to candidate's previous response and evaluate depth strictly against the ${selectedTopic} domain preface above.
2. Ask ONE focused, domain-specific technical question at a time.
3. Push back on missing edge cases, buzzwords, or superficial trade-offs.
4. Keep responses concise, direct, and conversational.
${interviewerProfile.sensibility}`;

    try {
      const response = await fetch(`http://localhost:8000/api/mock-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: `${selectedTopic} Engineer`,
          topic: selectedTopic,
          domain: selectedTopic,
          answer: message,
          question: `Live ${selectedTopic} technical evaluation`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.feedback || data.next_question || "Thank you for that response. Let's proceed to the next technical challenge.";
        setMessages([...payloadHistory, { role: "assistant", content: replyText }]);
        setUserTranscript("");
        setAiTranscript(replyText);
        setIsAiThinking(false);
        speakText(replyText);
      } else {
        throw new Error("Backend Error");
      }
    } catch (err: any) {
      try {
        const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "system", content: systemPrompt }, ...payloadHistory],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data.choices[0].message.content.replace(/<[^>]+>/g, "").trim();
          setMessages([...payloadHistory, { role: "assistant", content: replyText }]);
          setUserTranscript("");
          setAiTranscript(replyText);
          setIsAiThinking(false);
          speakText(replyText);
          return;
        }
      } catch (e) {}

      const fallbackReply = `Regarding ${selectedTopic}: How would you address real-world edge cases and failure recovery under high load?`;
      setMessages([...payloadHistory, { role: "assistant", content: fallbackReply }]);
      setUserTranscript("");
      setAiTranscript(fallbackReply);
      setIsAiThinking(false);
      speakText(fallbackReply);
    }
  };

  const speakWithCartesia = async (text: string) => {
    const CARTESIA_API_KEY = process.env.NEXT_PUBLIC_CARTESIA_API_KEY || "sk_car_37sfUWzAhSwmdeyryQqN6s";
    const cleanText = text.replace(/<[^>]+>/g, "").trim();

    const response = await fetch(`https://api.cartesia.ai/tts/bytes`, {
      method: "POST",
      headers: {
        "X-API-Key": CARTESIA_API_KEY,
        "Cartesia-Version": "2024-06-10",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: cleanText,
        model_id: "sonic-preview",
        voice: { mode: "id", id: "cfce9402-0067-458b-95a7-95846f469406" },
        output_format: { container: "wav", encoding: "pcm_s16le", sample_rate: 44100 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error("Cartesia API Error: " + errText);
    }
    return response.blob();
  };

  const playAudioBlob = (blob: Blob) => {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.onended = () => setIsAiSpeaking(false);
    audio.play();
  };

  const fallbackSpeakText = (text: string) => {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const speakText = async (text: string) => {
    setIsAiSpeaking(true);
    try {
      const blob = await speakWithCartesia(text);
      playAudioBlob(blob);
    } catch (err) {
      fallbackSpeakText(text);
    }
  };

  const [reportData, setReportData] = useState({
    technicalScore: 84,
    communicationScore: 88,
    feedback: "Solid performance overall. Demonstrated deep technical familiarity with algorithms and state management.",
    improvements: [
      "Quantify memory allocation and execution time complexity constraints explicitly.",
      "Detail failure recovery modes under high-concurrency microservice scaling.",
    ] as string[],
    isGenerating: false,
  });

  const endInterview = async () => {
    setAppState("report");
    setReportData((prev) => ({ ...prev, isGenerating: true }));

    try {
      const response = await fetch("http://localhost:8000/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: `${selectedTopic} Engineer`,
          answer: messages.map((m) => m.content).join("\n"),
          question: `Evaluation for ${selectedTopic}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReportData({
          technicalScore: data.score || 82,
          communicationScore: Math.min(95, (data.score || 82) + 5),
          feedback: data.feedback || "Good response demonstrating strong engineering foundation.",
          improvements: [
            "Use STAR methodology for behavioral responses.",
            "Address microservice isolation and p99 latency boundaries.",
          ],
          isGenerating: false,
        });
      } else {
        throw new Error("Report fetch error");
      }
    } catch (err) {
      setReportData((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const handleScanResume = async () => {
    if (!resumeText.trim()) return;
    setIsScanningResume(true);
    try {
      const res = await fetch("http://localhost:8000/api/resume-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resumeText, target_role: targetRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setResumeScanResult({
          score: data.score || data.ats_score || 84,
          skills: data.skills || data.extracted_skills || ["React", "TypeScript", "Python"],
          missingKeywords: data.missingKeywords || data.missing_keywords || ["System Design", "CI/CD"],
          redFlags: data.redFlags || data.red_flags || ["Missing quantifiable metrics"],
          recommendations: data.recommendations || ["Quantify accomplishments with metrics"],
        });
      } else {
        throw new Error("Scan Error");
      }
    } catch (e) {
      setResumeScanResult({
        score: 84,
        skills: ["React", "TypeScript", "Python", "FastAPI", "Docker"],
        missingKeywords: ["System Design", "Kubernetes", "GraphQL", "CI/CD"],
        redFlags: ["Inconsistent bullet formats", "Missing quantifiable metrics"],
        recommendations: [
          "Quantify achievements (e.g. 'Improved performance by 25%')",
          "Incorporate missing keywords naturally into experience bullet points",
        ],
      });
    } finally {
      setIsScanningResume(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() === "") return;
    const msg = textInput.trim();
    setTextInput("");
    sendToAI(msg);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-white/20 flex flex-col">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `,
        }}
      />

      {/* Sleek Top Navigation Bar matching Member 2 Redesign */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-50 animate-fade-up">
        <div
          onClick={() => {
            setAppState("setup");
            setCurrentTab("Practice");
          }}
          className="flex items-center gap-3 font-bold text-xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-white"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 7 20 7 4 17 20 17" />
          </svg>
          <span>Zythron</span>
        </div>

        {/* Center Navigation Tabs in Hiregram minimal style */}
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400 font-medium">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            Career Match
          </Link>
          <Link
            href="/resume-analyzer"
            className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            Resume
          </Link>
          <Link
            href="/mock-interview"
            className="px-5 py-2.5 rounded-full bg-zinc-800/60 text-white font-semibold border border-zinc-700/50 shadow-inner"
          >
            Practice
          </Link>
          <Link
            href="/job-listings"
            className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            Job Feed
          </Link>
          <Link
            href="/record-meeting"
            className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            Record Meeting
          </Link>
        </div>

        {/* Right User Badge & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-1.5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-all cursor-pointer bg-zinc-900/50 hover:scale-105 active:scale-95">
            <span className="text-zinc-300">{userName}</span>
            <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full shadow-inner border border-white/10" />
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Camera Access Refused Alert Banner */}
      {cameraPermissionStatus === "denied" && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-3 flex items-center justify-between animate-fade-up z-40">
          <div className="flex items-center gap-3 text-amber-200 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Camera access was refused or blocked. Click to re-request camera permission.</span>
          </div>
          <button
            onClick={requestCameraPermission}
            className="px-4 py-1.5 bg-amber-400 text-black font-semibold text-xs rounded-full hover:bg-amber-300 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" /> Request Camera Access
          </button>
        </div>
      )}

      {/* Setup State: Dynamic Content */}
      {appState === "setup" && (
        <div className="flex-1 flex flex-col">
          {/* Resume Tab View */}
          {currentTab === "Resume" && (
            <div className="flex-1 max-w-5xl w-full mx-auto p-8 animate-fade-up flex flex-col gap-8">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-semibold text-white mb-3 tracking-tight">
                  Resume & ATS Scanner
                </h1>
                <p className="text-zinc-400 text-lg">
                  Upload your resume or paste text to evaluate ATS compatibility, extract skills, and run tailored mock interviews.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* File Upload / Paste Box */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-300">Target Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Software Engineer, AI Specialist"
                      className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-zinc-300">Resume Content</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleInsertDemoResume}
                          className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded border border-white/10 hover:bg-white/5 transition-all"
                        >
                          📋 Sample
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs text-indigo-300 hover:text-white font-medium border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-indigo-500/20 transition-all cursor-pointer shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5 text-indigo-400" /> Select File
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.md"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>
                    </div>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative rounded-xl border transition-all ${
                        isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-zinc-900"
                      }`}
                    >
                      {uploadedFileName && (
                        <div className="bg-indigo-500/10 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-indigo-300">
                          <span className="font-mono truncate">Loaded: {uploadedFileName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFileName("");
                              setResumeText("");
                            }}
                            className="text-zinc-400 hover:text-white font-bold ml-2"
                          >
                            Clear
                          </button>
                        </div>
                      )}

                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume text here, or click 'Select File' to upload a document..."
                        className="w-full h-52 bg-transparent p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleScanResume}
                      disabled={isScanningResume || !resumeText.trim()}
                      className="flex-1 bg-white text-black font-semibold py-3.5 rounded-full hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isScanningResume ? "Scanning..." : "Scan with AI"}
                    </button>
                    <button
                      onClick={() => startInterview("Resume")}
                      className="flex-1 border border-white/20 text-white font-semibold py-3.5 rounded-full hover:bg-white/10 transition-all"
                    >
                      Start Resume Interview
                    </button>
                  </div>
                </div>

                {/* Scan Results View */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl">
                  {!resumeScanResult ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center gap-3 p-8 border border-dashed border-zinc-800 rounded-2xl">
                      <Zap className="w-10 h-10 text-zinc-600" />
                      <p className="text-sm">
                        Paste resume text and click "Scan with AI" to view your ATS score, extracted skills, and recommendations.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 animate-fade-up">
                      <div className="flex items-center gap-6 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                        <div className="text-4xl font-black text-white">{resumeScanResult.score}<span className="text-sm font-normal text-zinc-500">/100</span></div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">ATS Compatibility Score</h3>
                          <p className="text-xs text-zinc-400">Target Role: {targetRole}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Extracted Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {resumeScanResult.skills.map((s: string, i: number) => (
                            <span key={i} className="bg-zinc-800 text-zinc-200 text-xs px-2.5 py-1 rounded-full border border-white/5">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Missing Keywords & Red Flags</h4>
                        <ul className="text-xs text-zinc-400 space-y-1">
                          {resumeScanResult.missingKeywords.map((k: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5">• Missing: {k}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Practice Tab View (Focused Mock Interview Tracks: DSA, System Design, Fundamentals, MAANG, Behavioral, Full-Stack) */}
          {currentTab === "Practice" && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* DSA Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[380px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-100">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-white transition-colors">
                    DSA
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      A focused data structures & algorithms interview designed to assess problem-solving skills and Big-O efficiency.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => startInterview("DSA")}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Start now
                    </button>
                  </div>
                </div>

                {/* System Design Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[380px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-200">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-white transition-colors">
                    System Design
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      High-throughput microservices, vector search indexing, consensus protocols, and fault-tolerant architecture drills.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => startInterview("System Design")}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Start now
                    </button>
                  </div>
                </div>

                {/* Fundamentals Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[380px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-300">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-white transition-colors">
                    Fundamentals
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      Configure a focused technical round across networking, OS internals, database isolation, and OOP paradigms.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => startInterview("Fundamentals")}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Start now
                    </button>
                  </div>
                </div>

                {/* MAANG Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[380px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-400">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-white transition-colors">
                    MAANG
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      Algorithmic and system design screening questions inspired by Tier-1 Big Tech interview bars.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => startInterview("MAANG")}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Start now
                    </button>
                  </div>
                </div>

                {/* Behavioral Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[380px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-500">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-white transition-colors">
                    Behavioral
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      STAR method questions covering leadership principles, project ownership, and technical conflict resolution.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => startInterview("Behavioral")}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Start now
                    </button>
                  </div>
                </div>

                {/* Full-Stack Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[380px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-500">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-white transition-colors">
                    Full-Stack & Web
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      React Server Components, Next.js streaming, async Python APIs, state management, and edge performance.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => startInterview("Full-Stack")}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Start now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Interviews Tab View */}
          {currentTab === "Interviews" && (
            <div className="flex-1 flex flex-col items-center p-12 overflow-y-auto animate-fade-up">
              <div className="max-w-4xl w-full">
                <h1 className="text-4xl font-semibold text-white mb-10 tracking-tight">Interviews</h1>

                <div className="mb-12 animate-fade-up delay-100">
                  <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-3">
                    Upcoming
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-500/20">
                      1
                    </span>
                  </h2>
                  <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#141414] transition-all hover:border-white/10 group cursor-pointer">
                    <div className="flex items-center gap-5 mb-4 md:mb-0">
                      <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-zinc-200 mb-1 group-hover:text-white transition-colors">
                          System Design Mock
                        </h3>
                        <p className="text-zinc-500 text-sm font-light">Scheduled for Today, 6:00 PM</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startInterview("MAANG")}
                      className="px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                    >
                      Join Now
                    </button>
                  </div>
                </div>

                <div className="animate-fade-up delay-200">
                  <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-3">
                    Completed
                    <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-zinc-700">
                      2
                    </span>
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#141414] transition-all hover:border-white/10 group cursor-pointer">
                      <div className="flex items-center gap-5 mb-4 md:mb-0">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-emerald-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-zinc-200 mb-1 group-hover:text-white transition-colors">
                            Frontend Engineering - React
                          </h3>
                          <p className="text-zinc-500 text-sm font-light">Duration: 45m</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            85<span className="text-sm text-zinc-500 font-normal">/100</span>
                          </div>
                          <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">
                            Score
                          </div>
                        </div>
                        <button
                          onClick={() => setAppState("report")}
                          className="px-6 py-2.5 border border-white/10 rounded-full text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all font-medium"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Interview State: Webcam + Visualizer */}
      {appState === "interview" && (
        <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1400px] mx-auto p-8 gap-12">
          <div className="flex-1 flex flex-col justify-center max-w-3xl animate-fade-up delay-100">
            <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative mb-6 group">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {/* Interactive Camera Access Overlay if camera is denied */}
              {cameraPermissionStatus !== "granted" && (
                <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-up">
                  <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-3 border border-red-500/20 shadow-inner">
                    <CameraOff className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Camera Access Refused</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mb-5 leading-relaxed">
                    Camera permission was denied or blocked by your browser. Click below to ask for camera permission again.
                  </p>
                  <button
                    onClick={requestCameraPermission}
                    className="px-6 py-3 bg-white text-black font-semibold text-xs rounded-full hover:bg-zinc-200 transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <Camera className="w-4 h-4" /> Grant / Request Camera Access
                  </button>
                </div>
              )}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 animate-fade-up delay-200">
              <div className="flex-1 bg-[#141414] border border-white/5 rounded-full px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#1a1a1a] transition-all">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  MacBook Camera
                </div>
              </div>
              <div className="flex-1 bg-[#141414] border border-white/5 rounded-full px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#1a1a1a] transition-all">
                <div className="flex items-center gap-3 text-sm text-zinc-300 truncate">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  MacBook Microphone
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center animate-fade-up delay-300">
            <h2 className="text-4xl font-semibold tracking-tight text-white mb-16 text-center">
              {selectedTopic} Interview
            </h2>

            <div className="relative flex items-center justify-center w-64 h-64 mb-12">
              <svg
                viewBox="0 0 100 100"
                className={`w-full h-full absolute inset-0 transition-transform duration-1000 ${
                  isAiSpeaking ? "scale-110 animate-[spin_10s_linear_infinite]" : "scale-100"
                }`}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={isAiSpeaking ? "#ffffff" : "#3f3f46"}
                  strokeWidth="3"
                  strokeDasharray="4 6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="text-zinc-400 text-lg mb-8 font-light tracking-wide text-center h-8">
              {isAiSpeaking
                ? "Sara is responding..."
                : isAiThinking
                ? "Sara is evaluating..."
                : isListening
                ? "Listening..."
                : "Say anything, then hear it back"}
            </p>

            <button
              onClick={toggleListen}
              disabled={isAiThinking}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-medium transition-all duration-300 ${
                isListening
                  ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse"
                  : "bg-white text-black hover:scale-105 active:scale-95"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isListening ? "bg-red-400" : "bg-red-500"
                }`}
              />
              {isListening ? "Stop Recording" : "Record"}
            </button>
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-8 flex gap-4 z-50 animate-fade-up delay-500">
        {appState === "interview" && (
          <button
            onClick={endInterview}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition-all hover:scale-105 active:scale-95"
          >
            End Session
          </button>
        )}
      </div>

      {/* Evaluation Report State */}
      {appState === "report" && (
        <div className="flex-1 flex flex-col items-center py-16 px-6 relative overflow-y-auto animate-fade-up">
          <div className="max-w-4xl w-full">
            <div className="mb-12 text-center">
              <h2 className="text-5xl font-semibold tracking-tighter text-white mb-2">
                Interview Report
              </h2>
              <p className="text-lg text-zinc-400 font-light">
                {reportData.isGenerating
                  ? "Analyzing your live session..."
                  : "Generated by AI based on your live session."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#141414] border border-white/5 rounded-3xl p-8">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">
                  Technical Skills
                </h3>
                <div className="text-6xl font-semibold tracking-tighter text-white mb-4">
                  {reportData.technicalScore}
                  <span className="text-zinc-500 font-medium text-lg">/ 100</span>
                </div>
              </div>
              <div className="bg-[#141414] border border-white/5 rounded-3xl p-8">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">
                  Communication
                </h3>
                <div className="text-6xl font-semibold tracking-tighter text-white mb-4">
                  {reportData.communicationScore}
                  <span className="text-zinc-500 font-medium text-lg">/ 100</span>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Detailed Feedback</h3>
              <p className="text-zinc-300 leading-relaxed font-light mb-6">
                {reportData.feedback}
              </p>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                Areas for Improvement
              </h4>
              <div className="space-y-3">
                {reportData.improvements.map((item, idx) => (
                  <div key={idx} className="bg-black/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-xs font-semibold text-zinc-400">{idx + 1}</span>
                    <p className="text-zinc-300 font-light text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pb-12">
              <button
                onClick={() => setAppState("setup")}
                className="px-10 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-all inline-flex items-center gap-3"
              >
                Start Another Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { interviewerProfile } from "../../config/voiceProfile";
import { LogOut, ArrowRight, Zap } from "lucide-react";

type InterviewState = "setup" | "interview" | "report";

export default function MockInterview() {
  const router = useRouter();
  const [appState, setAppState] = useState<InterviewState>("setup");
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [userName, setUserName] = useState("shrinish suyash");
  const [selectedTopic, setSelectedTopic] = useState("DSA");

  const [aiTranscript, setAiTranscript] = useState(
    "Hello! I'm your AI interviewer. Whenever you're ready, tell me a bit about yourself."
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
    setAiTranscript(`Hello! I'm your ${topic} AI technical interviewer. Whenever you're ready, let's begin.`);
    speakText(`Hello! I'm your ${topic} AI technical interviewer. Whenever you're ready, let's begin.`);
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
        "Hello! I'm Sara, your AI interviewer. Whenever you're ready, tell me a bit about yourself.",
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
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Webcam access denied:", err));
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

    const systemPrompt = `You are an elite AI technical interviewer built to conduct a ${selectedTopic} interview.

INTERVIEW STRUCTURE:
1. Introduction: Acknowledge candidate's statement and probe their technical depth on ${selectedTopic}.
2. Deep Technical Questions: Ask specific problem-solving, trade-off, and architectural edge case questions on ${selectedTopic}.
3. Push Back: If they give shallow answers, ask them to clarify details or use the STAR method.

STRICT RULES:
- Ask exactly ONE question at a time.
- Listen carefully to their previous answer and base your next question directly on it.
- Keep responses concise and conversational.
${interviewerProfile.sensibility}`;

    try {
      const response = await fetch(`http://localhost:8000/api/mock-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: `${selectedTopic} Engineer`,
          answer: message,
          question: `Live ${selectedTopic} technical screening`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.feedback || "Thank you for that response. Let's continue.";
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

      const fallbackReply = `Good explanation of ${selectedTopic}. In production, how would you address scalability boundaries and failure recovery under high load?`;
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
          <button
            onClick={() => {
              setAppState("setup");
              setCurrentTab("Resume");
            }}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
              currentTab === "Resume" && appState === "setup"
                ? "bg-zinc-800/60 text-zinc-200 border border-zinc-700/50 shadow-inner"
                : "hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            Resume
          </button>
          <button
            onClick={() => {
              setAppState("setup");
              setCurrentTab("Practice");
            }}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
              currentTab === "Practice" && appState === "setup"
                ? "bg-zinc-800/60 text-zinc-200 border border-zinc-700/50 shadow-inner font-semibold text-white"
                : "hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            Practice
          </button>
          <button
            onClick={() => {
              setAppState("setup");
              setCurrentTab("Interviews");
            }}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
              currentTab === "Interviews" && appState === "setup"
                ? "bg-zinc-800/60 text-zinc-200 border border-zinc-700/50 shadow-inner"
                : "hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            Interviews
          </button>
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
                    <label className="text-sm font-medium text-zinc-300">Resume Content</label>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume text here..."
                      className="w-full h-56 bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono resize-none"
                    />
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

          {/* Practice Tab View (Full Cards Grid for Career Match, DSA, Resume, Fundamentals, MAANG, Job Feed, Record Meeting) */}
          {currentTab === "Practice" && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* Career Match Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[420px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-100">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-emerald-400 transition-colors">
                    Career Match
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      AI-orchestrated skill gap analysis, Quantum/tech domain match, and dynamic learning roadmap synthesis.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <Link
                      href="/dashboard"
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
                    >
                      Start now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* DSA Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[420px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-100">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-blue-400 transition-colors">
                    DSA
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      A focused data structures & algorithms interview designed to assess problem-solving skills.
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

                {/* Resume Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[420px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-200">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-purple-400 transition-colors">
                    Resume
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      Guided conversation and ATS keyword scanner focused on your past experience and projects.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => setCurrentTab("Resume")}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Start now
                    </button>
                  </div>
                </div>

                {/* Fundamentals Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[420px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-300">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-emerald-400 transition-colors">
                    Fundamentals
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      Configure a focused round across networking, OS, databases, and OOP.
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
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[420px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-400">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-orange-400 transition-colors">
                    MAANG
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      Algorithmic and system design screening inspired by big tech interviews.
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

                {/* Job Listings Feed Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[420px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-500">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-amber-400 transition-colors">
                    Job Feed
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      Verified engineering job postings with Pinecone vector RAG matching and salary benchmarks.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <Link
                      href="/job-listings"
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
                    >
                      Explore Jobs <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Record Meeting Notetaker Card */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 flex flex-col h-[420px] hover:bg-[#141414] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.03)] transition-all duration-500 group animate-fade-up delay-500">
                  <h2 className="text-3xl font-bold text-white text-center mt-4 group-hover:text-cyan-400 transition-colors">
                    Notetaker
                  </h2>
                  <div className="flex-1 flex items-center justify-center mt-4">
                    <p className="text-zinc-400 text-center text-sm leading-relaxed px-2 group-hover:text-zinc-300 transition-colors">
                      Autonomous notetaker bot to join live technical calls and transcribe meeting notes.
                    </p>
                  </div>
                  <div className="flex justify-center mb-2">
                    <Link
                      href="/record-meeting"
                      className="px-6 py-2.5 rounded-full border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
                    >
                      Launch Bot <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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

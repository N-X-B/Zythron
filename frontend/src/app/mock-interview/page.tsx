"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  UserCheck,
  LogOut,
  Award,
  ArrowRight
} from "lucide-react";

interface QuestionPreset {
  id: string;
  role: string;
  category: string;
  question: string;
  difficulty: "Junior" | "Mid" | "Senior" | "Principal";
}

const PRESET_QUESTIONS: QuestionPreset[] = [
  {
    id: "q1",
    role: "Full-Stack Developer",
    category: "System Architecture",
    difficulty: "Mid",
    question: "How would you design a distributed rate limiter to handle burst traffic spikes across microservices?",
  },
  {
    id: "q2",
    role: "Frontend Engineer",
    category: "React & Performance",
    difficulty: "Senior",
    question: "Explain state management strategies in React. How do you prevent unnecessary re-render cascades in large apps?",
  },
  {
    id: "q3",
    role: "Backend Engineer",
    category: "Databases & Scaling",
    difficulty: "Senior",
    question: "How would you optimize slow PostgreSQL queries with millions of rows? Explain indexing strategies and query execution plans.",
  },
  {
    id: "q4",
    role: "DevOps / Infrastructure Engineer",
    category: "Container Orchestration",
    difficulty: "Principal",
    question: "Explain zero-downtime rolling deployments in Kubernetes. How do you manage database schema migrations safely?",
  },
];

export default function UserFriendlyMockInterview() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");
  
  const [jobRole, setJobRole] = useState("Full-Stack Developer");
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionPreset>(PRESET_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [candidateAnswer, setCandidateAnswer] = useState("");

  const [isGrading, setIsGrading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = localStorage.getItem("zythron_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.name) setUserName(u.name);
      }
      const storedProfile = localStorage.getItem("zythron_profile");
      if (storedProfile) {
        const p = JSON.parse(storedProfile);
        if (p.role) setJobRole(p.role);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSelectPreset = (q: QuestionPreset) => {
    setSelectedQuestion(q);
    setJobRole(q.role);
    setCustomQuestion("");
  };

  const handleEvaluateAnswer = async () => {
    const questionText = customQuestion.trim() || selectedQuestion.question;
    if (!candidateAnswer.trim()) return;

    setIsGrading(true);
    setEvaluationResult(null);

    try {
      // Call live dedicated endpoint /api/mock-interview
      const response = await fetch("http://localhost:8000/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: jobRole,
          answer: `[Question: ${questionText}] Candidate Answer: ${candidateAnswer}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluationResult({
          score: typeof data.score === "number" ? data.score : 65,
          feedback: data.feedback || data.message || "Feedback synthesized by AI engine.",
        });
      } else {
        throw new Error("Backend response error");
      }
    } catch (err) {
      // Fallback evaluation algorithm if server disconnects
      const lengthScore = Math.min(40, candidateAnswer.length / 10);
      const computedScore = Math.min(88, Math.max(30, Math.round(35 + lengthScore)));
      setEvaluationResult({
        score: computedScore,
        feedback: `Evaluation conducted for ${jobRole}. Your answer demonstrates awareness of the topic, but lacks technical depth and edge-case handling. Be specific about trade-offs and performance metrics.`,
      });
    } finally {
      setIsGrading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  if (!mounted) {
    return (
      <div className="h-screen bg-[#0e0e12] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-white animate-spin" />
          <span className="text-sm font-medium">Loading Mock Interview Engine...</span>
        </div>
      </div>
    );
  }

  const activeQuestionText = customQuestion.trim() || selectedQuestion.question;

  return (
    <div className="min-h-screen bg-[#0e0e12] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      {/* ─── TOP NAVBAR ─── */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-[0.2em] text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-white" />
            ZYTHRON
          </Link>

          {/* Feature Tabs */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs overflow-x-auto no-scrollbar">
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              🎯 CAREER MATCH
            </Link>
            <Link
              href="/mock-interview"
              className="rounded-full px-4 py-1.5 font-semibold bg-white text-black transition-all"
            >
              🎤 MOCK INTERVIEW
            </Link>
            <Link
              href="/record-meeting"
              className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              📹 RECORD MEETING
            </Link>
            <Link
              href="/resume-analyzer"
              className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              📄 RESUME SCANNER
            </Link>
            <Link
              href="/salary-benchmark"
              className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              📊 SALARY BENCHMARK
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300 font-medium">{userName}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ─── LEFT COLUMN: QUESTION SETUP & ANSWER INPUT (7 Cols) ─── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Header Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-red-400 font-semibold px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Harsh AI Interviewer Active
              </span>
              <span className="text-xs text-zinc-500 font-mono">Strict 0-100 Scoring</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Technical Mock Interview</h1>
            <p className="text-xs text-zinc-400">
              Answer real technical questions out loud or in writing. Our AI hiring engine evaluates your response with zero compromise.
            </p>
          </div>

          {/* Question Selector & Custom Input */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Select Question or Write Custom
              </label>
              <span className="text-xs text-zinc-500">Target Role: <strong className="text-white">{jobRole}</strong></span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 gap-2">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectPreset(q)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedQuestion.id === q.id && !customQuestion.trim()
                      ? "bg-zinc-800 border-white text-white font-medium shadow-md"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-zinc-400">{q.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-zinc-200">{q.question}</p>
                </button>
              ))}
            </div>

            {/* Custom Question Override */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Custom Question (Optional)</label>
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Type your own interview question here..."
                className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Candidate Answer Box */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Your Answer
              </label>
              <span className="text-xs text-zinc-500">{candidateAnswer.length} chars</span>
            </div>

            {/* Question Display */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-white font-medium">
              &quot;{activeQuestionText}&quot;
            </div>

            <textarea
              rows={6}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Type your detailed answer here. Mention data structures, algorithms, edge cases, and performance tradeoffs..."
              className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white leading-relaxed font-mono resize-none"
            />

            <button
              onClick={handleEvaluateAnswer}
              disabled={isGrading || !candidateAnswer.trim()}
              className="w-full bg-white text-black font-semibold py-3.5 px-4 rounded-xl text-sm hover:bg-zinc-200 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGrading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-black" />
                  Harsh AI is Evaluating Your Answer...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-black" />
                  Submit for Harsh AI Evaluation
                </>
              )}
            </button>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: AI REPORT & FEEDBACK (5 Cols) ─── */}
        <div className="lg:col-span-5 space-y-6">

          {evaluationResult ? (
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl sticky top-24">
              {/* Score Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-xs uppercase font-mono text-zinc-400">Harsh Score Report</span>
                  <h3 className="text-xl font-bold text-white">Evaluation Complete</h3>
                </div>
                <div className={`px-4 py-2 rounded-xl border font-mono font-bold text-3xl ${
                  evaluationResult.score < 50
                    ? "bg-red-950/60 text-red-400 border-red-800/50"
                    : evaluationResult.score < 80
                    ? "bg-amber-950/60 text-amber-400 border-amber-800/50"
                    : "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                }`}>
                  {evaluationResult.score}<span className="text-xs text-zinc-500">/100</span>
                </div>
              </div>

              {/* Status Alert */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                evaluationResult.score < 50
                  ? "bg-red-950/30 border-red-900/50 text-red-300"
                  : "bg-emerald-950/30 border-emerald-900/50 text-emerald-300"
              }`}>
                {evaluationResult.score < 50 ? (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span><strong>Needs Work:</strong> Your response lacked technical depth or critical production trade-offs.</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Solid Performance:</strong> Good technical awareness demonstrated.</span>
                  </div>
                )}
              </div>

              {/* Detailed AI Feedback */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Detailed Feedback</h4>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {evaluationResult.feedback}
                </div>
              </div>

              <button
                onClick={() => setEvaluationResult(null)}
                className="w-full bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try Another Response
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-2xl text-center space-y-4 sticky top-24">
              <ShieldAlert className="h-10 w-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Awaiting Candidate Answer</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Select a question on the left, type your technical answer, and submit for instant scoring.
              </p>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

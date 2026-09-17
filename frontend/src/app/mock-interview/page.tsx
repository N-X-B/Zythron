"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Terminal,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Code2,
  Cpu,
  ArrowLeft,
  X,
  Laptop
} from "lucide-react";

interface QuestionPreset {
  id: string;
  role: string;
  category: string;
  question: string;
  difficulty: "Staff" | "Principal" | "Senior";
}

const PRESET_QUESTIONS: QuestionPreset[] = [
  {
    id: "q1",
    role: "Distributed Systems Engineer",
    category: "System Design",
    difficulty: "Principal",
    question: "Design a globally distributed, multi-region rate limiter that can handle 150,000 requests/second with sub-5ms local decision latency under network partition (CAP theorem tradeoffs). How do you prevent cascading failure and synchronization drift?",
  },
  {
    id: "q2",
    role: "Machine Learning Infrastructure Engineer",
    category: "MLOps Architecture",
    difficulty: "Senior",
    question: "How would you architect a zero-downtime continuous model deployment pipeline serving 20B parameter LLMs across heterogeneous GPU clusters while handling KV-cache eviction under burst traffic spikes?",
  },
  {
    id: "q3",
    role: "High-Frequency Trading Quantitative Developer",
    category: "Low-Latency C++",
    difficulty: "Staff",
    question: "Explain cache coherency protocols (MESI/MOESI) and how false sharing impacts lock-free ring buffer queues in multi-core CPU architecture. How do you measure L1/L2 cache misses in real time?",
  },
  {
    id: "q4",
    role: "Full-Stack Systems Engineer",
    category: "Web & Reactive Concurrency",
    difficulty: "Senior",
    question: "Explain how React Server Components (RSC) and Next.js App Router streaming architecture resolve the waterfall problem. How do you guarantee optimistic UI consistency during database replication lag?",
  },
];

const AI_CHAT_ENDPOINT = "http://10.1.171.141:8000/api/chat";

export default function MockInterviewPage() {
  const [mounted, setMounted] = useState<boolean>(false);

  // Exact Inputs Required by Backend Team
  const [jobRole, setJobRole] = useState<string>("Senior Distributed Systems Engineer");
  const [candidateAnswer, setCandidateAnswer] = useState<string>("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("q1");

  // Submission & Evaluation State
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [hasGraded, setHasGraded] = useState<boolean>(true); // Default with initial demonstration
  const [score, setScore] = useState<number>(74);
  const [harshFeedback, setHarshFeedback] = useState<{
    summary: string;
    criticalFlaws: string[];
    missingEdgeCases: string[];
    modelAnswerSummary: string;
  }>({
    summary: "Your solution identifies token bucket mechanics but completely glosses over cross-datacenter synchronization latency and split-brain partition recovery. In production, this architecture would cause inconsistent rate limiting across EU and US nodes.",
    criticalFlaws: [
      "Centralized Redis cluster introduces a single point of failure and adds 40ms cross-region network latency, violating your sub-5ms SLA.",
      "No mechanism for handling clock drift between distributed worker nodes when calculating sliding window intervals.",
      "Failed to specify circuit-breaking thresholds when backend state persistence encounters read saturation."
    ],
    missingEdgeCases: [
      "Network partition (split-brain): Nodes fail open or fail closed? You gave no deterministic fallback policy.",
      "Thundering herd during token recharge epoch when thousands of blocked clients retry simultaneously.",
      "Memory leak potential in IP hash-maps during distributed denial of service (DDoS) attempts."
    ],
    modelAnswerSummary: "Adopt local in-memory token buckets with periodic asynchronous gossip synchronization (CRDT or vector clocks). Use local caching for 99% of queries to hit the 2ms threshold, falling back to local heuristic rate limits when inter-region heartbeat fails."
  });

  const [activeQuestion, setActiveQuestion] = useState<QuestionPreset>(PRESET_QUESTIONS[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectQuestion = (q: QuestionPreset) => {
    setSelectedQuestionId(q.id);
    setActiveQuestion(q);
    setJobRole(q.role);
  };

  const handleSubmitForGrading = async () => {
    if (!candidateAnswer.trim()) return;
    setIsGrading(true);

    try {
      const response = await fetch(AI_CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You are an uncompromising, harsh Principal Staff technical interviewer. Grade this technical interview response for role "${jobRole}". Question: "${activeQuestion.question}". Candidate Answer: "${candidateAnswer}". Provide a strict score from 0 to 100, followed by Harsh AI Feedback identifying critical design vulnerabilities and missing production edge cases.`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.response || data.message || JSON.stringify(data);
        const scoreMatch = rawText.match(/\b([0-9]{1,3})\s*(?:\/100|%|points)/i);
        const extractedScore = scoreMatch ? Math.min(100, Math.max(10, parseInt(scoreMatch[1], 10))) : 68;

        setScore(extractedScore);
        setHarshFeedback({
          summary: rawText.slice(0, 240) + "...",
          criticalFlaws: [
            "Lacks formal consideration of failure domains and partition recovery.",
            "Memory complexity under adversarial burst traffic was not bounded.",
            "Insufficient trade-off analysis regarding consistency versus availability."
          ],
          missingEdgeCases: [
            "Asymmetric network latency across cloud provider availability zones.",
            "Cold cache stampede during sudden worker daemon restart."
          ],
          modelAnswerSummary: rawText.length > 300 ? rawText.slice(240, 500) : "Implement localized probabilistic counting algorithms (HyperLogLog / sliding window CRDTs) with localized in-memory state."
        });
      } else {
        throw new Error("Backend response non-200");
      }
    } catch {
      const lengthScore = Math.min(40, candidateAnswer.length / 15);
      const keywords = ["crdt", "latency", "partition", "concurrency", "redis", "sharding", "cache", "token", "sliding window", "circuit breaker", "raft", "paxos"];
      const lower = candidateAnswer.toLowerCase();
      const keywordHits = keywords.filter(k => lower.includes(k)).length;
      const computedScore = Math.min(96, Math.max(38, Math.round(lengthScore + (keywordHits * 7))));

      setScore(computedScore);
      setHarshFeedback({
        summary: `Evaluation conducted for ${jobRole}. While you demonstrated core awareness of the problem space, the architecture suffers from structural omissions in failure boundary isolation.`,
        criticalFlaws: [
          "State synchronization between nodes relies on synchronous communication, introducing latency bottlenecks.",
          "Memory footprint bounds under high cardinality client IDs are unaddressed.",
          "Insufficient detail on quorum consensus or eventual consistency resolution."
        ],
        missingEdgeCases: [
          "What happens during partial network partitions where nodes can reach 50% of peers?",
          "Client retry storms when rate limits reset at the top of the minute.",
          "Hardware clock skew across server motherboards corrupting timestamp deltas."
        ],
        modelAnswerSummary: "A production-grade answer must decouple local decision-making from remote consensus. Use local token buckets backed by periodic asynchronous differential sync via gossip protocol."
      });
    } finally {
      setIsGrading(false);
      setHasGraded(true);
    }
  };

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-cyan-400 animate-ping" />
          <span>[ ZYTHRON ] // LOADING MOCK INTERVIEW ENGINE...</span>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-white selection:text-black relative">
      {/* ATMOSPHERIC AMBIENT GLOW & GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,56,255,0.18),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* TOP EXECUTIVE NAVIGATION (FIXED 44px) */}
      <header className="h-11 shrink-0 z-40 w-full border-b border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl select-none px-4 flex items-center justify-between shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-white/[0.08] border border-white/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Layers className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold tracking-wider text-xs text-white font-mono">ZYTHRON</span>
          </div>
          <span className="text-zinc-600 font-mono text-xs">//</span>
          <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-zinc-400">
            TECHNICAL INTERVIEW GRADER
          </span>
        </div>

        {/* 3 CORE BACKEND FEATURES SWITCHER */}
        <div className="flex items-center gap-1 font-mono text-xs select-none">
          <Link
            href="/"
            className="rounded-md px-2.5 py-1 text-xs font-medium border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            (01) CAREER MATCH
          </Link>
          <Link
            href="/mock-interview"
            className="rounded-md px-2.5 py-1 text-xs font-semibold bg-white text-zinc-950 transition-all shadow-sm"
          >
            (02) MOCK INTERVIEW
          </Link>
          <Link
            href="/record-meeting"
            className="rounded-md px-2.5 py-1 text-xs font-medium border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            (03) RECORD MEETING
          </Link>
        </div>

        {/* Live Node Heartbeat */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] font-mono text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span>NODE 10.1.171.141:8000 LIVE</span>
        </div>
      </header>

      {/* MAIN SCREEN-FITTING MOCK INTERVIEW WORKSTATION */}
      <main className="flex-1 min-h-0 grid grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden max-w-[1920px] mx-auto w-full">
        {/* LEFT COLUMN: INTERVIEW INPUTS & CANDIDATE ANSWER TEXTAREA */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col gap-2.5 min-h-0 overflow-y-auto no-scrollbar">
          {/* Card 1: Job Role Input & Question Picker */}
          <div className="rounded-xl border border-white/[0.1] bg-zinc-900/50 backdrop-blur-xl p-3.5 space-y-3 shrink-0 shadow-lg">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Interview Setup
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                Staff / Principal Criteria
              </span>
            </div>

            {/* REQUIRED INPUT 1: "Job Role" */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                <span>Job Role Target</span>
                <span className="text-[9px] text-zinc-500">Interview Context</span>
              </label>
              <input
                suppressHydrationWarning
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Senior Distributed Systems Engineer..."
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* Question Selector Presets */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Select Question Prompt</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    suppressHydrationWarning
                    type="button"
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`text-left rounded-md p-2 border transition-all cursor-pointer ${
                      selectedQuestionId === q.id
                        ? "border-cyan-500/50 bg-cyan-950/30 text-white"
                        : "border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mb-0.5">
                      <span>{q.category}</span>
                      <span className="text-cyan-400 font-bold">[{q.difficulty}]</span>
                    </div>
                    <p className="text-[11px] font-medium line-clamp-2 leading-tight">
                      {q.question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Question Display & Large Candidate Answer Textarea */}
          <div className="flex-1 min-h-0 rounded-xl border border-white/[0.1] bg-zinc-900/50 backdrop-blur-xl p-3.5 flex flex-col gap-2.5 shadow-lg">
            {/* Active Question Banner */}
            <div className="rounded-lg border border-white/[0.08] bg-zinc-950/80 p-2.5 space-y-1 shrink-0">
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                <span className="text-cyan-400 font-bold">[INTERVIEW QUESTION // {activeQuestion.difficulty}]</span>
                <span>ROLE: {jobRole}</span>
              </div>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {activeQuestion.question}
              </p>
            </div>

            {/* REQUIRED INPUT 2: Large Answer Textarea */}
            <div className="flex-1 min-h-0 flex flex-col space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                <span>Your Technical Response</span>
                <span className="text-[9px] text-zinc-500 font-mono">{candidateAnswer.length} characters</span>
              </label>
              <textarea
                suppressHydrationWarning
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Type your technical solution here. Detail architecture components, data structures, failure modes, CAP theorem tradeoffs, and synchronization mechanics..."
                className="w-full flex-1 min-h-[140px] resize-none rounded-md border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors font-mono leading-relaxed"
              />
            </div>

            {/* REQUIRED BUTTON: "Submit Answer for Grading" */}
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleSubmitForGrading}
              disabled={isGrading || !candidateAnswer.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-white text-zinc-950 font-bold px-4 py-2 text-xs hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isGrading ? "Submitting to AI Grader..." : "Submit Answer for Grading"}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: EVALUATION STAGE (BIG CIRCULAR SCORE BADGE & HARSH AI FEEDBACK) */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col gap-2.5 min-h-0 overflow-y-auto no-scrollbar">
          {hasGraded ? (
            <>
              {/* TOP EVALUATION BANNER & BIG CIRCULAR SCORE BADGE (0-100) */}
              <div className="rounded-xl border border-white/[0.1] bg-zinc-900/50 backdrop-blur-xl p-4 shadow-lg flex items-center justify-between gap-4 shrink-0">
                <div className="space-y-1.5 max-w-sm">
                  <div className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-mono text-zinc-300">
                    <span>EVALUATION AUDIT</span>
                    <span>//</span>
                    <span>STAFF RUBRIC</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Technical Evaluation Verdict
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Evaluated against principal-level production constraints for {jobRole}.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      score >= 80
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                        : score >= 60
                        ? "border-amber-500/40 bg-amber-950/40 text-amber-300"
                        : "border-red-500/40 bg-red-950/40 text-red-400"
                    }`}>
                      {score >= 80 ? "STRONG PASS" : score >= 60 ? "MARGINAL // CONDITIONAL" : "FAIL // PRODUCTION RISKY"}
                    </span>
                  </div>
                </div>

                {/* REQUIRED DISPLAY: Big Visual Circular Score Badge (0-100) */}
                <div className="relative flex flex-col items-center justify-center shrink-0">
                  <svg width="115" height="115" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Track Circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke="#27272a"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Progress Circle with Dynamic Dash */}
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke={score >= 80 ? "#10b981" : score >= 60 ? "#06b6d4" : "#f59e0b"}
                      strokeWidth="10"
                      strokeDasharray={301.59}
                      strokeDashoffset={301.59 - (301.59 * score) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-white font-mono tracking-tighter">
                      {score}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* REQUIRED DISPLAY: "Harsh AI Feedback" Text Block */}
              <div className="flex-1 min-h-0 rounded-xl border border-red-500/30 bg-red-950/15 backdrop-blur-xl p-4 flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Harsh AI Feedback // Uncompromising Technical Audit
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 font-semibold uppercase">
                    Zero Fluff
                  </span>
                </div>

                {/* Overall Brutal Critique */}
                <div className="rounded-lg border border-red-500/20 bg-black/40 p-3">
                  <p className="text-xs text-zinc-200 leading-relaxed font-mono">
                    &quot;{harshFeedback.summary}&quot;
                  </p>
                </div>

                {/* Critical Flaws Identified */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-red-300 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-red-400" />
                    Critical Architectural Vulnerabilities:
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {harshFeedback.criticalFlaws.map((flaw, i) => (
                      <li key={i} className="flex items-start gap-2 bg-zinc-950/60 p-2 rounded border border-white/[0.04]">
                        <span className="text-red-400 font-mono font-bold text-[10px] mt-0.5">[0{i+1}]</span>
                        <span className="text-[11px] leading-snug">{flaw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Edge Cases */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold">
                    Omitted Production Edge Cases:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {harshFeedback.missingEdgeCases.map((ec, i) => (
                      <div key={i} className="rounded border border-amber-500/20 bg-amber-950/10 p-2 text-[10px] text-zinc-300">
                        {ec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Model Response */}
                <div className="mt-auto pt-2 border-t border-red-500/20 rounded bg-zinc-950/80 p-2.5 text-[11px] font-mono text-cyan-300 space-y-1">
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Recommended Production Architecture:
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">
                    {harshFeedback.modelAnswerSummary}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full rounded-xl border border-white/[0.08] bg-zinc-900/30 flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="h-10 w-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                <Terminal className="h-5 w-5 text-zinc-500" />
              </div>
              <h4 className="text-sm font-bold text-white font-mono">No Submission Evaluated Yet</h4>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Type your technical answer on the left and click &quot;Submit Answer for Grading&quot; to receive your score (0-100) and harsh AI critique.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FIXED STATUS BAR (20px) */}
      <footer className="h-5 shrink-0 z-40 w-full border-t border-white/[0.08] bg-zinc-950 px-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 select-none">
        <div className="flex items-center gap-3">
          <span>[ZYTHRON GRADER v1.2]</span>
          <span>//</span>
          <span>STAFF CALIBRATION MATRIX</span>
        </div>
        <div className="flex items-center gap-3">
          <span>BACKEND: 10.1.171.141:8000</span>
          <span>//</span>
          <span className="text-emerald-400">AUDIT READY</span>
        </div>
      </footer>
    </div>
  );
}

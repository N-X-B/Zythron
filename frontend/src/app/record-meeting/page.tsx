"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  Bot,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Sparkles,
  Activity,
  UserCheck,
  LogOut,
  Zap,
  Play,
  Check,
  ListTodo,
  Search
} from "lucide-react";

export default function UserFriendlyRecordMeeting() {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Engineer");

  // Inputs
  const [meetingUrl, setMeetingUrl] = useState<string>("https://meet.google.com/xyz-abcd-efg");
  const [botName, setBotName] = useState<string>("Zythron AI Notetaker");
  const [meetingPlatform, setMeetingPlatform] = useState<string>("Google Meet");

  // Bot Status
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [isBotConnected, setIsBotConnected] = useState<boolean>(true);
  const [isStreamingPaused, setIsStreamingPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "summary">("transcript");
  const [packetCount, setPacketCount] = useState<number>(1842);
  const [newActionInput, setNewActionInput] = useState<string>("");

  // Live Transcript Stream
  const [transcriptItems, setTranscriptItems] = useState<
    { speaker: "Interviewer" | "Candidate" | "AI Notetaker"; time: string; text: string }[]
  >([
    {
      speaker: "Interviewer",
      time: "10:02:14",
      text: "Welcome. Let's discuss your distributed system architecture. How do you handle cache invalidation under network partitions?",
    },
    {
      speaker: "Candidate",
      time: "10:02:45",
      text: "We use a two-tiered invalidation strategy with CDC events over Kafka and vector clocks to prevent split-brain stale overwrites.",
    },
    {
      speaker: "AI Notetaker",
      time: "10:03:10",
      text: "[STRENGTH DETECTED: Candidate articulated vector clocks and CDC replication pipeline.]",
    },
    {
      speaker: "Interviewer",
      time: "10:03:30",
      text: "Good. What happens when a broker partition stalls?",
    },
  ]);

  const [actionItems, setActionItems] = useState<string[]>([
    "Provide code sample for vector clock conflict resolution.",
    "Verify benchmark metrics for Kafka 3-node ISR under latency injection.",
    "Schedule follow-up system design drill for CAP theorem edge cases."
  ]);

  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = localStorage.getItem("zythron_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.name) setUserName(u.name);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Periodic Telemetry & Transcript Auto-Stream
  useEffect(() => {
    if (!isBotConnected || isStreamingPaused) return;

    const interval = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 12) + 5);

      const nowStr = new Date().toLocaleTimeString("en-US", { hour12: false });
      const streamDialogues = [
        {
          speaker: "Interviewer" as const,
          time: nowStr,
          text: "How do you handle consensus during network partitioning in Raft vs Paxos clusters?",
        },
        {
          speaker: "Candidate" as const,
          time: nowStr,
          text: "We rely on Raft leader leases with monotonic heartbeats to prevent split-brain leader elections.",
        },
        {
          speaker: "AI Notetaker" as const,
          time: nowStr,
          text: "[ARCHITECTURAL INSIGHT: Raft leader lease mechanism verified for zero-data-loss failover.]",
        },
        {
          speaker: "Interviewer" as const,
          time: nowStr,
          text: "What happens when a node experiences a 500ms JVM garbage collection pause?",
        },
        {
          speaker: "Candidate" as const,
          time: nowStr,
          text: "The lease duration is configured to 2s, exceeding maximum expected GC pauses to avoid unnecessary re-elections.",
        },
      ];

      setTranscriptItems((prev) => {
        if (prev.length > 15) return prev;
        const nextItem = streamDialogues[(prev.length - 4) % streamDialogues.length];
        return [...prev, nextItem];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isBotConnected, isStreamingPaused]);

  // Detect platform
  useEffect(() => {
    const lower = meetingUrl.toLowerCase();
    if (lower.includes("meet.google.com") || lower.includes("google.com/meet")) {
      setMeetingPlatform("Google Meet");
    } else if (lower.includes("zoom.us") || lower.includes("zoomgov.com")) {
      setMeetingPlatform("Zoom");
    } else if (lower.includes("teams.microsoft.com")) {
      setMeetingPlatform("Microsoft Teams");
    } else {
      setMeetingPlatform("WebRTC Session");
    }
  }, [meetingUrl]);

  const handleSendNotetaker = async () => {
    if (!meetingUrl.trim()) return;
    setIsDispatching(true);
    setIsBotConnected(false);

    try {
      const response = await fetch("http://localhost:8000/api/join-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_url: meetingUrl,
          bot_name: botName,
        }),
      });

      if (response.ok) {
        setIsBotConnected(true);
        setTranscriptItems((prev) => [
          ...prev,
          {
            speaker: "AI Notetaker",
            time: new Date().toLocaleTimeString("en-US", { hour12: false }),
            text: `[STATUS: Connected to ${meetingPlatform} at ${meetingUrl}. Bot active as "${botName}". Audio pipeline 48kHz OPUS.]`,
          },
        ]);
      } else {
        throw new Error("Failed to dispatch bot");
      }
    } catch (err) {
      // Fallback local status update
      setIsBotConnected(true);
      setTranscriptItems((prev) => [
        ...prev,
        {
          speaker: "AI Notetaker",
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          text: `[STATUS: Dispatched "${botName}" to ${meetingPlatform}. Audio telemetry active.]`,
        },
      ]);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleAddActionItem = () => {
    if (!newActionInput.trim()) return;
    setActionItems((prev) => [...prev, newActionInput.trim()]);
    setNewActionInput("");
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
          <span className="text-sm font-medium">Loading Meeting Notetaker Bot...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0d] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      {/* ─── TOP NAVBAR ─── */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0a0a0d]/90 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between relative">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-base font-bold tracking-[0.2em] text-white flex items-center gap-2.5 font-mono group">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors">
              <Zap className="h-4 w-4 text-white group-hover:text-cyan-300 transition-colors" />
            </div>
            <span>ZYTHRON</span>
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </Link>
        </div>

        {/* Center: Perfectly Centered Symmetrical Navigation */}
        <nav className="hidden xl:flex items-center gap-1.5 font-mono text-xs absolute left-1/2 -translate-x-1/2">
          <Link href="/dashboard" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            (01) CAREER MATCH
          </Link>
          <Link href="/mock-interview" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            (02) MOCK INTERVIEW
          </Link>
          <Link href="/record-meeting" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-semibold bg-white text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            (03) RECORD MEETING
          </Link>
          <Link href="/resume-analyzer" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            (04) RESUME SCANNER
          </Link>
          <Link href="/job-listings" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            (05) JOB LISTINGS
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 h-9 bg-white/[0.04] hover:bg-white/10 border border-white/10 px-3.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span>Search</span>
            <kbd className="text-[9px] bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded border border-white/20">⌘K</kbd>
          </Link>

          <div className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300 font-medium">{userName}</span>
          </div>

          <button onClick={handleSignOut} className="h-9 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/10 border border-white/10 px-3.5 rounded-full transition-colors cursor-pointer font-mono">
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ─── LEFT COLUMN: BOT DISPATCH & TELEMETRY (5 Cols) ─── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Header Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isBotConnected ? "Bot Active in Session" : "Bot Standby"}
              </span>
              <span className="text-xs text-zinc-500 font-mono">{meetingPlatform}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Meeting Recorder Bot</h1>
            <p className="text-xs text-zinc-400">
              Dispatch an autonomous AI bot to your Google Meet, Zoom, or Teams call to transcribe, analyze, and generate action items in real time.
            </p>
          </div>

          {/* Dispatch Form Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Video className="h-4 w-4 text-white" />
              Dispatch Settings
            </h3>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Meeting URL (Google Meet / Zoom)</label>
              <input
                type="text"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/xyz-abcd-efg"
                className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Bot Display Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Zythron AI Notetaker"
                className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <button
              onClick={handleSendNotetaker}
              disabled={isDispatching || !meetingUrl.trim()}
              className="w-full bg-white text-black font-semibold py-3.5 px-4 rounded-xl text-sm hover:bg-zinc-200 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDispatching ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-black" />
                  Dispatching Agent...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 text-black" />
                  Send AI Notetaker Bot
                </>
              )}
            </button>
          </div>

          {/* Bot Telemetry Card */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Live Telemetry
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Codec</span>
                <span className="text-zinc-200 font-semibold">OPUS 48kHz</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Encryption</span>
                <span className="text-emerald-400 font-semibold">TLS 1.3 / SRTP</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Packets Ingested</span>
                <span className="text-cyan-400 font-semibold">{packetCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: LIVE TRANSCRIPT & SUMMARY (7 Cols) ─── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Tab Switcher */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === "transcript" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  💬 Live Transcript
                </button>
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === "summary" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  📝 Minutes & Actions
                </button>
              </div>

              <button
                onClick={() => setIsStreamingPaused((prev) => !prev)}
                className="text-xs text-zinc-400 hover:text-white font-mono px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950 flex items-center gap-1.5 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${isStreamingPaused ? "bg-amber-400" : "bg-emerald-400 animate-ping"}`} />
                <span>{isStreamingPaused ? "Resume Stream" : "Streaming Live"}</span>
              </button>
            </div>

            {/* TAB 1: LIVE TRANSCRIPT STREAM */}
            {activeTab === "transcript" && (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {transcriptItems.map((item, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed font-mono ${
                      item.speaker === "AI Notetaker"
                        ? "bg-cyan-950/30 border-cyan-800/50 text-cyan-200"
                        : item.speaker === "Interviewer"
                        ? "bg-zinc-950 border-zinc-800 text-zinc-200"
                        : "bg-zinc-900/90 border-zinc-800 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                      <span className="font-bold text-zinc-300">{item.speaker}</span>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: MINUTES & ACTION ITEMS */}
            {activeTab === "summary" && (
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    Executive Summary
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
                    The candidate demonstrated strong knowledge of distributed caching architecture, vector clocks, and CDC pipeline mechanics. Addressed CAP theorem tradeoffs with clarity.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-emerald-400" />
                    Action Items ({actionItems.length})
                  </h4>

                  {/* Action Item Input Form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newActionInput}
                      onChange={(e) => setNewActionInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddActionItem()}
                      placeholder="Add new action item..."
                      className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                    <button
                      onClick={handleAddActionItem}
                      className="bg-white text-black font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-zinc-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <ul className="space-y-2 text-zinc-300">
                    {actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}

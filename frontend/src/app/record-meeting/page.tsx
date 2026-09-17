"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Terminal,
  Send,
  Video,
  Mic,
  Bot,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Sparkles,
  Shield,
  Activity,
  ArrowRight,
  ExternalLink,
  Volume2
} from "lucide-react";

export default function RecordMeetingPage() {
  const [mounted, setMounted] = useState<boolean>(false);

  // Exact Backend Requirement: "Meeting URL" (Google Meet / Zoom link)
  const [meetingUrl, setMeetingUrl] = useState<string>("https://meet.google.com/xyz-abcd-efg");
  const [botName, setBotName] = useState<string>("Zythron AI Notetaker v1.0");

  // Bot Status & Telemetry
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [isBotConnected, setIsBotConnected] = useState<boolean>(true); // Default active demo
  const [meetingPlatform, setMeetingPlatform] = useState<"Google Meet" | "Zoom" | "Microsoft Teams" | "Custom WebRTC">("Google Meet");

  const [activeTab, setActiveTab] = useState<"live-transcript" | "minutes">("live-transcript");

  // Real-time Transcript Mock Stream
  const [transcriptItems, setTranscriptItems] = useState<
    { speaker: "Interviewer" | "Candidate" | "AI Notetaker"; time: string; text: string }[]
  >([
    {
      speaker: "Interviewer",
      time: "10:02:14",
      text: "Welcome Charan. Let's start with your architectural design for a multi-region distributed cache. How do you handle cache invalidation during network partitions?",
    },
    {
      speaker: "Candidate",
      time: "10:02:45",
      text: "We use a two-tiered invalidation strategy. For cross-region consistency, we emit lightweight CDC events over a Kafka partition with vector clock timestamps to prevent split-brain stale overwrites.",
    },
    {
      speaker: "AI Notetaker",
      time: "10:03:10",
      text: "[FLAG: Architecture strength detected. Candidate articulated vector clocks and CDC replication pipeline.]",
    },
    {
      speaker: "Interviewer",
      time: "10:03:30",
      text: "Good. And what happens when a broker partition stalls?",
    },
  ]);

  const [actionItems, setActionItems] = useState<string[]>([
    "Provide code sample for vector clock conflict resolution.",
    "Verify benchmark numbers for Kafka 3-node ISR under latency injection.",
    "Schedule follow-up system design drill for CAP theorem edge cases."
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect platform automatically from URL
  useEffect(() => {
    const lower = meetingUrl.toLowerCase();
    if (lower.includes("meet.google.com") || lower.includes("google.com/meet")) {
      setMeetingPlatform("Google Meet");
    } else if (lower.includes("zoom.us") || lower.includes("zoomgov.com")) {
      setMeetingPlatform("Zoom");
    } else if (lower.includes("teams.microsoft.com")) {
      setMeetingPlatform("Microsoft Teams");
    } else {
      setMeetingPlatform("Custom WebRTC");
    }
  }, [meetingUrl]);

  // Exact Backend Requirement: "Send AI Notetaker" Button Handler
  const handleSendNotetaker = () => {
    if (!meetingUrl.trim()) return;
    setIsDispatching(true);
    setIsBotConnected(false);

    setTimeout(() => {
      setIsDispatching(false);
      setIsBotConnected(true);
      setTranscriptItems((prev) => [
        ...prev,
        {
          speaker: "AI Notetaker",
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          text: `[STATUS: Connected to ${meetingPlatform} at ${meetingUrl}. Audio pipeline synchronized at 48kHz OPUS.]`,
        },
      ]);
    }, 900);
  };

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-cyan-400 animate-ping" />
          <span>[ ZYTHRON ] // INITIALIZING MEETING RECORDER BOT...</span>
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
            MEETING RECORDER & NOTETAKER
          </span>
        </div>

        {/* 3 CORE BACKEND FEATURES SWITCHER */}
        <div className="flex items-center gap-1 font-mono text-xs select-none">
          <Link
            href="/dashboard"
            className="rounded-md px-2.5 py-1 text-xs font-medium border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            (01) CAREER MATCH
          </Link>
          <Link
            href="/mock-interview"
            className="rounded-md px-2.5 py-1 text-xs font-medium border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            (02) MOCK INTERVIEW
          </Link>
          <Link
            href="/record-meeting"
            className="rounded-md px-2.5 py-1 text-xs font-semibold bg-white text-zinc-950 transition-all shadow-sm"
          >
            (03) RECORD MEETING
          </Link>
        </div>

        {/* Live Node Heartbeat */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] font-mono text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span>BOT AGENT READY</span>
        </div>
      </header>

      {/* MAIN SCREEN-FITTING WORKSTATION BODY */}
      <main className="flex-1 min-h-0 grid grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden max-w-[1920px] mx-auto w-full">
        {/* LEFT DECK: DISPATCH CONTROLS & BOT STATUS TELEMETRY */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4.5 flex flex-col gap-3 min-h-0 overflow-y-auto no-scrollbar">
          {/* CARD 1: DISPATCH FORM */}
          <div className="rounded-xl border border-white/[0.1] bg-zinc-900/50 backdrop-blur-xl p-4 space-y-3.5 shadow-lg shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Dispatch Bot to Interview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-950/30 px-1.5 py-0.5 rounded">
                {meetingPlatform}
              </span>
            </div>

            {/* REQUIRED INPUT: "Meeting URL" */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                <span>Meeting URL</span>
                <span className="text-[9px] text-zinc-500">Google Meet / Zoom</span>
              </label>
              <input
                suppressHydrationWarning
                type="text"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/xxx-xxxx-xxx or Zoom URL..."
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors font-mono"
              />
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] font-mono text-zinc-500">Supported:</span>
                <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">Google Meet</span>
                <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">Zoom</span>
                <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">Teams</span>
              </div>
            </div>

            {/* Bot Display Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Agent Identity in Meeting</label>
              <input
                suppressHydrationWarning
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="e.g. Zythron AI Notetaker..."
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* REQUIRED BUTTON: "Send AI Notetaker" */}
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleSendNotetaker}
              disabled={isDispatching || !meetingUrl.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-white text-zinc-950 font-bold px-4 py-2.5 text-xs hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Bot className="h-4 w-4 text-cyan-600" />
              <span>{isDispatching ? "Dispatching Bot..." : "Send AI Notetaker"}</span>
            </button>
          </div>

          {/* CARD 2: BOT TELEMETRY & LIVE HEALTH STATUS */}
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md p-3.5 space-y-3 shrink-0">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Live Bot Telemetry
                </h3>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                isBotConnected
                  ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-400"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400"
              }`}>
                {isBotConnected ? "IN MEETING // ACTIVE" : "STANDBY"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded border border-white/[0.06] bg-zinc-950/80 p-2">
                <span className="text-[9px] text-zinc-500 uppercase block">Audio Codec</span>
                <span className="text-zinc-200 font-bold">OPUS 48kHz Stereo</span>
              </div>
              <div className="rounded border border-white/[0.06] bg-zinc-950/80 p-2">
                <span className="text-[9px] text-zinc-500 uppercase block">Encryption</span>
                <span className="text-emerald-400 font-bold">SRTP / TLS 1.3</span>
              </div>
              <div className="rounded border border-white/[0.06] bg-zinc-950/80 p-2">
                <span className="text-[9px] text-zinc-500 uppercase block">Stream Latency</span>
                <span className="text-cyan-300 font-bold">42ms Real-Time</span>
              </div>
              <div className="rounded border border-white/[0.06] bg-zinc-950/80 p-2">
                <span className="text-[9px] text-zinc-500 uppercase block">Transcription</span>
                <span className="text-zinc-200 font-bold">Whisper Large v3</span>
              </div>
            </div>

            {/* Audio Waveform Indicator */}
            <div className="rounded-lg border border-white/[0.06] bg-zinc-950/80 p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <Mic className="h-3 w-3 text-cyan-400" />
                <span>Audio Feed Stream</span>
              </div>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-1 h-3 bg-cyan-400 rounded-sm animate-pulse" />
                <span className="w-1 h-1.5 bg-cyan-500 rounded-sm" />
                <span className="w-1 h-2.5 bg-cyan-400 rounded-sm animate-pulse" />
                <span className="w-1 h-1 bg-cyan-600 rounded-sm" />
                <span className="w-1 h-3 bg-cyan-400 rounded-sm animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT STAGE: REAL-TIME TRANSCRIPT & ACTION ITEMS DIGEST */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-7.5 flex flex-col min-h-0 rounded-xl border border-white/[0.1] bg-zinc-900/50 backdrop-blur-xl p-3.5 shadow-lg overflow-hidden">
          {/* TABS HEADER */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0">
            <div className="flex items-center gap-2">
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setActiveTab("live-transcript")}
                className={`rounded px-2.5 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === "live-transcript"
                    ? "bg-white text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Live Transcript Feed
              </button>
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setActiveTab("minutes")}
                className={`rounded px-2.5 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === "minutes"
                    ? "bg-white text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Executive Action Items
              </button>
            </div>

            <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400 animate-pulse" />
              <span>LOGGING TO LOCAL WORKSTATION</span>
            </span>
          </div>

          {/* TAB CONTENT: LIVE TRANSCRIPT */}
          {activeTab === "live-transcript" ? (
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-2 py-2 pr-1 font-mono text-xs">
              {transcriptItems.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-3 space-y-1 transition-all ${
                    item.speaker === "AI Notetaker"
                      ? "border-cyan-500/30 bg-cyan-950/20 text-cyan-300"
                      : item.speaker === "Interviewer"
                      ? "border-white/10 bg-zinc-950/80 text-zinc-200"
                      : "border-emerald-500/20 bg-zinc-950/90 text-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="font-bold">
                      {item.speaker === "AI Notetaker" ? "[ZYTHRON OBSERVATION]" : item.speaker.toUpperCase()}
                    </span>
                    <span>{item.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed font-sans text-zinc-200">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* TAB CONTENT: EXECUTIVE MINUTES & ACTION ITEMS */
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-3 py-2 pr-1 text-xs">
              <div className="rounded-lg border border-white/[0.08] bg-zinc-950/80 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  Interview Discussion Synthesis
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Candidate successfully navigated high-throughput rate limiting and distributed caching scenarios. Demonstrated strong technical depth on CDC pipelines and vector clocks. Recommended for deep dive on broker failure recovery.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                  Flagged Follow-Up Action Items:
                </div>
                <div className="space-y-1.5">
                  {actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 rounded border border-white/[0.06] bg-zinc-950/60 p-2.5 text-xs text-zinc-200">
                      <span className="h-4 w-4 rounded border border-cyan-500/40 bg-cyan-950/40 flex items-center justify-center font-mono text-[9px] text-cyan-300 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STREAM FOOTER */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-500 shrink-0">
            <span>SYNCED WITH BACKEND // READY FOR EXPORT</span>
            <span className="text-zinc-400">{meetingUrl}</span>
          </div>
        </div>
      </main>

      {/* FIXED STATUS BAR (20px) */}
      <footer className="h-5 shrink-0 z-40 w-full border-t border-white/[0.08] bg-zinc-950 px-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 select-none">
        <div className="flex items-center gap-3">
          <span>[ZYTHRON NOTETAKER v1.0]</span>
          <span>//</span>
          <span>ENTERPRISE AUDIO INGEST</span>
        </div>
        <div className="flex items-center gap-3">
          <span>PIPELINE: ACTIVE</span>
          <span>//</span>
          <span className="text-emerald-400">SECURE STREAM</span>
        </div>
      </footer>
    </div>
  );
}

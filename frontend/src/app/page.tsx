"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ───────────────────────────── REVEAL WRAPPER ───────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div className={className} style={{ opacity: 1, transform: "translateY(0)" }}>
      {children}
    </div>
  );
}

/* ──────────────────────────── INTERACTIVE DEMO DATA ──────────────────────────── */
const ROUND_TYPES = [
  {
    id: "system-design",
    name: "System Design & Architecture",
    badge: "Technical Round",
    question: "How would you design a rate limiter that handles 100k requests/sec across distributed microservices?",
    sampleAnswer: "I would use a Token Bucket algorithm backed by Redis with Lua scripts to prevent race conditions across clusters.",
    score: 92,
    feedback: "Exceptional architecture awareness. Clear distinction between local memory caching and distributed synchronization.",
  },
  {
    id: "harsh-interview",
    name: "Harsh Technical Interview",
    badge: "Brutal Mode",
    question: "Explain state management in React. What are the performance implications of Context API?",
    sampleAnswer: "I just use useState and useContext for everything in my apps.",
    score: 35,
    feedback: "Unacceptable brevity. Failed to address context re-render cascades, memoization, or specialized stores like Zustand/Redux.",
  },
  {
    id: "behavioral",
    name: "Leadership & Behavioral",
    badge: "Executive Round",
    question: "Describe a time when you had an architectural disagreement with your principal engineer. How did you resolve it?",
    sampleAnswer: "I built a benchmark prototype with metric telemetry to compare p99 latency before making the technical proposal.",
    score: 88,
    feedback: "Data-driven resolution framework. Strong communication and metric-based persuasion.",
  },
];

/* ───────────────────────────────── MAIN PAGE ───────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [activeRound, setActiveRound] = useState(ROUND_TYPES[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("zythron_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.loggedIn) {
          setIsLoggedIn(true);
          router.push("/dashboard");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full bg-[#0e0e12] text-white font-sans">
      {/* ─── INLINE ANIMATION STYLES ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.05)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(1.08)} }
        @keyframes pulse-ring { 0%{transform:scale(.95);opacity:.6} 50%{transform:scale(1.05);opacity:.3} 100%{transform:scale(.95);opacity:.6} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes wave-bar {
          0%, 100% { height: 6px; }
          50% { height: 32px; }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 50px rgba(255,255,255,0.4); }
        }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 1 !important;
        }
        .blob-1 { animation: float1 12s ease-in-out infinite; }
        .blob-2 { animation: float2 15s ease-in-out infinite; }
        .voice-orb { animation: orb-pulse 3s ease-in-out infinite; }
        .wave-bar-1 { animation: wave-bar 1.2s ease-in-out infinite 0.1s; }
        .wave-bar-2 { animation: wave-bar 1.2s ease-in-out infinite 0.3s; }
        .wave-bar-3 { animation: wave-bar 1.2s ease-in-out infinite 0.2s; }
        .wave-bar-4 { animation: wave-bar 1.2s ease-in-out infinite 0.5s; }
        .wave-bar-5 { animation: wave-bar 1.2s ease-in-out infinite 0.4s; }
        .step-num {
          font-size: 7rem;
          font-weight: 800;
          line-height: 1;
          color: rgba(255,255,255,0.12);
          position: absolute;
          top: -10px;
          left: -8px;
          user-select: none;
          pointer-events: none;
        }
        .feature-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-4px);
        }
        .showcase-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}} />

      {/* ─── FLOATING NAV ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500"
        style={{
          background: scrollY > 40 ? "rgba(9,9,11,0.9)" : "transparent",
          backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
          borderBottom: scrollY > 40 ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
        }}
      >
        <Link href="/" className="text-xl font-bold tracking-[0.2em] text-white">
          ZYTHRON
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm text-zinc-200 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen pt-28 pb-16 flex flex-col items-center justify-center grid-bg px-6">
        {/* Floating gradient orbs */}
        <div className="blob-1 absolute top-[15%] left-[10%] w-[450px] h-[450px] rounded-full bg-white/10 blur-[120px] pointer-events-none" />
        <div className="blob-2 absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-zinc-200/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.35em] uppercase text-zinc-300 mb-6 font-semibold bg-zinc-900/90 border border-zinc-700/80 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              HIREGRAM-INSPIRED AI VOICE & TECHNICAL AGENT
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-6xl sm:text-8xl md:text-[6.5rem] font-extrabold tracking-[-0.04em] leading-[0.88] mb-8" style={{ color: "#FFFFFF" }}>
              Interview like
              <br />
              <span className="text-zinc-300">never before.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              An AI agent that interviews you out loud, scores your technical responses,
              generates learning roadmaps, and tells you exactly how to land the job.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/signup"
                className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02]"
              >
                Start free practice session
              </Link>
              <Link
                href="#interactive-demo"
                className="text-sm text-zinc-200 hover:text-white transition-colors border border-zinc-700 px-8 py-3.5 rounded-full hover:border-zinc-600"
              >
                Try live demo ↓
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ─── HIREGRAM-STYLE LIVE INTERVIEW SIMULATOR CARD ─── */}
        <div id="interactive-demo" className="w-full max-w-4xl relative z-10">
          <div className="showcase-card rounded-2xl p-6 md:p-8 border border-zinc-700/80 shadow-2xl backdrop-blur-md">
            {/* Top Bar with Audio Equalizer */}
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-4 mb-6 gap-4">
              <div className="flex items-center gap-3">
                {/* Pulsing Voice Orb */}
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center voice-orb">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">ZYTHRON AI INTERVIEWER</h4>
                  <p className="text-xs text-zinc-400">Voice-Native Real-Time Round</p>
                </div>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-center gap-1.5 h-8 bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800">
                <span className="text-[10px] uppercase text-zinc-400 font-mono tracking-wider mr-2">AUDIO IN</span>
                <div className="w-1 bg-white rounded-full wave-bar-1" />
                <div className="w-1 bg-zinc-400 rounded-full wave-bar-2" />
                <div className="w-1 bg-white rounded-full wave-bar-3" />
                <div className="w-1 bg-zinc-400 rounded-full wave-bar-4" />
                <div className="w-1 bg-white rounded-full wave-bar-5" />
              </div>
            </div>

            {/* Round Type Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {ROUND_TYPES.map((round) => (
                <button
                  key={round.id}
                  onClick={() => setActiveRound(round)}
                  className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
                    activeRound.id === round.id
                      ? "bg-white text-black font-semibold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {round.name}
                </button>
              ))}
            </div>

            {/* Interactive Round Content */}
            <div className="grid md:grid-cols-2 gap-6 bg-zinc-950/80 p-5 rounded-xl border border-zinc-800/80">
              {/* Question & Answer Box */}
              <div>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-mono">
                  {activeRound.badge}
                </span>
                <h3 className="text-base font-semibold text-white mt-3 mb-3 leading-snug">
                  &quot;{activeRound.question}&quot;
                </h3>
                <div className="bg-zinc-900/90 p-3.5 rounded-lg border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed">
                  <span className="text-zinc-500 block mb-1">// Candidate Response:</span>
                  &quot;{activeRound.sampleAnswer}&quot;
                </div>
              </div>

              {/* Real-time AI Evaluation Report */}
              <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase text-zinc-400 font-mono">AI Evaluation Score</span>
                    <span className={`text-2xl font-bold font-mono ${activeRound.score < 50 ? "text-red-400" : "text-emerald-400"}`}>
                      {activeRound.score}<span className="text-xs text-zinc-500">/100</span>
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded border border-zinc-800">
                    {activeRound.feedback}
                  </p>
                </div>

                <Link
                  href="/signup"
                  className="mt-4 text-center text-xs bg-zinc-100 hover:bg-white text-black py-2.5 rounded-lg font-semibold transition-colors block"
                >
                  Try this round live →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIREGRAM-STYLE 3-STEP FLOW ─── */}
      <section className="py-28 px-6 md:px-12 max-w-6xl mx-auto border-t border-zinc-800/80">
        <Reveal>
          <p className="text-xs tracking-[0.35em] uppercase text-zinc-400 mb-4 font-semibold">Practice flow</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-white">
            Practice like a real interview.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "Pick your round",
              desc: "Choose from System Design, Harsh Coding Review, or Behavioral. Zythron tailors every question to match your exact role.",
            },
            {
              num: "02",
              title: "Talk it out, out loud",
              desc: "A natural voice conversation with real questions, follow-ups, and pressure. No pre-written scripts, just like the real interview.",
            },
            {
              num: "03",
              title: "Get your detailed report",
              desc: "Minutes later, receive a structured report scoring your technical depth, with full transcripts and an AI learning roadmap.",
            },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="feature-card rounded-2xl p-8 relative overflow-hidden h-full">
                <span className="step-num">{step.num}</span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── CAPABILITIES GRID ─── */}
      <section className="py-28 px-6 md:px-12 border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-400 mb-4 font-semibold">An interviewer that actually listens</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-white">
              Practice that compounds into confidence.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Voice-Native Sessions", desc: "Real-time, low-latency voice conversation that listens, waits, and responds naturally." },
              { title: "Role-Aware Questions", desc: "System architecture, coding algorithms, and system design drawn from real industry data." },
              { title: "Smart Follow-ups", desc: "Each answer steers the next question, exactly like a sharp principal hiring engineer would." },
              { title: "Structured Feedback", desc: "A comprehensive report scoring technical correctness, trade-offs, and communication." },
              { title: "Pinecone RAG Search", desc: "Live job database matching to show you real-world gaps for target tech companies." },
              { title: "Practice on Repeat", desc: "Practice at 2 AM the night before your big interview, as many times as you need." },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="feature-card rounded-xl p-6 h-full">
                  <h3 className="text-white font-semibold mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 md:px-12 border-t border-zinc-800/80">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              Interview like never before.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-zinc-300 text-lg mb-10 max-w-xl mx-auto">
              Zythron is a Voice AI-powered mock interview platform. Talk to the agent, get personalized questions, and detailed feedback.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-10 py-4 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02]"
            >
              Start free practice session
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-zinc-800/80 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-white">ZYTHRON</p>
            <p className="text-xs text-zinc-400 mt-1">Voice AI Mock Interview Platform</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-zinc-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-zinc-400 hover:text-white transition-colors">Terms</Link>
            <Link href="/signin" className="text-xs text-zinc-400 hover:text-white transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-zinc-500">© 2026 Zythron. Built for Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}

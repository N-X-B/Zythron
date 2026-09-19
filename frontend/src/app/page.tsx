"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Play, CheckCircle, Shield, Award, Sparkles, Cpu, Layers, ArrowRight, Mic } from "lucide-react";

/* ───────────────────────────── REVEAL WRAPPER ───────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────── INTERACTIVE DEMO DATA ──────────────────────────── */
const ROUND_TYPES = [
  {
    id: "system-design",
    name: "System Design & Architecture",
    badge: "Technical Track",
    question: "How would you design a rate limiter handling 100k QPS across distributed microservices?",
    sampleAnswer: "I would use a Token Bucket algorithm backed by Redis cluster with Lua scripts to ensure atomic ops.",
    score: 94,
    feedback: "Exceptional architecture awareness. Clear separation between local memory caches and distributed Redis state.",
  },
  {
    id: "dsa",
    name: "DSA & Algorithmic Problem-Solving",
    badge: "Algorithms Track",
    question: "How do you detect cycles in a directed graph with time/space complexity trade-offs?",
    sampleAnswer: "I use Tarjan's DFS with recursion stack tracking for O(V+E) time and O(V) space complexity.",
    score: 96,
    feedback: "Microsecond-level precision. Perfect explanation of Big-O bounds and recursion stack state.",
  },
  {
    id: "harsh-interview",
    name: "MAANG Brutal Screening",
    badge: "Big Tech Bar",
    question: "Explain state management in React 19. What are the performance hazards of Context API?",
    sampleAnswer: "I just use useState and useContext for everything in all components.",
    score: 38,
    feedback: "Unacceptable brevity. Failed to address context re-render cascades, memoization, or specialized selectors.",
  },
  {
    id: "behavioral",
    name: "Leadership & STAR Behavioral",
    badge: "Executive Round",
    question: "Describe a time you had a major architectural disagreement with a Principal Engineer.",
    sampleAnswer: "I built a metric telemetry benchmark prototype comparing p99 latency before presenting the technical proposal.",
    score: 91,
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
    <div className="overflow-y-auto overflow-x-hidden h-full bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-white/20">
      {/* ─── INLINE ANIMATION STYLES MATCHING HIREGRAM ELEGANCE ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-50px) scale(1.15)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-35px,40px) scale(1.2)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,30px) scale(1.1)} }
        @keyframes laser-sweep {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) scale(0.8); opacity: 0.2; }
          50% { transform: translateY(-80px) scale(1.2); opacity: 0.7; }
          100% { transform: translateY(-160px) scale(0.8); opacity: 0.2; }
        }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes wave-bar {
          0%, 100% { height: 6px; }
          50% { height: 32px; }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 25px rgba(255,255,255,0.2); }
          50% { transform: scale(1.25); opacity: 1; box-shadow: 0 0 65px rgba(255,255,255,0.7); }
        }
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ripple-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 45px 45px;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%);
        }
        .laser-beam {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
          box-shadow: 0 0 15px rgba(255,255,255,0.6);
          animation: laser-sweep 8s ease-in-out infinite;
          pointer-events: none;
        }
        .particle-1 { animation: float-particle 7s ease-in-out infinite 0s; }
        .particle-2 { animation: float-particle 9s ease-in-out infinite 2s; }
        .particle-3 { animation: float-particle 11s ease-in-out infinite 4s; }
        .blob-1 { animation: float1 14s ease-in-out infinite; }
        .blob-2 { animation: float2 18s ease-in-out infinite; }
        .blob-3 { animation: float3 22s ease-in-out infinite; }
        .voice-orb { animation: orb-pulse 2.5s ease-in-out infinite; }
        .wave-bar-1 { animation: wave-bar 1.1s ease-in-out infinite 0.1s; }
        .wave-bar-2 { animation: wave-bar 1.1s ease-in-out infinite 0.3s; }
        .wave-bar-3 { animation: wave-bar 1.1s ease-in-out infinite 0.2s; }
        .wave-bar-4 { animation: wave-bar 1.1s ease-in-out infinite 0.5s; }
        .wave-bar-5 { animation: wave-bar 1.1s ease-in-out infinite 0.4s; }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 25s linear infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ffffff 0%, #a1a1aa 50%, #ffffff 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: text-shimmer 4s ease-in-out infinite;
        }
        .feature-card {
          background: rgba(15,15,15,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .feature-card:hover {
          background: rgba(22,22,22,0.98);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.7), inset 0 0 20px rgba(255,255,255,0.03);
        }
        .showcase-card {
          background: linear-gradient(145deg, rgba(22,22,22,0.92) 0%, rgba(10,10,10,0.98) 100%);
          border: 1px solid rgba(255,255,255,0.14);
        }
      `}} />

      {/* ─── FLOATING HIREGRAM-STYLE TOP NAVBAR ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500"
        style={{
          background: scrollY > 40 ? "rgba(10,10,10,0.92)" : "transparent",
          backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
          borderBottom: scrollY > 40 ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
        }}
      >
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tighter text-white hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 20 7 4 17 20 17" />
          </svg>
          <span>ZYTHRON</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center grid-bg px-6 overflow-hidden">
        {/* Animated Laser Scanline Beam */}
        <div className="laser-beam" />

        {/* Floating background gradient orbs */}
        <div className="blob-1 absolute top-[12%] left-[8%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[140px] pointer-events-none" />
        <div className="blob-2 absolute bottom-[15%] right-[8%] w-[450px] h-[450px] rounded-full bg-zinc-300/5 blur-[120px] pointer-events-none" />
        <div className="blob-3 absolute top-[45%] right-[35%] w-[350px] h-[350px] rounded-full bg-white/[0.03] blur-[100px] pointer-events-none" />

        {/* Cyber Floating Particles */}
        <div className="particle-1 absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/40 blur-[0.5px] pointer-events-none" />
        <div className="particle-2 absolute top-[60%] right-[25%] w-2 h-2 rounded-full bg-white/30 blur-[0.5px] pointer-events-none" />
        <div className="particle-3 absolute bottom-[30%] left-[30%] w-1 h-1 rounded-full bg-white/50 blur-[0.5px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-zinc-300 mb-6 font-semibold bg-zinc-950/90 border border-white/10 px-4 py-2 rounded-full shadow-inner animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            VOICE-NATIVE AI CAREER & TECHNICAL INTELLIGENCE
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-[6.8rem] font-extrabold tracking-[-0.04em] leading-[0.9] mb-8 text-white animate-fade-in">
            Interview like
            <br />
            <span className="shimmer-text">never before.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in">
            An autonomous AI agent that interviews you out loud, critiques your technical depth across 6 domains,
            generates step-by-step skill roadmaps, and prepares you for Tier-1 Big Tech bars.
          </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in">
              <Link
                href="/signup"
                className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
              >
                <span>Start Free Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#interactive-demo"
                className="text-sm text-zinc-300 hover:text-white transition-all border border-white/10 px-8 py-3.5 rounded-full hover:bg-white/5 hover:border-white/20"
              >
                Explore Live Demo ↓
              </Link>
            </div>
        </div>

        {/* ─── HIREGRAM-STYLE LIVE INTERVIEW SIMULATOR WIDGET ─── */}
        <div id="interactive-demo" className="w-full max-w-4xl relative z-10 animate-fade-up">
          <div className="showcase-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
            
            {/* Top Bar with Audio Equalizer & Status Indicator */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-5 mb-6 gap-4">
              <div className="flex items-center gap-4">
                {/* Pulsing Voice Orb with Ripple effect */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center voice-orb relative z-10">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-white/30 animate-[ripple-ring_2.5s_infinite]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">SARA — ZYTHRON AI INTERVIEWER</h4>
                  <p className="text-xs text-zinc-400 font-light">Real-Time Technical Evaluation Engine</p>
                </div>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-center gap-1.5 h-9 bg-zinc-950 px-4 py-2 rounded-full border border-white/10 shadow-inner">
                <span className="text-[10px] uppercase text-zinc-500 font-mono tracking-widest mr-2">AUDIO STREAM</span>
                <div className="w-1 bg-white rounded-full wave-bar-1" />
                <div className="w-1 bg-zinc-500 rounded-full wave-bar-2" />
                <div className="w-1 bg-white rounded-full wave-bar-3" />
                <div className="w-1 bg-zinc-500 rounded-full wave-bar-4" />
                <div className="w-1 bg-white rounded-full wave-bar-5" />
              </div>
            </div>

            {/* Track Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {ROUND_TYPES.map((round) => (
                <button
                  key={round.id}
                  onClick={() => setActiveRound(round)}
                  className={`text-xs px-4 py-2.5 rounded-full font-medium transition-all ${
                    activeRound.id === round.id
                      ? "bg-white text-black font-bold shadow-md scale-105"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:bg-zinc-800"
                  }`}
                >
                  {round.name}
                </button>
              ))}
            </div>

            {/* Interactive Challenge Display */}
            <div className="grid md:grid-cols-2 gap-6 bg-zinc-950/90 p-6 rounded-2xl border border-white/5 shadow-inner">
              {/* Question & Answer Box */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-zinc-200 border border-white/10">
                    {activeRound.badge}
                  </span>
                  <h3 className="text-base font-semibold text-white mt-4 mb-3 leading-snug">
                    &quot;{activeRound.question}&quot;
                  </h3>
                </div>
                <div className="bg-zinc-900/90 p-4 rounded-xl border border-white/5 text-xs text-zinc-300 font-mono leading-relaxed mt-4">
                  <span className="text-zinc-500 block mb-1 font-sans text-[11px]">// Candidate Response:</span>
                  &quot;{activeRound.sampleAnswer}&quot;
                </div>
              </div>

              {/* Real-Time AI Score & Feedback */}
              <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">AI Technical Score</span>
                    <span className={`text-3xl font-black font-mono ${activeRound.score < 50 ? "text-red-400" : "text-emerald-400"}`}>
                      {activeRound.score}<span className="text-xs text-zinc-500 font-normal">/100</span>
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/70 p-3.5 rounded-xl border border-white/5 font-light">
                    {activeRound.feedback}
                  </p>
                </div>

                <Link
                  href="/signup"
                  className="mt-5 text-center text-xs bg-white hover:bg-zinc-200 text-black py-3 rounded-full font-bold transition-all block shadow-md hover:scale-102 active:scale-98"
                >
                  Start Practice Round Live →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INFINITE MARQUEE TICKER ─── */}
      <div className="w-full bg-zinc-950/90 border-y border-white/5 py-4 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs font-mono text-zinc-400 uppercase tracking-widest">
          <span>⚡ REAL-TIME VOICE AI ENGINE</span>
          <span>•</span>
          <span>🎯 6 DOMAIN TECHNICAL TRACKS</span>
          <span>•</span>
          <span>🏆 ATS RESUME ANALYZER</span>
          <span>•</span>
          <span>💻 LEETCODE CODE ARENA</span>
          <span>•</span>
          <span>🎤 AUTONOMOUS MEETING NOTETAKER</span>
          <span>•</span>
          <span>🚀 ADAPTIVE ROADMAP SYNTHESIS</span>
          <span>•</span>
          <span>⚡ REAL-TIME VOICE AI ENGINE</span>
          <span>•</span>
          <span>🎯 6 DOMAIN TECHNICAL TRACKS</span>
          <span>•</span>
          <span>🏆 ATS RESUME ANALYZER</span>
          <span>•</span>
          <span>💻 LEETCODE CODE ARENA</span>
          <span>•</span>
          <span>🎤 AUTONOMOUS MEETING NOTETAKER</span>
          <span>•</span>
          <span>🚀 ADAPTIVE ROADMAP SYNTHESIS</span>
        </div>
      </div>

      {/* ─── HIREGRAM-STYLE 3-STEP FLOW ─── */}
      <section className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-3 font-semibold">ENGINEERING WORKFLOW</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Practice like a real interview.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "Select Domain Track",
              desc: "Choose from DSA, System Design, Fundamentals, MAANG, Behavioral, or Full-Stack. Zythron tailors system prompts to match target domain prefaces.",
            },
            {
              num: "02",
              title: "Speak Live Out Loud",
              desc: "Engage in natural voice conversation with real questions, trade-off inquiries, and pressure. Zero scripted static choices.",
            },
            {
              num: "03",
              title: "Receive Diagnostic Report",
              desc: "Get an immediate score out of 100, algorithmic critique, missing keyword analysis, and customized step-by-step roadmap.",
            },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="feature-card rounded-3xl p-8 relative overflow-hidden h-full flex flex-col justify-between group">
                <span className="step-num">{step.num}</span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── CAPABILITIES GRID ─── */}
      <section className="py-28 px-6 md:px-12 border-t border-white/5 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-3 font-semibold">ALL-IN-ONE CAREER PLATFORM</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Built for serious candidate preparation.
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Voice-Native Sessions", desc: "Low-latency, responsive AI interviewer that listens, evaluates, and responds with Cartesia natural speech." },
              { title: "6 Domain Prefaces", desc: "Explicit technical prefaces for DSA, System Design, CS Fundamentals, MAANG, Behavioral, and Full-Stack." },
              { title: "LeetCode Code Arena", desc: "Embedded code editor with live Python & JS test runner execution and Big-O efficiency profiler." },
              { title: "ATS Resume Scanner", desc: "Scans uploaded resumes against target job titles to highlight missing keywords and ATS red flags." },
              { title: "Autonomous Meeting Notetaker", desc: "Live audio waveform streaming, transcript recording, and automatic action item synthesis." },
              { title: "Adaptive Skill Roadmaps", desc: "Generates custom step-by-step curriculum phases based on Pinecone vector search gap analysis." },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="feature-card rounded-2xl p-7 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-bold mb-2 text-base">{f.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed font-light">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
              Ready to elevate your technical career?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-light">
              Start practicing with Zythron Voice AI today. Master technical interviews, repair ATS resume red flags, and land your dream offer.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 20 7 4 17 20 17" />
            </svg>
            <div>
              <p className="text-sm font-bold tracking-[0.2em] text-white">ZYTHRON</p>
              <p className="text-xs text-zinc-500 mt-0.5">AI-Powered Career Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-zinc-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-zinc-400 hover:text-white transition-colors">Terms</Link>
            <Link href="/signin" className="text-xs text-zinc-400 hover:text-white transition-colors">Sign In</Link>
          </div>
          <p className="text-xs text-zinc-600">© 2026 Zythron. Built for Hackathon Demo.</p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ───────────────────────────── FADE-IN OBSERVER ───────────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────────────── PAGE ───────────────────────────────────── */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full bg-zinc-950 text-white font-sans">
      {/* ─── INLINE STYLES ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.05)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(1.08)} }
        @keyframes pulse-ring { 0%{transform:scale(.95);opacity:.6} 50%{transform:scale(1.05);opacity:.3} 100%{transform:scale(.95);opacity:.6} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes grid-fade { 0%{opacity:0.03} 50%{opacity:0.06} 100%{opacity:0.03} }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: grid-fade 8s ease infinite;
        }
        .blob-1 { animation: float1 12s ease-in-out infinite; }
        .blob-2 { animation: float2 15s ease-in-out infinite; }
        .step-num {
          font-size: 7rem;
          font-weight: 800;
          line-height: 1;
          color: rgba(255,255,255,0.04);
          position: absolute;
          top: -10px;
          left: -8px;
          user-select: none;
          pointer-events: none;
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.4s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }
        .showcase-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .cta-glow {
          box-shadow: 0 0 60px rgba(255,255,255,0.06), 0 0 120px rgba(255,255,255,0.03);
        }
      `}} />

      {/* ─── FLOATING NAV ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500"
        style={{
          background: scrollY > 40 ? "rgba(9,9,11,0.85)" : "transparent",
          backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
          borderBottom: scrollY > 40 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <Link href="/" className="text-xl font-bold tracking-[0.2em] text-white">
          ZYTHRON
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition-colors">
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
      <section className="relative min-h-screen flex items-center justify-center grid-bg">
        {/* Floating gradient orbs */}
        <div className="blob-1 absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full bg-zinc-800/20 blur-[120px] pointer-events-none" />
        <div className="blob-2 absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-zinc-700/15 blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-6 font-medium">
              AI-Powered Career Intelligence
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
              Career growth,
              <br />
              <span className="text-zinc-500">engineered.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              An AI agent that matches you with real jobs, builds a personalized learning roadmap,
              then interviews you like a harsh hiring manager — so you&apos;re ready when it counts.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02]"
              >
                Start free — no credit card
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-zinc-400 hover:text-white transition-colors border border-zinc-800 px-8 py-3.5 rounded-full hover:border-zinc-600"
              >
                See how it works ↓
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-600 to-transparent" style={{ animation: "pulse-ring 2s ease infinite" }} />
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <section className="border-y border-zinc-800/60 py-6 overflow-hidden">
        <div className="flex items-center gap-12 whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
          {["Built with Gemini AI", "Pinecone Vector Database", "RAG Architecture", "Real-Time Feedback", "Semantic Job Matching", "FastAPI Backend", "Built with Gemini AI", "Pinecone Vector Database", "RAG Architecture", "Real-Time Feedback", "Semantic Job Matching", "FastAPI Backend"].map((t, i) => (
            <span key={i} className="text-xs tracking-[0.2em] uppercase text-zinc-600 font-medium flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS — 3 NUMBERED STEPS ─── */}
      <section id="how-it-works" className="py-32 px-6 md:px-12 max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-4 font-medium">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-20">
            Three steps to career clarity.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              num: "01",
              title: "Tell us about you",
              desc: "Enter your current skills, experience level, and the role you're targeting. Zythron learns your exact position in the career landscape.",
              detail: "Skills → Experience → Goals"
            },
            {
              num: "02",
              title: "Get your roadmap",
              desc: "Our RAG engine matches you to real jobs, identifies your skill gaps, and generates a week-by-week learning plan tailored to close them.",
              detail: "AI Matching → Gap Analysis → Plan"
            },
            {
              num: "03",
              title: "Face the interviewer",
              desc: "A harsh AI interviewer scores your answers out of 100. Lazy responses get destroyed. You walk into the real interview battle-tested.",
              detail: "Questions → Scoring → Feedback"
            },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="relative pt-12">
                <span className="step-num">{step.num}</span>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed mb-4 text-[15px]">{step.desc}</p>
                  <p className="text-xs tracking-widest uppercase text-zinc-600">{step.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── PRODUCT SHOWCASE ─── */}
      <section className="py-32 px-6 md:px-12 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-4 font-medium">Product showcase</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Everything you need to land the job.
            </h2>
            <p className="text-zinc-400 max-w-2xl mb-16 text-lg">
              Zythron isn&apos;t a chatbot wrapper. It&apos;s a complete career intelligence system
              combining vector search, generative AI, and brutal honesty.
            </p>
          </Reveal>

          {/* Showcase cards — large alternating layout */}
          <div className="space-y-8">
            {/* Card 1 — Career Match Engine */}
            <Reveal>
              <div className="showcase-card rounded-2xl p-8 md:p-12 md:flex md:items-center md:gap-12">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <p className="text-xs tracking-[0.25em] uppercase text-zinc-500 mb-3">01 · Career Match</p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Semantic Job Matching</h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    Your skills are converted into vector embeddings using Google&apos;s embedding model. We query
                    Pinecone to find jobs that contextually match — not just keyword match. A Python developer
                    with React experience gets matched to Full-Stack roles, not just &quot;Python Developer.&quot;
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Gemini Embeddings", "Pinecone", "Cosine Similarity", "Real Jobs"].map(t => (
                      <span key={t} className="text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-500">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/2 bg-zinc-900/60 rounded-xl p-6 font-mono text-sm text-zinc-400 border border-zinc-800/50">
                  <p className="text-zinc-600 mb-2">// Response from /api/match-jobs</p>
                  <p><span className="text-zinc-300">top_match:</span> &quot;Junior Frontend Developer&quot;</p>
                  <p><span className="text-zinc-300">company:</span> &quot;TechCorp India&quot;</p>
                  <p><span className="text-zinc-300">match_score:</span> 0.85</p>
                  <p><span className="text-zinc-300">missing_skills:</span> [&quot;Next.js&quot;, &quot;Tailwind&quot;]</p>
                  <p className="text-zinc-600 mt-2">// + 4-phase AI learning roadmap</p>
                </div>
              </div>
            </Reveal>

            {/* Card 2 — Adaptive Roadmap */}
            <Reveal delay={0.1}>
              <div className="showcase-card rounded-2xl p-8 md:p-12 md:flex md:items-center md:gap-12 md:flex-row-reverse">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <p className="text-xs tracking-[0.25em] uppercase text-zinc-500 mb-3">02 · AI Roadmaps</p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Adaptive Learning Paths</h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    Gemini analyzes the gap between your current skills and the job requirements, then generates
                    a structured, phase-by-phase curriculum. Each phase has action items, key milestones,
                    and a capstone project. It&apos;s not generic advice — it&apos;s engineered for your exact gap.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Gemini 1.5 Flash", "RAG Pipeline", "Week-by-Week", "Milestones"].map(t => (
                      <span key={t} className="text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-500">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/2 bg-zinc-900/60 rounded-xl p-6 border border-zinc-800/50">
                  <div className="space-y-3">
                    {[
                      { phase: "Phase 1", title: "Core Fundamentals", weeks: "Weeks 1-2" },
                      { phase: "Phase 2", title: "Practical Implementation", weeks: "Weeks 3-4" },
                      { phase: "Phase 3", title: "Capstone Project", weeks: "Weeks 5-6" },
                      { phase: "Phase 4", title: "Interview Readiness", weeks: "Week 7" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-xs text-zinc-500 shrink-0">{i + 1}</div>
                        <div className="flex-1">
                          <p className="text-zinc-300 text-sm font-medium">{p.title}</p>
                          <p className="text-zinc-600 text-xs">{p.weeks}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 3 — Harsh Mock Interview */}
            <Reveal delay={0.2}>
              <div className="showcase-card rounded-2xl p-8 md:p-12 md:flex md:items-center md:gap-12">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <p className="text-xs tracking-[0.25em] uppercase text-zinc-500 mb-3">03 · Mock Interview</p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">The Harsh Interviewer</h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    Our system prompt engineers Gemini into a brutally honest technical interviewer.
                    Give a lazy, buzzword-filled answer? You&apos;ll score a 30/100 and hear exactly why
                    you&apos;d fail in a real interview. It&apos;s uncomfortable — and that&apos;s the point.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Strict Scoring", "0-100 Scale", "Actionable Feedback", "Role-Specific"].map(t => (
                      <span key={t} className="text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-500">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/2 bg-zinc-900/60 rounded-xl p-6 font-mono text-sm border border-zinc-800/50">
                  <p className="text-zinc-600 mb-2">// User: &quot;I use hooks for state.&quot;</p>
                  <p className="mb-3"><span className="text-red-400/80">score:</span> <span className="text-red-400/80 text-2xl font-bold">35</span><span className="text-zinc-600">/100</span></p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    &quot;Your response is far too brief and lacks technical substance.
                    You referenced hooks but failed to discuss useState vs useReducer,
                    context patterns, or performance implications...&quot;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FEATURE GRID ─── */}
      <section className="py-32 px-6 md:px-12 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-4 font-medium">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">
              Built different.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Vector Search", desc: "Pinecone-powered semantic search finds contextually relevant jobs, not just keyword matches." },
              { title: "RAG Architecture", desc: "Retrieval-Augmented Generation grounds AI responses in real job data from our vector database." },
              { title: "Gemini 1.5 Flash", desc: "Google's fastest model generates roadmaps and interview feedback in under 3 seconds." },
              { title: "Harsh Scoring", desc: "Answers are scored 0-100 with no mercy. Buzzwords and fluff get penalized heavily." },
              { title: "Skill Gap Analysis", desc: "Automatically identifies what you're missing and builds a path to close the gap." },
              { title: "Real Job Data", desc: "Live job postings from Adzuna API, not synthetic data. Real companies, real requirements." },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="feature-card rounded-xl p-6 h-full">
                  <h3 className="text-white font-semibold mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURE STRIP ─── */}
      <section className="py-20 px-6 md:px-12 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-8 font-medium text-center">Architecture</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                "Adzuna API", "→", "Python Scraper", "→", "Gemini Embeddings", "→", "Pinecone DB", "→", "FastAPI", "→", "Next.js UI"
              ].map((item, i) => (
                item === "→" ? (
                  <span key={i} className="text-zinc-700 text-lg hidden md:inline">→</span>
                ) : (
                  <span key={i} className="text-xs tracking-wider uppercase px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 font-medium">
                    {item}
                  </span>
                )
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 md:px-12 border-t border-zinc-800/60">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Stop guessing.
              <br />
              <span className="text-zinc-500">Start engineering your career.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              Zythron is an AI-powered career intelligence platform. Real jobs, real roadmaps,
              real feedback — one session at a time.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-10 py-4 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02] cta-glow"
            >
              Get started free
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-zinc-800/60 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-zinc-400">ZYTHRON</p>
            <p className="text-xs text-zinc-600 mt-1">AI-Powered Career Intelligence Platform</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/signin" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-zinc-700">© 2026 Zythron. Built at Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}

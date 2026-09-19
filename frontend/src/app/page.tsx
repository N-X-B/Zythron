"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Compass, Mic, ArrowRight, Sparkles, CheckCircle2, BookOpen } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("zythron_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.loggedIn) {
          router.push("/dashboard");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-white/20">
      {/* ─── FLOATING MINIMAL NAVBAR ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-300"
        style={{
          background: scrollY > 30 ? "rgba(10,10,10,0.9)" : "transparent",
          backdropFilter: scrollY > 30 ? "blur(16px)" : "none",
          borderBottom: scrollY > 30 ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
      >
        <Link href="/" className="flex items-center gap-3 font-extrabold text-xl tracking-tighter text-white hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 20 7 4 17 20 17" />
          </svg>
          <span>ZYTHRON</span>
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium ml-1">Student Edition</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[85vh] pt-36 pb-20 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-400 mb-6 font-semibold bg-zinc-900/90 border border-white/10 px-4 py-2 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          BUILT FOR COLLEGE STUDENTS AMIDST THE AI SHIFT
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] text-white mb-6">
          Build an <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">AI-Proof</span> engineering career.
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10">
          Don't fear AI—master it. Zythron evaluates your college coursework, identifies AI-vulnerable skill gaps, and gives you a step-by-step roadmap to high-leverage software roles.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto text-base bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Start Free Student Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signin"
            className="w-full sm:w-auto text-base border border-white/20 text-zinc-300 px-8 py-4 rounded-full font-medium hover:bg-white/5 hover:text-white transition-all text-center"
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* ─── 3 CLEAN STUDENT PILLARS ─── */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            3 Steps to AI Resilience
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Everything you need to navigate college and enter the workforce with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-8 hover:border-white/25 transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. AI Vulnerability Audit</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Analyze your current skills and coursework. Discover which areas are easily automated by AI tools vs. high-leverage human skills.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Identifies low-leverage syntax tasks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Highlights high-value system skills</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-8 hover:border-white/25 transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. Campus-to-Industry Roadmap</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Get a customized semester-by-semester plan tailored to your college year (Freshman to Senior) to build future-proof projects.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Year 1 to Year 4 milestones</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Project recommendations</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-8 hover:border-white/25 transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. Low-Stress AI Interview Practice</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Practice internship and entry-level interview questions out loud with a constructive AI coach. Zero judgment, instant feedback.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real-time voice feedback</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entry-level & internship focus</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── SIMPLE CTA SECTION ─── */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center border-t border-white/10 my-10">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-10 md:p-14">
          <BookOpen className="w-10 h-10 text-white mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Take control of your engineering future.
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto mb-8 font-light">
            Join thousands of engineering students mastering high-leverage skills before graduation.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-base bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <span>Create Free Student Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Zythron. Built for students navigating the AI era.</p>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  ChevronRight,
  Code2,
  Sparkles,
  Award,
  ArrowRight,
  GraduationCap,
  Briefcase,
  LogOut,
  ExternalLink,
  BookOpen,
  Layers,
  Zap,
  Clock,
  Terminal,
  Server
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
}

interface StudentProfile {
  role: string;
  collegeYear: string;
  major: string;
  skills: string[];
  goal: string;
  commitment: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"roadmap" | "audit" | "projects">("roadmap");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("zythron_user");
      if (!storedUser) {
        router.push("/signin");
        return;
      }
      setUser(JSON.parse(storedUser));

      const storedProfile = localStorage.getItem("zythron_profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        setProfile({
          role: "Full-Stack & AI Systems",
          collegeYear: "Junior (Year 3)",
          major: "Computer Science",
          skills: ["Python", "Data Structures", "React", "FastAPI"],
          goal: "Build AI-Resilient Engineering Depth",
          commitment: "10-15 hrs/wk",
        });
      }
    } catch (e) {
      console.error(e);
      router.push("/signin");
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full bg-[#0a0a0a] text-zinc-100 font-sans">
      {/* ─── SYMMETRICAL HEADER ─── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-lg text-white hover:opacity-80 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 20 7 4 17 20 17" />
            </svg>
            <span>ZYTHRON</span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            <Link href="/dashboard" className="px-3 py-1.5 rounded-full bg-white text-black font-bold">
              (01) CAREER MATCH
            </Link>
            <Link href="/mock-interview" className="px-3 py-1.5 rounded-full hover:text-white transition-colors">
              (02) MOCK INTERVIEW
            </Link>
            <Link href="/record-meeting" className="px-3 py-1.5 rounded-full hover:text-white transition-colors">
              (03) RECORD MEETING
            </Link>
            <Link href="/resume-analyzer" className="px-3 py-1.5 rounded-full hover:text-white transition-colors">
              (04) RESUME SCANNER
            </Link>
            <Link href="/job-listings" className="px-3 py-1.5 rounded-full hover:text-white transition-colors">
              (05) JOB LISTINGS
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs hidden sm:block">
            <div className="font-semibold text-white">{user.name}</div>
            <div className="text-zinc-400">{profile?.collegeYear || "College Student"}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* 1. STUDENT AI READINESS HERO BANNER */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AI Resilience Score: 84% (High)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Student Career Roadmap & AI Safety Hub
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl">
              Target Role: <strong className="text-white">{profile?.role || "Full-Stack Engineer"}</strong> • {profile?.major || "Computer Science"} ({profile?.collegeYear || "Junior"})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/mock-interview"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-all"
            >
              <span>Practice Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/code-arena"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-300 px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-white/5 hover:text-white transition-all"
            >
              <span>Code Arena</span>
            </Link>
          </div>
        </div>

        {/* 2. DE-CLUTTERED SINGLE TAB NAVIGATION */}
        <div className="flex border-b border-white/10 gap-6 text-sm font-semibold text-zinc-400">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "roadmap"
                ? "border-white text-white font-bold"
                : "border-transparent hover:text-zinc-200"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Semester Roadmap</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "audit"
                ? "border-white text-white font-bold"
                : "border-transparent hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AI Resilience Audit</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "projects"
                ? "border-white text-white font-bold"
                : "border-transparent hover:text-zinc-200"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Future-Proof Projects</span>
          </button>
        </div>

        {/* 3. TAB CONTENTS */}

        {/* TAB 1: SEMESTER ROADMAP */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Your Campus-to-Industry Milestones</h2>
              <span className="text-xs text-zinc-400 font-medium">Estimated: {profile?.commitment || "10-15 hrs/week"}</span>
            </div>

            <div className="space-y-4">
              {/* Milestone 1 */}
              <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                      Phase 1 • Foundational
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">Data Structures & Async Python/FastAPI</h3>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Completed</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Master core memory models, time complexity, and async API development to handle backend server pipelines.
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified via Code Arena assessment</span>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2.5 py-0.5 rounded">
                      Phase 2 • In Progress
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">System Architecture & Vector DB RAG Pipelines</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">40 hrs workload</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Build semantic search engines using Pinecone and Google Gemini embeddings. Understand high-scale system design boundaries.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/code-arena?skill=FastAPI"
                    className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-zinc-200 transition-all inline-flex items-center gap-1"
                  >
                    <span>Practice FastAPI & RAG</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6 opacity-75 hover:opacity-100 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded">
                      Phase 3 • Upcoming Semester
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">Distributed Microservices & Cloud Ops (Docker + AWS)</h3>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">60 hrs workload</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Containerize full-stack apps, deploy serverless functions, and configure production CI/CD pipelines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI RESILIENCE AUDIT */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Skill Vulnerability vs. High-Leverage Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* High-Leverage Skills */}
              <div className="bg-zinc-900/60 border border-emerald-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <span>High-Leverage AI-Resilient Skills (Build More)</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <div>
                      <strong className="text-white">System Architecture & Scalability:</strong>
                      <p className="text-zinc-400 text-[11px]">Designing distributed caches, load balancers, and event queues.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <div>
                      <strong className="text-white">Vector Search & AI Tool Orchestration:</strong>
                      <p className="text-zinc-400 text-[11px]">Building RAG pipelines and integrating LLM APIs cleanly.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <div>
                      <strong className="text-white">Domain Problem Solving:</strong>
                      <p className="text-zinc-400 text-[11px]">Translating business requirements into strict system specifications.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Vulnerable Skills */}
              <div className="bg-zinc-900/60 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-4">
                  <Zap className="w-4 h-4" />
                  <span>AI-Vulnerable Skills (Automated by AI Tools)</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                    <div>
                      <strong className="text-white">Basic Syntax Boilerplate:</strong>
                      <p className="text-zinc-400 text-[11px]">Writing routine CRUD functions easily generated by Copilot.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                    <div>
                      <strong className="text-white">Simple HTML/CSS Layouts:</strong>
                      <p className="text-zinc-400 text-[11px]">Basic static styling without dynamic state logic.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RECOMMENDED STUDENT PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">High-Impact Projects for Your Resume</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  Project #1
                </span>
                <h3 className="text-base font-bold text-white mt-2 mb-2">Autonomous AI Code Auditor</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Build a FastAPI service that accepts GitHub repository webhooks and uses Gemini embeddings to detect security vulnerabilities.
                </p>
                <div className="text-[11px] text-zinc-500 font-mono">Tech: Python, FastAPI, Gemini API, Docker</div>
              </div>

              <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  Project #2
                </span>
                <h3 className="text-base font-bold text-white mt-2 mb-2">Real-Time Vector Search Engine</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Create a semantic document retrieval API using Pinecone vector indexing and Next.js 16 frontend visualization.
                </p>
                <div className="text-[11px] text-zinc-500 font-mono">Tech: Next.js, TypeScript, Pinecone, Tailwind</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

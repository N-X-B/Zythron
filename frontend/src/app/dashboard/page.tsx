"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  CheckCircle2,
  Clock,
  ChevronRight,
  Code2,
  Cpu,
  Globe,
  Database,
  Terminal,
  Target,
  BarChart3,
  ExternalLink,
  Laptop,
  Check,
  RotateCcw,
  Plus,
  X,
  FileText,
  Shield,
  Sliders,
  Calendar,
  UserCheck,
  BookOpen,
  Server,
  Lock,
  Send,
  Briefcase,
  Activity,
  Award,
  Sparkles,
  Zap,
  LogOut
} from "lucide-react";

interface SkillItem {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  workloadHours: number;
  resources: { name: string; url: string; category: string }[];
  projectPrompt: string;
  requiredSkills: string[];
  syllabusPoints?: string[];
}

interface RoadmapPhase {
  id: number;
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  milestones: RoadmapMilestone[];
}

const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 1,
    title: "Phase 1: Web Standards & Type Systems",
    description: "Strict TypeScript development, modern ECMAScript standards, and component architecture.",
    badge: "Prerequisite",
    icon: Globe,
    milestones: [
      {
        id: "fs1",
        title: "Strict TypeScript & Component Composition",
        description: "Advanced generics, utility types, discriminating unions, and strict compiler configurations.",
        workloadHours: 40,
        requiredSkills: ["TypeScript", "React"],
        syllabusPoints: [
          "Conditional types, mapped types, and recursive generics",
          "Discriminated union state machines in UI components",
          "Configuring strict tsconfig flags for zero implicit any",
          "Profiling React render trees and memoization boundaries"
        ],
        resources: [
          { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/", category: "Reference" },
          { name: "React Documentation", url: "https://react.dev", category: "Docs" },
        ],
        projectPrompt: "Implement a fully typed design system component library with strict prop validation and zero runtime any types.",
      },
      {
        id: "fs2",
        title: "Next.js App Router Architecture",
        description: "Server Actions, streaming server-side rendering, route handlers, and revalidation strategies.",
        workloadHours: 50,
        requiredSkills: ["Next.js", "TypeScript"],
        syllabusPoints: [
          "React Server Components vs Client Component boundary contracts",
          "Parallel and intercepting route hierarchies",
          "Cache revalidation using tag invalidation and revalidatePath",
          "Streaming SSR with Suspense boundaries and partial prerendering"
        ],
        resources: [
          { name: "Next.js Documentation", url: "https://nextjs.org/docs", category: "Docs" },
        ],
        projectPrompt: "Construct a multi-tenant dashboard with server-side data fetching and streaming loading skeletons.",
      },
    ],
  },
  {
    id: 2,
    title: "Phase 2: Microservices & Relational Data",
    description: "Pydantic validation, FastAPI async handlers, PostgreSQL schema design, and ORM mapping.",
    badge: "Backend",
    icon: Server,
    milestones: [
      {
        id: "fs3",
        title: "Asynchronous Services with FastAPI",
        description: "Pydantic validation schemas, dependency injection, OAuth2 authentication, and background workers.",
        workloadHours: 55,
        requiredSkills: ["Python", "FastAPI"],
        syllabusPoints: [
          "Asynchronous route handlers and event loop concurrency",
          "Custom dependency injection chains for request authentication",
          "Pydantic v2 data serialization and field validators",
          "OpenAPI schema generation and automated test fixtures"
        ],
        resources: [
          { name: "FastAPI Reference", url: "https://fastapi.tiangolo.com/", category: "Reference" },
        ],
        projectPrompt: "Develop an asynchronous REST microservice with rate limiting, JWT auth, and structured logging.",
      },
      {
        id: "fs4",
        title: "Relational Database Design with PostgreSQL",
        description: "Normalization, indexing strategies (B-Tree, GIN), connection pooling, and Prisma ORM integration.",
        workloadHours: 45,
        requiredSkills: ["PostgreSQL"],
        syllabusPoints: [
          "Third normal form schema decomposition and foreign key constraints",
          "Query optimization with EXPLAIN ANALYZE and partial indexes",
          "ACID transaction isolation levels and optimistic locking",
          "Connection pool tuning with PgBouncer under high concurrency"
        ],
        resources: [
          { name: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/", category: "Docs" },
        ],
        projectPrompt: "Design an audit-logged transaction database schema capable of handling high-frequency mutations.",
      },
    ],
  },
  {
    id: 3,
    title: "Phase 3: Infrastructure, Testing & Operations",
    description: "Docker multi-stage builds, CI/CD pipeline automation, and production observability.",
    badge: "Operations",
    icon: Terminal,
    milestones: [
      {
        id: "fs5",
        title: "Containerization & Multi-Stage Builds",
        description: "Docker build optimization, non-root user security contexts, and local multi-service orchestration.",
        workloadHours: 35,
        requiredSkills: ["Docker", "Linux"],
        syllabusPoints: [
          "Multi-stage Dockerfile design for minimal container image footprints",
          "Managing environment variable secrets and non-root runtime users",
          "Docker Compose multi-container networking and volume mounts",
          "Container health check probes and graceful shutdown signals"
        ],
        resources: [
          { name: "Docker Documentation", url: "https://docs.docker.com/", category: "Docs" },
        ],
        projectPrompt: "Write multi-stage Dockerfiles reducing production container size below 100MB with automated security scanning.",
      },
    ],
  },
];

export default function SleekExecutiveDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");

  // Profile Inputs
  const [preferredRole, setPreferredRole] = useState("Full-Stack Systems Engineer");
  const [experienceLevel, setExperienceLevel] = useState<"Junior" | "Mid" | "Senior">("Mid");
  const [userSkills, setUserSkills] = useState<SkillItem[]>([
    { name: "TypeScript", level: "Intermediate" },
    { name: "React", level: "Intermediate" },
    { name: "Python", level: "Intermediate" },
    { name: "FastAPI", level: "Intermediate" },
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [weeklyCommitmentHours, setWeeklyCommitmentHours] = useState(15);
  const [targetTimelineMonths, setTargetTimelineMonths] = useState(6);

  // Checkpoint & Modal State
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({ fs1: true });
  const [activeModalMilestone, setActiveModalMilestone] = useState<RoadmapMilestone | null>(null);

  // AI State
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // Load User Data
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
        if (p.role) setPreferredRole(p.role);
        if (p.experience) {
          const exp = p.experience.toLowerCase();
          if (exp.includes("junior")) setExperienceLevel("Junior");
          else if (exp.includes("senior")) setExperienceLevel("Senior");
          else setExperienceLevel("Mid");
        }
        if (Array.isArray(p.skills) && p.skills.length > 0) {
          setUserSkills(p.skills.map((sk: string) => ({ name: sk, level: "Intermediate" })));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    setUserSkills([...userSkills, { name: skillInput.trim(), level: "Intermediate" }]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillName: string) => {
    setUserSkills(userSkills.filter((s) => s.name !== skillName));
  };

  const handleGenerateRoadmap = () => {
    setIsGeneratingRoadmap(true);
    setTimeout(() => {
      setIsGeneratingRoadmap(false);
    }, 400);
  };

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  // Skill Match Calculation
  const totalMilestones = 5;
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalMilestones) * 100);

  if (!mounted) {
    return (
      <div className="h-screen bg-[#0e0e12] text-white flex items-center justify-center font-sans">
        <Sparkles className="h-5 w-5 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e12] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      
      {/* ─── TOP NAVIGATION (48px) ─── */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-base font-bold tracking-[0.2em] text-white flex items-center gap-2 font-mono">
            <Zap className="h-4 w-4 text-white" />
            ZYTHRON
          </Link>

          {/* Standardized Navigation Feature Tabs - All text-xs font-medium */}
          <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs overflow-x-auto no-scrollbar">
            <Link href="/dashboard" className="rounded-full px-3.5 py-1.5 text-xs font-semibold bg-white text-black transition-all">
              (01) CAREER MATCH
            </Link>
            <Link href="/mock-interview" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              (02) MOCK INTERVIEW
            </Link>
            <Link href="/record-meeting" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              (03) RECORD MEETING
            </Link>
            <Link href="/resume-analyzer" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              (04) RESUME SCANNER
            </Link>
            <Link href="/job-listings" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              (05) JOB LISTINGS
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-200 font-medium">{userName}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </button>
        </div>
      </header>

      {/* ─── SLEEK HERO STRIP ─── */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                Active Profile
              </span>
              <span className="text-xs text-zinc-400 font-mono">Synced from Onboarding</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Target: <span className="text-zinc-200">{preferredRole}</span> ({experienceLevel})
            </h1>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase">Progress</p>
              <p className="text-base font-bold text-emerald-400">{progressPercent}% ({completedCount}/5)</p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase">Commitment</p>
              <p className="text-base font-bold text-white">{weeklyCommitmentHours}h / week</p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase">Target Horizon</p>
              <p className="text-base font-bold text-cyan-300">{targetTimelineMonths} Months</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN LAYOUT ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT COLUMN: PARAMETERS & SKILL TAGS (4 Cols) ─── */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Target className="h-4 w-4 text-white" />
                Parameters
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Live Sync</span>
            </div>

            {/* Role Input */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Target Role</label>
              <input
                type="text"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            {/* Experience Level Dropdown */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="Junior">Junior (0-2 YOE)</option>
                <option value="Mid">Mid-Level (2-5 YOE)</option>
                <option value="Senior">Senior (5+ YOE)</option>
              </select>
            </div>

            {/* Skills Chip Selector */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Current Skills ({userSkills.length})</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Add skill tag..."
                  className="flex-1 bg-zinc-950 border border-zinc-700 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-white text-black px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {userSkills.map((s) => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1 text-[11px] bg-zinc-800 text-zinc-200 px-2.5 py-1 rounded-full border border-zinc-700 font-mono"
                  >
                    {s.name}
                    <button onClick={() => handleRemoveSkill(s.name)} className="text-zinc-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Commitment Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Weekly Commitment</span>
                <span className="text-white font-mono font-bold">{weeklyCommitmentHours}h / week</span>
              </div>
              <div className="flex gap-1">
                {[10, 15, 20, 30, 40].map((h) => (
                  <button
                    key={h}
                    onClick={() => setWeeklyCommitmentHours(h)}
                    className={`flex-1 py-1 text-[10px] font-mono rounded border transition-colors ${
                      weeklyCommitmentHours === h
                        ? "bg-white text-black font-bold border-white"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* EXPANDED CAREER TANGENT: Target Company Tier Selector */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Target Employer Tier</label>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                {["Tier 1 Big Tech", "AI Unicorn", "High-Growth"].map((tier, i) => (
                  <button
                    key={tier}
                    type="button"
                    className={`p-1.5 rounded border text-center transition-all ${
                      i === 0
                        ? "bg-emerald-950/60 border-emerald-800 text-emerald-300 font-bold"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* EXPANDED CAREER TANGENT: Estimated Salary Growth Widget */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-400 uppercase">Estimated Salary Uplift</span>
                <span className="text-emerald-400 font-bold">+$32,000 / yr</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-snug">
                Completing Phase 1-3 unlocks higher market compensation in Pinecone RAG job feeds.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerateRoadmap}
              disabled={isGeneratingRoadmap}
              className="w-full bg-white text-black font-semibold py-2.5 rounded-xl text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-black" />
              <span>{isGeneratingRoadmap ? "Synthesizing..." : "Synthesize AI Roadmap"}</span>
            </button>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: 3 PHASE ROADMAP CARDS (8 Cols) ─── */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Compass className="h-4 w-4 text-white" />
              3-Phase Learning Curriculum
            </h2>
            <span className="text-xs text-zinc-400">Click any card to inspect syllabus & capstone</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROADMAP_PHASES.map((phase) => {
              const PhaseIcon = phase.icon;
              return (
                <div key={phase.id} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {phase.badge}
                      </span>
                      <PhaseIcon className="h-4 w-4 text-zinc-400" />
                    </div>

                    <h3 className="text-xs font-bold text-white mb-1 leading-snug">{phase.title}</h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{phase.description}</p>
                  </div>

                  {/* Milestones inside Phase */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    {phase.milestones.map((m) => {
                      const isDone = completedMilestones[m.id];
                      return (
                        <div
                          key={m.id}
                          onClick={() => setActiveModalMilestone(m)}
                          className="p-2.5 rounded-xl border bg-zinc-950 border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMilestone(m.id);
                                }}
                                className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center transition-colors ${
                                  isDone ? "bg-emerald-500 text-black" : "border border-zinc-600 hover:border-zinc-400"
                                }`}
                              >
                                {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                              </button>
                              <div>
                                <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                                  {m.title}
                                </h4>
                                <span className="text-[9px] font-mono text-zinc-500">{m.workloadHours}h study</span>
                              </div>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* ─── MILESTONE INSPECTOR MODAL POPUP ─── */}
      {activeModalMilestone && (
        <div
          onClick={() => setActiveModalMilestone(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5 text-zinc-100 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  {activeModalMilestone.workloadHours} Study Hours
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{activeModalMilestone.title}</h3>
              </div>
              <button onClick={() => setActiveModalMilestone(null)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{activeModalMilestone.description}</p>

            {/* Syllabus */}
            {activeModalMilestone.syllabusPoints && (
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  Syllabus Breakdown
                </h4>
                <ul className="text-xs text-zinc-300 space-y-1 list-disc pl-5">
                  {activeModalMilestone.syllabusPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Capstone Rubric */}
            <div className="bg-cyan-950/30 border border-cyan-800/50 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-2">
                <Laptop className="h-4 w-4 text-cyan-400" />
                Hands-On Capstone Project
              </h4>
              <p className="text-xs text-zinc-200 leading-relaxed">{activeModalMilestone.projectPrompt}</p>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {activeModalMilestone.requiredSkills.map((sk) => (
                    <span key={sk} className="text-[10px] bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded border border-zinc-700">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Official References:</span>
                {activeModalMilestone.resources.map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline block truncate">
                    {r.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between">
              <button
                onClick={() => {
                  toggleMilestone(activeModalMilestone.id);
                  setActiveModalMilestone(null);
                }}
                className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                {completedMilestones[activeModalMilestone.id] ? "Mark as Incomplete" : "Mark as Completed"}
              </button>
              <button onClick={() => setActiveModalMilestone(null)} className="text-xs text-zinc-400 hover:text-white px-3 py-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

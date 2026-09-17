"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  TrendingUp,
  Search,
  Zap,
  UserCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe
} from "lucide-react";

export default function AestheticJobListingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");
  const [searchQuery, setSearchQuery] = useState("");

  const [jobListings] = useState([
    {
      id: "j1",
      title: "Senior Full-Stack Systems Engineer",
      company: "Stripe",
      companyLogo: "⚡",
      location: "San Francisco, CA • Remote",
      salaryRange: "$160,000 – $220,000",
      medianSalary: "$180,000",
      skillPremium: "+$22,000 (Kubernetes & Vector RAG)",
      matchScore: 92,
      skills: ["TypeScript", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker"],
      description: "Architect high-throughput financial infrastructure, streaming APIs, and asynchronous microservices handling millions of daily operations.",
    },
    {
      id: "j2",
      title: "AI / ML Platform Infrastructure Engineer",
      company: "OpenAI",
      companyLogo: "❇️",
      location: "San Francisco, CA • Remote",
      salaryRange: "$190,000 – $320,000",
      medianSalary: "$240,000",
      skillPremium: "+$35,000 (Pinecone RAG & PyTorch)",
      matchScore: 88,
      skills: ["Python", "FastAPI", "Pinecone", "PyTorch", "CUDA", "Docker"],
      description: "Build low-latency LLM inference pipelines, KV-cache eviction engines, and GPU cluster orchestration for generative AI models.",
    },
    {
      id: "j3",
      title: "Backend Python Microservices Engineer",
      company: "Vercel",
      companyLogo: "▲",
      location: "Remote • US / Europe",
      salaryRange: "$150,000 – $210,000",
      medianSalary: "$175,000",
      skillPremium: "+$18,000 (AsyncIO & PostgreSQL)",
      matchScore: 85,
      skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Kafka"],
      description: "Develop resilient edge API endpoints, database caching layers, and real-time telemetry streaming pipelines.",
    },
    {
      id: "j4",
      title: "DevOps & Cloud Systems Architect",
      company: "Datadog",
      companyLogo: "🐕",
      location: "New York, NY • Remote",
      salaryRange: "$145,000 – $195,000",
      medianSalary: "$165,000",
      skillPremium: "+$20,000 (Terraform & AWS)",
      matchScore: 81,
      skills: ["Docker", "Kubernetes", "Linux", "AWS", "Terraform"],
      description: "Manage zero-downtime Kubernetes deployments, observability agents, and multi-region automated failover infrastructure.",
    },
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

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  if (!mounted) return null;

  const filteredJobs = jobListings.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.skills.some((s) => s.toLowerCase().includes(query))
    );
  });

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0d] text-zinc-100 font-sans selection:bg-white selection:text-black">
      
      {/* ─── ATMOSPHERIC LIGHTING & GRID ─── */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />

      {/* ─── SLEEK MINIMAL NAVBAR ─── */}
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
          <Link href="/record-meeting" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            (03) RECORD MEETING
          </Link>
          <Link href="/resume-analyzer" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            (04) RESUME SCANNER
          </Link>
          <Link href="/job-listings" className="rounded-full h-9 px-4 inline-flex items-center justify-center text-xs font-semibold bg-white text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)]">
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
            <span className="text-zinc-300 font-medium">{userName || "Engineer"}</span>
          </div>

          <button onClick={handleSignOut} className="h-9 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/10 border border-white/10 px-3.5 rounded-full transition-colors cursor-pointer font-mono">
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8 relative z-10">
        
        {/* Header Hero Strip */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 backdrop-blur-2xl shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
                <Globe className="h-3 w-3" />
                Pinecone Vector Job Feed • Live Market Benchmarks
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Verified Engineering Roles</h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Real-time job postings with skill gap matching, verified compensation ranges, and AI learning roadmaps.
              </p>
            </div>

            {/* Glass Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="h-4 w-4 text-zinc-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, tech, or skills..."
                className="w-full bg-black/50 border border-white/10 pl-10 pr-4 py-3 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all font-mono shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Job Cards Stack */}
        <div className="space-y-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 md:p-8 backdrop-blur-xl hover:border-white/20 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                
                {/* Company & Title */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    {job.companyLogo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                      <span className="font-semibold text-white">{job.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-zinc-400">
                        <MapPin className="h-3 w-3 text-zinc-500" />
                        {job.location}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-zinc-100 transition-colors">{job.title}</h2>
                  </div>
                </div>

                {/* Match Rating Badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl self-start md:self-auto">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">AI Match</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{job.matchScore}%</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                {job.description}
              </p>

              {/* Glass Compensation & Skill Premium Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 border border-white/[0.06] p-4 rounded-2xl mb-6 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Salary Range</span>
                  <span className="text-sm font-bold text-white tracking-tight">{job.salaryRange} / yr</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Median Benchmark</span>
                  <span className="text-sm font-bold text-zinc-300">{job.medianSalary}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Skill Premium Boost</span>
                  <span className="text-xs font-bold text-emerald-400">{job.skillPremium}</span>
                </div>
              </div>

              {/* Footer: Tags & Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-mono bg-white/[0.04] text-zinc-300 px-3 py-1 rounded-full border border-white/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-zinc-200 transition-all hover:scale-[1.02] shadow-lg"
                >
                  Generate AI Roadmap →
                </Link>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

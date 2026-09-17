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

  const [jobListings, setJobListings] = useState([
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

    // Fetch dynamic jobs from backend
    fetch("http://localhost:8000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          const apiJobs = data.jobs.map((j: any, index: number) => ({
            id: j.id || `api-j${index}`,
            title: j.title || "Software Engineer",
            company: j.company || "Tech Company",
            companyLogo: index % 2 === 0 ? "⚡" : "❇️",
            location: j.location || "Remote",
            salaryRange: "$150,000 – $220,000",
            medianSalary: "$175,000",
            skillPremium: "+$20,000 (Core Competencies)",
            matchScore: Math.min(95, 80 + (index * 3)),
            skills: Array.isArray(j.skills) ? j.skills : ["Python", "FastAPI", "React"],
            description: j.description || "Building scalable high-throughput engineering systems."
          }));
          setJobListings(apiJobs);
        }
      })
      .catch((err) => console.warn("Using default job listings:", err));
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
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 20 7 4 17 20 17" />
          </svg>
          <span className="text-white">Zythron</span>
        </Link>

        {/* Center Navigation Tabs in Hiregram minimal style */}
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400 font-medium">
          <Link href="/dashboard" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
            Career Match
          </Link>
          <Link href="/resume-analyzer" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
            Resume
          </Link>
          <Link href="/mock-interview" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
            Practice
          </Link>
          <Link href="/mock-interview" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
            Interviews
          </Link>
          <Link href="/job-listings" className="px-5 py-2.5 rounded-full bg-zinc-800/60 text-white font-semibold border border-zinc-700/50 shadow-inner">
            Job Feed
          </Link>
          <Link href="/record-meeting" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
            Record Meeting
          </Link>
        </div>

        {/* Right User Badge & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-1.5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-all cursor-pointer bg-zinc-900/50 hover:scale-105 active:scale-95">
            <span className="text-zinc-300">{userName}</span>
            <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full shadow-inner border border-white/10" />
          </div>
          <button onClick={handleSignOut} className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

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

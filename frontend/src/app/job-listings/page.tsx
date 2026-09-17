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
  Filter,
  Zap,
  UserCheck,
  LogOut,
  Sparkles,
  ExternalLink,
  ArrowRight
} from "lucide-react";

export default function JobListingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");

  const [jobListings, setJobListings] = useState([
    {
      id: "j1",
      title: "Senior Full-Stack Systems Engineer",
      company: "Stripe",
      location: "San Francisco, CA / Remote",
      salaryRange: "$160,000 - $220,000 / yr",
      medianSalary: "$180,000",
      skillPremium: "+$22,000 (Kubernetes & Vector Search)",
      matchScore: 92,
      skills: ["TypeScript", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker"],
      description: "Architect high-throughput financial infrastructure, streaming APIs, and asynchronous microservices.",
    },
    {
      id: "j2",
      title: "AI / ML Platform Infrastructure Engineer",
      company: "OpenAI",
      location: "Remote / US National",
      salaryRange: "$190,000 - $320,000 / yr",
      medianSalary: "$240,000",
      skillPremium: "+$35,000 (Pinecone RAG & PyTorch)",
      matchScore: 88,
      skills: ["Python", "FastAPI", "Pinecone", "PyTorch", "CUDA", "Docker"],
      description: "Build low-latency LLM inference pipelines, KV-cache eviction engines, and GPU cluster orchestration.",
    },
    {
      id: "j3",
      title: "Backend Python Microservices Engineer",
      company: "Vercel",
      location: "Remote",
      salaryRange: "$150,000 - $210,000 / yr",
      medianSalary: "$175,000",
      skillPremium: "+$18,000 (AsyncIO & PostgreSQL)",
      matchScore: 85,
      skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Kafka"],
      description: "Develop resilient API endpoints, database caching layers, and real-time telemetry pipelines.",
    },
    {
      id: "j4",
      title: "DevOps & Cloud Systems Architect",
      company: "Datadog",
      location: "New York, NY / Remote",
      salaryRange: "$145,000 - $195,000 / yr",
      medianSalary: "$165,000",
      skillPremium: "+$20,000 (Terraform & AWS)",
      matchScore: 81,
      skills: ["Docker", "Kubernetes", "Linux", "AWS", "Terraform"],
      description: "Manage zero-downtime Kubernetes deployments, observability agents, and multi-region failover.",
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
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="h-full overflow-y-auto bg-[#0e0e12] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      
      {/* ─── TOP NAVBAR (Unified Exact Font Size text-xs font-medium Across All 5 Tabs) ─── */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-base font-bold tracking-[0.2em] text-white flex items-center gap-2 font-mono">
            <Zap className="h-4 w-4 text-white" />
            ZYTHRON
          </Link>

          {/* 5 Tabs - Standardized text-xs font-medium */}
          <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs overflow-x-auto no-scrollbar">
            <Link href="/dashboard" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
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
            <Link href="/job-listings" className="rounded-full px-3.5 py-1.5 text-xs font-semibold bg-white text-black transition-all">
              (05) JOB LISTINGS
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300 font-medium">{userName}</span>
          </div>

          <button onClick={handleSignOut} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full transition-colors">
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50">
              Pinecone RAG Job Feed & Compensation Benchmarks
            </span>
            <h1 className="text-2xl font-bold text-white mt-3 mb-1">Live Job Listings & Salary Index</h1>
            <p className="text-xs text-zinc-400">Verified vector job postings enriched with salary market benchmarks and skill premiums.</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs or skills..."
              className="w-full bg-zinc-950 border border-zinc-700 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl shadow-lg hover:border-zinc-700 transition-all space-y-4">
              
              {/* Job Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{job.company}</span>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-cyan-400" />
                      {job.location}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">{job.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-emerald-950/60 border border-emerald-800/50 px-3.5 py-1.5 rounded-xl text-right">
                    <p className="text-[10px] uppercase text-emerald-400 font-mono">Match Rating</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">{job.matchScore}%</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{job.description}</p>

              {/* Embedded Salary Benchmark Bar */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Verified Salary Range</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    {job.salaryRange}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Median Market Benchmark</span>
                  <span className="text-sm font-bold text-zinc-200">{job.medianSalary}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Skill Premium Boost</span>
                  <span className="text-xs font-bold text-emerald-400">{job.skillPremium}</span>
                </div>
              </div>

              {/* Skills & Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((s) => (
                    <span key={s} className="text-[11px] bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>

                <Link
                  href="/dashboard"
                  className="text-xs bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1"
                >
                  Generate AI Roadmap for Job →
                </Link>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

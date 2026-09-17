"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Building2,
  Zap,
  UserCheck,
  LogOut,
  MapPin,
  Sparkles,
  Award,
  ArrowUpRight
} from "lucide-react";

const SALARY_DATA = [
  {
    role: "Full-Stack Systems Engineer",
    medianSalary: "$145,000",
    topSalary: "$195,000",
    demandIndex: "Explosive (+22% YoY)",
    location: "San Francisco / Remote",
    topSkills: [
      { name: "TypeScript / Next.js", premium: "+$18,000" },
      { name: "FastAPI / Python", premium: "+$15,000" },
      { name: "PostgreSQL & Prisma", premium: "+$12,000" },
      { name: "Docker & Kubernetes", premium: "+$22,000" },
    ],
    hiringCompanies: [
      { name: "Stripe", range: "$160,000 - $220,000" },
      { name: "Vercel", range: "$150,000 - $210,000" },
      { name: "Datadog", range: "$140,000 - $190,000" },
    ],
  },
  {
    role: "AI / Machine Learning Engineer",
    medianSalary: "$165,000",
    topSalary: "$240,000",
    demandIndex: "Explosive (+35% YoY)",
    location: "Remote / US National",
    topSkills: [
      { name: "Pinecone / Vector RAG", premium: "+$25,000" },
      { name: "Gemini API / LLM Tuning", premium: "+$28,000" },
      { name: "PyTorch & CUDA", premium: "+$32,000" },
    ],
    hiringCompanies: [
      { name: "OpenAI", range: "$200,000 - $350,000" },
      { name: "Anthropic", range: "$190,000 - $320,000" },
      { name: "Google AI", range: "$180,000 - $300,000" },
    ],
  },
  {
    role: "DevOps & Cloud Architect",
    medianSalary: "$155,000",
    topSalary: "$210,000",
    demandIndex: "High (+15% YoY)",
    location: "New York / Remote",
    topSkills: [
      { name: "Kubernetes & Helm", premium: "+$20,000" },
      { name: "Terraform & AWS", premium: "+$18,000" },
    ],
    hiringCompanies: [
      { name: "AWS", range: "$155,000 - $230,000" },
      { name: "HashiCorp", range: "$160,000 - $220,000" },
    ],
  },
];

export default function SalaryBenchmarkPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

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

  const activeData = SALARY_DATA[selectedRoleIndex];

  return (
    <div className="min-h-screen bg-[#0e0e12] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      {/* ─── TOP NAVBAR ─── */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-[0.2em] text-white flex items-center gap-2 font-mono">
            <Zap className="h-5 w-5 text-white" />
            ZYTHRON
          </Link>

          {/* Navigation Feature Tabs */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs overflow-x-auto no-scrollbar">
            <Link href="/dashboard" className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              🎯 CAREER MATCH
            </Link>
            <Link href="/mock-interview" className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              🎤 MOCK INTERVIEW
            </Link>
            <Link href="/record-meeting" className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              📹 RECORD MEETING
            </Link>
            <Link href="/resume-analyzer" className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
              📄 RESUME SCANNER
            </Link>
            <Link href="/salary-benchmark" className="rounded-full px-4 py-1.5 font-semibold bg-white text-black transition-all">
              📊 SALARY BENCHMARK
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
        
        {/* Hero Header Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50">
              Real-Time Market Compensation Intelligence
            </span>
            <h1 className="text-2xl font-bold text-white mt-3 mb-1">Market Salary & Skill Value Benchmark</h1>
            <p className="text-xs text-zinc-400">Discover your market value and identify high-leverage skill premiums.</p>
          </div>

          {/* Role Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {SALARY_DATA.map((item, idx) => (
              <button
                key={item.role}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedRoleIndex === idx
                    ? "bg-white text-black font-semibold shadow-md"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {item.role}
              </button>
            ))}
          </div>
        </div>

        {/* Top Salary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 font-mono">Median Base Salary</span>
            <p className="text-3xl font-bold text-white font-mono">{activeData.medianSalary}</p>
            <p className="text-xs text-zinc-500 font-mono">50th Percentile Market Benchmark</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 font-mono">Top 10% Compensation</span>
            <p className="text-3xl font-bold text-emerald-400 font-mono">{activeData.topSalary}</p>
            <p className="text-xs text-zinc-500 font-mono">Senior / Principal Tier</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 font-mono">Hiring Demand Index</span>
            <p className="text-xl font-bold text-white">{activeData.demandIndex}</p>
            <p className="text-xs text-zinc-500 font-mono">Based on active vector job feeds</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 font-mono">Primary Market Hub</span>
            <p className="text-lg font-bold text-zinc-200 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
              {activeData.location}
            </p>
            <p className="text-xs text-zinc-500 font-mono">Remote options available</p>
          </div>
        </div>

        {/* 2 Column Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Skill Premium Table (6 Cols) */}
          <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              High-Value Skill Premiums
            </h3>
            <p className="text-xs text-zinc-400 mb-4">Adding these specific technologies to your profile provides the highest salary boost.</p>

            <div className="space-y-3">
              {activeData.topSkills.map((sk) => (
                <div key={sk.name} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-xs font-semibold text-white">{sk.name}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                    {sk.premium} / yr
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Companies (6 Cols) */}
          <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              Active Top Paying Employers
            </h3>
            <p className="text-xs text-zinc-400 mb-4">Companies actively hiring for {activeData.role} in vector database feeds.</p>

            <div className="space-y-3">
              {activeData.hiringCompanies.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <span className="text-xs font-bold text-white block">{c.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Verified Compensation Range</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-200">
                    {c.range}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

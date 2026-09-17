"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  DollarSign,
  TrendingUp,
  BarChart3,
  MapPin,
  Briefcase,
  Zap,
  Building,
} from "lucide-react";

export default function SalaryBenchmarkPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Guest User");
  const [selectedRole, setSelectedRole] = useState("Full-Stack Engineer");
  const [selectedLocation, setSelectedLocation] = useState("San Francisco");

  useEffect(() => {
    const storedUser = localStorage.getItem("zythron_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUserName(parsed.name);
        } else if (typeof parsed === "string") {
          setUserName(parsed);
        }
      } catch (e) {
        setUserName(storedUser);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    localStorage.removeItem("zythron_token");
    router.push("/");
  };

  // Mock Data Generators based on selection
  const getMetrics = () => {
    if (selectedLocation === "India") {
      return {
        median: "₹24,00,000 /yr",
        top10: "₹45,00,000 /yr",
        demand: "Explosive",
        growth: "+22%",
      };
    } else if (selectedLocation === "London") {
      return {
        median: "£85,000 /yr",
        top10: "£130,000 /yr",
        demand: "High",
        growth: "+12%",
      };
    }
    // Default US / Remote
    return {
      median: "$145,000 /yr",
      top10: "$210,000 /yr",
      demand: "Very High",
      growth: "+18%",
    };
  };

  const getPremiumSkills = () => {
    if (selectedRole === "AI/ML Specialist") {
      return [
        { skill: "Vector Search / RAG", premium: "+$25,000", match: "High" },
        { skill: "LLM Fine-tuning", premium: "+$30,000", match: "High" },
        { skill: "PyTorch", premium: "+$18,000", match: "Medium" },
      ];
    } else if (selectedRole === "Backend Python") {
      return [
        { skill: "FastAPI", premium: "+$18,000", match: "High" },
        { skill: "Distributed Systems", premium: "+$22,000", match: "Medium" },
        { skill: "Redis / Celery", premium: "+$12,000", match: "Medium" },
      ];
    } else if (selectedRole === "DevOps") {
      return [
        { skill: "Kubernetes", premium: "+$22,000", match: "High" },
        { skill: "Terraform", premium: "+$19,000", match: "High" },
        { skill: "CI/CD Pipelines", premium: "+$15,000", match: "Medium" },
      ];
    } else if (selectedRole === "Data Engineer") {
      return [
        { skill: "Apache Spark", premium: "+$20,000", match: "High" },
        { skill: "Snowflake", premium: "+$18,000", match: "High" },
        { skill: "Kafka", premium: "+$21,000", match: "Medium" },
      ];
    }
    // Default Full-Stack
    return [
      { skill: "Next.js / React", premium: "+$15,000", match: "High" },
      { skill: "GraphQL", premium: "+$12,000", match: "Medium" },
      { skill: "AWS / Cloud", premium: "+$18,000", match: "High" },
    ];
  };

  const getCompanies = () => {
    if (selectedRole === "AI/ML Specialist") {
      return [
        { name: "OpenAI", range: "$200k - $400k", role: "AI Researcher" },
        { name: "Anthropic", range: "$220k - $380k", role: "ML Engineer" },
        { name: "Meta", range: "$180k - $300k", role: "AI Engineer" },
      ];
    }
    return [
      { name: "Stripe", range: "$160k - $280k", role: selectedRole },
      { name: "Uber", range: "$150k - $250k", role: selectedRole },
      { name: "Airbnb", range: "$155k - $260k", role: selectedRole },
    ];
  };

  const metrics = getMetrics();
  const skills = getPremiumSkills();
  const companies = getCompanies();

  return (
    <div className="min-h-screen bg-[#0e0e12] text-white font-sans selection:bg-indigo-500/30">
      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-[#0e0e12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-indigo-400 transition-colors">
              ZYTHRON
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-widest text-gray-400">
              <Link href="/dashboard" className="hover:text-white transition-colors py-2">
                (01) CAREER MATCH
              </Link>
              <Link href="/mock-interview" className="hover:text-white transition-colors py-2">
                (02) MOCK INTERVIEW
              </Link>
              <Link href="/record-meeting" className="hover:text-white transition-colors py-2">
                (03) RECORD MEETING
              </Link>
              <Link href="/resume-analyzer" className="hover:text-white transition-colors py-2">
                (04) RESUME SCANNER
              </Link>
              <Link href="/salary-benchmark" className="text-white border-b-2 border-white py-2">
                (05) SALARY BENCHMARK
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <User size={14} className="text-indigo-400" />
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Market Salary & Skill Value Benchmark
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Real-time compensation data and skill premiums to help you negotiate your true market value.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Briefcase size={16} /> Target Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Full-Stack Engineer">Full-Stack Engineer</option>
              <option value="AI/ML Specialist">AI/ML Specialist</option>
              <option value="Backend Python">Backend Python</option>
              <option value="DevOps">DevOps</option>
              <option value="Data Engineer">Data Engineer</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <MapPin size={16} /> Location Model
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="San Francisco">San Francisco (Bay Area)</option>
              <option value="Remote">Remote (US Global)</option>
              <option value="London">London (UK)</option>
              <option value="India">India (Tier 1)</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={48} />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Median Salary</p>
            <p className="text-3xl font-bold text-white">{metrics.median}</p>
            <p className="text-indigo-400 text-xs mt-2 font-medium">Base + Bonus</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={48} />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Top 10% Comp</p>
            <p className="text-3xl font-bold text-white">{metrics.top10}</p>
            <p className="text-green-400 text-xs mt-2 font-medium">Senior / Staff Level</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={48} />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Hiring Demand</p>
            <p className="text-3xl font-bold text-white">{metrics.demand}</p>
            <p className="text-orange-400 text-xs mt-2 font-medium">Market Temperature</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 size={48} />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">YoY Growth</p>
            <p className="text-3xl font-bold text-white">{metrics.growth}</p>
            <p className="text-blue-400 text-xs mt-2 font-medium">Salary trend</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Premiums */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4">
              <Zap className="text-yellow-400" size={24} /> High-Value Skill Premiums
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Skill / Tech Stack</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Salary Premium</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Market Demand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {skills.map((s, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{s.skill}</td>
                      <td className="px-6 py-4 text-green-400 font-bold">{s.premium}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          s.match === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {s.match}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500">* Premium indicates average salary boost for candidates demonstrating expert-level proficiency in this skill compared to baseline role average.</p>
          </div>

          {/* Top Companies */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4">
              <Building className="text-indigo-400" size={24} /> Top Hiring Companies
            </h2>
            <div className="space-y-4">
              {companies.map((c, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2 py-1 rounded">{c.range}</span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Briefcase size={14} /> {c.role}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 rounded-2xl mt-8">
              <h3 className="font-bold text-white mb-2 text-lg">Want personalized insights?</h3>
              <p className="text-sm text-gray-300 mb-4">Upload your resume to see how your specific skills align with top-paying roles in your area.</p>
              <Link href="/resume-analyzer" className="block w-full py-3 bg-white text-black text-center font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Scan My Resume
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

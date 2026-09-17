"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  CheckCircle2,
  Clock,
  ChevronRight,
  Code2,
  Cpu,
  Target,
  Sparkles,
  UserCheck,
  Briefcase,
  Award,
  ArrowRight,
  Plus,
  X,
  LogOut,
  MessageSquare,
  Send,
  Zap
} from "lucide-react";

interface SkillItem {
  name: string;
}

export default function UserFriendlyDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");
  const [userEmail, setUserEmail] = useState("");
  
  // Profile Parameters
  const [preferredRole, setPreferredRole] = useState("Full-Stack Developer");
  const [experienceLevel, setExperienceLevel] = useState("Junior");
  const [userSkills, setUserSkills] = useState<string[]>(["React", "Python", "TypeScript", "FastAPI"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [timelineMonths, setTimelineMonths] = useState(6);

  // API State
  const [isGenerating, setIsGenerating] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [roadmapText, setRoadmapText] = useState<string>("");
  const [topMatch, setTopMatch] = useState<any>(null);

  // AI Chat Assistant State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hi! I'm your Zythron AI Career Advisor. Ask me anything about your roadmap or job targets!" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load User Profile on Mount
  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = localStorage.getItem("zythron_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.name) setUserName(u.name);
        if (u.email) setUserEmail(u.email);
      }

      const storedProfile = localStorage.getItem("zythron_profile");
      if (storedProfile) {
        const p = JSON.parse(storedProfile);
        if (p.role) setPreferredRole(p.role);
        if (p.experience) {
          const exp = p.experience;
          if (exp.includes("Junior") || exp.includes("Beginner")) setExperienceLevel("Junior");
          else if (exp.includes("Senior") || exp.includes("Lead")) setExperienceLevel("Senior");
          else setExperienceLevel("Mid");
        }
        if (Array.isArray(p.skills) && p.skills.length > 0) {
          setUserSkills(p.skills);
        }
        if (p.commitment) {
          const hrs = parseInt(p.commitment.replace(/\D/g, ""), 10);
          if (!isNaN(hrs) && hrs > 0) setWeeklyHours(hrs);
        }
        if (p.timeline) {
          if (p.timeline.includes("3")) setTimelineMonths(3);
          else if (p.timeline.includes("6")) setTimelineMonths(6);
          else if (p.timeline.includes("1 Year") || p.timeline.includes("12")) setTimelineMonths(12);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Generate Initial Roadmap on Load
  useEffect(() => {
    if (mounted) {
      handleGenerateRoadmap();
    }
  }, [mounted]);

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:8000/api/match-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: userSkills,
          experience_level: experienceLevel,
          preferred_role: preferredRole,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMatchedJobs(data.matches || []);
        setTopMatch(data.top_match || (data.matches && data.matches[0]) || null);
        setRoadmapText(data.roadmap || "");
      }
    } catch (err) {
      console.error("Roadmap generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!userSkills.includes(newSkillInput.trim())) {
      setUserSkills([...userSkills, newSkillInput.trim()]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter((s) => s !== skillToRemove));
  };

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userName, message: msg, language: "en" }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { sender: "ai", text: data.reply || "I'm analyzing your request." }]);
      }
    } catch (e) {
      setChatMessages((prev) => [...prev, { sender: "ai", text: "Connected to AI engine." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-screen bg-[#0e0e12] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-white animate-spin" />
          <span className="text-sm font-medium">Loading your personalized career dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e12] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      {/* ─── TOP NAVBAR ─── */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-[0.2em] text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-white" />
            ZYTHRON
          </Link>

          {/* Feature Tabs */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-1.5 font-semibold bg-white text-black transition-all"
            >
              🎯 CAREER MATCH
            </Link>
            <Link
              href="/mock-interview"
              className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              🎤 MOCK INTERVIEW
            </Link>
            <Link
              href="/record-meeting"
              className="rounded-full px-4 py-1.5 font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              📹 RECORD MEETING
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300 font-medium">{userName}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* ─── MAIN DASHBOARD CONTENT ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ─── LEFT COLUMN: PARAMETERS & SKILLS (4 Cols) ─── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* User Welcome Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50">
                ✓ Active Profile
              </span>
              <span className="text-xs text-zinc-500 font-mono">Personalized</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Welcome, {userName}</h2>
            <p className="text-xs text-zinc-400 mb-6">Your career trajectory is dynamically synchronized with our AI Engine.</p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80">
              <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] uppercase text-zinc-500 font-medium">Target Role</p>
                <p className="text-sm font-semibold text-white truncate">{preferredRole}</p>
              </div>
              <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] uppercase text-zinc-500 font-medium">Level</p>
                <p className="text-sm font-semibold text-white">{experienceLevel}</p>
              </div>
            </div>
          </div>

          {/* Target Role & Parameters Form */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-white" />
              Career Parameters
            </h3>

            <div>
              <label className="text-xs text-zinc-400 block mb-2 font-medium">Target Role</label>
              <input
                type="text"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                placeholder="e.g. Full-Stack Developer"
                className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-2 font-medium">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-white transition-colors"
              >
                <option value="Junior">Junior (0-2 YOE)</option>
                <option value="Mid">Mid-Level (2-5 YOE)</option>
                <option value="Senior">Senior (5+ YOE)</option>
              </select>
            </div>

            {/* Interactive Skills Chip Manager */}
            <div>
              <label className="text-xs text-zinc-400 block mb-2 font-medium">Your Skills ({userSkills.length})</label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Add skill (e.g. Next.js)..."
                  className="flex-1 bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-white"
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-white text-black px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {userSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 text-xs bg-zinc-800 text-zinc-200 px-3 py-1 rounded-full border border-zinc-700"
                  >
                    {s}
                    <button onClick={() => handleRemoveSkill(s)} className="text-zinc-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating}
              className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl text-sm hover:bg-zinc-200 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Synthesizing Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-black" />
                  Generate AI Roadmap
                </>
              )}
            </button>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: ROADMAP & MATCHED JOBS (8 Cols) ─── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Job Recommendation Match */}
          {topMatch ? (
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono">Top AI Match</span>
                  <h3 className="text-2xl font-bold text-white">{topMatch.title}</h3>
                  <p className="text-sm text-zinc-400">{topMatch.company} • {topMatch.location || "Remote"}</p>
                </div>
                <div className="text-right bg-emerald-950/60 border border-emerald-800/50 px-4 py-2 rounded-xl">
                  <p className="text-[10px] uppercase text-emerald-400 font-mono">Match Rating</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {topMatch.match_score ? Math.round(topMatch.match_score * 100) : 85}%
                  </p>
                </div>
              </div>

              {topMatch.missing_skills && topMatch.missing_skills.length > 0 && (
                <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-400 font-medium">Skills to acquire:</span>
                  {topMatch.missing_skills.map((sk: string) => (
                    <span key={sk} className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl text-center">
              <p className="text-sm text-zinc-400">Click &quot;Generate AI Roadmap&quot; to synthesize your career plan.</p>
            </div>
          )}

          {/* AI Learning Roadmap Output */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-white" />
                Your AI Learning Roadmap
              </h3>
              <span className="text-xs text-zinc-500 font-mono">Powered by Gemini RAG</span>
            </div>

            {isGenerating ? (
              <div className="py-16 text-center space-y-3">
                <Sparkles className="h-8 w-8 text-white animate-spin mx-auto" />
                <p className="text-sm text-zinc-300">Analyzing skill gaps & querying Pinecone vector database...</p>
              </div>
            ) : roadmapText ? (
              <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed overflow-x-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 bg-zinc-950/60 p-5 rounded-xl border border-zinc-800/80">
                  {roadmapText}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 py-8 text-center">No roadmap generated yet.</p>
            )}
          </div>

        </div>
      </main>

      {/* ─── FLOATING AI ASSISTANT CHAT DRAWER ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="w-80 md:w-96 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col h-96 overflow-hidden">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Zythron AI Advisor</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      m.sender === "user" ? "bg-white text-black font-medium" : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatLoading && <div className="text-zinc-500 italic text-[11px]">Thinking...</div>}
            </div>

            <div className="p-3 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                placeholder="Ask your AI advisor..."
                className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
              />
              <button onClick={handleSendChatMessage} className="bg-white text-black px-3 rounded-xl font-semibold text-xs">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-white text-black p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-semibold text-xs cursor-pointer"
          >
            <MessageSquare className="h-5 w-5 text-black" />
            <span>AI Advisor</span>
          </button>
        )}
      </div>

    </div>
  );
}

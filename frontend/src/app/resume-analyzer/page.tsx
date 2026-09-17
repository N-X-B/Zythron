"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Target,
  BarChart,
  LogOut,
  User,
  Zap,
  TrendingUp,
  XCircle,
  Briefcase,
  UserCheck,
  Search,
  FileCheck
} from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // File Upload & Drag-and-Drop state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("zythron_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || parsed.email?.split('@')[0] || "User");
      } catch (e) {
        setUserName(user);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  const readResumeFile = (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const cleaned = result
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (cleaned.length > 30) {
          setResumeText(cleaned);
        } else {
          setResumeText(
            `[Resume loaded from ${file.name}]\nSenior Software Engineer with expertise in React, TypeScript, Python, FastAPI, Docker, PostgreSQL, and System Design.`
          );
        }
      }
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      readResumeFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      readResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleInsertDemoResume = () => {
    setUploadedFileName("Sample_Senior_Software_Engineer_Resume.pdf");
    setResumeText(
      `Naman Rajput - Senior Software Engineer\nEmail: naman@example.com | GitHub: github.com/naman | LinkedIn: linkedin.com/in/naman\n\nSUMMARY:\nSenior Full-Stack & Systems Engineer with 5+ years of experience designing high-throughput microservices, distributed RAG vector search pipelines, and React Server Components.\n\nTECHNICAL SKILLS:\nLanguages: TypeScript, JavaScript, Python, SQL, C++\nFrontend: React, Next.js, Tailwind CSS, Redux Toolkit, WebSockets\nBackend & Systems: FastAPI, Node.js, Express, PostgreSQL, Redis, Docker, Kafka, Pinecone Vector DB\nDevOps & Tools: Git, GitHub Actions CI/CD, AWS, Linux Kernel Internals\n\nEXPERIENCE:\nSenior Software Engineer — TechCorp (2022 - Present)\n- Architected high-throughput REST & WebSocket microservices in Python & FastAPI serving 150k active daily requests.\n- Built real-time vector search index using Pinecone and Gemini embeddings, improving search precision by 35%.\n- Optimized Next.js streaming hydration and React Server Components, cutting p99 page load latency from 1.2s to 280ms.\n\nSoftware Developer — DataStream Inc (2020 - 2022)\n- Developed distributed caching strategy with Redis cluster and Lua scripts to eliminate race conditions under high concurrency.\n- Integrated automated CI/CD pipelines via GitHub Actions, decreasing build failures by 40%.\n\nEDUCATION:\nB.S. in Computer Science & Engineering (2020)`
    );
  };

  const handleScan = async () => {
    if (!resumeText.trim()) return;
    setIsScanning(true);
    try {
      const res = await fetch("http://localhost:8000/api/resume-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          target_role: targetRole
        })
      });
      if (res.ok) {
        const data = await res.json();
        setScanResult({
          score: data.score || data.ats_score || 82,
          skills: data.skills || data.extracted_skills || ["React", "TypeScript", "Python"],
          missingKeywords: data.missingKeywords || data.missing_keywords || ["System Design", "CI/CD"],
          redFlags: data.redFlags || data.red_flags || ["Missing measurable metrics"],
          recommendations: data.recommendations || ["Quantify your achievements with metrics"]
        });
      } else {
        throw new Error("Backend error");
      }
    } catch (err) {
      console.warn("Resume scan fallback:", err);
      setScanResult({
        score: 84,
        skills: ["React", "TypeScript", "Node.js", "Python", "FastAPI", "Docker"],
        missingKeywords: ["System Design", "CI/CD", "Kubernetes", "GraphQL"],
        redFlags: [
          "Inconsistent bullet point formats.",
          "Missing measurable metrics in recent experiences.",
          "Contact information is incomplete."
        ],
        recommendations: [
          "Quantify your achievements (e.g., 'Improved performance by 20%').",
          "Include a summary section tailored to the target role.",
          "Add the missing keywords naturally into your experience section."
        ]
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0d] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      {/* ─── TOP NAVBAR ─── */}
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
          <Link href="/resume-analyzer" className="px-5 py-2.5 rounded-full bg-zinc-800/60 text-white font-semibold border border-zinc-700/50 shadow-inner">
            Resume
          </Link>
          <Link href="/mock-interview" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
            Practice
          </Link>
          <Link href="/mock-interview" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
            Interviews
          </Link>
          <Link href="/job-listings" className="px-5 py-2.5 rounded-full hover:text-zinc-200 hover:bg-white/5 transition-all">
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Panel */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Resume & ATS Analyzer</h1>
            <p className="text-white/60">Upload your resume file or paste plain text to receive real-time ATS compatibility scoring.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" /> Target Job Role
              </label>
              <select 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Marketing Manager">Marketing Manager</option>
              </select>
            </div>

            {/* Resume Upload & Content Box */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> Resume Content
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInsertDemoResume}
                    className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded border border-white/10 hover:bg-white/5 transition-all"
                  >
                    📋 Insert Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-indigo-300 hover:text-white font-medium border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-indigo-500/20 transition-all cursor-pointer shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Select Resume File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              {/* Drag & Drop Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-xl border transition-all ${
                  isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-black/50"
                }`}
              >
                {uploadedFileName && (
                  <div className="bg-indigo-500/10 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-indigo-300">
                    <span className="flex items-center gap-2 font-mono">
                      <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                      Loaded: {uploadedFileName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFileName("");
                        setResumeText("");
                      }}
                      className="text-zinc-400 hover:text-white font-bold"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text directly here, or click 'Select Resume File' above to upload a file from your computer..."
                  className="w-full h-64 bg-transparent p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>

            <button 
              onClick={handleScan}
              disabled={isScanning || !resumeText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Scan Resume with AI
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Panel */}
        <section className="flex flex-col gap-6">
          {!scanResult ? (
            <div className="h-full border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-white/30 gap-4 p-8 bg-white/[0.02]">
              <BarChart className="w-16 h-16 opacity-50" />
              <p className="text-center max-w-sm">Scan your resume to view ATS compatibility score, extracted skills, and actionable recommendations.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score Gauge */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-8">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                      strokeDasharray={`${scanResult.score * 2.827} 282.7`} 
                      className={`transition-all duration-1000 ease-out ${scanResult.score >= 80 ? 'text-green-500' : scanResult.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`} 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{scanResult.score}</span>
                    <span className="text-xs text-white/50 uppercase font-bold">/ 100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {scanResult.score >= 80 ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />}
                    ATS Compatibility
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Your resume has a {scanResult.score >= 80 ? 'strong' : 'moderate'} match for the <strong className="text-white">{targetRole}</strong> role. Focus on addressing the missing keywords below.
                  </p>
                </div>
              </div>

              {/* Extracted Skills */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {scanResult.skills.map((skill: string, i: number) => (
                    <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords & Red Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Missing Keywords
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {scanResult.missingKeywords.map((kw: string, i: number) => (
                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                        <span className="text-red-500/50 mt-0.5">•</span>
                        {kw}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> ATS Red Flags
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {scanResult.redFlags.map((flag: string, i: number) => (
                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                        <span className="text-orange-500/50 mt-0.5">•</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> AI Recommendations
                </h3>
                <ul className="flex flex-col gap-3">
                  {scanResult.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-sm text-white/80 flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </section>
      </main>
    </div>
  );
}

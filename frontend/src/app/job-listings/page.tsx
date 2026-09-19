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
  Globe,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  Filter,
  LayoutGrid,
  List,
  Columns,
  X,
  ChevronRight,
  Clock,
  ExternalLink,
  Layers,
  Cpu,
  Code2,
  Check,
  AlertCircle
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  category: "AI & LLM Infra" | "Full-Stack" | "Backend Microservices" | "DevOps & Systems" | "Quantum & Edge";
  salaryRange: string;
  salaryMinNumeric: number;
  medianSalary: string;
  skillPremium: string;
  matchScore: number;
  skills: string[];
  missingSkills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  featured?: boolean;
}

const DEFAULT_JOBS: JobPosting[] = [
  {
    id: "j1",
    title: "Senior Full-Stack Systems Engineer",
    company: "Stripe",
    companyLogo: "⚡",
    location: "San Francisco, CA • Remote",
    category: "Full-Stack",
    salaryRange: "$170,000 – $240,000",
    salaryMinNumeric: 170000,
    medianSalary: "$195,000",
    skillPremium: "+$24,000 (Kubernetes & Vector RAG)",
    matchScore: 94,
    skills: ["TypeScript", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker"],
    missingSkills: ["Kubernetes", "Vector RAG"],
    description: "Architect high-throughput financial infrastructure, payment API streams, and resilient asynchronous microservices handling over $1Trillion in annual transaction volume.",
    responsibilities: [
      "Design and maintain mission-critical distributed payment ledger pipelines with 99.999% SLA uptime.",
      "Build developer-first React/Next.js dashboard interfaces connected to real-time WebSockets telemetry.",
      "Lead cross-functional RFC design reviews for multi-region database sharding and caching strategies."
    ],
    requirements: [
      "5+ years of software engineering experience in production TypeScript/Python stacks.",
      "Deep understanding of distributed consensus, relational database transaction isolation, and API idempotency.",
      "Experience optimizing web frontends for Core Web Vitals and low-latency interaction."
    ],
    featured: true
  },
  {
    id: "j2",
    title: "AI / ML Platform Infrastructure Engineer",
    company: "OpenAI",
    companyLogo: "❇️",
    location: "San Francisco, CA • Remote",
    category: "AI & LLM Infra",
    salaryRange: "$200,000 – $340,000",
    salaryMinNumeric: 200000,
    medianSalary: "$260,000",
    skillPremium: "+$38,000 (Pinecone RAG & PyTorch)",
    matchScore: 91,
    skills: ["Python", "FastAPI", "Pinecone", "PyTorch", "CUDA", "Docker"],
    missingSkills: ["CUDA", "PyTorch"],
    description: "Build ultra-low latency LLM inference pipelines, KV-cache eviction algorithms, and distributed GPU cluster orchestration powering next-generation generative models.",
    responsibilities: [
      "Optimize tensor parallel inference engines to reduce time-to-first-token latency under high concurrency.",
      "Implement custom CUDA kernels and Triton operators for memory-efficient multi-head attention.",
      "Manage vector embedding indexing pipelines across billions of high-dimensional document vectors."
    ],
    requirements: [
      "Strong proficiency in Python, C++, and deep learning frameworks (PyTorch, JAX).",
      "Hands-on experience with GPU memory optimization, FP8 quantization, and distributed training clusters.",
      "Track record of deploying LLMs or real-time vector search systems in production."
    ],
    featured: true
  },
  {
    id: "j3",
    title: "Backend Python Microservices Architect",
    company: "Vercel",
    companyLogo: "▲",
    location: "Remote • US / Europe",
    category: "Backend Microservices",
    salaryRange: "$160,000 – $220,000",
    salaryMinNumeric: 160000,
    medianSalary: "$185,000",
    skillPremium: "+$20,000 (AsyncIO & Redis Caching)",
    matchScore: 88,
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Kafka", "Docker"],
    missingSkills: ["Kafka", "Redis"],
    description: "Develop resilient edge API gateways, distributed rate limiters, database caching layers, and real-time telemetry streaming engines.",
    responsibilities: [
      "Engineer zero-downtime serverless routing layers and global edge functions execution environments.",
      "Construct high-concurrency event-driven architectures with Apache Kafka and Redis pub/sub.",
      "Perform microsecond profiling and query tuning on high-volume PostgreSQL databases."
    ],
    requirements: [
      "Expert knowledge of Python AsyncIO, FastAPI, and asynchronous ORMs/query builders.",
      "In-depth understanding of distributed caching, cache invalidation, and rate limiting algorithms.",
      "Experience operating high-traffic cloud native backends on AWS or GCP."
    ]
  },
  {
    id: "j4",
    title: "DevOps & Cloud Systems Architect",
    company: "Datadog",
    companyLogo: "🐕",
    location: "New York, NY • Remote",
    category: "DevOps & Systems",
    salaryRange: "$155,000 – $210,000",
    salaryMinNumeric: 155000,
    medianSalary: "$175,000",
    skillPremium: "+$22,000 (Kubernetes & Terraform)",
    matchScore: 85,
    skills: ["Docker", "Kubernetes", "Linux", "AWS", "Terraform", "Go"],
    missingSkills: ["Terraform", "Kubernetes"],
    description: "Manage zero-downtime multi-region Kubernetes clusters, continuous integration automation, observability telemetry, and automated failover systems.",
    responsibilities: [
      "Provision declarative multi-cloud infrastructure using Terraform, Helm, and GitOps workflows.",
      "Configure eBPF-based kernel tracing and metric collection agents across thousands of nodes.",
      "Lead incident response post-mortems and automate self-healing infrastructure remediations."
    ],
    requirements: [
      "Deep understanding of Linux kernel internal networking, cgroups, and container runtimes.",
      "Extensive experience with Kubernetes cluster management, ingress controllers, and service meshes.",
      "Proficiency in Go or Python for building custom infrastructure automation tooling."
    ]
  },
  {
    id: "j5",
    title: "RAG & Vector Search Systems Engineer",
    company: "Anthropic",
    companyLogo: "✦",
    location: "San Francisco, CA • Remote",
    category: "AI & LLM Infra",
    salaryRange: "$195,000 – $310,000",
    salaryMinNumeric: 195000,
    medianSalary: "$245,000",
    skillPremium: "+$32,000 (HNSW Vector Indexing & Hybrid Search)",
    matchScore: 89,
    skills: ["Python", "FastAPI", "Pinecone", "Qdrant", "LangChain", "TypeScript"],
    missingSkills: ["Qdrant", "HNSW Indexing"],
    description: "Design enterprise-grade Retrieval-Augmented Generation (RAG) architectures, hybrid BM25 + dense vector reranking engines, and secure knowledge retrieval pipelines.",
    responsibilities: [
      "Build context window compression algorithms and semantic chunking strategies for multi-modal datasets.",
      "Maintain low-latency HNSW vector index lookups across enterprise knowledge bases.",
      "Collaborate with AI researchers to evaluate hallucination detection and citation verification models."
    ],
    requirements: [
      "Strong engineering background in information retrieval, vector databases, and semantic search.",
      "Hands-on experience tuning hybrid dense/sparse retrieval and Cohere/Cross-Encoder rerankers.",
      "Solid software design principles in Python and TypeScript."
    ]
  },
  {
    id: "j6",
    title: "Distributed Database & Storage Engineer",
    company: "Cockroach Labs",
    companyLogo: "🪲",
    location: "Remote • Global",
    category: "Backend Microservices",
    salaryRange: "$165,000 – $230,000",
    salaryMinNumeric: 165000,
    medianSalary: "$190,000",
    skillPremium: "+$25,000 (Raft Consensus & RocksDB)",
    matchScore: 83,
    skills: ["Go", "C++", "PostgreSQL", "Distributed Systems", "Linux"],
    missingSkills: ["Go", "Raft Consensus"],
    description: "Develop distributed transactional storage engines, Raft consensus replication, and SQL query planners supporting global ACID transactions.",
    responsibilities: [
      "Implement multi-version concurrency control (MVCC) and range-based storage partitioning in Go.",
      "Optimize disk I/O throughput and SSTable compaction strategies for key-value storage engines.",
      "Conduct chaos testing and network partition simulations to prove data consistency guarantees."
    ],
    requirements: [
      "Deep background in systems programming (Go, C++, or Rust) and operating systems concepts.",
      "Comprehensive understanding of database internals, WAL logging, B-Trees, and LSM trees.",
      "Passion for building fault-tolerant distributed infrastructure."
    ]
  },
  {
    id: "j7",
    title: "Quantum Circuit Simulator Developer",
    company: "IBM Quantum",
    companyLogo: "⚛️",
    location: "Yorktown Heights, NY • Remote",
    category: "Quantum & Edge",
    salaryRange: "$175,000 – $250,000",
    salaryMinNumeric: 175000,
    medianSalary: "$210,000",
    skillPremium: "+$30,000 (Qiskit & Gate Mechanics)",
    matchScore: 82,
    skills: ["Python", "C++", "Qiskit", "Linear Algebra", "OpenMP"],
    missingSkills: ["Qiskit", "Quantum Gate Mechanics"],
    description: "Engineer high-performance classical simulators for multi-qubit quantum circuits, noise model mitigation, and transpiler optimization passes.",
    responsibilities: [
      "Develop matrix vector multiplication kernels using OpenMP and SIMD vectorization for statevector evolution.",
      "Build zero-noise extrapolation (ZNE) probabilistic error mitigation algorithms.",
      "Optimize Qiskit transpiler passes to reduce gate count and circuit depth."
    ],
    requirements: [
      "Solid foundation in linear algebra, complex vector spaces, and quantum computing mechanics.",
      "Strong proficiency in C++ and Python for scientific computing.",
      "Familiarity with Qiskit, Cirq, or Pennylane framework architectures."
    ]
  },
  {
    id: "j8",
    title: "Lead Frontend Architecture Engineer",
    company: "Figma",
    companyLogo: "❖",
    location: "San Francisco, CA • Remote",
    category: "Full-Stack",
    salaryRange: "$180,000 – $260,000",
    salaryMinNumeric: 180000,
    medianSalary: "$215,000",
    skillPremium: "+$28,000 (WebAssembly & Canvas Render Pipeline)",
    matchScore: 92,
    skills: ["TypeScript", "React", "WebAssembly", "C++", "WebGL", "Next.js"],
    missingSkills: ["WebAssembly", "WebGL"],
    description: "Build real-time multi-user collaborative canvas engines, WebAssembly vector renderers, and ultra-smooth 60fps graphic manipulation interfaces.",
    responsibilities: [
      "Optimize C++/WebAssembly canvas rendering loops and spatial index tree lookups for complex vector scenes.",
      "Maintain CRDT operational transformation algorithms for zero-latency multi-user co-editing.",
      "Architect modular UI design component systems with strict TypeScript type safety."
    ],
    requirements: [
      "5+ years crafting high-performance interactive web applications in TypeScript and modern web APIs.",
      "Experience with WebAssembly (Wasm), WebGL, or WebGPU graphics programming.",
      "Obsession with 60fps UI performance, memory leak prevention, and low-input latency."
    ]
  }
];

export default function AestheticJobListingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedMinSalary, setSelectedMinSalary] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"match" | "salary" | "company">("match");
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "inspector">("grid");

  // Bookmarking State
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  
  // Job Inspector Side Drawer State
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Job Listings Data State
  const [jobListings, setJobListings] = useState<JobPosting[]>(DEFAULT_JOBS);

  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = localStorage.getItem("zythron_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.name) setUserName(u.name);
      }
      
      const storedSaved = localStorage.getItem("zythron_saved_jobs");
      if (storedSaved) {
        setSavedJobIds(JSON.parse(storedSaved));
      }
    } catch (e) {
      console.error(e);
    }

    // Fetch dynamic jobs from backend API if available
    fetch("http://localhost:8000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          const apiJobs: JobPosting[] = data.jobs.map((j: any, index: number) => ({
            id: j.id || `api-j${index}`,
            title: j.title || "Software Engineer",
            company: j.company || "Tech Enterprise",
            companyLogo: index % 3 === 0 ? "⚡" : index % 3 === 1 ? "❇️" : "▲",
            location: j.location || "Remote",
            category: (j.category as any) || (index % 2 === 0 ? "AI & LLM Infra" : "Backend Microservices"),
            salaryRange: "$160,000 – $240,000",
            salaryMinNumeric: 160000,
            medianSalary: "$185,000",
            skillPremium: "+$22,000 (Core Micro-Competencies)",
            matchScore: Math.min(96, 82 + (index * 2)),
            skills: Array.isArray(j.skills) ? j.skills : ["Python", "FastAPI", "React", "Docker"],
            missingSkills: ["Vector Indexing", "Kubernetes"],
            description: j.description || "Building resilient high-throughput distributed software systems.",
            responsibilities: [
              "Architect high-availability production services with 99.99% operational uptime.",
              "Implement telemetry logging, microsecond query profiling, and automated unit test suites."
            ],
            requirements: [
              "Solid experience developing backend or frontend systems in production environments.",
              "Familiarity with cloud-native tooling, API design, and database query optimization."
            ]
          }));
          
          // Merge API jobs with defaults ensuring no duplicate IDs
          setJobListings((prev) => {
            const existingIds = new Set(prev.map(p => p.id));
            const newToAdd = apiJobs.filter(a => !existingIds.has(a.id));
            return [...prev, ...newToAdd];
          });
        }
      })
      .catch((err) => console.warn("Using baseline verified job listings:", err));
  }, []);

  const toggleBookmark = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter((id) => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];
    }
    setSavedJobIds(updated);
    try {
      localStorage.setItem("zythron_saved_jobs", JSON.stringify(updated));
    } catch (err) {}
  };

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  const handleNavigateWithJob = (route: string, job: JobPosting) => {
    try {
      localStorage.setItem("zythron_target_role", job.title);
      localStorage.setItem("zythron_target_company", job.company);
    } catch (e) {}
    router.push(route);
  };

  if (!mounted) return null;

  // Multi-Parameter Filter & Search Pipeline
  const filteredJobs = jobListings
    .filter((job) => {
      // 1. Search Query Match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some((s) => s.toLowerCase().includes(query));

      // 2. Category Filter Match
      const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;

      // 3. Location Filter Match
      const matchesLocation =
        selectedLocation === "All" ||
        (selectedLocation === "Remote" && job.location.toLowerCase().includes("remote")) ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // 4. Min Salary Match
      const matchesSalary = job.salaryMinNumeric >= selectedMinSalary;

      // 5. Saved Only Match
      const matchesSaved = !showSavedOnly || savedJobIds.includes(job.id);

      return matchesSearch && matchesCategory && matchesLocation && matchesSalary && matchesSaved;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "salary") return b.salaryMinNumeric - a.salaryMinNumeric;
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0;
    });

  const categoryOptions = ["All", "AI & LLM Infra", "Full-Stack", "Backend Microservices", "DevOps & Systems", "Quantum & Edge"];

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0d] text-zinc-100 font-sans selection:bg-white selection:text-black flex flex-col">
      
      {/* ─── ATMOSPHERIC LIGHTING & GRADIENT ─── */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />

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
            <div className="w-7 h-7 bg-white/10 text-white rounded-full flex items-center justify-center border border-white/15 text-xs font-mono font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
          <button onClick={handleSignOut} className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ─── MAIN CONTAINER ─── */}
      <main className="max-w-[1500px] w-full mx-auto p-6 md:p-10 space-y-8 relative z-10 flex-1 flex flex-col">
        
        {/* ─── HERO HEADER STRIP ─── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-zinc-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <Globe className="h-3 w-3 text-white" />
                Pinecone Vector Job Feed • Verified Market Roles
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Verified Engineering Roles</h1>
              <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Explore real-time high-throughput engineering openings, complete with vector-calculated AI match percentages, verified compensation benchmarks, and 1-click personalized roadmaps.
              </p>
            </div>

            {/* QUICK STATS CHIPS */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="bg-black/50 border border-white/10 p-3.5 rounded-2xl font-mono text-xs space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Total Available Roles</span>
                <span className="text-base font-bold text-white">{jobListings.length} Positions</span>
              </div>
              <div className="bg-black/50 border border-white/10 p-3.5 rounded-2xl font-mono text-xs space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Top Skill Premium</span>
                <span className="text-base font-bold text-white">+$38,000 / yr</span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── MULTI-PARAMETER SEARCH & FILTER CONTROL BAR ─── */}
        <div className="bg-zinc-900/60 border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl backdrop-blur-xl">
          
          {/* TOP ROW: Search input + View Mode Switcher */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="h-4 w-4 text-zinc-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, company, or skills (e.g. FastAPI, Next.js)..."
                className="w-full bg-black/60 border border-white/10 pl-11 pr-10 py-3 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all font-mono shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Right: Saved Toggle & View Mode */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              
              {/* Saved Only Filter */}
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                  showSavedOnly
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-black/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${showSavedOnly ? "fill-black" : ""}`} />
                <span>Bookmarked ({savedJobIds.length})</span>
              </button>

              {/* View Switcher */}
              <div className="flex bg-black/60 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    viewMode === "list" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Compact List View"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("inspector")}
                  className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    viewMode === "inspector" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Split Reader View"
                >
                  <Columns className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>

          {/* BOTTOM ROW: Filters & Sort Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs font-mono">
            
            {/* Category Track Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">Domain Track:</span>
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-white text-black font-extrabold border-white"
                      : "bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dropdown Filters: Location, Salary, Sort */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Location Select */}
              <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-zinc-900 text-white">All Locations</option>
                  <option value="Remote" className="bg-zinc-900 text-white">Remote Only</option>
                  <option value="San Francisco" className="bg-zinc-900 text-white">San Francisco</option>
                  <option value="New York" className="bg-zinc-900 text-white">New York</option>
                </select>
              </div>

              {/* Min Salary Select */}
              <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl">
                <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={selectedMinSalary}
                  onChange={(e) => setSelectedMinSalary(Number(e.target.value))}
                  className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value={0} className="bg-zinc-900 text-white">Any Salary</option>
                  <option value={160000} className="bg-zinc-900 text-white">$160k+ / yr</option>
                  <option value={180000} className="bg-zinc-900 text-white">$180k+ / yr</option>
                  <option value={200000} className="bg-zinc-900 text-white">$200k+ / yr</option>
                </select>
              </div>

              {/* Sort By Select */}
              <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl">
                <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer font-bold"
                >
                  <option value="match" className="bg-zinc-900 text-white">Sort: Highest Match</option>
                  <option value="salary" className="bg-zinc-900 text-white">Sort: Top Compensation</option>
                  <option value="company" className="bg-zinc-900 text-white">Sort: Company (A-Z)</option>
                </select>
              </div>

            </div>

          </div>

        </div>

        {/* ─── ACTIVE RESULTS COUNTER ─── */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-2">
          <span>Showing <strong className="text-white">{filteredJobs.length}</strong> matching roles</span>
          {showSavedOnly && <span className="text-zinc-300">★ Filtering by Bookmarked Roles</span>}
        </div>

        {/* ─── VIEW 1: CARDS GRID VIEW ─── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    
                    {/* Card Top: Logo, Company, Title, Bookmark */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                          {job.companyLogo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-0.5">
                            <span className="font-semibold text-white">{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono text-zinc-400">
                              <MapPin className="h-3 w-3 text-zinc-500" />
                              {job.location}
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-white group-hover:text-zinc-100 transition-colors">{job.title}</h2>
                        </div>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => toggleBookmark(job.id, e)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isSaved
                            ? "bg-white text-black border-white"
                            : "bg-black/40 border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                        }`}
                        title={isSaved ? "Remove Bookmark" : "Bookmark Job"}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-black" : ""}`} />
                      </button>
                    </div>

                    {/* Category & Match Badge Bar */}
                    <div className="flex items-center justify-between text-xs font-mono border-y border-white/10 py-2.5">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">{job.category}</span>
                      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                        <span className="text-[10px] text-zinc-300 uppercase">AI Match</span>
                        <span className="text-xs font-bold text-white">{job.matchScore}%</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>

                    {/* Salary & Premium Strip */}
                    <div className="bg-black/50 border border-white/10 p-3 rounded-2xl space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 uppercase">Salary Range</span>
                        <span className="text-xs font-bold text-white">{job.salaryRange} / yr</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-zinc-500 uppercase">Skill Premium</span>
                        <span className="text-[11px] font-semibold text-zinc-300">{job.skillPremium}</span>
                      </div>
                    </div>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-mono bg-white/5 text-zinc-300 px-2.5 py-0.5 rounded-md border border-white/10"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
                      Inspect Role Specs →
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateWithJob("/dashboard", job);
                      }}
                      className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all shadow-md"
                    >
                      AI Roadmap →
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ─── VIEW 2: HIGH-DENSITY COMPACT LIST VIEW ─── */}
        {viewMode === "list" && (
          <div className="bg-zinc-900/40 border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/10 font-mono shadow-xl">
            {filteredJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="p-5 hover:bg-white/[0.04] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                      {job.companyLogo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-white">{job.title}</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">{job.company}</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-500">{job.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {job.skills.slice(0, 4).map((s) => (
                          <span key={s} className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded border border-white/5">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white block">{job.salaryRange}</span>
                      <span className="text-[10px] text-zinc-400">Match: {job.matchScore}%</span>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(job.id, e)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isSaved ? "bg-white text-black border-white" : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-black" : ""}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                      className="bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── VIEW 3: SPLIT READER INSPECTOR VIEW ─── */}
        {viewMode === "inspector" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            
            {/* Left Jobs List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-2">
              {filteredJobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white/10 border-white shadow-xl"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white truncate">{job.title}</span>
                      <span className="text-[10px] font-mono text-zinc-300 font-bold">{job.matchScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>{job.company}</span>
                      <span>{job.salaryRange.split("–")[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Job Specs Inspector Panel (7 Cols) */}
            <div className="lg:col-span-7 bg-zinc-900/80 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 font-sans backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
              {selectedJob ? (
                <div className="space-y-6">
                  
                  {/* Inspector Header */}
                  <div className="border-b border-white/10 pb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xl">
                          {selectedJob.companyLogo}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
                          <span className="text-xs text-zinc-400">{selectedJob.company} • {selectedJob.location}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white text-black px-3 py-1 rounded-full">
                        {selectedJob.matchScore}% AI Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-black/50 p-3 rounded-2xl font-mono text-xs border border-white/10">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Compensation</span>
                        <span className="font-bold text-white">{selectedJob.salaryRange}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Skill Premium</span>
                        <span className="font-bold text-zinc-300">{selectedJob.skillPremium}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inspector Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase">Role Overview</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  {/* Inspector Responsibilities */}
                  <div className="space-y-2 font-mono text-xs">
                    <h3 className="text-[10px] text-zinc-500 uppercase font-bold">Key Responsibilities</h3>
                    <ul className="space-y-1 text-zinc-300 list-disc pl-4 text-[11px]">
                      {selectedJob.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Inspector Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleNavigateWithJob("/dashboard", selectedJob)}
                      className="bg-white text-black px-5 py-2.5 rounded-xl text-xs font-extrabold hover:bg-zinc-200 transition-all flex items-center gap-2"
                    >
                      <span>Generate AI Roadmap</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleNavigateWithJob("/mock-interview", selectedJob)}
                      className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    >
                      Practice Interview
                    </button>
                    <button
                      onClick={() => handleNavigateWithJob("/resume-analyzer", selectedJob)}
                      className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    >
                      Scan Resume
                    </button>
                  </div>

                </div>
              ) : (
                <div className="text-center py-24 text-zinc-500 font-mono text-xs">
                  Select a job posting from the left column to inspect specifications.
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ─── FULL JOB SPECIFICATION DRAWER / MODAL ─── */}
      {selectedJob && viewMode !== "inspector" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="bg-[#0e0e12] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            {/* Close Modal Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-4 border-b border-white/10 pb-6 pr-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl">
                  {selectedJob.companyLogo}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{selectedJob.title}</h2>
                  <p className="text-xs text-zinc-400 font-mono">{selectedJob.company} • {selectedJob.location}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="bg-white text-black font-extrabold px-3 py-1 rounded-full">
                  {selectedJob.matchScore}% AI Match Score
                </span>
                <span className="bg-white/10 text-white border border-white/15 px-3 py-1 rounded-full">
                  {selectedJob.category}
                </span>
                <span className="bg-white/10 text-zinc-300 border border-white/15 px-3 py-1 rounded-full">
                  {selectedJob.salaryRange} / yr
                </span>
              </div>
            </div>

            {/* Content: Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase">Role Overview</h3>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{selectedJob.description}</p>
            </div>

            {/* Skill Match Breakdown Matrix */}
            <div className="space-y-3 bg-black/60 border border-white/10 p-5 rounded-2xl font-mono text-xs">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white" />
                Pinecone Competency Match Breakdown
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1.5 font-bold">Matched Candidate Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((s) => (
                      <span key={s} className="text-[10px] bg-white/10 text-white px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1">
                        <Check className="h-3 w-3 text-white" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1.5 font-bold">Target Skill Gaps to Acquire</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.missingSkills.map((ms) => (
                      <span key={ms} className="text-[10px] bg-white/5 text-zinc-400 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-zinc-400" />
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2 font-mono text-xs">
              <h3 className="text-[10px] text-zinc-500 uppercase font-bold">Primary Responsibilities</h3>
              <ul className="space-y-1.5 text-zinc-300 list-disc pl-5 text-[11px] leading-relaxed">
                {selectedJob.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="space-y-2 font-mono text-xs">
              <h3 className="text-[10px] text-zinc-500 uppercase font-bold">Minimum Qualifications</h3>
              <ul className="space-y-1.5 text-zinc-300 list-disc pl-5 text-[11px] leading-relaxed">
                {selectedJob.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons Hub */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => toggleBookmark(selectedJob.id)}
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2"
              >
                <Bookmark className={`h-4 w-4 ${savedJobIds.includes(selectedJob.id) ? "fill-white" : ""}`} />
                <span>{savedJobIds.includes(selectedJob.id) ? "Saved" : "Save Job"}</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleNavigateWithJob("/dashboard", selectedJob)}
                  className="bg-white text-black px-6 py-3 rounded-xl text-xs font-extrabold hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Generate Adaptive AI Roadmap</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleNavigateWithJob("/mock-interview", selectedJob)}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl text-xs font-semibold transition-all"
                >
                  Practice Interview
                </button>
                <button
                  onClick={() => handleNavigateWithJob("/resume-analyzer", selectedJob)}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl text-xs font-semibold transition-all"
                >
                  Scan Resume ATS
                </button>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-xs text-zinc-400 hover:text-white font-mono px-4 py-2"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

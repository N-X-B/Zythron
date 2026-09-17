"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Clock,
  Layers,
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
  Smartphone,
  Server,
  Lock,
  Send,
  Wifi,
  Briefcase,
  Activity,
  Award,
  Scale,
  DollarSign,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  Sparkles,
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

interface CareerDomain {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tracks: TechnicalTrack[];
}

interface TechnicalTrack {
  id: string;
  domainId: string;
  role: string;
  department: string;
  description: string;
  coreSkills: string[];
  suggestedPrereqs: string[];
  phases: RoadmapPhase[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "backend";
  text: string;
  timestamp: string;
}

const CAREER_DOMAINS: CareerDomain[] = [
  {
    id: "tech-ai",
    name: "Technology & AI Systems",
    code: "01",
    description: "Distributed computing, full-stack architecture, machine learning models, and site reliability engineering.",
    icon: Cpu,
    tracks: [
      {
        id: "fullstack-systems",
        domainId: "tech-ai",
        role: "Full-Stack Systems Engineer",
        department: "Software Engineering",
        description: "Type-safe frontend clients, asynchronous microservices, relational data modeling, and container orchestration.",
        coreSkills: ["TypeScript", "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "Git", "Linux", "CI/CD"],
        suggestedPrereqs: ["JavaScript", "TypeScript", "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
        phases: [
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
                  { name: "Next.js Architecture Guide", url: "https://nextjs.org/docs", category: "Docs" },
                  { name: "HTTP Caching Specifications", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching", category: "Spec" },
                ],
                projectPrompt: "Construct a multi-tenant dashboard with server-side authentication and optimistic UI updates.",
              },
            ],
          },
          {
            id: 2,
            title: "Phase 2: Microservices & Relational Storage",
            description: "Asynchronous APIs, relational schema design, connection pooling, and data validation.",
            badge: "Backend",
            icon: Database,
            milestones: [
              {
                id: "fs3",
                title: "Asynchronous Services with FastAPI",
                description: "Pydantic validation schemas, dependency injection, OAuth2 authentication, and background workers.",
                workloadHours: 55,
                requiredSkills: ["Python", "FastAPI"],
                syllabusPoints: [
                  "AsyncIO concurrency event loops and non-blocking I/O",
                  "Pydantic V2 model parsing, validation, and serialization",
                  "JWT token lifecycle, refresh tokens, and rate-limiting middleware",
                  "Background task queues with Celery or Redis Streams"
                ],
                resources: [
                  { name: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/", category: "Docs" },
                  { name: "Python AsyncIO Internals", url: "https://docs.python.org/3/library/asyncio.html", category: "Manual" },
                ],
                projectPrompt: "Develop an asynchronous REST microservice with rate limiting, database migrations, and unit tests.",
              },
              {
                id: "fs4",
                title: "Relational Database Design with PostgreSQL",
                description: "Normalization, indexing strategies (B-Tree, GIN), connection pooling, and Prisma ORM integration.",
                workloadHours: 45,
                requiredSkills: ["PostgreSQL"],
                syllabusPoints: [
                  "Third normal form relational normalization and foreign key constraints",
                  "Query execution plan analysis with EXPLAIN ANALYZE",
                  "B-Tree, GIN, and BRIN index selection criteria",
                  "Transaction isolation levels and deadlock mitigation"
                ],
                resources: [
                  { name: "PostgreSQL Official Manual", url: "https://www.postgresql.org/docs/", category: "Docs" },
                  { name: "Prisma Schema Reference", url: "https://www.prisma.io/docs", category: "Docs" },
                ],
                projectPrompt: "Design an audit-logged transaction database schema capable of handling concurrent modifications.",
              },
            ],
          },
          {
            id: 3,
            title: "Phase 3: Infrastructure, Testing & Delivery",
            description: "Containerization, automated continuous integration pipelines, and production telemetry.",
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
                  "Multi-stage Dockerfile layering to reduce image footprint",
                  "Linux cgroups, namespaces, and rootless container execution",
                  "Docker Compose multi-service networks with health checks",
                  "Vulnerability scanning with Trivy in automated CI"
                ],
                resources: [
                  { name: "Docker Best Practices", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", category: "Manual" },
                  { name: "Linux Systems Manual", url: "https://man7.org/linux/man-pages/", category: "Reference" },
                ],
                projectPrompt: "Write multi-stage Dockerfiles reducing production container footprint under 120MB.",
              },
            ],
          },
        ],
      },
      {
        id: "ml-systems",
        domainId: "tech-ai",
        role: "Machine Learning Systems Engineer",
        department: "Applied Machine Learning",
        description: "Numerical computation, custom PyTorch training loops, tensor optimization, and low-latency inference serving.",
        coreSkills: ["Python", "NumPy", "Pandas", "PyTorch", "Scikit-Learn", "Docker", "FastAPI", "SQL", "Git"],
        suggestedPrereqs: ["Python", "NumPy", "Pandas", "PyTorch", "SQL", "Docker", "FastAPI"],
        phases: [
          {
            id: 1,
            title: "Phase 1: Numerical Computing & Tabular Pipelines",
            description: "Vector operations, linear algebra implementations, and reproducible feature engineering pipelines.",
            badge: "Prerequisite",
            icon: BarChart3,
            milestones: [
              {
                id: "ml1",
                title: "Vectorized Operations & Feature Extraction",
                description: "Multi-dimensional array slicing, memory-efficient transformations, and missing data imputation.",
                workloadHours: 50,
                requiredSkills: ["Python", "NumPy", "Pandas", "SQL"],
                syllabusPoints: [
                  "Broadcasting rules and memory strides in NumPy arrays",
                  "Efficient columnar operations without iterrows in Pandas",
                  "Feature scaling, one-hot encoding, and target encoding pipelines",
                  "Extracting structured training datasets via analytical SQL queries"
                ],
                resources: [
                  { name: "NumPy Documentation", url: "https://numpy.org/doc/", category: "Docs" },
                  { name: "Pandas User Guide", url: "https://pandas.pydata.org/docs/", category: "Docs" },
                ],
                projectPrompt: "Build a deterministic data-cleansing pipeline for 5M financial transaction rows without memory leaks.",
              },
            ],
          },
          {
            id: 2,
            title: "Phase 2: Deep Learning & Custom Training Loops",
            description: "Autograd graph computation, tensor operations, learning rate schedulers, and gradient validation.",
            badge: "Core Modeling",
            icon: Cpu,
            milestones: [
              {
                id: "ml2",
                title: "PyTorch Modeling & GPU Execution",
                description: "CUDA tensor acceleration, loss function implementations, and model checkpointing strategies.",
                workloadHours: 70,
                requiredSkills: ["Python", "PyTorch"],
                syllabusPoints: [
                  "Computational graph retention and backward propagation hooks",
                  "Mixed-precision training with torch.cuda.amp",
                  "Custom dataset classes, collate functions, and multi-worker DataLoaders",
                  "Early stopping, checkpoint serialization, and TensorBoard logging"
                ],
                resources: [
                  { name: "PyTorch API Documentation", url: "https://pytorch.org/docs/", category: "Docs" },
                  { name: "CUDA Programming Fundamentals", url: "https://docs.nvidia.com/cuda/", category: "Manual" },
                ],
                projectPrompt: "Train a custom neural classifier with mixed-precision training and validation loss tracking.",
              },
            ],
          },
          {
            id: 3,
            title: "Phase 3: Model Serving & Production Runtime",
            description: "Graph optimization, ONNX export, latency profiling, and microservice integration.",
            badge: "Production",
            icon: Terminal,
            milestones: [
              {
                id: "ml3",
                title: "Inference Server Deployment",
                description: "Batch inference, serialization, request queuing, and Prometheus latency monitoring.",
                workloadHours: 45,
                requiredSkills: ["Docker", "FastAPI", "Python"],
                syllabusPoints: [
                  "Exporting PyTorch models to ONNX and TensorRT runtime engines",
                  "Dynamic batching and asynchronous request queues",
                  "Quantization (INT8/FP16) for reduced inference latency",
                  "Prometheus metrics for p95 and p99 inference timing"
                ],
                resources: [
                  { name: "ONNX Runtime Documentation", url: "https://onnxruntime.ai/docs/", category: "Docs" },
                  { name: "FastAPI High Concurrency Patterns", url: "https://fastapi.tiangolo.com/deployment/", category: "Docs" },
                ],
                projectPrompt: "Package a trained model into a Docker container serving predictions with sub-50ms p99 latency.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "quant-finance",
    name: "Quantitative Finance & Capital Markets",
    code: "02",
    description: "Algorithmic trading engines, derivative pricing mathematics, risk modeling, and corporate valuation.",
    icon: DollarSign,
    tracks: [
      {
        id: "quant-research",
        domainId: "quant-finance",
        role: "Quantitative Research & Algo Trading",
        department: "Quantitative Investment",
        description: "Statistical arbitrage, stochastic calculus, tick-level order book modeling, and alpha signal generation.",
        coreSkills: ["Python", "C++", "Stochastic Calculus", "Time-Series Econometrics", "SQL", "Pandas", "Linear Algebra"],
        suggestedPrereqs: ["Python", "C++", "SQL", "Stochastic Calculus", "Linear Algebra", "Pandas"],
        phases: [
          {
            id: 1,
            title: "Phase 1: Mathematical Foundations & Time-Series",
            description: "Martingale theory, Ito calculus, stationary processes, and statistical backtesting frameworks.",
            badge: "Theory",
            icon: BarChart3,
            milestones: [
              {
                id: "qf1",
                title: "Stochastic Calculus & Asset Pricing",
                description: "Geometric Brownian motion, Black-Scholes-Merton PDE, Greeks derivation, and volatility surfaces.",
                workloadHours: 60,
                requiredSkills: ["Stochastic Calculus", "Python"],
                syllabusPoints: [
                  "Brownian motion, Ito lemma, and risk-neutral measure change (Girsanov theorem)",
                  "Derivation of the Black-Scholes partial differential equation",
                  "Implied volatility surface construction and smiles",
                  "Monte Carlo pricing for path-dependent exotic options"
                ],
                resources: [
                  { name: "Stochastic Calculus for Finance (Shreve)", url: "https://link.springer.com/book/10.1007/978-0-387-22527-2", category: "Book" },
                  { name: "Options, Futures, and Other Derivatives (Hull)", url: "https://www.pearson.com", category: "Book" },
                ],
                projectPrompt: "Implement a Monte Carlo derivative pricing engine in Python with variance reduction techniques.",
              },
              {
                id: "qf2",
                title: "High-Frequency Limit Order Book Simulation",
                description: "Market microstructure, bid-ask spread dynamics, tick data processing, and execution slippage modeling.",
                workloadHours: 55,
                requiredSkills: ["C++", "Python", "SQL"],
                syllabusPoints: [
                  "L1/L2/L3 order book data structures in C++",
                  "Order matching algorithms and price-time priority queues",
                  "Modeling market impact, adverse selection, and slippage",
                  "Backtesting alpha signals with survivorship-bias-free data"
                ],
                resources: [
                  { name: "Algorithmic and High-Frequency Trading (Cartea)", url: "https://www.cambridge.org", category: "Book" },
                  { name: "C++ High Performance (Andrist)", url: "https://www.packtpub.com", category: "Book" },
                ],
                projectPrompt: "Build a low-latency limit order book simulator in C++ capable of parsing 100,000 order events per second.",
              },
            ],
          },
        ],
      },
      {
        id: "corporate-finance",
        domainId: "quant-finance",
        role: "Mergers & Acquisitions and Private Equity",
        department: "Investment Banking",
        description: "Three-statement financial modeling, Discounted Cash Flow (DCF), Leveraged Buyout (LBO) analysis, and deal structuring.",
        coreSkills: ["Financial Modeling", "Excel", "Accounting", "DCF Valuation", "LBO Modeling", "Corporate Strategy"],
        suggestedPrereqs: ["Accounting", "Financial Modeling", "DCF Valuation", "LBO Modeling", "Excel"],
        phases: [
          {
            id: 1,
            title: "Phase 1: Financial Statement Engineering & Valuation",
            description: "Dynamic 3-statement projection schedules, working capital analysis, and cost of capital derivations.",
            badge: "Core Valuation",
            icon: FileText,
            milestones: [
              {
                id: "cf1",
                title: "Dynamic Three-Statement Financial Model",
                description: "Linking Income Statement, Balance Sheet, and Cash Flow with integrated debt and depreciation schedules.",
                workloadHours: 50,
                requiredSkills: ["Accounting", "Financial Modeling"],
                syllabusPoints: [
                  "Revenue build drivers (unit-level economics vs top-down market share)",
                  "Working capital schedules (DSO, DPO, inventory turnover)",
                  "Circular debt schedule resolution with cash sweeps",
                  "Sensitivity analysis and scenario modeling (Bull, Base, Bear)"
                ],
                resources: [
                  { name: "Investment Banking: Valuation & LBOs (Rosenbaum)", url: "https://www.wiley.com", category: "Book" },
                  { name: "Corporate Finance Institute Standards", url: "https://corporatefinanceinstitute.com", category: "Guide" },
                ],
                projectPrompt: "Construct an institutional-grade 5-year integrated three-statement financial model for a public enterprise.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "product-design",
    name: "Industrial & Spatial Product Design",
    code: "03",
    description: "Spatial computing for XR headsets, ergonomic hardware engineering, design systems, and interaction design.",
    icon: Laptop,
    tracks: [
      {
        id: "spatial-design",
        domainId: "product-design",
        role: "Spatial Computing & XR Architect",
        department: "Spatial Interaction Design",
        description: "VisionOS/OpenXR spatial ergonomics, 3D volume interfaces, eye-tracking input paradigms, and immersive audio.",
        coreSkills: ["3D Spatial Design", "Unity", "Figma", "OpenXR", "C#", "Interaction Architecture", "Blender"],
        suggestedPrereqs: ["Figma", "Unity", "Blender", "C#", "3D Spatial Design"],
        phases: [
          {
            id: 1,
            title: "Phase 1: Spatial Ergonomics & 3D Interface Volumes",
            description: "Z-depth visual hierarchy, gaze-and-pinch interaction models, and spatial design systems.",
            badge: "Spatial UX",
            icon: Globe,
            milestones: [
              {
                id: "sp1",
                title: "Spatial Design Systems & Volumetric Layouts",
                description: "Designing interfaces with depth layers, dynamic lighting, collision bounds, and physical anchors.",
                workloadHours: 50,
                requiredSkills: ["Figma", "3D Spatial Design"],
                syllabusPoints: [
                  "Field of view comfort zones and vergence-accommodation conflict",
                  "Designing translucent glassy spatial materials in volumetric spaces",
                  "Gaze-and-pinch targeting tolerances and feedback states",
                  "Spatial audio positioning for orientation cues"
                ],
                resources: [
                  { name: "Apple Human Interface Guidelines: VisionOS", url: "https://developer.apple.com/design/human-interface-guidelines/visionos", category: "Spec" },
                  { name: "OpenXR Specification Overview", url: "https://www.khronos.org/openxr/", category: "Docs" },
                ],
                projectPrompt: "Design an interactive 3D spatial workspace for VisionOS featuring volumetric window management.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "biomedical",
    name: "Biomedical & Computational Sciences",
    code: "04",
    description: "Computational genomics, bioinformatics sequence alignment, clinical trials governance, and molecular simulation.",
    icon: Activity,
    tracks: [
      {
        id: "bioinformatics-eng",
        domainId: "biomedical",
        role: "Bioinformatics & Genomic Data Scientist",
        department: "Computational Biology",
        description: "Next-Generation Sequencing (NGS) analysis, variant calling pipelines, structural bioinformatics, and Bioconductor tools.",
        coreSkills: ["Python", "R", "Bioconductor", "NGS Pipelines", "Linux", "SQL", "Statistical Genetics"],
        suggestedPrereqs: ["Python", "R", "Bioconductor", "Linux", "Statistical Genetics"],
        phases: [
          {
            id: 1,
            title: "Phase 1: Sequence Alignment & High-Throughput Genomics",
            description: "FASTQ quality control, Burrows-Wheeler transformation alignment, and variant calling formats.",
            badge: "Genomics",
            icon: Activity,
            milestones: [
              {
                id: "bio1",
                title: "Next-Generation Sequencing Variant Pipeline",
                description: "Building an automated pipeline from raw reads (FASTQ) to aligned BAM files and filtered VCF records.",
                workloadHours: 55,
                requiredSkills: ["Python", "Linux", "NGS Pipelines"],
                syllabusPoints: [
                  "FastQC read evaluation and adapter trimming algorithms",
                  "BWA-MEM genomic alignment and SAM/BAM coordinate sorting",
                  "GATK HaplotypeCaller variant calling best practices",
                  "Functional variant annotation using Ensembl VEP"
                ],
                resources: [
                  { name: "GATK Best Practices Workflows", url: "https://gatk.broadinstitute.org/", category: "Guide" },
                  { name: "Bioconductor Genomic Data Packages", url: "https://www.bioconductor.org/", category: "Docs" },
                ],
                projectPrompt: "Construct an automated Snakemake pipeline that executes variant calling on targeted cancer gene panels.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "strategy-consulting",
    name: "Strategy Consulting & Venture Capital",
    code: "05",
    description: "Hypothesis-driven problem solving, market sizing, investment thesis formulation, and M&A due diligence.",
    icon: Briefcase,
    tracks: [
      {
        id: "management-consulting",
        domainId: "strategy-consulting",
        role: "Management Consultant & Strategy Advisor",
        department: "Strategy Practice",
        description: "MECE issue trees, profitability diagnostics, business case synthesis, and C-suite stakeholder alignment.",
        coreSkills: ["Strategy Frameworks", "Financial Modeling", "Market Sizing", "Executive Presentation", "Excel"],
        suggestedPrereqs: ["Strategy Frameworks", "Market Sizing", "Financial Modeling", "Excel"],
        phases: [
          {
            id: 1,
            title: "Phase 1: Structured Problem Solving & Diagnostic Trees",
            description: "Mutually Exclusive, Collectively Exhaustive (MECE) root-cause decomposition and 80/20 prioritization.",
            badge: "Methodology",
            icon: Target,
            milestones: [
              {
                id: "st1",
                title: "Enterprise Profitability Diagnostic Engine",
                description: "Deconstructing declining profit margins into revenue volume/price drivers and fixed/variable cost structures.",
                workloadHours: 45,
                requiredSkills: ["Strategy Frameworks", "Excel"],
                syllabusPoints: [
                  "Pyramid Principle structured communications for executive audiences",
                  "MECE hypothesis breakdown trees and data collection plans",
                  "Top-down and bottom-up market sizing estimation methodologies",
                  "Synthesizing qualitative executive interviews into strategic matrices"
                ],
                resources: [
                  { name: "The McKinsey Way (Rasiel)", url: "https://www.mheducation.com", category: "Book" },
                  { name: "Case in Point (Cosentino)", url: "https://burgeepress.com", category: "Book" },
                ],
                projectPrompt: "Conduct an end-to-end strategic growth advisory case analyzing an enterprise technology turnaround.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "legal-policy",
    name: "Tech Law, Governance & Intellectual Property",
    code: "06",
    description: "Patent prosecution, algorithmic accountability frameworks, antitrust regulations, and global privacy compliance.",
    icon: Scale,
    tracks: [
      {
        id: "ip-patent-law",
        domainId: "legal-policy",
        role: "Intellectual Property & Technology Counsel",
        department: "Legal Practice",
        description: "Patent claim drafting, prior art invalidity searches, technology licensing contracts, and software copyright.",
        coreSkills: ["Patent Law", "Legal Writing", "Contract Negotiation", "Prior Art Analysis", "Regulatory Compliance"],
        suggestedPrereqs: ["Patent Law", "Legal Writing", "Prior Art Analysis", "Regulatory Compliance"],
        phases: [
          {
            id: 1,
            title: "Phase 1: Patent Prosecution & Prior Art Analysis",
            description: "Section 101 patent eligibility, independent and dependent claim construction, and office action responses.",
            badge: "Legal IP",
            icon: Scale,
            milestones: [
              {
                id: "law1",
                title: "Software Patent Claim Architecture",
                description: "Drafting robust patent claims that satisfy Alice/Mayo subject-matter eligibility tests for computer systems.",
                workloadHours: 50,
                requiredSkills: ["Patent Law", "Legal Writing"],
                syllabusPoints: [
                  "35 U.S.C. 101, 102, 103, and 112 legal statutory standards",
                  "Structuring independent and dependent method/system claims",
                  "Executing comprehensive USPTO and EPO prior art novelty searches",
                  "Drafting legal office action responses overcoming examiner rejections"
                ],
                resources: [
                  { name: "Manual of Patent Examining Procedure (MPEP)", url: "https://www.uspto.gov/web/offices/pac/mpep/", category: "Manual" },
                  { name: "WIPO Patent Drafting Manual", url: "https://www.wipo.int", category: "Guide" },
                ],
                projectPrompt: "Draft an institutional-grade provisional patent application including full claims for a distributed consensus protocol.",
              },
            ],
          },
        ],
      },
    ],
  },
];

// Backend endpoint configuration as specified by team member
const AI_CHAT_ENDPOINT = "http://localhost:8000/api/chat";

export default function CareerGuidanceDashboard() {
  // Domain and Track Selection
  const [selectedDomainId, setSelectedDomainId] = useState<string>("tech-ai");
  const [selectedTrackId, setSelectedTrackId] = useState<string>("fullstack-systems");
  const [mounted, setMounted] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>("");

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
          if (exp.includes("junior") || exp.includes("beginner")) setExperienceLevel("Junior");
          else if (exp.includes("senior") || exp.includes("lead")) setExperienceLevel("Senior");
          else setExperienceLevel("Mid");
        }
        if (Array.isArray(p.skills) && p.skills.length > 0) {
          setUserSkills(
            p.skills.map((sk: string) => ({
              name: sk,
              level: "Intermediate",
            }))
          );
        }
        if (p.commitment) {
          const hrs = parseInt(p.commitment.replace(/\D/g, ""), 10);
          if (!isNaN(hrs) && hrs > 0) setWeeklyCommitmentHours(hrs);
        }
        if (p.timeline) {
          if (p.timeline.includes("3")) setTargetTimelineMonths(3);
          else if (p.timeline.includes("6")) setTargetTimelineMonths(6);
          else if (p.timeline.includes("1 Year") || p.timeline.includes("12")) setTargetTimelineMonths(12);
        }
        if (p.role || p.experience) {
          setLastGeneratedAt(`Customized for ${p.role || "User"} (${p.experience || "Personalized"})`);
        }
      }
    } catch (err) {
      console.error("Error loading user profile in dashboard:", err);
    }
  }, []);

  // Interactive 3D Impossible Triangle Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // User Skills State
  const [userSkills, setUserSkills] = useState<SkillItem[]>([
    { name: "TypeScript", level: "Intermediate" },
    { name: "React", level: "Intermediate" },
    { name: "Next.js", level: "Advanced" },
    { name: "Python", level: "Intermediate" },
    { name: "PostgreSQL", level: "Intermediate" },
  ]);

  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  // Guidance Inputs
  const [weeklyCommitmentHours, setWeeklyCommitmentHours] = useState<number>(15);
  const [userBackground, setUserBackground] = useState<string>("Degree Candidate / Recent Graduate");
  const [targetTimelineMonths, setTargetTimelineMonths] = useState<number>(6);
  const [learningPreference, setLearningPreference] = useState<string>("Project-Based (Hands-on)");
  // Exact Backend Requirements: Experience Level, Preferred Role & Generator State
  const [experienceLevel, setExperienceLevel] = useState<"Junior" | "Mid" | "Senior">("Mid");
  const [preferredRole, setPreferredRole] = useState<string>("Full-Stack Systems Engineer");
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState<boolean>(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string>("Active Synthesis");

  const handleGenerateRoadmap = () => {
    setIsGeneratingRoadmap(true);
    setTimeout(() => {
      setIsGeneratingRoadmap(false);
      setLastGeneratedAt("Synthesized for " + preferredRole + " (" + experienceLevel + ")");
    }, 450);
  };

  // Checkpoints
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    fs1: true,
  });

  // Popup Modal for Milestone Inspection
  const [activeModalMilestone, setActiveModalMilestone] = useState<RoadmapMilestone | null>(null);

  // AI Backend Chat State (Live fetch to http://localhost:8000/api/chat)
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "backend",
      text: "Zythron Advisory Engine online. Connected to network node localhost:8000. Ask any curriculum question.",
      timestamp: "Ready",
    },
  ]);

  const currentDomain = useMemo(() => {
    return CAREER_DOMAINS.find((d) => d.id === selectedDomainId) || CAREER_DOMAINS[0];
  }, [selectedDomainId]);

  const activeTrack = useMemo(() => {
    const found = currentDomain.tracks.find((t) => t.id === selectedTrackId);
    if (found) return found;
    return currentDomain.tracks[0];
  }, [currentDomain, selectedTrackId]);

  // Keep track in sync when domain changes
  useEffect(() => {
    if (!currentDomain.tracks.some((t) => t.id === selectedTrackId)) {
      setSelectedTrackId(currentDomain.tracks[0].id);
    }
  }, [currentDomain, selectedTrackId]);

  useEffect(() => {
    setPreferredRole(activeTrack.role);
  }, [activeTrack.role]);

  // Calculations
  const calculation = useMemo(() => {
    const userNames = new Set(userSkills.map((s) => s.name.toLowerCase()));
    const matched = activeTrack.coreSkills.filter((s) => userNames.has(s.toLowerCase()));
    const missing = activeTrack.coreSkills.filter((s) => !userNames.has(s.toLowerCase()));
    const matchPercentage = Math.round((matched.length / activeTrack.coreSkills.length) * 100);

    const totalMilestones = activeTrack.phases.reduce((acc, p) => acc + p.milestones.length, 0);
    const completedCount = activeTrack.phases.reduce((acc, p) => {
      return acc + p.milestones.filter((m) => completedMilestones[m.id]).length;
    }, 0);
    const milestonePercentage = Math.round((completedCount / totalMilestones) * 100);

    const totalWorkloadHours = activeTrack.phases.reduce((acc, p) => {
      return acc + p.milestones.reduce((mAcc, m) => mAcc + m.workloadHours, 0);
    }, 0);

    const completedHours = activeTrack.phases.reduce((acc, p) => {
      return acc + p.milestones.filter((m) => completedMilestones[m.id]).reduce((mAcc, m) => mAcc + m.workloadHours, 0);
    }, 0);
    const remainingHours = Math.max(0, totalWorkloadHours - completedHours);

    const weeksNeeded = Math.ceil(remainingHours / Math.max(weeklyCommitmentHours, 1));
    const monthsNeeded = (weeksNeeded / 4.3).toFixed(1);

    const targetWeeks = targetTimelineMonths * 4.3;
    const isPaceRealistic = weeksNeeded <= targetWeeks;

    return {
      matched,
      missing,
      matchPercentage,
      totalMilestones,
      completedCount,
      milestonePercentage,
      totalWorkloadHours,
      completedHours,
      remainingHours,
      weeksNeeded,
      monthsNeeded,
      isPaceRealistic,
    };
  }, [userSkills, activeTrack, completedMilestones, weeklyCommitmentHours, targetTimelineMonths]);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    if (userSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput("");
      return;
    }

    setUserSkills((prev) => [...prev, { name: trimmed, level: skillLevel }]);
    setSkillInput("");
  };

  const handleQuickAdd = (name: string) => {
    if (userSkills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    setUserSkills((prev) => [...prev, { name, level: "Intermediate" }]);
  };

  const handleRemoveSkill = (name: string) => {
    setUserSkills((prev) => prev.filter((s) => s.name !== name));
  };

  const toggleMilestone = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // POST request to backend at http://localhost:8000/api/chat
  const handleSendQuery = async (customText?: string) => {
    const textToSend = (customText || chatInput).trim();
    if (!textToSend || isChatLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: timeStr,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);
    setChatError(null);

    try {
      const res = await fetch(AI_CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "charan_frontend",
          message: textToSend,
          language: "en",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const replyText = data.reply || "Backend Engine returned status acknowledgment.";

      setChatMessages((prev) => [
        ...prev,
        {
          id: "b-" + Date.now(),
          sender: "backend",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to reach AI backend";
      setChatError(`Error communicating with ${AI_CHAT_ENDPOINT}: ${errMsg}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Mouse tilt effect for 3D Impossible Triangle
  const handleMouseMoveHero = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };

  const handleMouseLeaveHero = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-white selection:text-black relative overflow-x-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,56,255,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-white/[0.08] border border-white/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-wider text-base text-white font-mono">ZYTHRON</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
            <span className="inline-block h-1.5 w-1.5 rounded-sm bg-cyan-400 animate-ping" />
            <span>INITIALIZING EXECUTIVE WORKSTATION...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-white selection:text-black relative">
      {/* ATMOSPHERIC AMBIENT GLOW & ARCHITECTURAL GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,56,255,0.18),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* TOP EXECUTIVE WORKSTATION NAVIGATION (FIXED 44px) */}
      <header className="h-11 shrink-0 z-40 w-full border-b border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl select-none px-3 sm:px-4 flex items-center justify-between shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)]">
        {/* Brand & Workspace Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-white/[0.08] border border-white/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Layers className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold tracking-wider text-xs text-white font-mono">ZYTHRON</span>
          </div>
          <span className="text-zinc-600 font-mono text-xs">//</span>
          <span className="hidden sm:inline-block rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-zinc-400">
            EXECUTIVE WORKSTATION
          </span>
          <span className="hidden md:inline text-zinc-600 font-mono text-xs">/</span>
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <span className="text-zinc-500">{currentDomain.code}</span>
            <span>:</span>
            <span className="text-zinc-200 font-medium truncate max-w-[150px]">{currentDomain.name}</span>
          </div>
        </div>

        {/* 3 CORE BACKEND FEATURES SWITCHER */}
        <div className="hidden lg:flex items-center gap-1 font-mono text-xs select-none">
          <Link
            href="/dashboard"
            className="rounded-md px-2.5 py-1 text-xs font-semibold bg-white text-zinc-950 transition-all shadow-sm"
          >
            (01) CAREER MATCH
          </Link>
          <Link
            href="/mock-interview"
            className="rounded-md px-2.5 py-1 text-xs font-medium border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            (02) MOCK INTERVIEW
          </Link>
          <Link
            href="/record-meeting"
            className="rounded-md px-2.5 py-1 text-xs font-medium border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            (03) RECORD MEETING
          </Link>
        </div>

        {/* Right Status Actions & Terminal Launcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Backend Connection Indicator */}
          <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[10px] font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="hidden lg:inline text-zinc-300">NODE localhost:8000</span>
            <span className="lg:hidden text-zinc-300">ONLINE</span>
          </div>

          {/* Glassy Terminal Action Button */}
          <button
            suppressHydrationWarning
            type="button"
            onClick={() => setChatDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/25 px-2.5 py-1 text-xs font-medium text-white transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] cursor-pointer"
          >
            <Terminal className="h-3 w-3 text-cyan-400" />
            <span className="font-mono text-xs">Advisory Terminal</span>
          </button>
        </div>
      </header>

      {/* UNIFIED DOMAIN & TRACK SUBNAV RIBBON (FIXED 36px) */}
      <div className="h-9 shrink-0 z-30 w-full border-b border-white/[0.08] bg-zinc-950/70 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-3 overflow-hidden select-none">
        {/* Domain Tabs with Hidden Scrollbars */}
        <div
          className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 shrink-0 mr-1 hidden sm:inline">
            DOMAINS:
          </span>
          {CAREER_DOMAINS.map((domain) => {
            const isSelected = domain.id === selectedDomainId;
            const DomainIcon = domain.icon;
            return (
              <button
                suppressHydrationWarning
                type="button"
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                }`}
              >
                <span className={`text-[9px] font-mono ${isSelected ? "text-zinc-600" : "text-zinc-500"}`}>
                  {domain.code}
                </span>
                <DomainIcon className="h-3 w-3" />
                <span className="text-[11px] whitespace-nowrap">{domain.name}</span>
              </button>
            );
          })}
        </div>

        {/* Track Switcher for Active Domain */}
        <div
          className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 shrink-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {currentDomain.tracks.map((track) => {
            const isCurrent = track.id === selectedTrackId;
            return (
              <button
                suppressHydrationWarning
                type="button"
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  isCurrent
                    ? "bg-zinc-800 text-cyan-300 border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                {track.role}
              </button>
            );
          })}
          <button
            suppressHydrationWarning
            type="button"
            onClick={() => setChatDrawerOpen(true)}
            className="hidden xl:inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-950/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>Consult AI</span>
          </button>
        </div>
      </div>

      {/* MAIN SCREEN-FITTING WORKSTATION BODY (FLEX-1 MIN-H-0) */}
      <main className="flex-1 min-h-0 grid grid-cols-12 gap-2.5 p-2.5 sm:p-3 overflow-hidden max-w-[1920px] mx-auto w-full">
        {/* LEFT DECK: 3D GEOMETRY, SKILLS MATRIX & TRAJECTORY PARAMETERS */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3.5 flex flex-col gap-2 min-h-0 overflow-y-auto no-scrollbar pr-0.5">
          {/* CARD 1: 3D IMPOSSIBLE GEOMETRY & TRACK TELEMETRY */}
          <div
            onMouseMove={handleMouseMoveHero}
            onMouseLeave={handleMouseLeaveHero}
            className="rounded-xl border border-white/[0.1] bg-zinc-900/50 backdrop-blur-xl p-3 shadow-lg flex items-center justify-between gap-3 relative overflow-hidden select-none shrink-0"
          >
            <div className="space-y-1.5 z-10 max-w-[180px] sm:max-w-[210px]">
              <div className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono text-zinc-300">
                <span>{currentDomain.code}</span>
                <span>//</span>
                <span>{activeTrack.department}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                {activeTrack.role}
              </h2>
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Skill Match</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{calculation.matchPercentage}%</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Volume</span>
                  <span className="text-xs font-mono font-bold text-zinc-200">{calculation.totalWorkloadHours}h</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Progress</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{calculation.milestonePercentage}%</span>
                </div>
              </div>
            </div>

            {/* Interactive 3D Impossible Triangle */}
            <div
              className="relative flex items-center justify-center transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing shrink-0"
              style={{
                perspective: "800px",
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              }}
            >
              <div className="absolute -bottom-1 w-24 h-4 bg-black/80 blur-sm rounded-xl transform scale-y-50 -skew-x-12 pointer-events-none" />
              <svg
                width="105"
                height="105"
                viewBox="0 0 320 320"
                className="drop-shadow-xl transition-all"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M160 20 L280 230 L225 230 L160 115 L95 230 L40 230 Z" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
                <path d="M160 20 L185 65 L95 230 L40 230 Z" fill="#09090b" />
                <path d="M160 115 L225 230 L115 230 L80 170 L140 65 Z" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
                <path d="M160 20 L280 230 L250 230 L160 65 Z" fill="#121215" />
                <path d="M40 230 L280 230 L240 260 L75 260 Z" fill="#09090b" />
                <g transform="translate(68, 150)">
                  <polygon points="20,0 40,10 20,20 0,10" fill="#2563eb" />
                  <polygon points="0,10 20,20 20,40 0,30" fill="#0038ff" />
                  <polygon points="20,20 40,10 40,30 20,40" fill="#1d4ed8" />
                </g>
              </svg>
            </div>
          </div>

          {/* UI SECTION 1: CAREER MATCH SPECIFICATION FORM */}
          <div className="rounded-xl border border-white/[0.1] bg-zinc-900/50 backdrop-blur-xl p-3 space-y-3 shrink-0">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Career Match Parameters
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-950/30 px-1.5 py-0.5 rounded">
                {lastGeneratedAt}
              </span>
            </div>

            {/* Input 1 & 2: Preferred Role & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                  <span>Preferred Role</span>
                  <span className="text-[9px] text-zinc-500">Target Trajectory</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  placeholder="e.g. Full-Stack Systems Engineer..."
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase">Experience Level</label>
                <select
                  suppressHydrationWarning
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            {/* Input 3: Current Skills Tag Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                <span>Current Skills</span>
                <span className="text-[9px] text-zinc-500">{userSkills.length} Verified</span>
              </label>
              
              {/* Quick Add Input */}
              <form onSubmit={handleAddSkill} className="flex gap-1.5">
                <input
                  suppressHydrationWarning
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill (e.g. React, Python, Docker)..."
                  className="flex-1 min-w-0 rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <select
                  suppressHydrationWarning
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Beginner">Beg</option>
                  <option value="Intermediate">Int</option>
                  <option value="Advanced">Adv</option>
                </select>
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center justify-center rounded-md bg-white text-zinc-950 px-2.5 py-1 text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Tag Selector Cloud */}
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto no-scrollbar pt-0.5">
                {userSkills.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-zinc-950/80 px-2 py-0.5 text-[10px] font-mono text-zinc-200"
                  >
                    <span className="font-semibold">{skill.name}</span>
                    <span className="text-[9px] text-zinc-500">[{skill.level[0]}]</span>
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="text-zinc-500 hover:text-red-400 transition-colors ml-0.5 cursor-pointer"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggested Track Prereqs */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[9px] font-mono text-zinc-500">Quick Add:</span>
                {activeTrack.suggestedPrereqs.map((item) => {
                  const exists = userSkills.some((us) => us.name.toLowerCase() === item.toLowerCase());
                  return (
                    <button
                      suppressHydrationWarning
                      type="button"
                      key={item}
                      disabled={exists}
                      onClick={() => handleQuickAdd(item)}
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono transition-colors ${
                        exists
                          ? "bg-zinc-950 text-zinc-600 border border-zinc-800 cursor-default line-through"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white cursor-pointer"
                      }`}
                    >
                      {!exists && "+ "}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekly Commitment & Timeline Controls */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                  <span>Commitment</span>
                  <span className="text-white font-bold">{weeklyCommitmentHours}h/wk</span>
                </label>
                <div className="grid grid-cols-5 gap-0.5">
                  {[10, 15, 20, 30, 40].map((hrs) => (
                    <button
                      suppressHydrationWarning
                      type="button"
                      key={hrs}
                      onClick={() => setWeeklyCommitmentHours(hrs)}
                      className={`rounded px-1 py-0.5 font-mono text-[9px] transition-all cursor-pointer text-center ${
                        weeklyCommitmentHours === hrs
                          ? "bg-white text-zinc-950 font-bold"
                          : "bg-zinc-950 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
                      }`}
                    >
                      {hrs}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase">Target Horizon</label>
                <select
                  suppressHydrationWarning
                  value={targetTimelineMonths}
                  onChange={(e) => setTargetTimelineMonths(Number(e.target.value))}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value={3}>3 Months (Sprint)</option>
                  <option value={6}>6 Months (Balanced)</option>
                  <option value={9}>9 Months (Extended)</option>
                  <option value={12}>12 Months (Paced)</option>
                </select>
              </div>
            </div>

            {/* REQUIRED BUTTON: "Generate AI Roadmap" */}
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleGenerateRoadmap}
              disabled={isGeneratingRoadmap}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-white text-zinc-950 font-bold px-4 py-2 text-xs hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span>{isGeneratingRoadmap ? "Synthesizing AI Roadmap..." : "Generate AI Roadmap"}</span>
            </button>
          </div>
        </div>

        {/* RIGHT STAGE: 3-PHASE MILESTONE COMMAND BOARD */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-8.5 flex flex-col min-h-0 gap-2 overflow-hidden">
          {/* STAGE HEADER BAR */}
          <div className="h-9 shrink-0 flex items-center justify-between px-3 rounded-xl border border-white/10 bg-zinc-900/60 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs truncate">
              <span className="font-bold text-white uppercase tracking-wide font-mono">
                {activeTrack.role}
              </span>
              <span className="text-zinc-600 font-mono">//</span>
              <span className="text-zinc-400 text-[11px] hidden sm:inline truncate max-w-sm">
                {activeTrack.description}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
              <span className="text-[10px] text-zinc-400">
                {calculation.completedCount}/{calculation.totalMilestones} Verified
              </span>
              <div className="w-16 sm:w-24 h-1.5 rounded-sm bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${calculation.milestonePercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-cyan-300">
                {calculation.milestonePercentage}%
              </span>
            </div>
          </div>

          {/* 3-PHASE PARALLEL COLUMNS GRID (FLEX-1 MIN-H-0) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-2 overflow-hidden">
            {activeTrack.phases.map((phase, phaseIndex) => {
              const PhaseIcon = phase.icon;
              const isComplete = phase.milestones.every((m) => completedMilestones[m.id]);
              const phaseDoneCount = phase.milestones.filter((m) => completedMilestones[m.id]).length;

              return (
                <div
                  key={phase.id}
                  className="rounded-xl border border-white/10 bg-zinc-900/40 backdrop-blur-md flex flex-col min-h-0 overflow-hidden"
                >
                  {/* Phase Column Header */}
                  <div className="shrink-0 p-2.5 border-b border-white/10 bg-zinc-950/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/5 text-zinc-300">
                        <PhaseIcon className="h-3 w-3" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{phase.badge}</span>
                          <span className="text-[11px] font-bold text-white truncate">{phase.title}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-1">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-mono font-medium border border-emerald-800/60 bg-emerald-950/40 text-emerald-400">
                          <Check className="h-2.5 w-2.5" /> Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-mono text-zinc-400 border border-zinc-800 bg-zinc-900">
                          {phaseDoneCount}/{phase.milestones.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scrollable Milestone List for this Phase */}
                  <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-2 space-y-2">
                    {phase.milestones.map((m) => {
                      const isDone = completedMilestones[m.id];
                      return (
                        <div
                          key={m.id}
                          onClick={() => setActiveModalMilestone(m)}
                          className={`group relative cursor-pointer rounded-lg border p-2.5 space-y-2 transition-all duration-150 ${
                            isDone
                              ? "border-emerald-500/30 bg-zinc-950/90 text-zinc-300 hover:border-emerald-500/50"
                              : "border-white/10 bg-zinc-950/60 hover:border-white/25 hover:bg-zinc-950/90"
                          }`}
                        >
                          {/* Top Row: Checkbox, Title, Hours */}
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-start gap-2 min-w-0">
                              <button
                                suppressHydrationWarning
                                type="button"
                                onClick={(e) => toggleMilestone(m.id, e)}
                                title={isDone ? "Mark Incomplete" : "Mark Complete"}
                                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                                  isDone
                                    ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                                    : "border-zinc-600 bg-zinc-900 text-transparent hover:border-white"
                                }`}
                              >
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </button>
                              <div className="min-w-0">
                                <h4
                                  className={`text-xs font-bold leading-tight transition-colors ${
                                    isDone ? "text-zinc-400 line-through decoration-zinc-600" : "text-white group-hover:text-cyan-300"
                                  }`}
                                >
                                  {m.title}
                                </h4>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-400 shrink-0 border border-white/[0.06] bg-white/[0.02] px-1 rounded">
                              {m.workloadHours}h
                            </span>
                          </div>

                          {/* Description Snippet */}
                          <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                            {m.description}
                          </p>

                          {/* Required Skills Chips */}
                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            {m.requiredSkills.map((req) => {
                              const hasSkill = userSkills.some(
                                (us) => us.name.toLowerCase() === req.toLowerCase()
                              );
                              return (
                                <span
                                  key={req}
                                  className={`inline-flex items-center rounded px-1 py-0.2 text-[9px] font-mono border ${
                                    hasSkill
                                      ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-300"
                                      : "border-zinc-800 bg-zinc-900 text-zinc-400"
                                  }`}
                                >
                                  {hasSkill && <Check className="h-2 w-2 mr-0.5 text-emerald-400" />}
                                  {req}
                                </span>
                              );
                            })}
                          </div>

                          {/* Capstone Challenge Snippet */}
                          <div className="rounded border border-white/[0.06] bg-zinc-900/80 px-2 py-1 text-[10px] text-zinc-300 flex items-center justify-between gap-1">
                            <span className="text-zinc-400 truncate italic">
                              {m.projectPrompt}
                            </span>
                            <ArrowUpRight className="h-3 w-3 text-zinc-500 group-hover:text-cyan-300 transition-colors shrink-0" />
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

      {/* FIXED BOTTOM STATUS BAR (20px) */}
      <footer className="h-5 shrink-0 z-40 w-full border-t border-white/[0.08] bg-zinc-950 px-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 select-none">
        <div className="flex items-center gap-3">
          <span>[ZYTHRON OS v2.4]</span>
          <span className="hidden sm:inline text-zinc-600">//</span>
          <span className="hidden sm:inline text-zinc-400">BACKEND NODE: localhost:8000 (CONNECTED)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline">LATENCY: 12ms</span>
          <span className="hidden md:inline text-zinc-600">//</span>
          <span className="text-emerald-400">STATUS: NOMINAL</span>
        </div>
      </footer>

      {/* AMAZING GLASSY POPUP MODAL: MILESTONE INSPECTOR */}
      {activeModalMilestone && (
        <div
          onClick={() => setActiveModalMilestone(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-white/20 bg-zinc-950/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] p-6 space-y-5 text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                  <span>MILESTONE INSPECTOR</span>
                  <span>//</span>
                  <span>{activeModalMilestone.workloadHours} STUDY HOURS</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeModalMilestone.title}
                </h3>
              </div>
              <button suppressHydrationWarning
                type="button"
                onClick={() => setActiveModalMilestone(null)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {activeModalMilestone.description}
            </p>

            {/* Syllabus Points */}
            {activeModalMilestone.syllabusPoints && (
              <div className="space-y-2 rounded-xl border border-white/10 bg-zinc-900/70 p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  Syllabus Competency Breakdown
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-300 list-disc pl-5">
                  {activeModalMilestone.syllabusPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hands-On Capstone Project Rubric */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-300 text-xs">
                <Laptop className="h-4 w-4 text-cyan-400" />
                Hands-On Capstone Rubric & Challenge
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                {activeModalMilestone.projectPrompt}
              </p>
            </div>

            {/* Required Skills & Resources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-3 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                  Required Competencies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeModalMilestone.requiredSkills.map((req) => (
                    <span
                      key={req}
                      className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-200"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-3 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                  Primary References:
                </span>
                <div className="flex flex-col gap-1">
                  {activeModalMilestone.resources.map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between text-[11px] text-cyan-400 hover:underline"
                    >
                      <span>{r.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">[{r.category}]</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button suppressHydrationWarning
                type="button"
                onClick={() => {
                  toggleMilestone(activeModalMilestone.id);
                  setActiveModalMilestone(null);
                }}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  completedMilestones[activeModalMilestone.id]
                    ? "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-white text-zinc-950 hover:bg-zinc-200 shadow-md"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>
                  {completedMilestones[activeModalMilestone.id] ? "Mark as Incomplete" : "Mark as Completed"}
                </span>
              </button>

              <button suppressHydrationWarning
                type="button"
                onClick={() => setActiveModalMilestone(null)}
                className="rounded-md border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLASSY AI TERMINAL DRAWER (POST to http://localhost:8000/api/chat) */}
      {chatDrawerOpen && (
        <div
          onClick={() => setChatDrawerOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md transition-all"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-white/20 bg-zinc-950/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] p-5 space-y-4 text-zinc-100 animate-in fade-in slide-in-from-bottom-6 duration-200"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Advisory Backend Connection
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <span className="h-2 w-2 rounded bg-emerald-400" />
                  <span>{AI_CHAT_ENDPOINT}</span>
                </div>
                <button suppressHydrationWarning
                  type="button"
                  onClick={() => setChatDrawerOpen(false)}
                  className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Terminal Feed */}
            <div className="space-y-2 max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 font-mono text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-lg border ${
                    msg.sender === "user"
                      ? "border-zinc-700 bg-zinc-900 text-zinc-200 ml-6"
                      : "border-cyan-500/20 bg-zinc-950 text-cyan-300 mr-6"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                    <span>{msg.sender === "user" ? "Client Inquiry" : "AI Backend Node (localhost:8000)"}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                </div>
              ))}
              {isChatLoading && (
                <div className="p-2 rounded border border-zinc-800 bg-zinc-950 text-zinc-400 italic text-xs">
                  Awaiting response from backend node at {AI_CHAT_ENDPOINT}...
                </div>
              )}
            </div>

            {chatError && (
              <div className="rounded-md border border-red-800/60 bg-red-950/40 p-2.5 text-xs text-red-300 font-mono">
                {chatError}
              </div>
            )}

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-zinc-500 font-mono text-[10px]">Presets:</span>
              {[
                "Analyze missing prerequisites for this track.",
                "Recommend next capstone project to build.",
                "Explain the primary competencies of Phase 1.",
              ].map((query) => (
                <button suppressHydrationWarning
                  key={query}
                  type="button"
                  disabled={isChatLoading}
                  onClick={() => handleSendQuery(query)}
                  className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input suppressHydrationWarning
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendQuery();
                  }
                }}
                disabled={isChatLoading}
                placeholder="Query AI backend regarding track prerequisites or capstone specs..."
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <button suppressHydrationWarning
                type="button"
                onClick={() => handleSendQuery()}
                disabled={isChatLoading || !chatInput.trim()}
                className="flex items-center gap-1.5 rounded-md bg-white text-zinc-950 px-4 py-2 text-xs font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

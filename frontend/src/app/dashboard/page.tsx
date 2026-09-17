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
  ShieldCheck,
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
  LogOut,
  TrendingUp,
  Layers,
  HelpCircle,
  MessageSquare
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
        description: "Normalization, indexing strategies (B-Tree, GIN), connection pooling, and ORM integration.",
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
    title: "Phase 3: Infrastructure, Security & Operations",
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

const ROLE_SKILL_MAP: Record<string, string[]> = {
  "ai": ["Python", "PyTorch", "TensorFlow", "FastAPI", "Vector DB", "Pinecone", "LangChain", "Docker", "GPU Clusters", "Transformers"],
  "ml": ["Python", "PyTorch", "Scikit-Learn", "FastAPI", "Pandas", "MLflow", "Docker", "Vector DB", "PostgreSQL", "CUDA"],
  "data": ["Python", "SQL", "Spark", "Pandas", "Airflow", "Snowflake", "dbt", "PostgreSQL", "Kafka", "Docker"],
  "mobile": ["Swift", "SwiftUI", "Kotlin", "React Native", "Flutter", "REST API", "GraphQL", "Firebase", "Xcode", "Git"],
  "ios": ["Swift", "SwiftUI", "Objective-C", "Xcode", "Combine", "REST API", "CoreData", "Git", "TestFlight", "CocoaPods"],
  "android": ["Kotlin", "Android SDK", "Jetpack Compose", "Coroutines", "Room DB", "REST API", "Git", "Gradle", "Firebase", "Unit Testing"],
  "devops": ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "Prometheus", "Linux", "Python", "Golang", "Ansible"],
  "cloud": ["AWS", "Kubernetes", "Docker", "Terraform", "Cloud Architecture", "Python", "Linux", "Networking", "IAM", "PostgreSQL"],
  "backend": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Node.js", "Go", "gRPC", "Microservices", "Kafka"],
  "frontend": ["TypeScript", "React", "Next.js", "Tailwind CSS", "Redux", "GraphQL", "Web Performance", "HTML5/CSS3", "Jest", "Git"],
  "full-stack": ["TypeScript", "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "Redis", "Kafka"],
  "fullstack": ["TypeScript", "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "Redis", "Kafka"],
  "security": ["Python", "Linux", "Networking", "SIEM", "Penetration Testing", "Cryptography", "OAuth2", "Docker", "AWS", "Bash"],
  "product": ["Product Strategy", "User Research", "Agile/Scrum", "SQL", "A/B Testing", "Figma", "Data Analytics", "Roadmapping", "System Architecture", "KPI Tracking"],
};

function getRequiredSkillsForRole(roleText: string): string[] {
  const r = roleText.toLowerCase();
  for (const key of Object.keys(ROLE_SKILL_MAP)) {
    if (r.includes(key)) {
      return ROLE_SKILL_MAP[key];
    }
  }
  return ["TypeScript", "React", "Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "System Design", "Git", "Cloud"];
}

function getDynamicPhases(roleText: string): RoadmapPhase[] {
  const r = roleText.toLowerCase();

  if (r.includes("ai") || r.includes("ml") || r.includes("machine learning") || r.includes("intelligence")) {
    return [
      {
        id: 1,
        title: "Phase 1: PyTorch & Vector Mathematics",
        description: "Tensor transformations, embedding spaces, cosine metrics, and neural network foundations.",
        badge: "AI Math",
        icon: Cpu,
        milestones: [
          {
            id: "ai1",
            title: "PyTorch Tensor Pipeline & Matrix Calculus",
            description: "Building autograd models, loss optimization, and GPU acceleration with CUDA.",
            workloadHours: 45,
            requiredSkills: ["Python", "PyTorch"],
            syllabusPoints: [
              "Autograd engine and custom autograd Functions",
              "Vector embeddings and high-dimensional cosine distance",
              "Batch normalization and learning rate schedulers",
              "GPU memory optimization with mixed precision (fp16)"
            ],
            resources: [
              { name: "PyTorch Documentation", url: "https://pytorch.org/docs/", category: "Docs" },
            ],
            projectPrompt: "Train a custom neural transformer classifier on high-dimensional text embeddings.",
          },
          {
            id: "ai2",
            title: "Pinecone Vector Search & RAG Architecture",
            description: "Pinecone index configuration, chunking strategies, semantic retrieval, and prompt context enrichment.",
            workloadHours: 50,
            requiredSkills: ["Vector DB", "Pinecone", "LangChain"],
            syllabusPoints: [
              "HNSW vector indexing and cosine distance partitioning",
              "Recursive semantic document chunking and token budgeting",
              "Prompt augmentation with top-K similarity search results",
              "Evaluation metrics for RAG hallucination reduction"
            ],
            resources: [
              { name: "Pinecone Docs", url: "https://docs.pinecone.io", category: "Docs" },
            ],
            projectPrompt: "Build a production RAG search engine over 100,000 domain PDF documents with Pinecone.",
          }
        ]
      },
      {
        id: 2,
        title: "Phase 2: LLM Fine-Tuning & Prompt Engineering",
        description: "LoRA parameter-efficient fine-tuning, system prompt engineering, and structured JSON output control.",
        badge: "LLMs",
        icon: Sparkles,
        milestones: [
          {
            id: "ai3",
            title: "LoRA & QLoRA Model Adaptation",
            description: "Fine-tuning open-weights models (Llama/Mistral) with PEFT techniques.",
            workloadHours: 60,
            requiredSkills: ["Python", "Transformers"],
            syllabusPoints: [
              "Quantization methods (4-bit NF4 vs 8-bit integers)",
              "Rank matrix decomposition (LoRA r=16 alpha=32)",
              "Instruction tuning dataset formatting (SFT Trainer)",
              "Model evaluation with BLEU, ROUGE, and LLM-as-a-judge"
            ],
            resources: [
              { name: "Hugging Face PEFT Docs", url: "https://huggingface.co/docs/peft", category: "Docs" },
            ],
            projectPrompt: "Fine-tune a 7B parameter open-source LLM for domain-specific JSON extraction.",
          }
        ]
      },
      {
        id: 3,
        title: "Phase 3: Production Model Serving & GPU Operations",
        description: "vLLM serving, Triton inference server, Docker containerization, and rate-limited API gateways.",
        badge: "Operations",
        icon: Terminal,
        milestones: [
          {
            id: "ai4",
            title: "High-Throughput Model Serving with vLLM",
            description: "Continuous batching, PagedAttention memory management, and async streaming HTTP APIs.",
            workloadHours: 40,
            requiredSkills: ["FastAPI", "Docker"],
            syllabusPoints: [
              "PagedAttention KV cache memory allocation",
              "Asynchronous token streaming over Server-Sent Events (SSE)",
              "Multi-GPU tensor parallelism configuration",
              "Monitoring inference latency (TTFT and throughput token/sec)"
            ],
            resources: [
              { name: "vLLM Documentation", url: "https://docs.vllm.ai", category: "Docs" },
            ],
            projectPrompt: "Deploy a high-concurrency LLM inference API microservice handling 500 requests/sec.",
          }
        ]
      }
    ];
  }

  if (r.includes("devops") || r.includes("cloud") || r.includes("infrastructure") || r.includes("sre")) {
    return [
      {
        id: 1,
        title: "Phase 1: Linux Kernel, Networking & Containers",
        description: "Container runtime primitives, Linux namespaces, cgroups, and multi-stage Docker builds.",
        badge: "Containers",
        icon: Terminal,
        milestones: [
          {
            id: "do1",
            title: "Container Internals & Docker Security",
            description: "Linux process isolation, seccomp profiles, multi-stage image optimization, and rootless runtimes.",
            workloadHours: 40,
            requiredSkills: ["Docker", "Linux"],
            syllabusPoints: [
              "Cgroups v2 resource limiting and network namespaces",
              "Multi-stage Dockerfile caching and zero-vulnerability base images",
              "Container runtime security with Trivy and Grype scanning",
              "Container network overlay bridge and host networking"
            ],
            resources: [
              { name: "Docker Documentation", url: "https://docs.docker.com", category: "Docs" },
            ],
            projectPrompt: "Architect a hardened multi-stage Docker pipeline with distroless base images under 50MB.",
          }
        ]
      },
      {
        id: 2,
        title: "Phase 2: Kubernetes Orchestration & Infrastructure as Code",
        description: "Declarative cluster specs, Helm charts, Terraform HCL modules, and ingress controllers.",
        badge: "K8s & IaC",
        icon: Server,
        milestones: [
          {
            id: "do2",
            title: "Kubernetes Cluster Architecture & Helm",
            description: "Deployments, StatefulSets, ingress routing, secret management, and Horizontal Pod Autoscalers.",
            workloadHours: 55,
            requiredSkills: ["Kubernetes", "Terraform"],
            syllabusPoints: [
              "Kube-apiserver control plane and etcd state consistency",
              "Ingress NGINX routing, TLS termination, and cert-manager",
              "Terraform AWS EKS cluster provision with HCL modules",
              "Horizontal Pod Autoscaler (HPA) driven by custom Prometheus metrics"
            ],
            resources: [
              { name: "Kubernetes Docs", url: "https://kubernetes.io/docs/", category: "Docs" },
            ],
            projectPrompt: "Provision a multi-AZ Kubernetes cluster using Terraform with automated SSL certificate renewal.",
          }
        ]
      },
      {
        id: 3,
        title: "Phase 3: CI/CD Automation & Full Observability",
        description: "GitHub Actions runner matrices, Prometheus metrics scraping, Grafana dashboards, and Jaeger tracing.",
        badge: "Observability",
        icon: Activity,
        milestones: [
          {
            id: "do3",
            title: "GitOps Pipelines & Prometheus Observability",
            description: "ArgoCD automated cluster syncing, SLI/SLO tracking, and distributed tracing.",
            workloadHours: 45,
            requiredSkills: ["CI/CD", "Prometheus"],
            syllabusPoints: [
              "ArgoCD GitOps continuous deployment reconciliation loop",
              "Prometheus PromQL queries and Alertmanager notification rules",
              "Grafana dashboard design for RED metrics (Rate, Errors, Duration)",
              "OpenTelemetry distributed trace propagation"
            ],
            resources: [
              { name: "Prometheus Docs", url: "https://prometheus.io/docs/", category: "Docs" },
            ],
            projectPrompt: "Construct an automated GitOps deployment pipeline with canary releases and instant rollback on error spike.",
          }
        ]
      }
    ];
  }

  if (r.includes("mobile") || r.includes("ios") || r.includes("android") || r.includes("flutter") || r.includes("react native")) {
    return [
      {
        id: 1,
        title: "Phase 1: Native Mobile Architecture & Declarative UI",
        description: "SwiftUI / Jetpack Compose component trees, reactive state management, and touch interactions.",
        badge: "Mobile UI",
        icon: Laptop,
        milestones: [
          {
            id: "mb1",
            title: "Declarative UI & Reactive State Pipelines",
            description: "State machines, observable objects, layout constraints, and smooth animations.",
            workloadHours: 40,
            requiredSkills: ["SwiftUI", "React Native"],
            syllabusPoints: [
              "Declarative view lifecycles and diffing algorithms",
              "Combine / Reactive state streams and debounced search",
              "Custom gesture recognizers and 60fps fluid motion",
              "Dark mode theme tokens and accessible dynamic font scaling"
            ],
            resources: [
              { name: "Apple Developer Docs", url: "https://developer.apple.com/documentation/swiftui", category: "Docs" },
            ],
            projectPrompt: "Build a responsive native mobile design system with fluid drag-and-drop interactive gestures.",
          }
        ]
      },
      {
        id: 2,
        title: "Phase 2: Networking, Offline Caching & Local DB",
        description: "REST & GraphQL client layers, SQLite / CoreData encryption, and push notification handlers.",
        badge: "Networking",
        icon: Globe,
        milestones: [
          {
            id: "mb2",
            title: "Offline-First Synchronization Engine",
            description: "Background task fetching, local database encryption, and automatic sync reconciliation.",
            workloadHours: 50,
            requiredSkills: ["REST API", "Firebase"],
            syllabusPoints: [
              "Encrypted SQLite storage and migration schemas",
              "Background HTTP queue runner with retry backoff",
              "FCM Push Notification payload handling in background",
              "Optimistic UI updates with rollbacks on network timeout"
            ],
            resources: [
              { name: "Firebase Docs", url: "https://firebase.google.com/docs", category: "Docs" },
            ],
            projectPrompt: "Create an offline-first messaging app with background syncing and push notifications.",
          }
        ]
      },
      {
        id: 3,
        title: "Phase 3: App Security, Testing & Store Publishing",
        description: "Keychain security, certificate pinning, automated UI tests, and App Store / Play Store deployment.",
        badge: "Release",
        icon: ShieldCheck,
        milestones: [
          {
            id: "mb3",
            title: "App Store Publishing & Biometric Security",
            description: "FaceID / Biometric auth, SSL pinning, Xcode Cloud / Fastlane automated releases.",
            workloadHours: 35,
            requiredSkills: ["Xcode", "Git"],
            syllabusPoints: [
              "Secure enclave storage for JWT auth tokens",
              "SSL pinning to prevent man-in-the-middle inspection",
              "Fastlane automated screenshot generation and TestFlight release",
              "Crashlytics crash reporting and symbolication"
            ],
            resources: [
              { name: "Fastlane Docs", url: "https://docs.fastlane.tools", category: "Docs" },
            ],
            projectPrompt: "Configure an automated Fastlane deployment pipeline with security audits and TestFlight beta distribution.",
          }
        ]
      }
    ];
  }

  return ROADMAP_PHASES;
}

export default function HyperPersonalizedCareerGuidance() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Engineer");
  const [userEmail, setUserEmail] = useState("");

  // User Profile Data (Loaded from Onboarding)
  const [preferredRole, setPreferredRole] = useState("Full-Stack Systems Engineer");
  const [experienceLevel, setExperienceLevel] = useState<"Junior" | "Mid" | "Senior">("Mid");
  const [targetCompanyTier, setTargetCompanyTier] = useState<"Tier 1 Big Tech" | "AI Unicorn" | "High-Growth">("Tier 1 Big Tech");
  const [userSkills, setUserSkills] = useState<SkillItem[]>([
    { name: "TypeScript", level: "Intermediate" },
    { name: "React", level: "Intermediate" },
    { name: "Python", level: "Intermediate" },
    { name: "FastAPI", level: "Intermediate" },
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [weeklyCommitmentHours, setWeeklyCommitmentHours] = useState(15);
  const [targetTimelineMonths, setTargetTimelineMonths] = useState(6);

  // Checkpoints & Inspector Modal
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({ fs1: true });
  const [activeModalMilestone, setActiveModalMilestone] = useState<RoadmapMilestone | null>(null);

  // AI RAG State
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [aiRoadmapOutput, setAiRoadmapOutput] = useState<string>("");
  const [topJobMatch, setTopJobMatch] = useState<any>(null);

  // AI Chat Assistant State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Zythron AI Career Advisor online. Ask me any question about your skill gap analysis, target role requirements, or interview prep!" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load Onboarding Data
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
          const exp = p.experience.toLowerCase();
          if (exp.includes("junior")) setExperienceLevel("Junior");
          else if (exp.includes("senior")) setExperienceLevel("Senior");
          else setExperienceLevel("Mid");
        }
        if (Array.isArray(p.skills) && p.skills.length > 0) {
          setUserSkills(p.skills.map((sk: string) => ({ name: sk, level: "Intermediate" })));
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
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync state edits to localStorage whenever configuration changes
  useEffect(() => {
    if (!mounted) return;
    try {
      const existing = localStorage.getItem("zythron_profile");
      let current = existing ? JSON.parse(existing) : {};
      current = {
        ...current,
        role: preferredRole,
        experience: experienceLevel,
        tier: targetCompanyTier,
        skills: userSkills.map((s) => s.name),
        commitment: `${weeklyCommitmentHours}h`,
        timeline: `${targetTimelineMonths} Months`,
      };
      localStorage.setItem("zythron_profile", JSON.stringify(current));
    } catch (err) {
      console.error(err);
    }
  }, [preferredRole, experienceLevel, targetCompanyTier, userSkills, weeklyCommitmentHours, targetTimelineMonths, mounted]);

  // Calculate Dynamic Role Requirements & Dynamic Phases
  const requiredRoleSkills = useMemo(() => getRequiredSkillsForRole(preferredRole), [preferredRole]);
  const activeRoadmapPhases = useMemo(() => getDynamicPhases(preferredRole), [preferredRole]);

  const userSkillNames = new Set(userSkills.map((s) => s.name.toLowerCase()));

  const acquiredSkills = userSkills.map((s) => s.name);
  const missingSkills = requiredRoleSkills.filter((s) => !userSkillNames.has(s.toLowerCase()));
  const skillMatchPercent = Math.min(100, Math.round((userSkills.filter(s => requiredRoleSkills.map(r => r.toLowerCase()).includes(s.name.toLowerCase())).length / Math.max(1, requiredRoleSkills.length)) * 100));

  const totalMilestones = 5;
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalMilestones) * 100);

  // Dynamic Salary Uplift Estimate based on missing skills & tier
  const estimatedSalaryUplift = useMemo(() => {
    let base = 25000;
    if (targetCompanyTier === "Tier 1 Big Tech") base += 15000;
    if (experienceLevel === "Senior") base += 20000;
    return base;
  }, [targetCompanyTier, experienceLevel]);

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!userSkills.some((s) => s.name.toLowerCase() === skillInput.trim().toLowerCase())) {
      setUserSkills([...userSkills, { name: skillInput.trim(), level: "Intermediate" }]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillName: string) => {
    setUserSkills(userSkills.filter((s) => s.name !== skillName));
  };

  const handleSynthesizeAIRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const response = await fetch("http://localhost:8000/api/match-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: acquiredSkills,
          experience_level: experienceLevel,
          preferred_role: preferredRole,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTopJobMatch(data.top_match || null);
        setAiRoadmapOutput(data.roadmap || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
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
        setChatMessages((prev) => [...prev, { sender: "ai", text: data.reply || "I am analyzing your request." }]);
      }
    } catch (e) {
      setChatMessages((prev) => [...prev, { sender: "ai", text: "Connected to AI Engine." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("zythron_user");
    router.push("/signin");
  };

  if (!mounted) return null;

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0d] text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black">
      
      {/* ─── ATMOSPHERIC BACKGROUND ─── */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />

      {/* ─── TOP NAVBAR ─── */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0a0a0d]/80 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-base font-bold tracking-[0.2em] text-white flex items-center gap-2 font-mono">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            ZYTHRON
          </Link>

          {/* Standardized Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs">
            <Link href="/dashboard" className="rounded-full px-3.5 py-1.5 text-xs font-semibold bg-white text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              (01) CAREER MATCH
            </Link>
            <Link href="/mock-interview" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
              (02) MOCK INTERVIEW
            </Link>
            <Link href="/record-meeting" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
              (03) RECORD MEETING
            </Link>
            <Link href="/resume-analyzer" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
              (04) RESUME SCANNER
            </Link>
            <Link href="/job-listings" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
              (05) JOB LISTINGS
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300 font-medium">{userName}</span>
          </div>

          <button onClick={handleSignOut} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer">
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8 relative z-10">

        {/* ─── 1. HYPER-PERSONALIZED DIAGNOSTIC HEADER BANNER ─── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced Profile: {userName}
                </span>
                <span className="text-xs text-zinc-400 font-mono">Onboarding Baseline Loaded</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Career Trajectory: <span className="text-zinc-200">{preferredRole}</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Targeting {targetCompanyTier} • {experienceLevel} Tier • {weeklyCommitmentHours}h/week Commitment Horizon
              </p>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-black/40 border border-white/10 p-3 rounded-2xl">
                <span className="text-[9px] text-zinc-500 uppercase block">Skill Match</span>
                <span className="text-xl font-bold text-emerald-400">{skillMatchPercent}%</span>
              </div>
              <div className="bg-black/40 border border-white/10 p-3 rounded-2xl">
                <span className="text-[9px] text-zinc-500 uppercase block">Milestones</span>
                <span className="text-xl font-bold text-white">{completedCount}/5</span>
              </div>
              <div className="bg-black/40 border border-white/10 p-3 rounded-2xl">
                <span className="text-[9px] text-zinc-500 uppercase block">Salary Uplift</span>
                <span className="text-base font-bold text-cyan-300">+${estimatedSalaryUplift / 1000}k</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2-COLUMN WORKSTATION GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ─── LEFT COLUMN: PERSONALIZED CONTROLS & SKILL MATRIX (4 Cols) ─── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Parameter Adjustment Panel */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-white" />
                  Career Controls
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">Live Tweak</span>
              </div>

              {/* Target Role Input */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Target Role</label>
                <input
                  type="text"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                />
              </div>

              {/* Experience Level Selector */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                >
                  <option value="Junior">Junior Tier (0-2 YOE)</option>
                  <option value="Mid">Mid-Level Tier (2-5 YOE)</option>
                  <option value="Senior">Senior / Staff Tier (5+ YOE)</option>
                </select>
              </div>

              {/* Target Company Tier Selector */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Target Employer Tier</label>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                  {(["Tier 1 Big Tech", "AI Unicorn", "High-Growth"] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setTargetCompanyTier(tier)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        targetCompanyTier === tier
                          ? "bg-white text-black font-bold border-white shadow-md"
                          : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Skill Chips Editor */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Your Current Skills ({userSkills.length})</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    placeholder="Add skill (e.g. Docker)..."
                    className="flex-1 bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                  <button onClick={handleAddSkill} className="bg-white text-black px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {userSkills.map((s) => (
                    <span key={s.name} className="inline-flex items-center gap-1.5 text-xs bg-white/[0.04] text-zinc-200 px-3 py-1 rounded-full border border-white/10 font-mono">
                      {s.name}
                      <button onClick={() => handleRemoveSkill(s.name)} className="text-zinc-500 hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Synthesize Button */}
              <button
                onClick={handleSynthesizeAIRoadmap}
                disabled={isGeneratingRoadmap}
                className="w-full bg-white text-black font-semibold py-3.5 rounded-xl text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isGeneratingRoadmap ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-black" />
                    Querying Pinecone Vector Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-black" />
                    Synthesize Personalized AI Roadmap
                  </>
                )}
              </button>
            </div>

            {/* Personalized Skill Gap Analysis Matrix */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                Personalized Competency Matrix
              </h3>

              {/* Acquired vs Missing */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1 font-semibold">Acquired Strengths ({acquiredSkills.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {acquiredSkills.map((sk) => (
                      <span key={sk} className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider block mb-1 font-semibold">Target Gaps to Acquire ({missingSkills.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {missingSkills.map((sk) => (
                      <span key={sk} className="text-[10px] bg-amber-950/60 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-800/50">
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: 3-PHASE CURRICULUM & INSPECTOR (8 Cols) ─── */}
          <div className="lg:col-span-8 space-y-6">

            {/* 3 Phase Cards Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Compass className="h-4 w-4 text-white" />
                  3-Phase Custom Curriculum
                </h2>
                <p className="text-xs text-zinc-400">Click any milestone card to inspect syllabus topics, capstones & docs</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                {progressPercent}% Complete ({completedCount}/5)
              </span>
            </div>

            {/* 3 Phase Parallel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeRoadmapPhases.map((phase) => {
                const PhaseIcon = phase.icon;
                return (
                  <div key={phase.id} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 space-y-4 flex flex-col justify-between backdrop-blur-xl shadow-xl">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                          {phase.badge}
                        </span>
                        <PhaseIcon className="h-4 w-4 text-zinc-400" />
                      </div>
                      <h3 className="text-xs font-bold text-white leading-snug mb-1">{phase.title}</h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{phase.description}</p>
                    </div>

                    {/* Milestones inside Phase */}
                    <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                      {phase.milestones.map((m) => {
                        const isDone = completedMilestones[m.id];
                        return (
                          <div
                            key={m.id}
                            onClick={() => setActiveModalMilestone(m)}
                            className="p-3 rounded-2xl border bg-black/40 border-white/10 hover:border-white/30 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMilestone(m.id);
                                  }}
                                  className={`mt-0.5 h-4 w-4 rounded-md flex items-center justify-center transition-colors ${
                                    isDone ? "bg-emerald-400 text-black" : "border border-zinc-600 hover:border-zinc-300"
                                  }`}
                                >
                                  {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                                </button>
                                <div>
                                  <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                                    {m.title}
                                  </h4>
                                  <span className="text-[9px] font-mono text-zinc-500">{m.workloadHours}h study hours</span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Generated AI RAG Roadmap Output (If Triggered) */}
            {aiRoadmapOutput && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-white" />
                    Gemini Vector RAG Roadmap Response
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">Live AI Synthesis</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-300 bg-black/50 p-4 rounded-2xl border border-white/10 leading-relaxed overflow-x-auto">
                  {aiRoadmapOutput}
                </pre>
              </div>
            )}

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
            className="w-full max-w-2xl bg-[#0a0a0d] border border-white/20 rounded-3xl p-6 space-y-5 text-zinc-100 shadow-2xl relative"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  {activeModalMilestone.workloadHours} Estimated Study Hours
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
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  Syllabus Competencies
                </h4>
                <ul className="text-xs text-zinc-300 space-y-1 list-disc pl-5 font-mono">
                  {activeModalMilestone.syllabusPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Capstone Challenge */}
            <div className="bg-cyan-950/30 border border-cyan-500/20 p-4 rounded-2xl space-y-1">
              <h4 className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-2 font-mono">
                <Laptop className="h-4 w-4 text-cyan-400" />
                Hands-On Capstone Challenge
              </h4>
              <p className="text-xs text-zinc-200 leading-relaxed">{activeModalMilestone.projectPrompt}</p>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {activeModalMilestone.requiredSkills.map((sk) => (
                    <span key={sk} className="text-[10px] bg-white/10 text-zinc-200 px-2 py-0.5 rounded border border-white/10">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Primary Documentation:</span>
                {activeModalMilestone.resources.map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline block truncate">
                    {r.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between">
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

      {/* ─── FLOATING AI ASSISTANT CHAT DRAWER ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="w-80 md:w-96 bg-[#0a0a0d] border border-white/20 rounded-3xl shadow-2xl flex flex-col h-96 overflow-hidden">
            <div className="p-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Zythron AI Advisor</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${m.sender === "user" ? "bg-white text-black font-semibold" : "bg-white/10 border border-white/10 text-zinc-200"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatLoading && <div className="text-zinc-500 italic text-[11px]">Thinking...</div>}
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                placeholder="Ask your AI advisor..."
                className="flex-1 bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none font-mono"
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

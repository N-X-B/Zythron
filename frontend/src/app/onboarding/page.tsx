"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldAlert, Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Form State
  const [collegeYear, setCollegeYear] = useState("Junior (Year 3)");
  const [major, setMajor] = useState("Computer Science");
  const [targetTrack, setTargetTrack] = useState("Full-Stack & AI Systems");

  const [skills, setSkills] = useState<string[]>(["Python", "Data Structures", "React"]);
  const [skillInput, setSkillInput] = useState("");

  const [aiFocusGoal, setAiFocusGoal] = useState("Build AI-Resilient Engineering Depth");
  const [weeklyHours, setWeeklyHours] = useState("10-15 hrs/week");

  const suggestedSkills = [
    "Python", "Data Structures", "System Design", "React", "FastAPI",
    "PyTorch", "Docker", "SQL", "TypeScript", "Git", "Cloud Architecture"
  ];

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("zythron_user");
    if (!storedUser) {
      router.push("/signin");
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        router.push("/signin");
      }
    }
  }, [router]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = () => {
    const profileData = {
      role: targetTrack,
      collegeYear,
      major,
      experience: collegeYear,
      skills,
      goal: aiFocusGoal,
      commitment: weeklyHours,
    };
    localStorage.setItem("zythron_profile", JSON.stringify(profileData));

    if (user) {
      const db = JSON.parse(localStorage.getItem("zythron_db") || "{}");
      if (db[user.email]) {
        db[user.email].onboarded = true;
        db[user.email].profile = profileData;
        localStorage.setItem("zythron_db", JSON.stringify(db));
      }
    }

    router.push("/dashboard");
  };

  if (!isMounted || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col justify-between py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <GraduationCap className="w-5 h-5 text-white" />
          <span>ZYTHRON</span>
        </div>
        <div className="text-xs text-zinc-400 font-medium bg-zinc-900 border border-white/10 px-3 py-1 rounded-full">
          Step {step} of 3
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xl mx-auto mb-10 bg-zinc-900 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-xl mx-auto bg-zinc-900/80 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md my-auto">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome, {user.name}</h2>
              <p className="text-zinc-400 text-sm">Let's setup your college career AI resilience plan.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Current Academic Year
              </label>
              <select
                value={collegeYear}
                onChange={(e) => setCollegeYear(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
              >
                <option value="Freshman (Year 1)">Freshman (Year 1)</option>
                <option value="Sophomore (Year 2)">Sophomore (Year 2)</option>
                <option value="Junior (Year 3)">Junior (Year 3)</option>
                <option value="Senior (Year 4)">Senior (Year 4)</option>
                <option value="Graduate / Master's">Graduate / Master's</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Major / Program
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science, Electrical Engineering"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Target Engineering Track
              </label>
              <select
                value={targetTrack}
                onChange={(e) => setTargetTrack(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
              >
                <option value="Full-Stack & AI Systems">Full-Stack & AI Systems</option>
                <option value="Backend Microservices & Cloud">Backend Microservices & Cloud</option>
                <option value="AI / ML Infrastructure">AI / ML Infrastructure</option>
                <option value="DevOps & Systems Engineering">DevOps & Systems Engineering</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Coursework & Skills</h2>
              <p className="text-zinc-400 text-sm">Add skills you've learned in class or self-study.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Add Skill (Press Enter)
              </label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React, Python, Docker"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 placeholder-zinc-600 mb-3"
              />

              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-200 text-xs px-3 py-1.5 rounded-full font-medium border border-white/10"
                  >
                    {s}
                    <button
                      onClick={() => removeSkill(s)}
                      className="text-zinc-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="text-xs text-zinc-500 mb-2 font-medium">Quick Add Suggestions:</div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAddSkill(s)}
                    disabled={skills.includes(s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      skills.includes(s)
                        ? "bg-zinc-900 border-white/5 text-zinc-600 cursor-default"
                        : "bg-zinc-950 border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                    }`}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">AI Career Goals</h2>
              <p className="text-zinc-400 text-sm">Define what you want to achieve before graduation.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Primary Objective
              </label>
              <select
                value={aiFocusGoal}
                onChange={(e) => setAiFocusGoal(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
              >
                <option value="Build AI-Resilient Engineering Depth">Build AI-Resilient Engineering Depth</option>
                <option value="Prepare for 2026 Internships">Prepare for 2026 Internships</option>
                <option value="Transition from Basic Syntax to System Design">Transition from Basic Syntax to System Design</option>
                <option value="Master AI Tools & Cloud Deployment">Master AI Tools & Cloud Deployment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Weekly Time Commitment
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["5-10 hrs/wk", "10-15 hrs/wk", "15+ hrs/wk"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setWeeklyHours(time)}
                    className={`py-3 rounded-xl text-xs font-semibold border transition-all ${
                      weeklyHours === time
                        ? "bg-white text-black border-white"
                        : "bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all ml-auto"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all ml-auto"
            >
              Launch Student Dashboard
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-zinc-600">
        Zythron Student Career Intelligence • {new Date().getFullYear()}
      </div>
    </div>
  );
}

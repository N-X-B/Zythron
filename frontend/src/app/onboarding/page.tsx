"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

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
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [goal, setGoal] = useState("");
  const [commitment, setCommitment] = useState("");
  const [timeline, setTimeline] = useState("");

  const suggestedSkills = [
    "React", "Python", "TypeScript", "Node.js", "FastAPI",
    "Docker", "PostgreSQL", "AWS", "Next.js", "Git"
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
      role,
      experience,
      industry,
      skills,
      goal,
      commitment,
      timeline,
    };
    localStorage.setItem("zythron_profile", JSON.stringify(profileData));
    router.push("/dashboard");
  };

  if (!isMounted || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  const progressWidth = `${((step - 1) / 2) * 100}%`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans overflow-y-auto selection:bg-zinc-800">
      <div className="max-w-lg mx-auto py-16 px-6">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-light text-zinc-100 mb-2">Welcome, {user.name}</h1>
          <p className="text-zinc-500">Let's set up your career profile.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-zinc-500 mb-2">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && "Professional Profile"}
              {step === 2 && "Skills & Expertise"}
              {step === 3 && "Goals & Commitment"}
            </span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-400 transition-all duration-500 ease-in-out rounded-full"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <div className="relative min-h-[400px]">
          {/* Step 1 */}
          <div
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              step === 1
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "-translate-x-8 opacity-0 pointer-events-none"
            }`}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Preferred Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full-Stack Developer"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors appearance-none"
                >
                  <option value="" disabled>Select experience...</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Current Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Technology, Finance"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              step === 2
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : step < 2
                ? "translate-x-8 opacity-0 pointer-events-none"
                : "-translate-x-8 opacity-0 pointer-events-none"
            }`}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Add Skills
                </label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-zinc-700 text-zinc-300 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-zinc-400 hover:text-zinc-100 focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-3 mt-4">Suggested Skills</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      disabled={skills.includes(skill)}
                      className="px-3 py-1 border border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm rounded-full transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              step === 3
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "translate-x-8 opacity-0 pointer-events-none"
            }`}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Career Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors appearance-none"
                >
                  <option value="" disabled>Select primary goal...</option>
                  <option value="Get First Job">Get First Job</option>
                  <option value="Switch Careers">Switch Careers</option>
                  <option value="Get Promoted">Get Promoted</option>
                  <option value="Learn New Stack">Learn New Stack</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Weekly Commitment
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {["5h", "10h", "15h", "20h", "30h+"].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setCommitment(hours)}
                      className={`py-2 px-1 text-center text-sm border rounded-md transition-colors ${
                        commitment === hours
                          ? "bg-zinc-800 border-zinc-500 text-zinc-100"
                          : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {hours}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Target Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors appearance-none"
                >
                  <option value="" disabled>Select timeline...</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-zinc-900">
          <button
            type="button"
            onClick={handleBack}
            className={`px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors ${
              step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-medium bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-medium bg-zinc-200 text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Launch Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

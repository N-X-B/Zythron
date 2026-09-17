"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setError("");

    // Load existing user database
    const db = JSON.parse(localStorage.getItem("zythron_db") || "{}");

    // Check if email already exists
    if (db[email]) {
      setError("An account with this email already exists. Please sign in.");
      return;
    }

    // Create user entry in database
    db[email] = {
      name,
      email,
      password,
      onboarded: false,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("zythron_db", JSON.stringify(db));

    // Set active session
    const user = { name, email, loggedIn: true };
    localStorage.setItem("zythron_user", JSON.stringify(user));

    // New user → go to onboarding
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-zinc-300 font-sans overflow-y-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <Link href="/" className="flex justify-center mb-6">
          <span className="text-2xl font-bold tracking-[0.2em] text-white">ZYTHRON</span>
        </Link>
        <h2 className="text-center text-3xl font-light text-white mb-2">
          Create an account
        </h2>
        <p className="text-center text-sm text-zinc-400 mb-8">
          Join us to accelerate your career
        </p>

        <div className="bg-zinc-900/50 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-zinc-800">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-zinc-700 bg-zinc-950 rounded-md shadow-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 sm:text-sm text-white transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-zinc-700 bg-zinc-950 rounded-md shadow-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 sm:text-sm text-white transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-zinc-700 bg-zinc-950 rounded-md shadow-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 sm:text-sm text-white transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-950 transition-colors duration-200"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-950 text-zinc-400">
                  Already a member?
                </span>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              <Link href="/signin" className="font-medium text-white hover:text-zinc-300 transition-colors duration-200">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}

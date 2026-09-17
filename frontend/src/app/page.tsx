"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]"></div>;

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-zinc-100 overflow-x-hidden overflow-y-auto selection:bg-zinc-800 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-zinc-900/40 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-zinc-800/30 rounded-full blur-[90px] animate-blob animation-delay-4000" />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-[#0a0a0a]/70 border-b border-zinc-800/50">
        <Link href="/" className="text-xl font-bold tracking-widest text-white hover:text-zinc-300 transition-colors">
          ZYTHRON
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/signin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <main className="relative z-10 flex flex-col items-center w-full pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-20 md:py-32 w-full animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-8 animate-fade-in-up animation-delay-100">
            <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse"></span>
            <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">Introducing the future of career growth</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white mb-6 animate-fade-in-up animation-delay-200 leading-[1.1]">
            ZYTHRON
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 animate-fade-in-up animation-delay-300">
            AI-Powered Career Intelligence Platform. Navigate your professional journey with precision, driven by advanced artificial intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-400">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Start Your Journey
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-zinc-700 rounded-full font-semibold text-lg hover:bg-zinc-800 transition-all duration-300">
              View Dashboard
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 animate-fade-in-up animation-delay-500">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Intelligent capabilities</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Elevate your career trajectory with our suite of AI-driven tools designed for the modern professional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-zinc-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </div>
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-200 transition-colors">Career Matching</h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Our advanced algorithms analyze your skills and aspirations to match you with ideal opportunities that align with your unique profile.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-zinc-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </div>
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-200 transition-colors">Mock Interviews</h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Practice with our AI interviewers that simulate real-world scenarios, providing instant, actionable feedback to hone your delivery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-zinc-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </div>
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-200 transition-colors">AI Roadmaps</h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Generate personalized, step-by-step career progression plans tailored to your specific goals and industry trends.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md animate-fade-in-up animation-delay-600 my-10 text-center flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50 pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to transform your career?</h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-10 relative z-10">Join thousands of professionals leveraging Zythron to accelerate their growth and achieve their ambitions.</p>
          <Link href="/signup" className="relative z-10 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]">
            Get Started Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-[#0a0a0a] py-10 text-center">
        <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} Zythron. All rights reserved.</p>
      </footer>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
      `}</style>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Zythron",
  description: "Zythron privacy policy and data governance terms.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <span className="text-xs font-semibold text-zinc-400">Zythron Documentation</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-4 border-b border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            Legal & Compliance
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-400">
            Effective Date: September 17, 2026. Last Updated: September 17, 2026.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">1. Scope and Overview</h2>
            <p>
              This Privacy Policy explains how Zythron (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects information when you access or use the Zythron Career Guidance platform. We are committed to straightforward data practices with no covert telemetry or unauthorized data reselling.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">2. Information We Collect</h2>
            <p>
              Zythron operates primarily through client-side state processing. The types of data handled include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>
                <strong className="text-white">User-Provided Skill Data:</strong> Technical competencies, experience levels, and career goal selections entered directly into the dashboard form.
              </li>
              <li>
                <strong className="text-white">Technical Device Information:</strong> Standard HTTP request data including IP address, user-agent headers, and browser configurations collected by hosting servers for routing and security verification.
              </li>
              <li>
                <strong className="text-white">Local Preferences:</strong> State parameters such as active sidebar toggles and completed milestone checkpoints saved in browser local storage for session continuity.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">3. How Information Is Used</h2>
            <p>Information processed by Zythron is used strictly to:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>Calculate real-time skill alignment percentages against technical track prerequisites.</li>
              <li>Organize interactive milestone progress and render sequential roadmap recommendations.</li>
              <li>Maintain service reliability, resolve runtime bugs, and prevent infrastructure misuse.</li>
            </ul>
            <p>
              We do not sell, rent, or trade your skill inventory or profile data to recruitment agencies, advertisers, or third-party brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">4. Cookies and Local Storage</h2>
            <p>
              Zythron does not use third-party tracking cookies or advertising pixels. Browser LocalStorage may be utilized exclusively to preserve your chosen theme settings and active roadmap selections locally on your hardware.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">5. Third-Party Integrations and External Links</h2>
            <p>
              The platform references external educational resources, official documentation repositories, and specifications (such as Next.js, Python, and PostgreSQL portals). Clicking external links transfers your browsing context to those respective domains, governed by their independent privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">6. Data Retention and Deletion</h2>
            <p>
              Session data held exclusively in client-side state is cleared whenever your browser cache is reset. If you wish to purge all stored local settings, you can utilize the &quot;Reset&quot; button directly on the dashboard interface.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">7. Security Measures</h2>
            <p>
              All traffic between your browser and Zythron servers is encrypted in transit using standard Transport Layer Security (TLS 1.3). Production builds are compiled using strict type validation and static output bundling to minimize runtime vulnerabilities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">8. Contact Information</h2>
            <p>
              For inquiries, security reports, or questions regarding this Privacy Policy, please contact the engineering team at:
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-xs text-zinc-300">
              Zythron Engineering Team<br />
              Email: privacy@zythron.internal<br />
              Repository: github.com/N-X-B/Zythron
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <span>Copyright 2026 Zythron. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Dashboard
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

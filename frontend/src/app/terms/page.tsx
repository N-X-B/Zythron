import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckSquare, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Zythron",
  description: "Zythron terms and conditions of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
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
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            Legal Agreement
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Terms & Conditions
          </h1>
          <p className="text-sm text-zinc-400">
            Effective Date: September 17, 2026. Last Updated: September 17, 2026.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Zythron Career Guidance platform, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, you must discontinue use of the platform immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">2. Purpose of the Platform</h2>
            <p>
              Zythron provides technical curriculum mapping, skill gap analysis, and educational roadmap tracking. The platform serves as an advisory and informational utility. Roadmap recommendations, milestone sequences, and technical tracks do not constitute an explicit guarantee of employment, hiring offers, or professional accreditation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">3. Acceptable Use Policy</h2>
            <p>When interacting with the platform, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>Attempt to disrupt, breach, or overwhelm platform servers or network infrastructure.</li>
              <li>Scrape, reverse-engineer, or systematically extract curriculum datasets using automated crawlers without written authorization.</li>
              <li>Inject malicious payloads, scripts, or crafted input vectors through the skill configuration forms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">4. Intellectual Property</h2>
            <p>
              The code, design system, component layouts, and curated roadmap structures are the intellectual property of Zythron and contributors under the project licensing terms. All third-party trademarks, documentation names (e.g. Next.js, React, Python, PostgreSQL), and external references remain the property of their respective trademark holders.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">5. Disclaimer of Warranties</h2>
            <p>
              The software and content are provided &quot;as is&quot; and &quot;as available&quot;, without warranty of any kind, express or implied. We do not guarantee uninterrupted availability, error-free execution, or that third-party educational documentation URLs will remain permanent or current.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall Zythron, its developers, or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use this platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">7. Modifications to Terms</h2>
            <p>
              We reserve the right to revise or replace these Terms at any time. Material revisions will be posted directly to this URL with an updated effective date. Continued use of the platform after updates constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">8. Governing Law and Jurisdiction</h2>
            <p>
              These terms shall be governed by and interpreted in accordance with applicable governing regulations, without giving effect to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">9. Contact Information</h2>
            <p>
              For legal inquiries or questions concerning these Terms & Conditions, contact:
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-xs text-zinc-300">
              Zythron Legal and Engineering<br />
              Email: legal@zythron.internal<br />
              Repository: github.com/N-X-B/Zythron
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <span>Copyright 2026 Zythron. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
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

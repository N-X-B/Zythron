import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zythron | Technical Career Roadmaps",
  description: "Structured engineering career roadmaps, skill gap analysis, and curriculum progression.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="h-full overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 font-sans">{children}</body>
    </html>
  );
}

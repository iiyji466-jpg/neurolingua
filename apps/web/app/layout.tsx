import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroLingua AI — Your AI Language Tutor",
  description:
    "Master any language with an AI tutor that remembers your progress, adapts to your level, and makes learning feel natural.",
  keywords: ["language learning", "AI tutor", "multilingual", "pronunciation", "fluency"],
  authors: [{ name: "NeuroLingua Team" }],
  openGraph: {
    title: "NeuroLingua AI",
    description: "The world's most advanced AI language tutor",
    type: "website",
    url: "https://neurolingua.ai",
  },
  twitter: { card: "summary_large_image", title: "NeuroLingua AI" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-[#050507] text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

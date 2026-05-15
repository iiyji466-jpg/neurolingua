"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Brain, Globe, Zap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROVIDERS = [
  {
    id: "google",
    label: "Continue with Google",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: "github",
    label: "Continue with GitHub",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#f9fafb">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Continue with Apple",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#f9fafb">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuth = async (providerId: string) => {
    setLoading(providerId);
    await signIn(providerId, { callbackUrl: "/onboarding" });
  };

  const handleMagicLink = async () => {
    if (!email || loading) return;
    setLoading("email");
    await signIn("email", { email, redirect: false });
    setSent(true);
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="w-14 h-14 rounded-[18px] mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6ee7b7,#3b82f6,#c4b5fd)", boxShadow: "0 0 50px #6ee7b720" }}
            whileHover={{ scale: 1.05 }}
          >
            <Brain size={26} color="#050507" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NeuroLingua</h1>
          <p className="text-sm text-gray-500 mt-1.5">Your AI-powered language tutor</p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-5">
          {PROVIDERS.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => handleOAuth(p.id)}
              disabled={!!loading}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#0e0e11] border border-[#1e1e24] text-gray-300 text-sm font-medium hover:bg-[#111116] hover:border-[#2d2d35] transition-all disabled:opacity-50"
            >
              {p.icon}
              {loading === p.id ? "Redirecting…" : p.label}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#111]" />
          <span className="text-[11px] text-[#2d2d35]">or continue with email</span>
          <div className="flex-1 h-px bg-[#111]" />
        </div>

        {/* Magic Link */}
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                className="input-base w-full text-sm"
              />
              <button
                onClick={handleMagicLink}
                disabled={!email || !!loading}
                className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all disabled:opacity-30"
                style={{
                  background: email ? "linear-gradient(135deg,#6ee7b7,#3b82f6)" : "#0e0e11",
                  border: email ? "none" : "1px solid #1e1e24",
                  color: email ? "#050507" : "#374151",
                  cursor: email ? "pointer" : "default",
                }}
              >
                {loading === "email" ? "Sending…" : "Send Magic Link ✦"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6ee7b715] border border-[#6ee7b730] flex items-center justify-center mx-auto mb-3">
                <Zap size={22} color="#6ee7b7" />
              </div>
              <p className="text-white font-semibold">Check your inbox</p>
              <p className="text-xs text-gray-500 mt-1">Magic link sent to {email}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => router.push("/onboarding")}
          className="w-full mt-4 py-2.5 text-xs text-[#2d2d35] hover:text-gray-500 transition-colors"
        >
          Continue as guest →
        </button>
      </motion.div>
    </div>
  );
}

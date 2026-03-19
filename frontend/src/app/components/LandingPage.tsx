import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Stethoscope, Activity, ArrowRight, Wand2, Shield, Globe, Zap, CheckCircle } from "lucide-react";
import { AuthModal } from "./AuthModal";

// Animated gradient background — ported from Astra AI
function BackgroundGradient() {
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = interactiveRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - el.offsetWidth / 2}px, ${e.clientY - el.offsetHeight / 2}px)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "rgb(5, 8, 25)" }}>
      <svg className="hidden">
        <defs>
          <filter id="blur-filter">
            <feGaussianBlur stdDeviation="40" colorInterpolationFilters="sRGB" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: "url(#blur-filter) blur(0px)", width: "100%", height: "100%" }}>
        {/* Static gradient blobs */}
        <div className="absolute" style={{
          width: "80%", height: "80%", top: "10%", left: "10%",
          background: "radial-gradient(circle at center, rgba(59,130,246,0.35) 0%, transparent 60%)",
          mixBlendMode: "hard-light", animation: "moveBlob1 8s ease infinite alternate"
        }} />
        <div className="absolute" style={{
          width: "70%", height: "70%", top: "20%", left: "20%",
          background: "radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 60%)",
          mixBlendMode: "hard-light", animation: "moveBlob2 10s ease infinite alternate"
        }} />
        <div className="absolute" style={{
          width: "60%", height: "60%", top: "30%", left: "5%",
          background: "radial-gradient(circle at center, rgba(34,211,238,0.2) 0%, transparent 60%)",
          mixBlendMode: "hard-light", animation: "moveBlob3 12s ease infinite alternate"
        }} />
        <div className="absolute" style={{
          width: "50%", height: "50%", top: "5%", left: "40%",
          background: "radial-gradient(circle at center, rgba(124,58,237,0.25) 0%, transparent 60%)",
          mixBlendMode: "hard-light", animation: "moveBlob4 9s ease infinite alternate"
        }} />
        {/* Interactive blob that follows cursor */}
        <div ref={interactiveRef} className="absolute" style={{
          width: "40%", height: "40%",
          background: "radial-gradient(circle at center, rgba(103,232,249,0.2) 0%, transparent 60%)",
          mixBlendMode: "hard-light", transition: "transform 0.1s ease-out",
          top: 0, left: 0
        }} />
      </div>
      <style>{`
        @keyframes moveBlob1 { 0%{transform:translate(0,0)} 100%{transform:translate(5%,8%)} }
        @keyframes moveBlob2 { 0%{transform:translate(0,0)} 100%{transform:translate(-8%,5%)} }
        @keyframes moveBlob3 { 0%{transform:translate(0,0)} 100%{transform:translate(10%,-5%)} }
        @keyframes moveBlob4 { 0%{transform:translate(0,0)} 100%{transform:translate(-5%,10%)} }
      `}</style>
    </div>
  );
}

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const sampleQueries = [
    "I have a fever and headache",
    "मुझे बुखार है",
    "How to reduce stomach pain?",
    "सिर दर्द का उपाय",
  ];

  const handleQuerySubmit = (query: string) => {
    if (query.trim()) {
      setInitialQuery(query);
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = (username: string) => {
    localStorage.setItem("healthbot_user", username);
    if (initialQuery) {
      localStorage.setItem("healthbot_initial_query", initialQuery);
    }
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <BackgroundGradient />

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <Stethoscope className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            HealthBot
          </span>
        </div>
        <button
          onClick={() => setShowAuth(true)}
          className="px-4 py-2 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-200 backdrop-blur-sm"
        >
          Sign in
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center max-w-4xl mx-auto w-full">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full mb-8 text-sm backdrop-blur-sm"
          >
            <Activity className="size-4" />
            <span>Available in English & Hindi · 24/7</span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Get instant{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300">
              health
            </span>{" "}
            advice,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300">
              anytime
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Chat with our AI health assistant to get quick guidance on common health concerns. Describe your symptoms and get instant, reliable advice.
          </motion.p>

          {/* Input Box — Astra AI style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-3xl mx-auto mb-8"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex gap-3">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleQuerySubmit(inputValue);
                      }
                    }}
                    placeholder="Describe your symptoms... e.g. I have a headache and fever"
                    rows={3}
                    className="flex-1 outline-none bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  />
                  {inputValue.trim() && (
                    <button
                      onClick={() => handleQuerySubmit(inputValue)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg self-end py-3"
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Stethoscope className="size-3.5" />
                    <span>AI Health Assistant</span>
                  </div>
                  <span className="text-xs text-gray-500">Press Enter to send</span>
                </div>
              </div>
            </div>

            {/* Sample queries */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {sampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(query)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-lg text-gray-400 hover:text-white transition-all text-sm backdrop-blur-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mt-16"
          >
            {[
              {
                icon: <Zap className="size-5 text-blue-400" />,
                bg: "bg-blue-500/20",
                border: "hover:border-blue-500",
                title: "Instant Responses",
                desc: "Get immediate health guidance powered by AI, available around the clock.",
                check: "text-blue-400",
              },
              {
                icon: <Globe className="size-5 text-purple-400" />,
                bg: "bg-purple-500/20",
                border: "hover:border-purple-500",
                title: "Bilingual Support",
                desc: "Communicate comfortably in English or Hindi — whichever feels natural.",
                check: "text-purple-400",
              },
              {
                icon: <Shield className="size-5 text-emerald-400" />,
                bg: "bg-emerald-500/20",
                border: "hover:border-emerald-500",
                title: "Private & Secure",
                desc: "Your health conversations are confidential and never shared.",
                check: "text-emerald-400",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`group bg-black/40 backdrop-blur-sm border border-white/10 ${card.border} rounded-xl p-6 text-left transition-all duration-300`}
              >
                <div className={`${card.bg} p-3 rounded-lg inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{card.desc}</p>
                <div className={`flex items-center gap-1.5 text-xs ${card.check}`}>
                  <CheckCircle className="size-3.5" />
                  <span>Always available</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/10 text-center text-sm text-gray-500 backdrop-blur-md bg-black/20">
        <p>HealthBot is an AI assistant. Always consult a healthcare professional for serious conditions.</p>
      </footer>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

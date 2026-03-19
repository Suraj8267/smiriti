import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Stethoscope, MessageCircle, Monitor } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [view, setView] = useState<"choose" | "auth">("choose");
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleWhatsApp = () => {
    window.open("https://wa.me/14155238886?text=Hi", "_blank");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      localStorage.setItem(`user_${formData.email}`, JSON.stringify({
        username: formData.username, email: formData.email, password: formData.password,
      }));
      onSuccess(formData.username);
    } else {
      const userData = localStorage.getItem(`user_${formData.email}`);
      if (userData) {
        const user = JSON.parse(userData);
        if (user.password === formData.password) { onSuccess(user.username); }
        else { alert("Invalid credentials!"); }
      } else { alert("User not found! Please sign up."); }
    }
  };

  const inputClass = "w-full bg-gray-900/60 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
        >
          {/* Glow border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-50 blur" />
          <div className="relative bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="size-4" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                <Stethoscope className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                HealthBot
              </span>
            </div>

            {view === "choose" ? (
              /* ── Choice Screen ── */
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">How do you want to chat?</h2>
                  <p className="text-sm text-gray-400">Choose your preferred platform</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setView("auth")}
                    className="w-full flex items-center gap-4 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/60 rounded-xl transition-all duration-200 text-left group"
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                      <Monitor className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Chat on Web</p>
                      <p className="text-xs text-gray-400 mt-0.5">Sign in or create an account to chat here</p>
                    </div>
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-4 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/60 rounded-xl transition-all duration-200 text-left group"
                  >
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Chat on WhatsApp</p>
                      <p className="text-xs text-gray-400 mt-0.5">Opens WhatsApp with AarogyaBot directly</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* ── Auth Form ── */
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => setView("choose")} className="text-gray-500 hover:text-white transition-colors text-sm">← Back</button>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {isSignUp ? "Create your account" : "Welcome back"}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {isSignUp ? "Sign up to start using HealthBot" : "Sign in to continue to HealthBot"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Your name"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={`${inputClass} pl-10`}
                        required
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-blue-500/20 mt-2"
                  >
                    {isSignUp ? "Create Account" : "Sign In"}
                  </button>
                </form>

                <div className="mt-5 text-center text-sm">
                  <span className="text-gray-500">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  </span>
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

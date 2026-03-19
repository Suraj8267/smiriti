import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Mic, Image as ImageIcon, LogOut, User,
  Stethoscope, Loader2, MicOff, X, Bot,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string;
}

// Reusable background — same as LandingPage
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
      <svg className="hidden"><defs><filter id="blur-filter2"><feGaussianBlur stdDeviation="40" colorInterpolationFilters="sRGB" /></filter></defs></svg>
      <div style={{ filter: "url(#blur-filter2) blur(0px)", width: "100%", height: "100%" }}>
        <div className="absolute" style={{ width: "80%", height: "80%", top: "10%", left: "10%", background: "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob1 8s ease infinite alternate" }} />
        <div className="absolute" style={{ width: "70%", height: "70%", top: "20%", left: "20%", background: "radial-gradient(circle at center, rgba(139,92,246,0.25) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob2 10s ease infinite alternate" }} />
        <div className="absolute" style={{ width: "50%", height: "50%", top: "5%", left: "40%", background: "radial-gradient(circle at center, rgba(124,58,237,0.2) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob4 9s ease infinite alternate" }} />
        <div ref={interactiveRef} className="absolute" style={{ width: "40%", height: "40%", background: "radial-gradient(circle at center, rgba(103,232,249,0.15) 0%, transparent 60%)", mixBlendMode: "hard-light", transition: "transform 0.1s ease-out", top: 0, left: 0 }} />
      </div>
      <style>{`
        @keyframes moveBlob1 { 0%{transform:translate(0,0)} 100%{transform:translate(5%,8%)} }
        @keyframes moveBlob2 { 0%{transform:translate(0,0)} 100%{transform:translate(-8%,5%)} }
        @keyframes moveBlob4 { 0%{transform:translate(0,0)} 100%{transform:translate(-5%,10%)} }
      `}</style>
    </div>
  );
}

export function ChatInterface() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const username = localStorage.getItem("healthbot_user");
    if (!username) { navigate("/"); return; }
    setUser(username);
    const initialQuery = localStorage.getItem("healthbot_initial_query");
    if (initialQuery) { setInputValue(initialQuery); localStorage.removeItem("healthbot_initial_query"); }
    const savedChats = localStorage.getItem(`healthbot_chats_${username}`);
    if (savedChats) {
      setMessages(JSON.parse(savedChats).map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
    }
  }, [navigate]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const saveChats = (msgs: Message[]) => {
    localStorage.setItem(`healthbot_chats_${user}`, JSON.stringify(msgs));
  };

  const sendMessageToBackend = async (message: string, image?: string | null): Promise<string> => {
    if (image) {
      const res = await fetch("http://localhost:5001/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, user }),
      });
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      return data.reply;
    }
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, user }),
    });
    if (!response.ok) throw new Error("Backend error");
    const data = await response.json();
    return data.reply;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;
    const userMessage: Message = {
      id: Date.now().toString(), role: "user",
      content: inputValue, timestamp: new Date(),
      image: selectedImage || undefined,
    };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInputValue("");
    setSelectedImage(null);
    setIsLoading(true);
    try {
      const response = await sendMessageToBackend(inputValue, selectedImage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(), role: "assistant",
        content: response, timestamp: new Date(),
      };
      const final = [...updated, assistantMessage];
      setMessages(final);
      saveChats(final);
    } catch {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in your browser.");
      return;
    }
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => { setIsRecording(true); toast.info("Listening..."); };
    recognition.onresult = (e: any) => { setInputValue(e.results[0][0].transcript); toast.success("Voice captured!"); };
    recognition.onerror = () => { toast.error("Voice recognition error"); setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setSelectedImage(reader.result as string); toast.success("Image attached"); };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => { localStorage.removeItem("healthbot_user"); navigate("/"); };

  const quickReplies = ["I have a high fever", "मुझे सिर दर्द है", "How to reduce cough?", "पेट में दर्द हो रहा है"];

  return (
    <div className="h-screen flex flex-col text-white">
      <BackgroundGradient />

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/30 px-4 py-3 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <Stethoscope className="size-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">HealthBot</h1>
            <p className="text-xs text-gray-400">AI Health Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <User className="size-3.5" />
            <span>{user}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-5 rounded-2xl inline-block mb-5 shadow-xl shadow-blue-500/30">
                <Stethoscope className="size-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
              <p className="text-gray-400 mb-8">Describe your symptoms and I'll provide guidance</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                {quickReplies.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(query)}
                    className="p-3 bg-black/40 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-xl text-left text-sm text-gray-300 hover:text-white transition-all backdrop-blur-sm"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full size-9 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                      <Bot className="size-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-black/40 backdrop-blur-sm border border-white/10 text-gray-100"
                  }`}>
                    {message.role === "assistant" && (
                      <div className="text-xs font-semibold text-purple-400 mb-1">Astra Health</div>
                    )}
                    {message.image && (
                      <img src={message.image} alt="Uploaded" className="rounded-lg mb-2 max-w-full" />
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1.5 ${message.role === "user" ? "text-blue-200" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white text-sm border border-white/10">
                        {user.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full size-9 flex items-center justify-center shrink-0">
                <Bot className="size-4 text-white" />
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="text-xs font-semibold text-purple-400 mr-1">Astra Health</div>
                <Loader2 className="size-4 animate-spin text-blue-400" />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 backdrop-blur-md bg-black/30 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img src={selectedImage} alt="Selected" className="h-16 rounded-lg border border-white/20" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-60 transition duration-300 blur" />
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                }}
                placeholder="Describe your symptoms..."
                rows={2}
                className="w-full outline-none bg-transparent text-white placeholder-gray-500 resize-none text-sm"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Attach image"
                  >
                    <ImageIcon className="size-4" />
                  </button>
                  <button
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-lg transition-all ${isRecording ? "bg-red-500/20 text-red-400" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
                    title="Voice input"
                  >
                    {isRecording ? <MicOff className="size-4 animate-pulse" /> : <Mic className="size-4" />}
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputValue.trim() && !selectedImage) || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 shadow-lg"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  <span>{isLoading ? "Sending..." : "Send"}</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center mt-2">
            HealthBot can make mistakes. Consult a doctor for serious conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

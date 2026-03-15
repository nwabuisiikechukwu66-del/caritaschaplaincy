"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING = `✝ Peace be with you! I'm **Ask a Padre** — your AI guide to Catholic faith, doctrine, and everything about our chaplaincy.

You can ask me about:
- Catholic doctrine, sacraments & the Bible
- Mass times, booking intentions & petitions
- Our societies, associations & chaplaincy events
- Saints, prayers, Church history & more

How may I assist you today?`;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I'm having trouble responding right now. Please try again or speak with Fr. Davison directly.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I seem to be offline at the moment. Please try again shortly. God bless you. ✝",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown-like renderer for bold
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const quickPrompts = [
    "When is Sunday Mass?",
    "How do I book a Mass intention?",
    "What is the Eucharist?",
    "Tell me about confession",
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ask a Padre AI"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-caritas-red text-white px-4 py-3 rounded-full shadow-xl hover:bg-caritas-maroon transition-all duration-300 group candle-glow"
      >
        <span className="font-cinzel text-caritas-gold text-base leading-none">✝</span>
        <span className="font-cinzel text-xs tracking-wider hidden sm:block">Ask a Padre</span>
        {open ? <X size={16} /> : <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-40 w-[340px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-caritas-gold/20 flex flex-col overflow-hidden"
          style={{ maxHeight: "72vh" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-caritas-dark to-caritas-maroon px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-caritas-gold/20 border border-caritas-gold/50 flex items-center justify-center flex-shrink-0">
              <span className="font-cinzel text-caritas-gold font-bold text-base">✝</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-cinzel text-white text-sm font-bold leading-tight">Ask a Padre</p>
              <p className="font-garamond text-caritas-cream text-xs">Caritas Chaplaincy AI Guide</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors ml-1">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-caritas-cream/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-caritas-red flex items-center justify-center flex-shrink-0 mb-0.5">
                    <span className="text-white text-xs font-cinzel">✝</span>
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-garamond whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-caritas-red text-white rounded-br-sm"
                      : "bg-white text-caritas-dark shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-caritas-red flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-cinzel">✝</span>
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-caritas-gold/60 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-caritas-gold/60 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-caritas-gold/60 typing-dot" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick prompts — only show on first message */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0 bg-white border-t border-gray-50">
              <p className="w-full font-cinzel text-xs text-gray-400 pt-2 tracking-wider">QUICK QUESTIONS</p>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); setTimeout(send, 50); }}
                  className="font-garamond text-xs text-caritas-red border border-caritas-red/30 px-3 py-1.5 rounded-full hover:bg-caritas-red hover:text-white transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-garamond focus:outline-none focus:border-caritas-red transition-colors bg-caritas-cream/30"
              placeholder="Ask about faith, doctrine, Mass times..."
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-caritas-red flex items-center justify-center hover:bg-caritas-maroon transition-colors disabled:opacity-40 flex-shrink-0"
            >
              {loading ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <Send size={15} className="text-white" />
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="bg-caritas-dark px-4 py-2 text-center flex-shrink-0">
            <p className="font-cinzel text-white/30 text-xs tracking-wider">
              CARITAS CHAPLAINCY · AMORJI-NIKE, ENUGU
            </p>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export function JarvisChat() {
  const sessionId = useId();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm JARVIS, your AI Chief of Staff. Ask me anything about your agency — client decisions, pricing, strategy, agent architecture, progress reviews. I'll read your current knowledge base and give you honest strategic advice. 💡",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/agents/jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Jarvis");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.assistantMessage, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Make sure the Drivn.AI OS folder is accessible and you have API credits.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-[700px] overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-[0_0_80px_-20px_rgba(139,92,246,0.2)]">
      <HudBrackets color="rgba(139,92,246,0.2)" size={8} />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6 pr-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed font-inter",
                  msg.role === "user"
                    ? "bg-gradient-to-r from-brand-purple to-violet-900 text-white font-semibold shadow-[0_0_20px_-8px_rgba(139,92,246,0.6)]"
                    : "bg-white/[0.05] border border-white/[0.08] text-white font-medium"
                )}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-brand-purple animate-spin" />
              <span className="text-sm text-white/60 font-inter">Jarvis thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative border-t border-white/[0.07] bg-gradient-to-t from-white/[0.02] to-transparent p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Jarvis... (Enter to send, Shift+Enter for newline)"
            className={cn(
              "flex-1 rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition",
              "border-white/[0.10] placeholder:text-white/30",
              "focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/30",
              "hover:border-white/[0.15]",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-sora text-sm font-semibold transition",
              "border border-brand-purple/25 bg-gradient-to-r from-brand-purple/20 to-violet-900/20",
              "text-brand-purple-light hover:border-brand-purple/50 hover:bg-brand-purple/30",
              "hover:shadow-[0_0_20px_-6px_rgba(139,92,246,0.6)]",
              "active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
}

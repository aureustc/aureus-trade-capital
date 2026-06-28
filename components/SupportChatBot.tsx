"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import {
  QUICK_TOPICS,
  getBotReply,
  getWelcomeMessage,
  type SupportTopic,
} from "@/lib/supportBot";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function parseMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split("\n").map((line, j) => (
      <span key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </span>
    ));
  });
}

export function SupportChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: getWelcomeMessage() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const reply = useCallback(async (text: string, topic?: SupportTopic) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const answer = getBotReply(trimmed, topic);
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: "assistant", text: answer },
    ]);
    setTyping(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!typing) reply(input);
  }

  function handleQuickTopic(prompt: string, topic: SupportTopic) {
    if (typing) return;
    reply(prompt, topic);
  }

  return (
    <div className="support-chat pro-card-accent flex h-full min-h-[420px] flex-col overflow-hidden lg:min-h-[520px]">
      <div className="relative border-b border-[var(--card-border)] bg-[linear-gradient(135deg,var(--accent-soft-md)_0%,transparent_55%)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="pro-card-icon-ring flex h-11 w-11 shrink-0 items-center justify-center">
            <Bot className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                ATC Support Assistant
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft-md)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-deep)]">
                <Sparkles className="h-3 w-3" />
                AI
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Bot setup · licenses · payments · MT5 help
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--accent-deep)]">
            <span
              className="h-2 w-2 rounded-full bg-[var(--accent)]"
              style={{ animation: "pulse-live 2s ease-in-out infinite" }}
            />
            Online
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  msg.role === "user"
                    ? "support-bubble-user max-w-[88%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm"
                    : "support-bubble-bot max-w-[92%] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-[var(--text-secondary)]"
                }
              >
                {parseMarkdownLite(msg.text)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="support-bubble-bot flex gap-1 rounded-2xl rounded-bl-md px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-[var(--accent)]"
                    style={{
                      animation: `typing-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[var(--card-border)] bg-[var(--bg-primary)]/80 px-4 py-3 sm:px-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={typing}
              onClick={() => handleQuickTopic(t.prompt, t.id)}
              className="support-chip rounded-full px-3 py-1.5 text-[11px] font-semibold transition disabled:opacity-50"
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about installation, license, or payment…"
            disabled={typing}
            className="min-w-0 flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={typing || !input.trim()}
            className="btn-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiHelpCircle, FiMessageCircle, FiMessageSquare, FiPackage, FiRotateCcw, FiTruck, FiX } from "react-icons/fi";
import { LuRuler, LuShirt } from "react-icons/lu";
import type { IconType } from "react-icons";

const CHAT_API_URL: string =
  import.meta.env.VITE_CHAT_API_URL ?? "http://localhost:3001";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  ts: string;
}

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

interface QuickAction {
  label: string;
  message: string;
  Icon: IconType;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Return Policy", message: "What is your return policy?", Icon: FiRotateCcw },
  { label: "Size Guide", message: "Help me choose my size.", Icon: LuRuler },
  { label: "Track My Order", message: "Where is my order?", Icon: FiPackage },
  { label: "Fabric & Care", message: "How do I care for my clothing?", Icon: LuShirt },
  { label: "Shipping Info", message: "What are your shipping options?", Icon: FiTruck },
  { label: "General Help", message: "I need some help.", Icon: FiHelpCircle },
];

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.18 }}
    className="flex justify-start"
  >
    <div className="flex items-center rounded-[18px] bg-chat-bubble px-5 py-4">
      <span className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-[5px] w-[5px] rounded-full bg-chat-muted"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
    </div>
  </motion.div>
);

const EmptyState = ({ onSelect }: { onSelect: (value: string) => void }) => (
  <div className="flex h-full flex-col items-center justify-center px-8 py-8 text-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="grid h-[84px] w-[84px] place-items-center rounded-full bg-chat-secondary"
    >
      <FiMessageCircle className="h-[26px] w-[26px] text-chat-ink" strokeWidth={1.2} />
    </motion.div>

    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-8 font-display text-[22px] font-medium leading-tight tracking-[0.02em] text-chat-ink"
    >
      How can I help you today?
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="mt-3 max-w-[300px] font-display text-[15px] leading-[1.7] text-chat-muted"
    >
      Ask about our collections, sizing, fabrics, styling, or your order.
    </motion.p>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="mt-7 w-full max-w-[330px]"
    >
      <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#8E847A]">
        Popular Topics
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5">
        {QUICK_ACTIONS.map(({ label, message, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(message)}
            className="flex h-14 items-center gap-3 rounded-[16px] border border-chat-border bg-white px-4 text-left font-display text-[15px] font-medium text-chat-ink transition-colors duration-200 hover:bg-[#FAF7F2]"
          >
            <Icon
              className="h-[18px] w-[18px] shrink-0 text-chat-muted"
              strokeWidth={1.5}
            />
            <span className="leading-[1.3]">{label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  </div>
);

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  // Lock body scroll while the mobile full-screen panel is open.
  useEffect(() => {
    if (!open) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, isTyping]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 280);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const send = async (value?: string) => {
    const text = (value ?? input).trim();
    if (!text || isTyping) return;

    const history = messages.map((msg) => ({
      role: msg.role,
      content: msg.text,
    }));

    setMessages((prev) => [
      ...prev,
      { id: ++idRef.current, role: "user", text, ts: nowTime() },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${CHAT_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);

      const data = (await response.json()) as { reply?: string };
      const reply =
        data.reply?.trim() ||
        "I couldn't find an answer just now — could you try rephrasing?";

      setMessages((prev) => [
        ...prev,
        { id: ++idRef.current, role: "assistant", text: reply, ts: nowTime() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: ++idRef.current,
          role: "assistant",
          text: "I'm sorry — I couldn't reach my styling assistant just now. Please make sure the assistant server and Ollama are running, then try again in a moment.",
          ts: nowTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-launcher"
            type="button"
            aria-label="Open AI Assistant"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.6, ease: "easeOut" }, duration: 0.2, ease: "easeInOut" }}
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="fixed bottom-6 right-6 z-[115] grid h-11 w-11 cursor-pointer select-none place-items-center rounded-full bg-[#FAF8F5] text-[#3A342F] transition-colors duration-200 ease-in-out hover:bg-[#F2EEE8] active:bg-[#ECE6DF]"
          >
            <FiMessageSquare className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="chat-backdrop"
              className="fixed inset-0 z-[110] hidden bg-[rgba(31,27,24,0.12)] md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="chat-panel"
              role="dialog"
              aria-label="CoGenesis AI assistant"
              initial={{ x: "100%", opacity: 0.4 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 z-[120] flex flex-col overflow-hidden bg-chat-panel pt-[env(safe-area-inset-top)] md:inset-y-0 md:left-auto md:right-0 md:w-[400px] md:border-l md:border-chat-border"
            >
              {/* Header */}
              <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-chat-hairline px-6">
                <span className="font-display text-[15px] font-medium uppercase tracking-[0.22em] text-chat-ink">
                  AI Assistant
                </span>

                <button
                  type="button"
                  aria-label="Close assistant"
                  onClick={() => setOpen(false)}
                  className="grid h-[46px] w-[46px] cursor-pointer place-items-center rounded-full bg-chat-soft text-chat-ink transition-colors duration-200 hover:bg-[#E3D8CB]"
                >
                  <FiX className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </header>

              {/* Conversation */}
              <div
                ref={listRef}
                className="chat-scroll flex-1 overflow-y-auto overscroll-contain"
              >
                {messages.length === 0 && !isTyping ? (
                  <EmptyState onSelect={send} />
                ) : (
                  <div className="flex flex-col gap-6 px-6 pb-6 pt-8">
                    {messages.map((msg) => {
                      const isUser = msg.role === "user";
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.18 }}
                          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex max-w-[80%] flex-col ${
                              isUser ? "items-end" : "items-start"
                            } ${isUser ? "md:max-w-[72%]" : ""}`}
                          >
                            <div
                              className={`whitespace-pre-line font-display text-[17px] font-normal leading-[1.8] text-chat-ink ${
                                isUser
                                  ? "rounded-[18px] border border-chat-user-border bg-white px-[18px] py-[14px]"
                                  : "rounded-[18px] bg-chat-bubble px-5 py-4"
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="mt-4 text-[12px] tracking-[0.08em] text-chat-taupe">
                              {msg.ts}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                    {isTyping && <TypingIndicator />}
                  </div>
                )}
              </div>

              {/* Input + footer */}
              <div className="shrink-0 px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
                <div className="flex h-[54px] items-center rounded-[18px] border border-chat-border bg-white pl-[18px] pr-[10px]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about our collections, sizing, or orders…"
                    aria-label="Type your question"
                    className="min-w-0 flex-1 bg-transparent font-display text-[16px] text-chat-ink outline-none placeholder:font-sans placeholder:text-[14px] placeholder:text-chat-placeholder"
                  />
                  <button
                    type="button"
                    aria-label="Send message"
                    onClick={() => send()}
                    disabled={!input.trim() || isTyping}
                    className="ml-2 grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-full bg-chat-send text-chat-ink transition-colors duration-200 hover:bg-[#CBBFAE] disabled:cursor-default disabled:opacity-40"
                  >
                    <FiArrowRight className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </button>
                </div>

                <p className="mt-3 text-center font-sans text-[12px] tracking-[0.02em] text-chat-note">
                  AI responses may be inaccurate. Please double-check important
                  information.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

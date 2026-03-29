import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = [
  "How do I subscribe?",
  "What's included?",
  "PayPal payment help",
  "Pricing plans",
];

function getBotResponse(input: string): string {
  const msg = input.toLowerCase();

  if (
    msg.includes("subscri") ||
    msg.includes("get started") ||
    msg.includes("sign up") ||
    msg.includes("join")
  ) {
    return "Great! Here's how: 1) Visit our Pricing page and choose a plan. 2) Click 'Pay via PayPal' and complete payment to jeffbasham41@gmail.com. 3) Return here and fill in the registration form with your PayPal transaction ID. 4) Your account is activated instantly!";
  }

  if (
    msg.includes("pric") ||
    msg.includes("plan") ||
    msg.includes("cost") ||
    msg.includes("tier") ||
    msg.includes("how much")
  ) {
    return "We offer 3 plans: Basic ($49/mo), Professional ($149/mo), and Enterprise ($299/mo). All plans include full access to Sales CRM, Logistics, HR, Finance, and Business Intelligence. Visit /pricing to see full details and subscribe.";
  }

  if (
    msg.includes("paypal") ||
    msg.includes("payment") ||
    msg.includes("pay") ||
    msg.includes("transaction")
  ) {
    return "To pay: send your subscription payment to jeffbasham41@gmail.com via PayPal. Then come back to our Pricing page, fill in your name, email, plan, and PayPal transaction ID to activate your account instantly.";
  }

  if (
    msg.includes("feature") ||
    msg.includes("includ") ||
    msg.includes("what do i get") ||
    msg.includes("module") ||
    msg.includes("tool")
  ) {
    return "Agenda Automation Station includes: Sales CRM, Services Scheduling, Logistics & Shipment Tracking, Financial Accounting, HR & Employee Management, Inventory Management, Business Intelligence dashboards, and Workflow Automation — all in one platform.";
  }

  if (
    msg.includes("access") ||
    msg.includes("login") ||
    msg.includes("log in") ||
    msg.includes("account") ||
    msg.includes("dashboard")
  ) {
    return "After you subscribe and submit your PayPal transaction ID on our Pricing page, your account is activated instantly. Log in using Internet Identity (Google, Apple, or passkey).";
  }

  if (
    msg.includes("support") ||
    msg.includes("help") ||
    msg.includes("contact") ||
    msg.includes("question")
  ) {
    return "For additional support, use this chat or visit our Pricing page to get started. We're here 24/7!";
  }

  return "Thanks for your message! For subscription help, visit our Pricing page. For urgent questions, our team monitors all inquiries and will respond promptly.";
}

let messageIdCounter = 0;

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: ++messageIdCounter,
      role: "bot",
      text: "Hi! I'm the Agenda Automation Station assistant. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop =
        scrollViewportRef.current.scrollHeight;
    }
  }, []);

  // Scroll to bottom after each render when open
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  });

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: ++messageIdCounter,
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setShowQuickReplies(false);

    const timer = setTimeout(() => {
      const botMsg: Message = {
        id: ++messageIdCounter,
        role: "bot",
        text: getBotResponse(text),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);

    return () => clearTimeout(timer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Callback ref to capture the scroll viewport inside ScrollArea
  const scrollAreaCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const viewport = node.querySelector(
          "[data-radix-scroll-area-viewport]",
        ) as HTMLDivElement | null;
        scrollViewportRef.current = viewport;
        scrollToBottom();
      }
    },
    [scrollToBottom],
  );

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          data-ocid="chat.dialog"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[500px] bg-white rounded-2xl overflow-hidden shadow-xl border border-border flex flex-col"
          aria-label="Customer support chat"
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <Bot className="w-4 h-4 text-navy" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">
                  Agenda Assistant
                </p>
                <p className="text-white/60 text-xs">Online • 24/7 support</p>
              </div>
            </div>
            <button
              type="button"
              data-ocid="chat.close_button"
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaCallbackRef} className="flex-1 min-h-0">
            <div className="p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-gold" aria-hidden="true" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-navy text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Quick reply buttons (shown on first open) */}
              {showQuickReplies && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => sendMessage(reply)}
                      className="text-xs px-3 py-1.5 rounded-full border border-navy/30 text-navy hover:bg-navy hover:text-white transition-colors font-medium"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-3 shrink-0 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                ref={inputRef}
                data-ocid="chat.input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 h-9 text-sm border-gray-200 focus-visible:ring-gold/50 rounded-xl"
                aria-label="Chat message"
                autoComplete="off"
              />
              <Button
                type="submit"
                data-ocid="chat.submit_button"
                disabled={!inputValue.trim()}
                className="bg-navy hover:bg-navy/90 text-white h-9 w-9 p-0 rounded-xl shrink-0 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bubble Button */}
      <button
        type="button"
        data-ocid="chat.open_modal_button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-navy shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        aria-label={isOpen ? "Close chat" : "Open customer support chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" aria-hidden="true" />
        ) : (
          <Bot className="w-6 h-6 text-gold" aria-hidden="true" />
        )}
      </button>
    </>
  );
}

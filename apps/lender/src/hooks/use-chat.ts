"use client";

import { useEffect, useRef, useState } from "react";
import type { AssistantMessage, ChatMessage } from "@/types/types";

export type ChatStatus = "idle" | "thinking";

const STATUS_LABELS = ["Thinking...", "Checking latest updates"];

/**
 * Stand-in for the agent API. Replace `respond` with a call to the real
 * endpoint — the shape it returns is the contract the chat renders.
 */
function respond(prompt: string): AssistantMessage {
  const id = `a-${Date.now()}`;

  if (/strong match|opportunit/i.test(prompt)) {
    return {
      id,
      role: "assistant",
      blocks: [
        {
          type: "text",
          text: "I found 4 funding opportunities that match your current mandate. I’ve highlighted the strongest match based on your mandate fit",
        },
        {
          type: "opportunities",
          title: "Top matched opportunities",
          items: [
            {
              id: "titan",
              name: "Titan Suppliers",
              kind: "Supplier",
              initials: "TI",
              amount: "₦8.5M",
              expires: "Oct 2, 2026",
              match: 92,
              href: "/matched",
            },
            {
              id: "northline",
              name: "Northline Stores",
              kind: "Distributor",
              initials: "NL",
              amount: "₦6.2M",
              expires: "Oct 18, 2026",
              match: 86,
              href: "/matched",
            },
            {
              id: "averra",
              name: "Averra Limited",
              kind: "Supplier",
              initials: "AV",
              amount: "₦4.8M",
              expires: "Oct 5, 2026",
              match: 65,
              href: "/matched",
            },
          ],
          action: { label: "View all opportunities", href: "/matched" },
        },
        {
          type: "text",
          text: "Your strongest match is Titan Suppliers at 92% fit. would you like to review that opportunity?",
        },
      ],
      suggestions: ["Review opportunity"],
    };
  }

  return {
    id,
    role: "assistant",
    blocks: [
      {
        type: "text",
        text: "I've found 4 funding opportunities that match your funding mandate and need your attention.",
      },
      {
        type: "priority-list",
        title: "Priority list",
        items: [
          {
            id: "funding",
            label: "Funding opportunity",
            href: "/matched",
            count: 4,
          },
        ],
      },
      {
        type: "text",
        text: "Would you like me to show you the funding opportunities with the strongest match?",
      },
    ],
    suggestions: ["Show me opportunities with a strong match"],
  };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [statusLabel, setStatusLabel] = useState(STATUS_LABELS[0]!);
  const [title, setTitle] = useState("New conversation");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  function send(text: string) {
    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: "user", text },
    ]);
    setTitle((current) =>
      current === "New conversation" ? "Update request" : current,
    );
    setStatus("thinking");
    setStatusLabel(STATUS_LABELS[0]!);

    timers.current.push(
      setTimeout(() => setStatusLabel(STATUS_LABELS[1]!), 900),
      setTimeout(() => {
        setMessages((current) => [...current, respond(text)]);
        setStatus("idle");
      }, 2000),
    );
  }

  function reset() {
    clearTimers();
    setMessages([]);
    setStatus("idle");
    setTitle("New conversation");
  }

  return { messages, status, statusLabel, title, send, reset };
}

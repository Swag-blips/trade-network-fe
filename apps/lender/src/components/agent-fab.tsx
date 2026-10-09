"use client";

import { useState } from "react";
import { TaiAgent } from "@repo/ui/tai-agent";
import { ChatPanel } from "@/components/chat/chat-panel";

export function AgentFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? <ChatPanel onClose={() => setOpen(false)} /> : null}
      <button
        id="agent-fab"
        type="button"
        aria-label={open ? "Close Tai" : "Ask Tai"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`fixed right-xl bottom-xl z-30 size-14 rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2 motion-reduce:transition-none ${
          open ? "hidden" : ""
        }`}
      >
        <TaiAgent />
      </button>
    </>
  );
}

import { TaiAgent } from "./tai-agent";

export function AgentFab() {
  return (
    <button
      id="agent-fab"
      type="button"
      aria-label="Ask Tai"
      className="fixed right-xl bottom-xl size-14 rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2 motion-reduce:transition-none"
    >
      <TaiAgent />
    </button>
  );
}

import { Topbar } from "../components/topbar";
import { InboxView } from "./components/inbox-view";
import { ASSISTANT, CONVERSATIONS } from "./data";

export default function InboxPage() {
  return (
    <>
      <Topbar title="Inbox" />
      <InboxView assistant={ASSISTANT} conversations={CONVERSATIONS} />
    </>
  );
}

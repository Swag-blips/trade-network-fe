import { SettingsPage } from "../../components/settings-page";
import { SessionRow } from "./components/session-row";
import { getLoginSessions } from "./data";

export const dynamic = "force-dynamic";

export default function LoginActivityPage() {
  const sessions = getLoginSessions();

  return (
    <SettingsPage
      title="Login activity"
      description="Track login activity on your account."
    >
      <div className="flex flex-col gap-md">
        <p className="text-body-sm/[normal] text-grey-600">
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
        </p>
        <ul className="flex flex-col divide-y divide-grey-100 overflow-hidden rounded-2xl border border-grey-100 shadow-card">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </ul>
      </div>
    </SettingsPage>
  );
}

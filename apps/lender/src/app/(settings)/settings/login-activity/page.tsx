import { SettingsPage } from "../../components/settings-page";
import { SessionList } from "./components/session-list";

export default function LoginActivityPage() {
  return (
    <SettingsPage
      title="Login activity"
      description="Track login activity on your account."
    >
      <SessionList />
    </SettingsPage>
  );
}

import { SettingsPage } from "../../components/settings-page";
import { TeamTabs } from "./components/team-tabs";

export default function TeamsPage() {
  return (
    <SettingsPage
      title="Teams & permissions"
      description="Manage your team members, roles, and access permissions."
    >
      <TeamTabs />
    </SettingsPage>
  );
}

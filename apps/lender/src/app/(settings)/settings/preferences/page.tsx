import { SettingsPage, SectionHeading } from "../../components/settings-page";
import { AutoNegotiationSettings } from "./components/auto-negotiation-settings";
import { NotificationSettings } from "./components/notification-settings";

export default function PreferencesPage() {
  return (
    <SettingsPage title="Preferences">
      <div className="flex max-w-126.5 flex-col gap-lg">
        <SectionHeading
          title="Notification preference"
          description="Set your notification preference."
        />

        <NotificationSettings />

        <hr className="border-grey-200" />

        <SectionHeading
          title="Auto-negotiation settings"
          description="Set how much control Tai has when negotiating for you."
        />

        <AutoNegotiationSettings />
      </div>
    </SettingsPage>
  );
}

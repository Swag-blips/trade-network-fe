import { SettingsPage } from "../../components/settings-page";
import { AccountDeletion } from "./components/account-deletion";
import { EmailSection } from "./components/email-section";

export default function AccountSecurityPage() {
  return (
    <SettingsPage
      title="Account security"
      description="Edit your account profile details."
    >
      <div className="flex w-162.5 max-w-full flex-col overflow-hidden rounded-xl border border-grey-200 bg-white">
        <EmailSection />
        <AccountDeletion />
      </div>
    </SettingsPage>
  );
}

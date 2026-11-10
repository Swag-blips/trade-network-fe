import { SettingsPage } from "../../components/settings-page";
import { DeleteAccountButton } from "./components/delete-account-button";
import { EmailSection } from "./components/email-section";

export default function AccountSecurityPage() {
  return (
    <SettingsPage
      title="Account security"
      description="Edit your account profile details."
    >
      <div className="flex w-162.5 max-w-full flex-col overflow-hidden rounded-xl border border-grey-200 bg-white">
        <EmailSection />

        <section className="border-t border-grey-100">
          <div className="p-md">
            <div className="flex min-h-17 flex-col gap-1">
              <h2 className="font-sans text-body/[1.5] font-medium text-grey-900">
                Delete your account
              </h2>
              <p className="text-body-sm/[1.5] text-grey-600">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end border-t border-grey-200 bg-grey-50 px-md py-2.5">
            <DeleteAccountButton />
          </div>
        </section>
      </div>
    </SettingsPage>
  );
}

import { SettingsPage } from "../../components/settings-page";
import { ProfileForm } from "./components/profile-form";

export default function ProfilePage() {
  return (
    <SettingsPage
      title="Personal details"
      description="Edit your account profile details."
    >
      <ProfileForm />
    </SettingsPage>
  );
}

import { SettingsPage } from "../../components/settings-page";
import { CompanyForm } from "./components/company-form";

export default function CompanyPage() {
  return (
    <SettingsPage
      title="Company details"
      description="Edit your account profile details."
    >
      <CompanyForm />
    </SettingsPage>
  );
}

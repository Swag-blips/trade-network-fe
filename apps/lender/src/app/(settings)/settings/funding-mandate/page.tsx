import { SettingsPage } from "../../components/settings-page";
import { MandateLoader } from "./components/mandate-loader";

export default function FundingMandatePage() {
  return (
    <SettingsPage
      title="Funding preference"
      description="Set your financing preferences to receive opportunities that match your investment criteria."
      gap="xl"
    >
      <MandateLoader />
    </SettingsPage>
  );
}

import { FundingMandateForm } from "./components/funding-mandate-form";

export default async function FundingMandatePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; org?: string }>;
}) {
  const { role, org } = await searchParams;

  return (
    <FundingMandateForm
      role={role ?? "capital-provider"}
      orgName={org ?? "Mycompany"}
    />
  );
}

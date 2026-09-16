import { OrganisationForm } from "./components/organisation-form";

export default async function OrganisationPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;

  return <OrganisationForm role={role ?? "capital-provider"} />;
}

import { WelcomeMessage } from "./components/welcome-message";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; role?: string }>;
}) {
  const { name, role } = await searchParams;

  return (
    <WelcomeMessage name={name ?? "there"} role={role ?? "capital-provider"} />
  );
}

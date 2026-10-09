import { VerifyEmailForm } from "./components/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; redirectTo?: string }>;
}) {
  const { email, redirectTo } = await searchParams;

  return (
    <VerifyEmailForm email={email ?? "your email"} redirectTo={redirectTo} />
  );
}

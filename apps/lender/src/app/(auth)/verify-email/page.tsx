import { VerifyEmailForm } from "./components/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    firstName?: string;
    redirectTo?: string;
  }>;
}) {
  const { email, firstName, redirectTo } = await searchParams;

  return (
    <VerifyEmailForm
      email={email ?? "your email"}
      firstName={firstName ?? ""}
      redirectTo={redirectTo}
    />
  );
}

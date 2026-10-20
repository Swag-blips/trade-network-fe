import { VerifyEmailForm } from "./components/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; redirectTo?: string; flow?: string }>;
}) {
  const { email, redirectTo, flow } = await searchParams;

  return (
    <VerifyEmailForm
      email={email ?? "your email"}
      redirectTo={redirectTo}
      flow={flow === "login" ? "login" : "signup"}
    />
  );
}

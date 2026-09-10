import { UserAvatar } from "@/components/avatars";

function Glow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[220px] overflow-hidden"
    >
      <div className="absolute -top-[120px] left-[-29px] size-[218px] rounded-full bg-evergreen-400 opacity-[0.06] blur-[60px]" />
      <div className="absolute -top-[70px] left-[131px] size-[218px] rounded-full bg-linen-400 opacity-[0.06] blur-[60px]" />
    </div>
  );
}

export function WelcomeBanner({ firstName }: { firstName: string }) {
  return (
    <div className="relative">
      <Glow />
      <div className="relative flex items-center gap-md px-lg pt-lg">
        <UserAvatar name={firstName} size={64} />
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="font-brand text-[1.5rem]/[1.5] font-medium text-grey-900">
            Welcome, {firstName}.
          </p>
          <p className="text-body-sm text-grey-600">
            Here&rsquo;s what&rsquo;s happening across your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

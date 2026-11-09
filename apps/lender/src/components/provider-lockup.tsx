import { Wordmark } from "@repo/ui/wordmark";

export function ProviderLockup() {
  return (
    <div className="flex h-9.25 flex-col gap-0.5 pt-0.5">
      <Wordmark className="h-4 w-37.25 flex-none text-evergreen-900" />
      <p className="pl-9.5 font-brand text-body-sm whitespace-nowrap text-grey-600">
        For Capital Providers
      </p>
    </div>
  );
}

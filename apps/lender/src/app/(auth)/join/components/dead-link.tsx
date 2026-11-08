import { Unlink02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { ButtonLink } from "@repo/ui/button-link";
import { JoinCard } from "./join-card";

export function DeadLink({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <JoinCard
      icon={Unlink02Icon}
      title={onRetry ? "Something went wrong" : "This link can't be used"}
    >
      <p className="text-body/[1.5] text-grey-600">{message}</p>
      <div className="flex w-full flex-col gap-sm">
        {onRetry ? (
          <Button size="auth" onClick={onRetry} className="w-full">
            Try again
          </Button>
        ) : null}
        <ButtonLink
          href="/login"
          variant={onRetry ? "tertiary" : "primary"}
          size="auth"
          className="w-full"
        >
          Go to login
        </ButtonLink>
      </div>
    </JoinCard>
  );
}

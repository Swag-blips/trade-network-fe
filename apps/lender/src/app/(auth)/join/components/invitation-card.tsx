import { Avatar, initials } from "@repo/ui/avatar";
import { BrandMark } from "@repo/ui/brand-mark";
import { Button } from "@repo/ui/button";
import { TextPlaceholder } from "@/components/text-placeholder";
import type { InvitationPreview } from "../types";

function orgInitials(name: string) {
  const letters = initials(name);
  return letters.length > 1 ? letters : name.trim().slice(0, 2).toUpperCase();
}

export function InvitationCard({
  preview,
  sending = false,
  onJoin,
}: {
  preview?: InvitationPreview;
  sending?: boolean;
  onJoin?: () => void;
}) {
  return (
    // The gradient's end stop sits just off the evergreen ramp, kept verbatim from Figma.
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-linear-to-b from-evergreen-900 to-[#064845] px-md">
      <div
        aria-hidden
        className="absolute -inset-x-[6.4%] -inset-y-[15.9%] bg-[url(/brand/arcs-pattern.svg)] bg-cover bg-center"
      />
      <div className="relative flex w-full max-w-147.25 flex-col items-start gap-lg overflow-hidden rounded-xl border border-grey-100 bg-white px-lg pt-lg pb-xl shadow-soft-section">
        <BrandMark className="h-10 w-[52.682px] text-evergreen-900" />
        <div className="flex w-full flex-col gap-md">
          <h1 className="font-sans text-body/[1.5] font-normal text-grey-800">
            {!preview ? (
              <TextPlaceholder className="w-80" />
            ) : preview.invitedByName ? (
              <>
                You have been invited by{" "}
                <span className="font-medium">{preview.invitedByName}</span> to
                join an organisation on TradeNetwork.
              </>
            ) : (
              "You have been invited to join an organisation on TradeNetwork."
            )}
          </h1>
          <div className="flex w-full items-center gap-3.25 overflow-hidden rounded-lg border border-grey-100 bg-white p-sm shadow-soft-section">
            <Avatar
              name={preview?.organizationName ?? ""}
              size={56}
              shape="square"
              className="border border-grey-200 bg-grey-50 text-grey-600"
              fallback={
                <span
                  aria-hidden
                  className="font-sans text-h4/[normal] font-medium"
                >
                  {preview ? orgInitials(preview.organizationName) : null}
                </span>
              }
            />
            <div className="flex min-w-0 flex-1 flex-col gap-xxs">
              <p className="truncate text-body/[1.15] font-medium text-grey-900">
                {preview ? (
                  preview.organizationName
                ) : (
                  <TextPlaceholder className="w-24" />
                )}
              </p>
              <p className="text-body-sm/[normal] text-grey-600">
                {preview ? (
                  `As ${preview.roleName}`
                ) : (
                  <TextPlaceholder className="w-16" />
                )}
              </p>
            </div>
            <Button
              size="auth"
              loading={sending}
              disabled={!preview || sending}
              onClick={onJoin}
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

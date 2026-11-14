"use client";

import { useState } from "react";
import { onlineManager } from "@tanstack/react-query";
import { Button } from "@repo/ui/button";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, readProblemType, readStatus } from "@/api/client";
import { FormDialog } from "@/components/form-dialog";
import { useMe } from "@/hooks/use-me";
import { useMembers } from "@/hooks/use-members";
import { daysUntil, localeDate } from "@/utils/date";
import type { User } from "@/types/user";
import {
  useCancelDeletion,
  useScheduleDeletion,
} from "../hooks/use-account-deletion";
import { useStepUp } from "../hooks/use-step-up";
import { DeleteAccountModal } from "./delete-account-modal";
import { VerifyEmailModal } from "./verify-email-modal";

const SECTION_FOOTER =
  "flex justify-end border-t border-grey-200 bg-grey-50 px-md py-2.5";

export function AccountDeletion() {
  const { data: me } = useMe();

  if (me?.deleteAfter)
    return <ScheduledDeletion deleteAfter={me.deleteAfter} />;
  return <DeleteAccount me={me} />;
}

function DeleteAccount({ me }: { me?: User }) {
  const { toast } = useToast();
  const { members, isPending: membersPending } = useMembers();
  const [confirming, setConfirming] = useState(false);
  const [deleteAfter, setDeleteAfter] = useState<string>();
  const { mutate: schedule, isPending: scheduling } = useScheduleDeletion();

  const joined = members.filter((member) => !member.invitation);
  const role = joined.find((member) => member.userId === me?.id)?.role;
  const otherMembers = role === "Owner" && joined.length > 1;

  const stepUp = useStepUp({
    busy: scheduling,
    onVerified: (stepUpChallengeId) =>
      schedule(
        { stepUpChallengeId },
        {
          onSuccess: (result) => {
            // Every session ended with this response; anything sent from here
            // on would hit the refresh flow and race the navigation to /login.
            onlineManager.setOnline(false);
            stepUp.close();
            setDeleteAfter(result.deleteAfter);
          },
          onError: (error) => {
            const type = readProblemType(error);
            if (type === "challenge-expired" || type === "validation-failed") {
              stepUp.restart();
              return;
            }
            stepUp.close();
            toast({
              state: "error",
              message: extractErrorMessage(
                error,
                readStatus(error) === 409
                  ? "Your account can't be deleted yet."
                  : "We couldn't delete your account.",
              ),
            });
          },
        },
      ),
  });

  return (
    <section className="border-t border-grey-100">
      <div className="p-md">
        <div className="flex min-h-17 flex-col gap-1">
          <h2 className="font-sans text-body/[1.5] font-medium text-grey-900">
            Delete your account
          </h2>
          <p className="text-body-sm/[1.5] text-grey-600">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          {otherMembers ? (
            <p className="text-body-sm/[1.5] text-red-error-500">
              Remove the other members of your organization before deleting your
              account.
            </p>
          ) : null}
        </div>
      </div>
      <div className={SECTION_FOOTER}>
        <Button
          variant="destructive-outline"
          size="auth"
          disabled={!me || membersPending || otherMembers}
          onClick={() => setConfirming(true)}
        >
          Delete account
        </Button>
      </div>

      {confirming ? (
        <DeleteAccountModal
          soleOwner={role === "Owner"}
          onClose={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            stepUp.begin();
          }}
        />
      ) : null}

      {stepUp.active && me ? (
        <VerifyEmailModal
          email={me.email}
          address="account"
          {...stepUp.modal}
          onClose={stepUp.close}
        />
      ) : null}

      {deleteAfter ? <DeletionScheduled deleteAfter={deleteAfter} /> : null}
    </section>
  );
}

function DeletionScheduled({ deleteAfter }: { deleteAfter: string }) {
  const toLogin = () => window.location.assign("/login");

  return (
    <FormDialog
      title="Account deletion scheduled"
      className="w-113.25"
      dismissible={false}
      onClose={toLogin}
      onSubmit={toLogin}
      footer={
        <Button type="submit" size="form" autoFocus>
          Go to login
        </Button>
      }
    >
      <p className="text-body/[1.5] text-grey-600">
        Your account will be deleted on{" "}
        <span className="font-medium text-grey-800">
          {localeDate(deleteAfter)}
        </span>
        . We&rsquo;ve logged you out everywhere. Log in before then to cancel.
      </p>
    </FormDialog>
  );
}

function ScheduledDeletion({ deleteAfter }: { deleteAfter: string }) {
  const { toast } = useToast();
  const { mutate: cancel, isPending } = useCancelDeletion();
  const days = daysUntil(deleteAfter);

  return (
    <section className="border-t border-grey-100">
      <div className="p-md">
        <div className="flex min-h-17 flex-col gap-1">
          <h2 className="font-sans text-body/[1.5] font-medium text-grey-900">
            Deletion request submitted
          </h2>
          <p className="text-body-sm/[1.5] text-grey-600">
            Your account will be deleted in {days} {days === 1 ? "day" : "days"}{" "}
            ({localeDate(deleteAfter, "short")}) and will be permanent from that
            date. Until then you can cancel the deletion
          </p>
        </div>
      </div>
      <div className={SECTION_FOOTER}>
        <Button
          size="auth"
          loading={isPending}
          onClick={() => {
            if (isPending) return;
            cancel(undefined, {
              onSuccess: () =>
                toast({
                  state: "success",
                  message: "Your account will no longer be deleted",
                }),
              onError: (error) =>
                toast({
                  state: "error",
                  message: extractErrorMessage(
                    error,
                    "We couldn't cancel the deletion.",
                  ),
                }),
            });
          }}
        >
          Cancel request
        </Button>
      </div>
    </section>
  );
}

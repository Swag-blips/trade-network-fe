"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Notice } from "@/components/notice";
import { useRevokeInvitation } from "../hooks/use-invitation-actions";
import type { Invitation, MemberStatus } from "@/types/team";
import { StatusLabel, StatusMenu } from "./status-menu";

export function InvitationStatus({
  invitation,
  status,
  editable,
}: {
  invitation: Invitation;
  status: MemberStatus;
  editable: boolean;
}) {
  const [removing, setRemoving] = useState(false);
  const { mutate: revoke, isPending } = useRevokeInvitation();

  if (!editable) return <StatusLabel status={status} />;

  return (
    <>
      <StatusMenu
        status={status}
        divided
        actions={[
          { label: "Remove", danger: true, onSelect: () => setRemoving(true) },
        ]}
      />
      {removing ? (
        <ConfirmDialog
          title="Remove invitation?"
          confirmLabel="Remove"
          confirmVariant="destructive"
          loading={isPending}
          onConfirm={() =>
            revoke(invitation, { onSettled: () => setRemoving(false) })
          }
          onClose={() => setRemoving(false)}
          notice={
            <Notice>
              Their invitation link will stop working. You can invite them again
              at any time.
            </Notice>
          }
        >
          Are you sure you want to remove the invitation to{" "}
          <span className="font-medium text-grey-800">{invitation.email}</span>?
        </ConfirmDialog>
      ) : null}
    </>
  );
}

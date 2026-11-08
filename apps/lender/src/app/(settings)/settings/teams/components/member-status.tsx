"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Notice } from "@/components/notice";
import { useSetMemberStatus } from "../hooks/use-set-member-status";
import type { Member } from "@/types/team";
import { StatusLabel, StatusMenu } from "./status-menu";

export function MemberStatus({
  member,
  editable,
}: {
  member: Member;
  editable: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const { mutate: setStatus, isPending } = useSetMemberStatus();

  if (
    !editable ||
    (member.status !== "Active" && member.status !== "Deactivated")
  ) {
    return <StatusLabel status={member.status} />;
  }

  const deactivating = member.status === "Active";

  return (
    <>
      <StatusMenu
        status={member.status}
        actions={[
          {
            label: deactivating ? "Deactivate" : "Activate",
            danger: deactivating,
            onSelect: () => setConfirming(true),
          },
        ]}
      />
      {confirming ? (
        <ConfirmDialog
          title={
            deactivating ? "Deactivate team member?" : "Activate team member?"
          }
          confirmLabel={deactivating ? "Disable" : "Activate"}
          confirmVariant={deactivating ? "destructive" : "primary"}
          loading={isPending}
          onConfirm={() =>
            setStatus(
              { member, status: deactivating ? "Deactivated" : "Active" },
              { onSettled: () => setConfirming(false) },
            )
          }
          onClose={() => setConfirming(false)}
          notice={
            deactivating ? (
              <Notice>
                This user will immediately lose access to your business account
                and won&apos;t be able to perform any actions on TradeNetwork.
              </Notice>
            ) : (
              <Notice tone="success">
                This user will regain access to the system with their current
                permissions.
              </Notice>
            )
          }
        >
          Are you sure you want to {deactivating ? "deactivate" : "activate"}{" "}
          <span className="font-medium text-grey-800">
            {member.name || member.email}
          </span>
          ?
        </ConfirmDialog>
      ) : null}
    </>
  );
}

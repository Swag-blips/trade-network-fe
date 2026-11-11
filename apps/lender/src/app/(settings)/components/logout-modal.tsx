"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { useLogout } from "@/hooks/use-logout";

export function LogoutModal({ onClose }: { onClose: () => void }) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <ConfirmDialog
      title="Log out of TradeNetwork?"
      confirmLabel="Logout"
      confirmVariant="destructive"
      loading={isPending}
      onConfirm={() => logout()}
      onClose={onClose}
    >
      Are you sure you want to log out? You&rsquo;ll need to sign in again to
      access your account.
    </ConfirmDialog>
  );
}

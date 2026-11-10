"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { DeleteAccountModal } from "./delete-account-modal";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive-outline"
        size="auth"
        onClick={() => setOpen(true)}
      >
        Delete account
      </Button>
      {open ? (
        <DeleteAccountModal
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

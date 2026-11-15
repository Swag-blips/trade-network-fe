import { useState } from "react";
import { useToast } from "@repo/ui/toast";
import { readFieldErrors } from "@/api/client";

/**
 * Puts a 422's messages under the fields named in `fields`, matched by pointer
 * path or its parent (`sectors` takes `sectors/0`). Anything the form doesn't
 * show still toasts. Mutation hooks skip their own toast for a 422 with fields.
 */
export function useFieldErrors<Name extends string>(fields: readonly Name[]) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Partial<Record<Name, string>>>({});


  function show(error: unknown) {
    const found = readFieldErrors(error);
    if (!found) return;

    const next: Partial<Record<Name, string>> = {};
    let unshown: string | undefined;

    for (const { path, detail } of found) {
      const field = fields.find(
        (name) => path === name || path.startsWith(`${name}/`),
      );
      if (field) next[field] ??= detail;
      else unshown ??= detail;
    }

    setErrors(next);
    if (unshown) toast({ state: "error", message: unshown });
  }

  function clear(field: Name) {
    if (!errors[field]) return;
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return { errors, show, clear, reset: () => setErrors({}) };
}

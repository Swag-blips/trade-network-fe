import { mutation, query } from "@/api/client";
import type { Mandate } from "@/types/mandate";

export const mandateService = {
  get() {
    return query<Mandate>("/mandate");
  },

  update(mandate: Mandate) {
    return mutation<Mandate>("/mandate", "put", mandate);
  },
};

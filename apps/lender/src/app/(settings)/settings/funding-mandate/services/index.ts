import { mutation, query } from "@/api/client";
import type { Mandate } from "../types";

export const mandateService = {
  get() {
    return query<Mandate>("/mandate", { service: "lender" });
  },

  update(mandate: Mandate) {
    return mutation<Mandate>("/mandate", "put", mandate, { service: "lender" });
  },
};

import { mutation, query } from "@/api/client";
import type { OpportunityPage, OpportunityQuery } from "../types/opportunity";

export const opportunityService = {
  list(params: OpportunityQuery) {
    return query<OpportunityPage>("/opportunities", { ...params });
  },

  notInterested(opportunityUid: string) {
    // The endpoint 415s without a JSON body, but an empty one is accepted.
    return mutation<unknown>(
      `/opportunity-actions/${opportunityUid}/not-interested`,
      "post",
      {},
    );
  },
};

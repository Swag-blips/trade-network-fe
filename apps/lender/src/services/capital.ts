import { query } from "@/api/client";
import { fromMinorUnits } from "@/utils/naira";
import type { Capital, CapitalResponse } from "@/types/capital";

export const capitalService = {
  async get(): Promise<Capital> {
    const capital = await query<CapitalResponse>("/capital");
    return {
      allocation: fromMinorUnits(capital.allocationMinor),
      available: fromMinorUnits(capital.availableMinor),
      deployed: fromMinorUnits(capital.deployedMinor),
      outstanding: fromMinorUnits(capital.outstandingMinor),
    };
  },
};

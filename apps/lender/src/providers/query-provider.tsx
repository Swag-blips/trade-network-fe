"use client";

import { useState, type ReactNode } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { readProblemType } from "@/api/client";
import { ME_KEY } from "@/hooks/use-me";

const deletionScheduled = (error: unknown) =>
  readProblemType(error) === "account-deletion-scheduled";

function createQueryClient() {
  // An organisation route refusing because deletion is scheduled means `me`
  // is stale; refetching it lets `DeletionGate` move the user out.
  const onError = (error: unknown) => {
    if (deletionScheduled(error)) {
      void client.invalidateQueries({ queryKey: ME_KEY });
    }
  };

  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        retry: (failures, error) => !deletionScheduled(error) && failures < 3,
      },
    },
  });
  return client;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

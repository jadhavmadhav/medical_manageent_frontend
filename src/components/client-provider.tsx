"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            // refetchOnReconnect: false,
            // retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes
            // cacheTime: 1000 * 60 * 10, // 10 minutes (removed as it's not a valid property)
            // notifyOnChangePropsExclusions: ["isFetching", "isLoading"],
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

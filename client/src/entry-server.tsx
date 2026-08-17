import { renderToString } from "react-dom/server";
import { dehydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Router } from "wouter";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import App from "./App";
import { prefetchForPath, type HeadMeta } from "./ssr/prefetch";

export type RenderResult = {
  html: string;
  dehydratedState: unknown;
  head: HeadMeta;
};

export async function render(url: string): Promise<RenderResult> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  const questionMark = url.indexOf("?");
  const ssrPath = questionMark === -1 ? url : url.slice(0, questionMark);
  const ssrSearch = questionMark === -1 ? "" : url.slice(questionMark + 1);
  const head = await prefetchForPath(url, queryClient);
  const trpcClient = trpc.createClient({
    links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
  });
  const html = renderToString(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={ssrPath} ssrSearch={ssrSearch}>
          <App />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );

  return { html, dehydratedState: dehydrate(queryClient), head };
}

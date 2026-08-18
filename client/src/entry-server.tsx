import { renderToString } from "react-dom/server";
import App from "./App";
import { prefetchForPath, type HeadMeta } from "./ssr/prefetch";

export type RenderResult = {
  html: string;
  dehydratedState: unknown;
  head: HeadMeta;
};

export async function render(url: string): Promise<RenderResult> {
  const head = await prefetchForPath(url);
  const html = renderToString(<App />);

  return { html, dehydratedState: undefined, head };
}

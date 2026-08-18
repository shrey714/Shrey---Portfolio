import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
import { prefetchForPath, type HeadMeta } from "./ssr/prefetch";

export type RenderResult = {
  html: string;
  dehydratedState: unknown;
  head: HeadMeta;
};

export async function render(url: string): Promise<RenderResult> {
  const questionMark = url.indexOf("?");
  const ssrPath = questionMark === -1 ? url : url.slice(0, questionMark);
  const ssrSearch = questionMark === -1 ? "" : url.slice(questionMark + 1);
  const head = await prefetchForPath(url);
  const html = renderToString(
    <Router ssrPath={ssrPath} ssrSearch={ssrSearch}>
      <App />
    </Router>
  );

  return { html, dehydratedState: undefined, head };
}

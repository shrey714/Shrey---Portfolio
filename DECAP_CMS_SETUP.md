# Private Content Editor and Vercel Setup

This project uses Decap CMS with the GitHub backend. The public portfolio is server-rendered by the Express application; the editor is a separate noindex route at `/admin`. Decap saves create commits in the portfolio repository, and the GitHub-to-Vercel integration publishes the rebuilt HTML.

## Required production configuration

| Setting | Production value | Purpose |
|---|---|---|
| `CANONICAL_ORIGIN` | `https://shrey-patel-profile.vercel.app` | Canonical URL, Open Graph URLs, structured-data URL, and OAuth callback origin. |
| `SITE_NAME` | `Shrey Patel` | Open Graph site name. |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Starts the Decap GitHub login flow. |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | Server-only authorization-code exchange; never expose it in client code. |

These values have been added as protected project configuration for local review. Add the same four values to the Vercel project’s **Environment Variables** before its first production deployment. Use the **Production** environment and, if preview deployments need the editor, add matching preview-domain redirect URLs and environment values deliberately.

## GitHub OAuth App

The OAuth App must be registered with the following production values.

| GitHub OAuth field | Required value |
|---|---|
| Homepage URL | `https://shrey-patel-profile.vercel.app` |
| Authorization callback / redirect URI | `https://shrey-patel-profile.vercel.app/api/decap/callback` |
| Wildcard redirect matching | Disabled |
| Device Flow | Disabled |
| Expiring user tokens | Disabled |

The callback must match exactly. It is not `/admin` and it is not `/api/decap/auth`. The `/auth` endpoint starts the GitHub authorization flow; `/callback` securely exchanges the one-time GitHub code on the server and returns a token only to the editor popup window.

## Deployment behavior

The build validates `content/portfolio.json`, builds the browser bundle, builds the React server-renderer, and creates the Express application bundle. Vercel routes requests to the Express application and includes the compiled public and server-renderer assets in the function. The `scripts/verify-ssr.sh` command checks that the initial response has one title, one canonical URL, one Open Graph title, structured data, hydrated state, and a rendered work-section marker.

The public route is indexable. `/admin` is protected from indexing with a robots meta tag, `X-Robots-Tag` response header, and `robots.txt` exclusion. After GitHub returns a token, the server checks the authenticated GitHub login and accepts the editor session only for `shrey714`, the configured repository owner. Repository permissions alone are not sufficient for editor access.

## Local testing

The portfolio and editor shell can be reviewed locally with `pnpm dev`, `pnpm verify:ssr`, and `http://localhost:3000/admin`. The live GitHub authorization redirect should be tested only after the reviewed code has been deployed to the registered production origin. If local OAuth testing becomes necessary, add `http://localhost:3000/api/decap/callback` as an additional GitHub OAuth redirect URI temporarily and remove it when finished.

## Current limitation

The sandbox could not complete a live outbound request to GitHub’s OAuth validation endpoint because the remote connection was reset or timed out before an authorization response. This did not return a GitHub credential-rejection response. The real end-to-end login should therefore be checked at the production `/admin` route after the Vercel deployment is connected; the editor shell, configuration, noindex controls, server-side OAuth route structure, and secret non-exposure checks have been verified locally.

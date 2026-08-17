# Secure Telegram Contact Form

The portfolio contact form lives in the existing project and uses a public server procedure to send each accepted enquiry to the configured Telegram bot. It does **not** store visitor names, email addresses, or message content in the database.

## Delivery flow

1. The visitor enters a name, email address, and message.
2. The browser applies required, email, and length checks before submission.
3. The server repeats strict validation, silently discards honeypot submissions, and applies a 90-second cooldown per hashed network key.
4. Accepted submissions are formatted as plain Telegram HTML and sent privately to the configured destination chat.
5. The visitor sees a success message or a retry-safe error with a direct-email fallback.

## Protection controls

| Control | Purpose |
| --- | --- |
| Server-only Telegram secrets | Keeps the bot token and chat ID outside browser code and GitHub. |
| Hashed network-key cooldown | Limits one submission per network key every 90 seconds without persisting raw IP addresses. |
| Honeypot field | Silently absorbs many basic automated submissions. |
| Input limits and sanitization | Rejects malformed or oversized input and escapes Telegram HTML. |
| No message database storage | Keeps enquiry content in Telegram rather than duplicating it in the website database. |
| Redis TTL expiration | Automatically removes each opaque cooldown key after 90 seconds; no cleanup job is required. |

## Operational notes

The relevant user-facing form labels and messages live in `client/src/content/portfolioContent.ts` under `contact.form`. The server delivery and safety logic lives in `server/contact.ts`. Telegram credentials are managed as protected project secrets and must never be copied into source files.

If you ever rotate the Telegram bot token or change the destination chat, update the matching protected secret and re-run the credential and destination tests before relying on the form.

## Rate-limit storage and expiration

The contact form stores one SHA-256 hash in Upstash Redis for each recent submitting network key. It does not store the visitor’s raw IP address, name, email address, or message. Redis automatically expires the key after the 90-second cooldown, so the application needs neither a SQL database nor a maintenance query for this feature.

For Vercel production, connect the Upstash Redis integration to the project and keep `KV_REST_API_URL` and `KV_REST_API_TOKEN` available to the Production environment. The full-access token is server-only and must never be copied into browser code or GitHub.

## Verification record

The public Contact section has been checked in the running portfolio. It exposes labelled name, email, and message fields; a concealed honeypot field; a visible submit action; a live status region; a privacy note; and an email fallback.

The visible form was also populated with valid browser-side input and submitted in the running preview. Its submit control correctly changed to the pending state while the server processed the submission.

The upstream-failure path is covered by an automated test that simulates a Telegram timeout. The server converts that condition into the existing retry-safe visitor error rather than waiting indefinitely.

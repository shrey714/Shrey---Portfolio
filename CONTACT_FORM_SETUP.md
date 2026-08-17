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
| Daily rate-limit cleanup | Deletes only hashed cooldown records that expired more than 24 hours earlier. |

## Operational notes

The relevant user-facing form labels and messages live in `client/src/content/portfolioContent.ts` under `contact.form`. The server delivery and safety logic lives in `server/contact.ts`. Telegram credentials are managed as protected project secrets and must never be copied into source files.

If you ever rotate the Telegram bot token or change the destination chat, update the matching protected secret and re-run the credential and destination tests before relying on the form.

## Rate-limit retention and scheduled cleanup

The `contact_rate_limits` table stores one SHA-256 hash and a cooldown timestamp for each recent submitting network key. It does not store the visitor’s raw IP address, name, email address, or message. Records are retained for 24 hours after their 90-second cooldown expires, then removed by the cleanup query. An index on `nextAllowedAt` keeps the scheduled lookup targeted to expired rows.

For the planned Vercel deployment, `vercel.json` schedules `GET /api/contact-rate-limit-cleanup` every day at **03:00 UTC**. The route runs independently of page loads and contact submissions, so it does not add work to a visitor’s request. It accepts only an `Authorization: Bearer <CRON_SECRET>` request. Before the first Vercel production deployment, set a strong `CRON_SECRET` environment variable in the Vercel project; Vercel sends that same value automatically when it invokes the configured cron route. The route fails closed with `401` if the secret is absent or incorrect.

After each authorized cleanup run, the same configured Telegram bot sends a private maintenance notification with the number of expired cooldown records removed and the UTC retention cutoff. It reports the result even when the count is zero, so you can confirm the job ran. The notification contains no raw IP address, hashed network key, name, email address, or contact message. If Telegram is temporarily unavailable, the completed cleanup remains successful and the route returns normally to avoid an automatic retry deleting the same records twice.

If the cleanup itself fails, the bot sends a separate private alert that identifies only the failed maintenance stage and UTC timestamp. It deliberately excludes the underlying error text, database connection data, credentials, and visitor information. The route still returns a retryable failure response so the scheduler can retry the cleanup automatically; if the alert cannot be delivered, the retry behavior remains unchanged.

## Verification record

The public Contact section has been checked in the running portfolio. It exposes labelled name, email, and message fields; a concealed honeypot field; a visible submit action; a live status region; a privacy note; and an email fallback.

The visible form was also populated with valid browser-side input and submitted in the running preview. Its submit control correctly changed to the pending state while the server processed the submission.

The upstream-failure path is covered by an automated test that simulates a Telegram timeout. The server converts that condition into the existing retry-safe visitor error rather than waiting indefinitely.

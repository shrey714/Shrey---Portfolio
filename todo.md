# Dark Mode Update

- [x] Inspect the current theme provider, global tokens, and header controls.
- [x] Add a persistent, keyboard-accessible light/dark toggle for desktop and mobile navigation.
- [x] Define a complementary charcoal-and-cobalt dark theme that retains the portfolio’s editorial hierarchy.
- [x] Validate light and dark modes across desktop and mobile, including reduced-motion and contrast considerations.
- [x] Create a final checkpoint and provide the updated project version.

# Portfolio Refinement

- [x] Remove the custom logo mark from all portfolio surfaces and metadata.
- [x] Add an animated mobile navigation overlay with background dimming, scroll lock, and outside-click dismissal.
- [x] Reduce unnecessary runtime dependencies and optimize the production bundle.
- [x] Validate responsive interaction, build output, and final perceived load cost.
- [x] Save and deliver the refined project checkpoint.

# Engineering Philosophy Layout Correction

- [x] Replace the oversized dark block with discrete, proportionate philosophy entries.
- [x] Tune mobile padding, surface treatment, and divider rhythm for stronger reading flow.
- [x] Verify the correction in light and dark modes at desktop and mobile widths.
- [x] Save and deliver the updated project checkpoint.

# Philosophy Divider and Hover Correction

- [x] Remove stacked borders so each philosophy entry has exactly one separator.
- [x] Replace the dark boxed hover surface with a restrained text-and-accent response.
- [x] Verify the corrected list at mobile width in dark mode.
- [x] Save and deliver the targeted correction checkpoint.

# Mobile Header and Navigation Refinement

- [x] Hide the mobile header identity while the hero identity lockup is visible, then reveal it after scrolling.
- [x] Remove the redundant Shrey Patel text from the mobile navigation panel.
- [x] Add a coordinated closing transition for the navigation backdrop, panel, and links.
- [x] Validate the refined mobile header and menu at relevant scroll positions.
- [x] Save and deliver the interaction refinement checkpoint.

# Contact Label Contrast Correction

- [x] Apply a dedicated light contact-label color that is readable on the cobalt surface.
- [x] Verify the label remains correct in light and dark themes.
- [x] Save and deliver the contrast correction checkpoint.

# Hero Visual Carousel

- [x] Convert the hero visual index into four distinct editorial slides with truthful captions.
- [x] Add accessible previous/next controls, slide indicators, and keyboard navigation without autoplay.
- [x] Preserve initial-load performance by loading the first hero visual eagerly and remaining visuals lazily.
- [x] Validate the carousel at desktop and mobile widths.
- [x] Save and deliver the completed carousel checkpoint.

# Hero Carousel Readability and Autoplay

- [x] Move slide-specific visual metadata away from the global carousel caption and controls.
- [x] Add a gentle automatic slide cadence that pauses during hover and focus.
- [x] Animate captions in sync with each slide change while respecting reduced-motion preferences.
- [x] Verify readable overlays at desktop and mobile widths.
- [x] Save and deliver the refined carousel checkpoint.

# Dark Carousel Surface and Timing

- [x] Apply a coherent dark theme to the carousel frame, footer, captions, indicators, and controls.
- [x] Ensure each CSS-built visual state has readable dark-mode metadata and annotation treatment.
- [x] Reduce the automatic slide interval while preserving hover, focus, and reduced-motion behavior.
- [x] Validate dark carousel contrast and responsive composition.
- [x] Save and deliver the dark-carousel refinement checkpoint.

# Centralized Portfolio Content

- [x] Move editable identity, hero, navigation, project, experience, philosophy, contact, and carousel content into one configuration file.
- [x] Refactor the page to consume the configuration without visual or interaction regressions.
- [x] Add simple editing instructions alongside the configuration file.
- [x] Validate the configuration-driven page and production build.
- [x] Save and deliver the centralized-content checkpoint.

# Resume Download Action

- [x] Add a resume label, PDF URL, and filename to the centralized portfolio configuration.
- [x] Add the Download Resume action to the hero section with safe download attributes.
- [x] Validate the action markup and production build.
- [x] Save and deliver the resume-action checkpoint.

# GitHub First-Phase Release

- [x] Inspect the local repository and linked remote state.
- [x] Commit the completed first-phase portfolio code with a release message.
- [x] Push the committed code to shrey714/Shrey---Portfolio.
- [x] Confirm the remote repository contains the new commit.

# Temporary Artifact Cleanup

- [x] Inspect temporary folders and disposable verification files.
- [x] Remove temporary browser profiles and generated verification captures.
- [x] Confirm the project build and repository status remain clean.
- [x] Save and push the cleanup update to GitHub.

# Secure Telegram Contact Form

- [x] Document the contact-form architecture, delivery flow, and abuse-protection controls.
- [x] Upgrade the portfolio project with a secure same-repository backend capability.
- [x] Add strict client and server validation, honeypot spam detection, and IP-based rate limiting.
- [x] Add a secure Telegram delivery route with secrets kept outside source control.
- [x] Build an accessible contact form with pending, success, and retry-safe error states.
- [x] Verify rate limiting, validation, and the unavailable-secret fallback before adding Telegram credentials.
- [x] Save and push the secure contact-form update to GitHub.

# Contact Delivery Latency Optimization

- [x] Measure the contact route’s rate-limit, database, and Telegram-delivery timings.
- [x] Identify the primary latency source and optimize the response path without weakening delivery guarantees.
- [x] Verify the improved interaction time, Telegram notification delivery, and fallback behavior.
- [x] Save and push the contact-delivery latency refinement to GitHub.

# Systems Evidence Alignment Correction

- [x] Move the Practice visual callout into a non-overlapping position within the component.
- [x] Align the System Note and Signal / Decision / Response labels on a shared footer row.
- [x] Verify the corrected component in dark mode and responsive widths.
- [x] Save and deliver the alignment correction checkpoint.

# Scheduled Rate-Limit Record Cleanup

- [x] Authorize scheduled cleanup requests with the deployment platform’s CRON_SECRET so only the configured daily job can invoke deletion.
- [x] Add an idempotent database helper that deletes only expired contact rate-limit records after a 24-hour retention period.
- [x] Add an authenticated daily scheduled endpoint that invokes the cleanup independently of page loads and contact submissions.
- [x] Add unit coverage for the cleanup boundary and scheduled-handler authorization behavior.
- [x] Validate the production build and save the cleanup implementation checkpoint.
- [x] Document the user-owned Vercel CRON_SECRET activation step; the route fails closed until the secret is configured after deployment.

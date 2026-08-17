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

# Scheduled Cleanup Telegram Notification

- [x] Add a server-only Telegram formatter and sender for completed rate-limit cleanup results.
- [x] Send the deleted-row count only after a successful authorized cleanup run, without delaying public page or contact-form traffic.
- [x] Add unit coverage for the cleanup notification content and failure behavior.
- [x] Verify the scheduled handler returns success with `notificationSent: false` when Telegram fails after cleanup succeeds.
- [x] Validate the updated build and document the new notification flow.
- [x] Save and deliver the cleanup-notification checkpoint.

# Scheduled Cleanup Failure Alert

- [x] Add a sanitized Telegram alert for cleanup failures that includes only a safe stage label and timestamp.
- [x] Preserve the cleanup route’s retryable error response even when the failure alert cannot be delivered.
- [x] Add unit coverage for failure-alert formatting, delivery fallback, and retryable scheduled-handler response.
- [x] Validate the production build and update the maintenance documentation.
- [x] Save and deliver the cleanup-failure-alert checkpoint.

# GitHub Maintenance Sync

- [x] Inspect the local branch and linked GitHub branch for unpushed portfolio maintenance updates.
- [x] Commit and push any remaining validated maintenance, notification, documentation, and task-tracker changes.
- [x] Verify GitHub `main` matches the latest pushed commit and report the commit identifier.

# Micro Case-Study Paths and Motion

- [x] Add editable three-step micro walkthrough content to both case-study projects in the central portfolio configuration.
- [x] Build keyboard-accessible walkthrough controls with clear active-step and progress states for each project.
- [x] Add a restrained IntersectionObserver-based evidence-frame entrance treatment that respects reduced-motion preferences and dark mode.
- [x] Add targeted configuration coverage, validate desktop and mobile layouts, and confirm the production build.
- [x] Add true scroll-progress evidence-frame motion while preserving reduced-motion and dark-mode behavior.
- [x] Add frontend interaction coverage for active-step updates, tab semantics, progress state, and motion fallback.
- [x] Save a local review checkpoint only; do not push these changes to GitHub until the user explicitly approves.

# Micro Case-Study Walkthrough Removal

- [x] Remove the three-step walkthrough panels, controls, and project configuration content from the Selected Work section.
- [x] Remove the walkthrough-only client tests and browser-test dependencies, retaining only the evidence-motion coverage.
- [x] Restore the original concise Selected Work composition while keeping the requested evidence-frame motion.
- [x] Validate desktop and mobile layouts, tests, TypeScript, and production build.
- [x] Save a local-only review checkpoint without pushing to GitHub.

# Compact Appearance Icon Control

- [x] Replace the large light/dark switch with a compact current-mode icon button across desktop and mobile placements.
- [x] Add a purposeful sun-to-moon icon transition that respects reduced-motion preferences and retains accessible labels and focus states.
- [x] Verify icon control behavior, contrast, responsive placement, tests, TypeScript, and production build.
- [x] Save a local-only review checkpoint without pushing to GitHub.

# Approved Compact Appearance Icon Push

- [x] Inspect the latest local and remote GitHub branch state before publication.
- [x] Commit the approved compact appearance-icon change and the associated local portfolio refinements.
- [x] Push the approved commit to GitHub `main` and verify the remote commit identifier.

# Portfolio Interaction Ideas Research

- [x] Research distinctive, real portfolio interaction patterns from public design and portfolio sources.
- [x] Evaluate candidate ideas for fit with the current quiet editorial visual system, accessibility, and performance.
- [x] Present a practical shortlist for user review without modifying or pushing website code.

# System X-Ray, Debug Mode, and Field Notes

- [x] Add editable X-Ray lenses and Field Notes content to the centralized portfolio configuration.
- [x] Build the System X-Ray interaction for both selected-work evidence frames with keyboard access and reduced-motion fallback.
- [x] Build an optional Design Debug Mode that exposes editorial grid, typography, and color-system layers without altering normal reading.
- [x] Add a compact Field Notes section that presents manually editable evolving observations without a live-status backend.
- [x] Add focused unit coverage and validate responsive accessibility and production build.
- [x] Save a local-only review checkpoint without pushing to GitHub.

# Removal of System X-Ray, Debug Mode, and Field Notes

- [x] Remove the System X-Ray components, project content, controls, styles, and tests.
- [x] Remove the Design Debug Mode component, triggers, labels, styles, and inspection-layer behavior.
- [x] Remove the Field Notes section, centralized content, styles, and editing-guide references.
- [x] Validate the restored portfolio at desktop and mobile widths, and run tests, TypeScript, and a production build.
- [x] Save a local-only checkpoint without pushing to GitHub.

# Local-to-GitHub Source Parity Check

- [x] Compare the restored local portfolio source with GitHub `main` without committing or pushing.
- [x] Restore the two harmless source-parity differences so non-metadata portfolio source matches GitHub `main` exactly.

# Dynamic Content and SEO Options Analysis

- [x] Research free ways to edit portfolio content dynamically while preserving crawler-visible SEO.
- [x] Compare the options for editing experience, deployment workflow, security, performance, and maintenance.
- [x] Present a recommendation before implementing or changing any website code.
- [x] Prepare the dynamic-content and SEO options summary with a recommended path for user approval.

# Git-Backed Content Editor and SEO Rendering

- [x] Audit the existing Vite/Express route graph, content configuration, metadata, and browser-only rendering dependencies.
- [x] Create a Git-backed content schema and private editor workflow suitable for editable portfolio copy.
- [x] Convert the public portfolio route to server-rendered HTML with correct canonical, Open Graph, Twitter, JSON-LD, sitemap, and robots output.
- [x] Add secure owner-only editing, content validation, and draft-to-GitHub publishing without exposing repository credentials in the browser.
- [x] Test public crawl output and private editor behavior; document Vercel configuration and rollback; save a local-only review checkpoint without pushing to GitHub.

- [x] Make static assets and public configuration files Vercel-compatible without relying on Express static serving inside the server function.
- [x] Enforce an explicit GitHub owner boundary before an authenticated Decap editor session is accepted.
- [ ] Verify the live GitHub login and save-to-commit flow against the registered Vercel deployment before treating publication as production-ready.

- [x] Commit the approved Git-backed editor and SSR implementation to GitHub `main`.
- [x] Verify the pushed commit is present on the linked GitHub repository without deploying it on the user's behalf.

- [x] Make the root Vercel entrypoint import and initialize Express directly so framework detection accepts the deployment.
- [ ] Validate and push the targeted Vercel entrypoint correction, then ask the user to redeploy.

- [x] Diagnose the Vercel serverless function crash from runtime evidence and prepare a targeted correction.
- [ ] Confirm the corrected Vercel deployment responds successfully before continuing CMS workflow validation.

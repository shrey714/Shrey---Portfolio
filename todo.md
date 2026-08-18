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

- [x] Collect the Vercel function runtime stack trace for the persistent post-deploy crash and use it to verify the final correction.

- [ ] Deploy the explicit `.js` extension import graph correction and confirm the Vercel function initializes without module-resolution errors.

- [x] Convert the Vercel `includeFiles` declaration to the supported single-string glob form and validate the deployment configuration.

- [x] Diagnose why the deployed Vercel page cannot load generated CSS and JavaScript assets and prepare a focused correction.
- [ ] Confirm the redeployed portfolio returns its CSS and JavaScript assets successfully before continuing editor verification.

- [x] Fix the deployed `/admin` route so it resolves the compiled Decap editor shell in Vercel-mode production.

- [x] Route `/api/trpc/*` contact submissions into the Vercel Express application rather than a static 404 response.
- [x] Replace the Manus-only hero image path with a directly reachable CDN asset and verify image delivery.

- [x] Define explicit Vercel route mappings so `/api/*` and `/admin` reach the correct server function instead of Vercel’s static 404 handler.
- [ ] Verify the deployed contact endpoint returns tRPC JSON and the deployed `/admin` endpoint returns the Decap editor shell.

- [x] During active Vercel troubleshooting, automatically push each validated corrective commit to GitHub `main` and report its commit ID without asking separately.

- [x] Restore a Vercel-detectable root Express entrypoint while preserving the explicit unified `/api/index.ts` route configuration.

- [ ] Configure a Vercel-reachable `DATABASE_URL` so contact-rate-limit storage is available in production.
- [x] Diagnose the live `/admin` 404 and return the Decap editor shell directly from the function without a bundled file dependency.

- [ ] Provision a Vercel-reachable MySQL-compatible or TiDB-compatible database and add its connection string as `DATABASE_URL`.
- [ ] Apply the existing contact rate-limit schema migration to the new database before re-testing live contact delivery.

- [x] Replace contact rate-limit persistence with secure atomic Upstash Redis TTL operations using the Vercel-provided `KV_REST_API_URL` and `KV_REST_API_TOKEN` variables.
- [x] Remove the database-schema dependency from public contact delivery while retaining existing validation, honeypot, cooldown, Telegram delivery, and safe failure behavior.

- [x] Remove the obsolete Vercel daily rate-limit cleanup cron and its Telegram cleanup-success and failure notification paths because Redis TTL expires cooldown keys automatically.

- [x] Remove orphaned cleanup API files and confirm no deleted cleanup modules remain referenced by the Vercel build.

- [x] Serve a Decap-compatible `/config.yml` fallback from the Vercel function so the editor can continue after GitHub OAuth authorization.

- [x] Remove duplicate manual Decap initialization so the editor loads the portfolio collection only once from `/config.yml`.

- [x] Remove unused Decap media-folder configuration to stop optional missing-media lookups.
- [x] Route Decap GitHub API save requests through a constrained same-origin proxy so browser CORS does not block content commits.
- [ ] Verify the deployed editor receives a valid configuration and transitions from GitHub login to the editable portfolio form.

- [x] Restore Decap’s required valid media configuration without enabling unused media uploads or noisy repository lookups.
- [x] Audit and correct all production-facing origin references to https://shrey-patel-profile.vercel.app/.

- [x] Permit Decap’s authenticated `/user` identification request through the same-origin proxy without widening repository write access.

- [x] Audit current portfolio image and document assets and determine the available Vercel Blob storage access path.
- [x] Connect or provision Vercel Blob storage and securely configure the required server-side token.
- [x] Migrate existing portfolio media to Vercel Blob and replace editable content with permanent Blob URLs.
- [x] Add a secure owner-only workflow for future portfolio media uploads.
- [x] Validate local private Blob delivery, cache headers, SSR social-image output, owner-only upload protection, media-manager rendering, credential access, deterministic tests, TypeScript, and production build.
- [ ] Validate local and deployed media delivery, admin editing behavior, SEO preview references, tests, and production build.

- [x] Replace the separate media-manager page with a native Decap Media workflow backed by private Vercel Blob storage.
- [ ] Ensure Decap media uploads, media selection, and deletion operate through owner-authorized Blob routes without committing binary files to GitHub.

- [ ] Fix the native Decap Media **Use** action so it inserts the selected Vercel Blob URL into the active content field.
- [x] Trace the uploaded resume’s Vercel Blob store, pathname, and dashboard visibility, then reconcile any mismatched storage target.

- [ ] Stabilize the native Decap Media insertion behavior so asset selection reliably updates the active file or image field.
- [x] Inventory all code, routes, dependencies, assets, documentation, and deployment configuration for obsolete or duplicate material.
- [x] Remove obsolete code paths, unused assets, redundant dependencies, and nonessential repository documentation without harming operations.
- [x] Perform a comprehensive production-readiness review of application logic, security, validation, error handling, SSR, SEO, and deployment behavior.
- [x] Perform a complete desktop and mobile UI/UX, alignment, accessibility, and interaction-state review, then correct verified issues.
- [x] Research and apply safe performance optimizations for loading, runtime delivery, media, and metadata.
- [x] Complete comprehensive regression, build, crawler, visual, and deployment-readiness validation.
- [x] Create an unpushed review-ready local checkpoint and change summary; do not publish a branch or open a PR without morning approval.

- [x] Complete all remaining noninteractive Decap Media, cleanup, production-hardening, and validation work before requesting one consolidated morning review.
- [x] Produce one consolidated morning checklist covering only owner-authenticated interactions that cannot be exercised without the user’s GitHub session.

- [ ] Complete the single owner-authenticated Decap Media field-selection and live publish verification when the user is available; no further local implementation work remains.

- [x] Adjust the desktop hero composition so its role metadata and Wells Fargo line fit completely inside the initial viewport at the reported 2048×1396 aspect ratio.

- [x] Reposition the Based in Bangalore callout so it does not cover carousel captions, controls, or visual content at narrow desktop and tablet sizes.

- [x] Refine the footer’s light and dark theme treatment so its contrast and visual tone feel intentional with the surrounding page.

- [x] Match the light-mode footer background exactly to the porcelain surface used by the main page and sidebar.

- [x] Match the dark-mode footer background exactly to the dark sidebar surface.

- [x] Remove the remaining rendered dark-mode color discrepancy between the footer and sidebar by consolidating their effective background rules.

- [x] Restore a visible but restrained right divider on the desktop sidebar in dark mode without altering light mode.

- [x] Match the desktop dark-mode sidebar divider exactly to the shared horizontal separator weight.

- [x] Create a pull request from the approved local production-hardening review branch into GitHub main without changing the live branch.

- [x] Verify the owner-selected Decap resume URL resolves through the correct site-owned media route before publishing the content update.

- [x] Correct Decap’s resume-media insertion so it cannot publish an invalid legacy `/media/...` route and instead returns the canonical private Blob delivery URL.

- [x] Verify the merged canonical resume-media correction on GitHub main and the deployed portfolio before closing the production checklist.

- [x] Convert the Experience editor and public portfolio section to support adding, editing, reordering, and rendering multiple roles.

- [x] Add the supplied Wells Fargo, Surabhi.io, and ZolutionTech internship roles as structured editable experience entries.

- [x] Add Istine Package Manager, FliplookAI, and Bill Splitter as editable projects, and add supplied GitHub and live links for all portfolio projects.

- [x] Replace project visual-kind labels with named layouts, add new visual presets, and support an optional media-library project image override.

- [x] Rebalance project card text and visual proportions and make the Layout 3 project visual more compact.

- [x] Replace the editable Skills groups with the supplied Android, backend, frontend, programming-language, and other-stack categories.

- [x] Redesign the Skills component with technology-specific icons, stronger visual hierarchy, and minimal accessible motion.

- [x] Remove the small two-letter technology token boxes from Skills cards while retaining the approved icon-led design.

- [x] Remove the leftover empty vertical space in Skills cards after the technology token boxes were removed.

- [x] Add an editable Achievements and Participation section with per-entry visual placeholders and an official GDSC mark where suitable.

- [x] Refine Achievements and Participation into a compact list with a small logo or placeholder at left and achievement information at right.

- [x] Restyle achievements to use the Skills section’s lighter separator rhythm, smaller transparent logos, and minimal fallback icons.

- [x] Fix uploaded achievement images not rendering when entries remain set to the placeholder visual mode in Decap CMS.

- [x] Refine the desktop sidebar active link with a cobalt title and a single animated rounded selection indicator.

- [x] Fix the active sidebar title’s cobalt color in dark mode and attach the active dot to the sliding indicator.

- [x] Add subtle cobalt hover feedback and slight horizontal movement for inactive desktop sidebar links.

- [x] Remove sidebar hover color changes and restore neutral inactive sidebar colors in dark mode while retaining the hover shift.

- [x] Apply and validate low-risk Lighthouse-guided performance improvements without changing current portfolio functionality or design.

- [x] Replace oversized hero and achievement image sources with optimized modern variants while preserving current display and Decap editability.

- [x] Review the updated Lighthouse report, quantify improvements, and identify any remaining approval-required optimizations.

- [x] Resolve the remaining safe Lighthouse findings: contact-panel text contrast, hero-carousel dot hit areas, and the analytics placeholder request.

- [x] Implement and validate approved deeper Lighthouse optimizations for JavaScript delivery, font loading, and final hero-media reduction.

- [x] Align contact honeypot validation with the intended silent-success behavior while preserving Telegram and cooldown protections.

- [x] Investigate and improve the supplied mobile PageSpeed performance report before addressing the desktop accessibility report.

- [x] Resolve the supplied desktop PageSpeed background-and-foreground color contrast failures without changing portfolio hierarchy or layout.

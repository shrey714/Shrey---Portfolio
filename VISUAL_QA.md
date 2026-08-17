# Visual QA Notes

## 2026-08-17 — Practice / Systems Evidence

The desktop light and dark views were inspected at the Practice section. The `Detail is part of the system.` callout now sits below the Systems Evidence frame in normal document flow and does not overlap its footer. The `Signal / decision / response` and `System note 01` labels remain on one baseline at desktop width. A 375 px mobile full-page capture also showed the callout below the evidence frame, with no collision against the metadata row or adjacent discipline content.

## 2026-08-17 — Compact Appearance Icon

The desktop rail appearance control was checked in both dark and light modes. The prior wide switch has been replaced by a single compact icon button. Activating it changed dark mode to light mode, updated the accessible action label from `Switch to light mode` to `Switch to dark mode`, and preserved a clear circular control with readable contrast.

## 2026-08-17 — Portfolio Interaction Additions

The selected-work desktop surface was inspected after adding the new interaction layer. Both evidence frames retain their original editorial hierarchy and show a compact System X-Ray trigger at the lower left. The Field Notes section is present in document content between the About and Engineering Philosophy surfaces. X-Ray panel interaction verification continues in the next QA pass.

The browser console was checked during the initial trigger check and showed no client-side errors. The panel rendering state is being verified separately because the browser-console execution wrapper did not return the DOM snapshot value.

The DardiBook trigger was opened successfully in the desktop Selected Work section. The X-Ray panel rendered over the evidence frame with a close control and three tabs. Selecting the `Workflow` tab updated the displayed signal, title, and description to the corresponding workflow lens without disturbing the surrounding card layout.

Design Debug Mode opened from the desktop rail as a non-blocking inspection layer. It revealed the 12-column field and a compact panel with the editorial grid, typography, and surface-system details. The close control removed the layer cleanly and returned the normal page view.

A 375 px full-page capture retained the concise project-card composition, placed the System X-Ray triggers within the evidence frames, and stacked the Field Notes cards with readable spacing. No overlap or horizontal overflow was visible in the mobile capture.

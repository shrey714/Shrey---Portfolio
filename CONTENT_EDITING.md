# Editing Portfolio Content

Portfolio copy is edited through the private **Decap CMS** at `/admin` after the Vercel deployment is live. The editor updates one tracked source file, `content/portfolio.json`, and every save creates a GitHub commit. Vercel then rebuilds the portfolio from that committed content, so the public HTML remains server-rendered and crawler-visible.

> **Do not edit `client/src/content/portfolioContent.ts`.** It is now only the stable import boundary that reads the JSON source used by the editor.

| What you want to change | Editor section |
|---|---|
| Name, location, availability, and rail wording | **Identity** |
| Hero heading, introductory copy, resume URL, and carousel content | **Hero** |
| Projects, technologies, source or live-project URLs, calls to action, and evidence-frame labels | **Selected work** |
| Practice, disciplines, and skill groups | **Practice** |
| Achievement entries, participation details, and per-entry visuals | **Achievements and participation** |
| Biography, experience history, and fact cards | **About** and **Experience** |
| Principles | **Philosophy** |
| Email, social URLs, and contact-form copy | **Contact** |
| Footer language and accessibility labels | **Footer** and **Interface labels** |
| Page title, search description, Open Graph copy, and Person schema data | **SEO and social sharing** |

## Editing workflow

Visit `https://shrey-patel-profile.vercel.app/admin` and choose **Login with GitHub**. Sign in with the GitHub account that has write access to `shrey714/Shrey---Portfolio`. Open **Portfolio content**, make the changes, and use the editor’s **Publish** action. Decap commits the updated `content/portfolio.json` to the `main` branch.

The GitHub commit starts the linked Vercel deployment. After its build succeeds, the public home page includes the new content in the initial server-rendered HTML as well as the hydrated page. This keeps normal copy changes code-free while preserving the SEO behavior of the portfolio.

## Important content rules

Keep every required field populated. The deployment build validates the content structure before it emits the site, so an incomplete field or unsupported project visual kind fails early instead of quietly breaking the public page. Use complete absolute URLs for external links and use either a complete absolute URL or a leading-slash site path for the resume and image URLs.

Use the native **Media** panel in `/admin` to upload, select, and delete images and PDF files. The Decap panel is backed by private Vercel Blob storage rather than the GitHub `content/media` directory, so media binaries are not committed to the repository. Select an asset to insert its cacheable site-owned URL into **Hero image URL**, **Social share image URL**, or **Resume → PDF URL**. The normal Decap media folder stays empty; it exists only to satisfy the CMS configuration contract.

### Project visuals

Each project in **Selected work** can use one of five presentation presets: **Layout 1 — Workflow dashboard**, **Layout 2 — Commerce board**, **Layout 3 — System map**, **Layout 4 — Editorial showcase**, or **Layout 5 — Analytics panel**. They change only the decorative visual frame, not the project copy or links. Select **Project images** when you want to use your own visuals, then add one or more assets in the single **Project images** field. Multiple images autoplay and can also be selected with the pagination dots on the public portfolio.

### Adding an experience

Open **Experience** in **Portfolio content**, then use **Add Experience entries** to create another role. Each entry includes its company, role, date range, description, responsibility label, and responsibility list. Decap lets you reorder the entries; the public portfolio presents them in that same order, so place your most recent role first.

### Adding an achievement

Open **Achievements and participation** in **Portfolio content**, then use **Add Achievement entries** to create a record. Choose **Image** to upload or select an image from the native Media panel; an image is required only for that visual mode. Choose **Placeholder** when an event has no suitable mark yet, then edit the **Placeholder label** to control the calm editorial visual shown on the site. The supplied Google Developer Student Clubs entry begins with a program-mark visual; you can replace it with your own chapter or event asset at any time.

## Rollback

Every edit has a corresponding GitHub commit. To undo one, use **Revert** on the relevant GitHub commit, then allow Vercel to deploy that revert. If a Vercel build itself needs to be reverted, use Vercel’s deployment rollback interface. The editor never writes directly to the live site or database.

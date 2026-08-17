# Editing Portfolio Content

Portfolio copy is edited through the private **Decap CMS** at `/admin` after the Vercel deployment is live. The editor updates one tracked source file, `content/portfolio.json`, and every save creates a GitHub commit. Vercel then rebuilds the portfolio from that committed content, so the public HTML remains server-rendered and crawler-visible.

> **Do not edit `client/src/content/portfolioContent.ts`.** It is now only the stable import boundary that reads the JSON source used by the editor.

| What you want to change | Editor section |
|---|---|
| Name, location, availability, and rail wording | **Identity** |
| Hero heading, introductory copy, resume URL, and carousel content | **Hero** |
| Projects, technologies, calls to action, and evidence-frame labels | **Selected work** |
| Practice, disciplines, and skill groups | **Practice** |
| Biography, experience, and fact cards | **About** and **Experience** |
| Principles | **Philosophy** |
| Email, social URLs, and contact-form copy | **Contact** |
| Footer language and accessibility labels | **Footer** and **Interface labels** |
| Page title, search description, Open Graph copy, and Person schema data | **SEO and social sharing** |

## Editing workflow

Visit `https://shrey-patel-profile.vercel.app/admin` and choose **Login with GitHub**. Sign in with the GitHub account that has write access to `shrey714/Shrey---Portfolio`. Open **Portfolio content**, make the changes, and use the editor’s **Publish** action. Decap commits the updated `content/portfolio.json` to the `main` branch.

The GitHub commit starts the linked Vercel deployment. After its build succeeds, the public home page includes the new content in the initial server-rendered HTML as well as the hydrated page. This keeps normal copy changes code-free while preserving the SEO behavior of the portfolio.

## Important content rules

Keep every required field populated. The deployment build validates the content structure before it emits the site, so an incomplete field or unsupported project visual kind fails early instead of quietly breaking the public page. Use complete absolute URLs for external links and use either a complete absolute URL or a leading-slash site path for the resume and image URLs.

The present editor is intentionally configured for text and URL management only. Continue to use the existing asset process for images and PDFs, then paste the resulting URL into the relevant content field. Do not rely on the CMS media-upload folder for website assets.

## Rollback

Every edit has a corresponding GitHub commit. To undo one, use **Revert** on the relevant GitHub commit, then allow Vercel to deploy that revert. If a Vercel build itself needs to be reverted, use Vercel’s deployment rollback interface. The editor never writes directly to the live site or database.

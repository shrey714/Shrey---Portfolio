# Dynamic Content and SEO — Source Notes

## Key conclusions

The current portfolio uses a client-rendered React/Vite application. Google can render modern JavaScript, but critical SEO content, canonical tags, Open Graph metadata, and rapidly re-indexed edits are more robust when represented in server-rendered or statically generated HTML rather than fetched only after client hydration.[1]

For a small portfolio whose content changes occasionally, static generation is the strongest performance/SEO default. Vercel describes Static Site Generation as providing pre-rendered HTML with fast loads and excellent SEO, with the trade-off that content changes require a rebuild and deployment. SSR keeps content fresh per request but costs more server work and is slower than SSG; it is appropriate only if edits truly need to be live without a deploy.[2]

Decap CMS is an open-source, Git-backed editor that uses a web UI to make repository commits. It can be used without Netlify and supports GitHub/GitLab/Bitbucket workflows, making it suitable for a free “content editor” layer over a repository-based static publishing workflow.[3]

Sanity’s Free plan is currently listed as $0 forever for smaller projects and includes a hosted content database, free Studio hosting, live previews, 10,000 documents, 1 million API CDN requests per month, and 100 GB of assets/bandwidth. For SEO, its content should be fetched during static generation/rebuild or SSR—not only from the browser after the page loads.[4]

## Implications for this portfolio

| Architecture | Dynamic editing | SEO-safe delivery | Update visibility | Main trade-off |
| --- | --- | --- | --- | --- |
| Git file / Decap CMS + static pre-render | Friendly Git-backed editor | Pre-rendered HTML at build time | After a rebuild/deploy | Content edit causes a deployment |
| Sanity (or equivalent) + static pre-render | Dedicated visual CMS | Pre-rendered HTML at build time | After webhook/rebuild | Additional CMS project and token setup |
| Existing database + protected admin + SSR | Custom site-native editor | HTML rendered from database per request | Immediately after publish | Most engineering and SSR work |
| Client-side Google Sheet/Notion/API | Easy external editing | Not sufficient for “full SEO” by itself | Immediately in browser | Text is not reliably present in initial HTML/social previews |

## Sources

[1]: https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process
[2]: https://vercel.com/blog/how-to-choose-the-best-rendering-strategy-for-your-app
[3]: https://decapcms.org/docs/intro/
[4]: https://www.sanity.io/pricing

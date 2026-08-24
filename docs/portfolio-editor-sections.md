# Portfolio Editor Section Architecture

The Portfolio CMS now presents thirteen focused entries directly on the `/admin` landing page: profile, navigation, hero, work, practice, achievements, about, experience, philosophy, contact, footer, interface labels, and SEO. Each entry stores only its own fields in a dedicated JSON file under `content/portfolio/`, so selecting it opens a focused editing page rather than a single long form.

Each focused entry keeps meaningful collapsed summaries for repeatable project, achievement, experience, skill, and navigation items. A composition module rebuilds the same public `portfolioContent` object consumed by the portfolio and SSR metadata layer, so rendering, validation, media uploads, and GitHub save behavior remain unchanged. The local `/api/decap/config` response confirms the thirteen landing-page entries and their file paths.

This uses Decap CMS’s supported `object` and `list` configuration options for collapsed content and summaries, without changing portfolio data keys. [1] [2]

## References

[1]: https://decapcms.org/docs/widgets/object/ "Decap CMS Object widget"
[2]: https://decapcms.org/docs/widgets/list/ "Decap CMS List widget"

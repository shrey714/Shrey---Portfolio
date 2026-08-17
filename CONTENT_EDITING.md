# Editing Portfolio Content

All text, project details, contact links, carousel captions, navigation labels, and page metadata are now collected in:

```text
client/src/content/portfolioContent.ts
```

To update the site, open that one file and change the text inside quotation marks. The page layout, styles, animations, and interactions are deliberately kept elsewhere, so normal copy updates do not require modifying components or CSS.

| What you want to change | Configuration section |
| --- | --- |
| Name, location, availability, desktop rail label | `identity` |
| Hero title, intro, buttons, visual carousel captions | `hero` |
| Work projects, technologies, and calls to action | `work.projects` |
| Practice statements, disciplines, and skills | `practice` |
| Biography, fact cards, and professional experience | `about` and `experience` |
| Engineering principles | `philosophy` |
| Email and social destinations | `contact` |
| Footer wording | `footer` |

Keep quotation marks, commas, brackets, and braces intact. For a new project or principle, copy the nearest existing object inside its list and replace only the values.


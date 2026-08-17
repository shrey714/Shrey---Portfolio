# Portfolio Interaction Ideas — Research Notes

## Evaluation lens for this portfolio

The portfolio should retain its quiet editorial system, warm porcelain/charcoal/cobalt palette, readable case-study hierarchy, low interaction cost, keyboard access, and reduced-motion support. A useful new feature should reveal **how Shrey thinks or works**, rather than act as decoration.

## External findings

| Source | Relevant observations | What to borrow, not copy |
| --- | --- | --- |
| [Awwwards Portfolio collection](https://www.awwwards.com/websites/portfolio/) | The collection currently surfaces diverse creative patterns, including collages and motion, walkable-atlas concepts, handheld-format portfolios, strong project navigation, and experimental visual systems. | Use a distinctive interaction metaphor only when it supports the work story; avoid building a full experimental navigation layer for a recruiter-facing portfolio. |
| [Interaction Design Foundation — Interactive Design Portfolios](https://ixdf.org/literature/topics/interactive-design-portfolios) | Interactivity can demonstrate interaction-design skill, but portfolios remain strongest when they tell a project story from problem to solution and keep navigation, responsiveness, and readability intuitive. | Favor small, optional, story-revealing interactions over visual spectacle or complex animation. |
| [Product Design Portfolios — inspirational collection](https://www.productdesignportfolios.com/) | The collection highlights animated screens, interactive prototypes, fan carousels, mixed media, pixel animation, strong project ownership, data/impact emphasis, project links to articles and release notes, as well as different portfolio metaphors such as a Netflix-film presentation. | Consider animated interface excerpts, a personal product “field notes” stream, an ownership lens, or a deliberately constrained themed format—implemented in the existing editorial language. |
| [Joel Hooks — Digital Garden](https://joelhooks.com/digital-garden/) | The digital-garden pattern treats a personal site as a cultivated, evolving collection of ideas rather than a chronological publishing feed. | Use a very small evolving “notes” surface, not a full blog, if ongoing thinking would add genuine value. |

## Guardrails

The ideas below should not invent project outcomes, testimonials, live status information, or case-study facts. Every persistent feature must have a clear empty state or graceful fallback. Any visually rich motion must use transform/opacity, be optional, and respect `prefers-reduced-motion`.

import content from "../../../content/portfolio.json";

/**
 * The app-facing import boundary for the editable Git-backed content source.
 * Content editors update content/portfolio.json through /admin; the UI remains
 * intentionally unaware of the delivery mechanism.
 */
export const portfolioContent = content;

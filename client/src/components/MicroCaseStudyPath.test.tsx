/** @vitest-environment jsdom */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { portfolioContent } from "@/content/portfolioContent";
import { MicroCaseStudyPath } from "./MicroCaseStudyPath";

describe("MicroCaseStudyPath", () => {
  it("exposes accessible steps, progress, and an updated panel when a visitor selects a new step", async () => {
    const user = userEvent.setup();
    const project = portfolioContent.work.projects[0];
    render(<MicroCaseStudyPath project={project} />);

    const tablist = screen.getByRole("tablist", { name: project.caseStudy.controlsLabel });
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("01 / 03")).toBeTruthy();

    await user.click(tabs[1]);

    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("02 / 03")).toBeTruthy();
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(tabs[1].id);
    expect(screen.getByText(project.caseStudy.steps[1].title)).toBeTruthy();
  });
});

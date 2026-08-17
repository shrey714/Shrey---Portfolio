import { describe, expect, it } from "vitest";
import { getEvidenceScrollMotion } from "./evidenceMotion";

describe("getEvidenceScrollMotion", () => {
  it("returns a small bounded scroll-progress response", () => {
    const entering = getEvidenceScrollMotion({ top: 900, height: 400, viewportHeight: 1000 }, false);
    const leaving = getEvidenceScrollMotion({ top: -100, height: 400, viewportHeight: 1000 }, false);

    expect(entering?.translateY).toBeGreaterThan(0);
    expect(entering?.scale).toBeLessThan(1);
    expect(leaving?.translateY).toBeLessThan(0);
    expect(leaving?.scale).toBeGreaterThan(entering?.scale ?? 0);
  });

  it("returns no motion for reduced-motion preferences or invalid geometry", () => {
    expect(getEvidenceScrollMotion({ top: 100, height: 400, viewportHeight: 1000 }, true)).toBeNull();
    expect(getEvidenceScrollMotion({ top: 100, height: 0, viewportHeight: 1000 }, false)).toBeNull();
  });
});

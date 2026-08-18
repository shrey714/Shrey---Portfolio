import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) => resolve(process.cwd(), relativePath);

describe("server template cleanup", () => {
  it("does not retain unregistered integration helpers", async () => {
    const unusedTemplateModules = [
      "server/_core/dataApi.ts",
      "server/_core/heartbeat.ts",
      "server/_core/imageGeneration.ts",
      "server/_core/llm.ts",
      "server/_core/map.ts",
      "server/_core/voiceTranscription.ts",
    ];

    await Promise.all(unusedTemplateModules.map((relativePath) => expect(access(projectFile(relativePath))).rejects.toThrow()));
  });
});

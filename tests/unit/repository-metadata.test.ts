import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("repository metadata contract", () => {
  it("pins CI and release to the supported Ubuntu browser image", () => {
    for (const file of ["ci.yml", "release.yml"]) {
      const workflow = readFileSync(
        new URL(`../../.github/workflows/${file}`, import.meta.url),
        "utf8",
      );
      expect(workflow).toContain("runs-on: ubuntu-24.04");
      expect(workflow).not.toContain("runs-on: ubuntu-latest");
    }
  });

  it("uses English for standalone document metadata", () => {
    const html = readFileSync(
      new URL("../../index.html", import.meta.url),
      "utf8",
    );
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>KoppaJS Documentation</title>");
    expect(html).toContain(
      "Complete KoppaJS user documentation with standalone and embeddable documentation interfaces.",
    );
  });

  it("exposes the baseline quality and release scripts contributors rely on", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
    ) as {
      scripts?: Record<string, string>;
    };

    for (const scriptName of [
      "clean",
      "prepare",
      "format",
      "format:check",
      "lint",
      "lint:fix",
      "typecheck",
      "test",
      "test:watch",
      "test:coverage",
      "test:ci",
      "test:e2e",
      "check",
      "validate",
      "release:check",
      "build",
    ]) {
      expect(packageJson.scripts?.[scriptName]).toBeTruthy();
    }
  });

  it("declares the 0.0.4 release baseline and local engine policy", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
    ) as {
      version?: string;
      engines?: Record<string, string>;
    };
    const nvmrc = readFileSync(
      new URL("../../.nvmrc", import.meta.url),
      "utf8",
    ).trim();
    const npmrc = readFileSync(
      new URL("../../.npmrc", import.meta.url),
      "utf8",
    ).trim();

    expect(packageJson.version).toBe("0.0.4");
    expect(packageJson.engines?.node).toBe(">=22");
    expect(nvmrc).toBe("22");
    expect(npmrc).toContain("engine-strict=true");
  });

  it("keeps CI aligned with the documented Node matrix and browser smoke gate", () => {
    const ciWorkflow = readFileSync(
      new URL("../../.github/workflows/ci.yml", import.meta.url),
      "utf8",
    );

    expect(ciWorkflow).toContain("node: [22, 24]");
    expect(ciWorkflow).toContain("Browser Smoke (Node 22)");
    expect(ciWorkflow).toContain("npm run test:e2e");
  });
});

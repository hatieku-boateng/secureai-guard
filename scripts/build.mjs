import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { copyFile } from "node:fs/promises";

await build({
  absWorkingDir: fileURLToPath(new URL("../", import.meta.url)),
  entryPoints: ["src/content.ts"],
  outfile: "dist/content.js",
  bundle: true,
  platform: "browser",
  format: "iife",
  target: "es2022",
  logLevel: "info",
});

await copyFile(
  new URL("../manifest.json", import.meta.url),
  new URL("../dist/manifest.json", import.meta.url),
);

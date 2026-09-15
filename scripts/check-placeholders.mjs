#!/usr/bin/env node
/**
 * Fails the build if unresolved client placeholders are still in shipped output.
 *
 * Run against dist/ after a build. Exits non-zero when anything is outstanding,
 * so this can gate a launch without anyone having to remember to look.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const DIST = "dist";

/**
 * Files in public/ ship byte-for-byte — no resizing, no format conversion. A
 * 4.3MB phone photo measured at LCP 23s and took Lighthouse mobile performance
 * from 100 to 74, so oversized images need to be loud rather than discovered
 * later in the field.
 */
const IMAGE_WARN_BYTES = 300 * 1024;
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

const PATTERNS = [
  { label: "bracketed placeholder", re: /\[[A-Z][A-Z0-9_]*(?:_PENDING)?\]/g },
  { label: "placeholder domain", re: /DOMAIN-PENDING\.example\.com/g },
  { label: "build note left in markup", re: /Build note — not for launch/g },
];

async function walk(dir, exts) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path, exts)));
    else if (exts.includes(extname(entry.name).toLowerCase())) out.push(path);
  }
  return out;
}

async function checkImageWeights() {
  const heavy = [];
  for (const file of await walk(DIST, IMAGE_EXTS)) {
    const { size } = await stat(file);
    if (size > IMAGE_WARN_BYTES) heavy.push({ file, size });
  }
  if (heavy.length === 0) return;

  console.log("\nOversized images — these will hurt mobile LCP:\n");
  for (const { file, size } of heavy.sort((a, b) => b.size - a.size)) {
    console.log(`  ${(size / 1024).toFixed(0).padStart(6)} KB  ${file}`);
  }
  console.log(
    "\n  Re-export as WebP, roughly 1200px wide, under ~200KB, and replace" +
      " the file in public/.\n",
  );
}

let files;
try {
  files = await walk(DIST, [".html", ".xml", ".txt"]);
} catch {
  console.error(`No ${DIST}/ directory. Run \`npm run build\` first.`);
  process.exit(2);
}

await checkImageWeights();

const findings = new Map();

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const { label, re } of PATTERNS) {
    const hits = text.match(re);
    if (!hits) continue;
    for (const hit of new Set(hits)) {
      const key = `${label}: ${hit}`;
      findings.set(key, (findings.get(key) ?? new Set()).add(file));
    }
  }
}

if (findings.size === 0) {
  console.log("No placeholders left in dist/. Clear to ship.");
  process.exit(0);
}

console.log(`\n${findings.size} unresolved item(s) still in the built output:\n`);
for (const [key, fileSet] of [...findings].sort()) {
  console.log(`  ${key}`);
  console.log(`    in ${fileSet.size} file(s): ${[...fileSet].slice(0, 3).join(", ")}${fileSet.size > 3 ? ", …" : ""}`);
}
console.log(
  "\nThese must come from the client, not from a guess. Not shippable yet.\n",
);
process.exit(1);

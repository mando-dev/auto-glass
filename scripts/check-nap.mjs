#!/usr/bin/env node
/**
 * Guards the single-source NAP rule.
 *
 * Scans src/ for business identity — phone numbers, emails, street addresses —
 * written anywhere other than src/lib/site.ts. Every one of those belongs in
 * site.ts and gets imported.
 *
 * This is enforcement rather than a style preference. A competitor audit across
 * 12 Orange County auto glass sites found identity conflicts on every one of the
 * five most recently checked — different addresses, phones or emails between a
 * site's own schema, its footer and its directory listings, in one case three
 * address/email combinations on a single site. That inconsistency is the thing a
 * governed source prevents, and it only stays governed if drift fails a check
 * instead of relying on whoever edits a component next remembering the rule.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, extname, relative } from "node:path";

const SRC = "src";
const SOURCE_OF_TRUTH = join("src", "lib", "site.ts");

const RULES = [
  {
    label: "hard-coded phone number",
    re: /\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g,
  },
  {
    label: "hard-coded tel: link",
    re: /tel:\+?[\d-.\s()]{7,}/g,
  },
  {
    label: "hard-coded email address",
    re: /[\w.+-]+@(?!example\.com)[\w-]+\.[\w.]{2,}/g,
  },
  {
    label: "hard-coded street address",
    re: /\b\d{1,6}\s+[A-Z][A-Za-z]+\s+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road|Dr|Drive|Way|Ln|Lane|Ct|Court)\b/g,
  },
  {
    label: "hard-coded city/ZIP",
    re: /\b(?:CA|California)[,\s]+\d{5}\b/g,
  },
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if ([".astro", ".ts", ".js", ".mjs"].includes(extname(entry.name)))
      out.push(path);
  }
  return out;
}

const violations = [];

for (const file of await walk(SRC)) {
  if (relative(".", file) === SOURCE_OF_TRUTH) continue;

  const lines = (await readFile(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    for (const { label, re } of RULES) {
      for (const match of line.matchAll(re)) {
        violations.push({ file, line: i + 1, label, text: match[0].trim() });
      }
    }
  });
}

if (violations.length === 0) {
  console.log(
    "NAP is governed: no business identity written outside src/lib/site.ts.",
  );
  process.exit(0);
}

console.log(
  `\n${violations.length} piece(s) of business identity written outside ${SOURCE_OF_TRUTH}:\n`,
);
for (const v of violations) {
  console.log(`  ${v.file}:${v.line}  ${v.label} — ${v.text}`);
}
console.log(
  `\nMove these into ${SOURCE_OF_TRUTH} and import them. A second copy is a` +
    " future inconsistency.\n",
);
process.exit(1);

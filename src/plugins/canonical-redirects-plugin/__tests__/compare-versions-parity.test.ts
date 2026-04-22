/**
 * Parity test: scripts/handle_redirects.js (CloudFront Function, inlined)
 * and src/plugins/canonical-redirects-plugin/lib/compare-versions.ts must
 * agree on every input. The edge runtime can't resolve additional imports,
 * so compareVersions lives in two places; this test reads the edge source
 * as text, extracts the function body, new Function()'s it, and asserts
 * behavioural equality with the TypeScript copy on a representative case
 * table spanning major/minor boundaries.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compareVersions as tsCompareVersions } from "../lib/compare-versions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EDGE_FILE = path.join(__dirname, "..", "..", "..", "..", "scripts", "handle_redirects.js");

/** Pull the `function compareVersions(...) { ... }` body out of the edge file. */
function extractEdgeCompareVersions(): (v1: string, v2: string) => number {
    const source = fs.readFileSync(EDGE_FILE, "utf8");
    // Match: function compareVersions(v1, v2) { ...balanced-braces... }
    // Non-greedy body, relying on the next top-level "\n}\n" as terminator.
    const match = source.match(/function\s+compareVersions\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\}\n/);
    if (!match) {
        throw new Error(
            `parity test: could not locate compareVersions in ${EDGE_FILE}. ` +
                `Function signature may have changed — update the extractor regex.`
        );
    }
    const params = match[1].split(",").map((p) => p.trim()).filter(Boolean);
    const body = match[2];
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(...params, body) as (v1: string, v2: string) => number;
}

const CASES: Array<[string, string, number]> = [
    ["7.2", "7.2", 0],
    ["7.2", "7.1", 1],
    ["7.1", "7.2", -1],
    ["7.11", "7.2", 1],
    ["7.2", "7.11", -1],
    ["6.2", "7.0", -1],
    ["7.0", "6.2", 1],
    ["8.0", "7.2", 1],
    ["7.2", "8.0", -1],
    ["10.0", "9.9", 1],
    ["9.9", "10.0", -1],
    ["4.2", "4.2", 0],
    ["4.2", "5.3", -1],
    ["5.4", "5.3", 1],
];

test("edge compareVersions is extractable from handle_redirects.js", () => {
    const edgeFn = extractEdgeCompareVersions();
    assert.equal(typeof edgeFn, "function");
    assert.equal(edgeFn("7.2", "7.2"), 0);
});

test("edge + plugin compareVersions agree across the case table", () => {
    const edgeFn = extractEdgeCompareVersions();
    for (const [a, b, expected] of CASES) {
        const edge = edgeFn(a, b);
        const plugin = tsCompareVersions(a, b);
        assert.equal(
            edge,
            expected,
            `edge compareVersions(${a}, ${b}) = ${edge}, expected ${expected}`
        );
        assert.equal(
            plugin,
            expected,
            `plugin compareVersions(${a}, ${b}) = ${plugin}, expected ${expected}`
        );
        assert.equal(
            edge,
            plugin,
            `drift detected: edge(${a}, ${b}) = ${edge}, plugin = ${plugin}`
        );
    }
});

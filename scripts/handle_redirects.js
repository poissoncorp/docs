import cf from "cloudfront";

// ---------------------------------------------------------------------------
// CloudFront Functions deploy note
// ---------------------------------------------------------------------------
// The CloudFront Functions runtime expects a single-file upload. The only
// remaining import here is CURRENT_VERSION from scripts/lib/version-policy.js,
// the single source of truth for the current major.minor. compareVersions is
// defined inline below (the runtime can't resolve additional imports at edge
// time). A parity test in the canonical-redirects plugin reads this file as
// text, extracts the compareVersions body, and asserts behavioural equality
// with the plugin's TypeScript copy — catching drift between the two.
// ---------------------------------------------------------------------------
import { CURRENT_VERSION } from "./lib/version-policy.js";

function compareVersions(v1, v2) {
    const parts1 = v1.split(".");
    const parts2 = v2.split(".");
    const major1 = parseInt(parts1[0], 10);
    const major2 = parseInt(parts2[0], 10);
    const minor1 = parseInt(parts1[1], 10);
    const minor2 = parseInt(parts2[1], 10);
    if (major1 === major2) {
        if (minor1 > minor2) return 1;
        if (minor1 < minor2) return -1;
        return 0;
    }
    if (major1 > major2) return 1;
    if (major1 < major2) return -1;
    return 0;
}

const kvsHandle = cf.kvs();

const defaultVersion = CURRENT_VERSION;

const staticAssetRegex =
    /\.(html|css|js|jpg|jpeg|png|gif|webp|svg|ico|ttf|otf|woff|woff2|eot|mp4|mp3|webm|avi|mov|pdf|txt|xml)$/i;

const versionRegex = /^\/(\d+\.\d+)(\/.*)?/;

function redirect(targetUrl) {
    return {
        statusCode: 301,
        statusDescription: "Moved Permanently",
        headers: {
            location: { value: targetUrl },
        },
    };
}

async function handler(event) {
    const request = event.request;
    const uri = request.uri;

    if (staticAssetRegex.test(uri)) {
        return request;
    }

    const hasTrailingSlash = uri !== "/" && uri.endsWith("/");
    const normalizedUri = hasTrailingSlash ? uri.slice(0, -1) : uri;

    if (normalizedUri.startsWith("/templates")) {
        if (hasTrailingSlash) {
            return redirect(normalizedUri);
        }
        request.uri = uri + "/index.html";
        return request;
    }

    if (normalizedUri.startsWith("/guides") || normalizedUri.startsWith("/cloud")) {
        try {
            const redirectData = await kvsHandle.get(normalizedUri);
            const redirectJsonValue = JSON.parse(redirectData);
            if (redirectJsonValue.targetUrl) {
                return redirect(redirectJsonValue.targetUrl);
            }
        } catch (_) {
            // No redirect rule found
        }
        if (hasTrailingSlash) {
            return redirect(normalizedUri);
        }
        request.uri = uri + "/index.html";
        return request;
    }

    const versionMatch = normalizedUri.match(versionRegex);

    let version, versionlessUri, targetUri;
    let redirectRequired = hasTrailingSlash;

    if (versionMatch) {
        version = versionMatch[1];
        versionlessUri = versionMatch[2] || "";
    } else {
        version = defaultVersion;
        versionlessUri = normalizedUri === "/" ? "" : normalizedUri;
        redirectRequired = true;
    }

    targetUri = `/${version}${versionlessUri}`;

    // Resolve redirect chain so an N-hop chain becomes exactly one 301
    // at the edge. Two invariants — "no cycles" and "targetUrl is always
    // a non-empty string" — are enforced upstream by npm run validate-
    // redirects (which runs in CI and in the canonical-redirects plugin's
    // loadContent). The KVS only ever contains pre-validated data, so the
    // edge can trust those invariants and keep this loop minimal. See the
    // plugin's validateNoCycles for the authoritative cycle check.
    //
    // minimumVersion is required by validation on every versioned (docs)
    // rule and forbidden on versionless (/guides, /cloud) rules. The
    // /guides and /cloud branches above short-circuit before this loop,
    // so in practice every rule this loop sees carries a minimumVersion.
    // The `rule.minimumVersion &&` guard stays as a cheap belt-and-braces:
    // if a versionless rule ever reaches here, "absent" is treated as
    // "always apply", matching the schema intent.
    let current = versionlessUri;
    while (true) {
        let rule;
        try {
            rule = JSON.parse(await kvsHandle.get(current));
        } catch (_) {
            break; // no rule → terminal
        }
        if (rule.minimumVersion && compareVersions(version, rule.minimumVersion) < 0) break;
        current = rule.targetUrl;
    }
    if (current !== versionlessUri) {
        targetUri = `/${version}${current}`;
        redirectRequired = true;
    }

    if (redirectRequired) {
        return redirect(targetUri);
    }

    request.uri = normalizedUri + "/index.html";
    return request;
}

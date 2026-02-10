// File: /js/ss-rules.js
// SafeShare rules engine v2026-02-10-01

const GLOBAL_DROP_EXACT = new Set([
  "fbclid", "gclid", "dclid", "msclkid", "mc_eid", "igshid", "si",
  "_hsenc", "_hsmi", "vero_id", "wickedid", "yclid", "ref", "ref_src"
]);

const GLOBAL_DROP_PREFIX = [
  "utm_"
];

const GLOBAL_ESSENTIAL_KEEP = new Set([
  "id", "p", "v", "q", "k", "list", "t", "page", "article"
]);

const HOST_RULES = {
  "google.com": {
    keep: new Set(["q", "kgmid", "tbm"]),
    dropExact: new Set(["sca_esv", "sxsrf", "source", "shndl", "ved", "ei", "oq", "gs_lcp", "uact"])
  },
  "www.google.com": {
    keep: new Set(["q", "kgmid", "tbm"]),
    dropExact: new Set(["sca_esv", "sxsrf", "source", "shndl", "ved", "ei", "oq", "gs_lcp", "uact"])
  },
  "youtube.com": {
    keep: new Set(["v", "list", "t"]),
    dropExact: new Set(["si", "feature", "pp", "embeds_referring_euri"])
  },
  "www.youtube.com": {
    keep: new Set(["v", "list", "t"]),
    dropExact: new Set(["si", "feature", "pp", "embeds_referring_euri"])
  },
  "amazon.de": {
    keep: new Set(["k", "i", "node", "page"]),
    dropExact: new Set(["tag", "ref_", "pf_rd_r", "pf_rd_p", "psc", "smid", "ascsubtag"])
  },
  "www.amazon.de": {
    keep: new Set(["k", "i", "node", "page"]),
    dropExact: new Set(["tag", "ref_", "pf_rd_r", "pf_rd_p", "psc", "smid", "ascsubtag"])
  }
};

function normalizeHost(hostname) {
  return hostname.toLowerCase().replace(/^m\./, "");
}

function shouldDropGlobal(keyLower) {
  if (GLOBAL_DROP_EXACT.has(keyLower)) return true;
  for (const prefix of GLOBAL_DROP_PREFIX) {
    if (keyLower.startsWith(prefix)) return true;
  }
  return false;
}

function getHostRule(hostname) {
  const h = normalizeHost(hostname);
  return HOST_RULES[h] || null;
}

export function cleanUrl(input, mode = "standard") {
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    // Fallback for missing scheme
    parsed = new URL(`https://${input}`);
  }

  const rule = getHostRule(parsed.hostname);
  const removed = [];
  const kept = [];

  const allowKeep = new Set([
    ...GLOBAL_ESSENTIAL_KEEP,
    ...(rule ? Array.from(rule.keep) : [])
  ]);

  const entries = Array.from(parsed.searchParams.entries());
  parsed.search = "";

  for (const [key, value] of entries) {
    const lk = key.toLowerCase();

    const dropByGlobal = shouldDropGlobal(lk);
    const dropByHost = !!rule && rule.dropExact.has(lk);

    if (dropByGlobal || dropByHost) {
      removed.push(key);
      continue;
    }

    if (mode === "strict") {
      if (allowKeep.has(lk)) {
        parsed.searchParams.append(key, value);
        kept.push(key);
      } else {
        removed.push(key);
      }
    } else {
      // standard: unknown params bleiben, bekannte Tracker raus
      parsed.searchParams.append(key, value);
      if (allowKeep.has(lk)) kept.push(key);
    }
  }

  // Hash behalten (kann z. B. Anker oder App-State enthalten)
  return {
    cleaned: parsed.toString(),
    removed: Array.from(new Set(removed)),
    kept: Array.from(new Set(kept))
  };
}
/* File: /js/ss-rules.js */
/* SafeShare rules engine v2026-02-10-03 */

(() => {
  "use strict";

  // =========================
  // Global tracking patterns
  // =========================
  const GLOBAL_DROP_EXACT = new Set([
    "fbclid", "gclid", "dclid", "msclkid", "mc_eid",
    "igshid", "ig_rid", "ig_mid",
    "_hsenc", "_hsmi",
    "vero_id", "wickedid", "yclid",
    "gbraid", "wbraid", "mibextid",
    "srsltid", "ttclid", "twclid"
  ]);

  const GLOBAL_DROP_PREFIX = [
    "utm_",   // utm_source, utm_medium, ...
    "pk_",    // Matomo
    "mtm_"    // Matomo
  ];

  // Global funktional (für unbekannte Hosts in strict)
  const GLOBAL_ESSENTIAL_KEEP = new Set([
    "id", "page", "lang", "hl"
  ]);

  // =========================
  // Host rules
  // =========================
  // normalizeHost() entfernt m./www., daher Basishosts
  const HOST_RULES = {
    "google.com": {
      standardKeep: new Set(["q", "kgmid", "tbm", "hl", "gl"]),
      strictKeep:   new Set(["q"]),
      dropExact: new Set([
        "sca_esv", "sxsrf", "source", "shndl", "ved", "ei", "oq", "gs_lcp", "uact"
      ]),
      dropPrefix: []
    },

    "youtube.com": {
      standardKeep: new Set(["v", "list", "t", "start", "index"]),
      strictKeep:   new Set(["v"]),
      dropExact: new Set(["si", "feature", "pp", "embeds_referring_euri"]),
      dropPrefix: []
    },

    "amazon.de": {
      standardKeep: new Set(["k", "i", "node", "page"]),
      strictKeep:   new Set(["k", "i", "node"]),
      dropExact: new Set(["tag", "pf_rd_r", "pf_rd_p", "psc", "smid", "ascsubtag"]),
      dropPrefix: ["ref_"] // wichtig: Prefix
    },

    "amazon.com": {
      standardKeep: new Set(["k", "i", "node", "page"]),
      strictKeep:   new Set(["k", "i", "node"]),
      dropExact: new Set(["tag", "pf_rd_r", "pf_rd_p", "psc", "smid", "ascsubtag"]),
      dropPrefix: ["ref_"]
    },

    "facebook.com": {
      standardKeep: new Set([]),
      strictKeep:   new Set([]),
      dropExact: new Set(["ref", "refsrc", "__tn__", "notif_id", "notif_t"]),
      dropPrefix: []
    },

    "instagram.com": {
      standardKeep: new Set([]),
      strictKeep:   new Set([]),
      dropExact: new Set(["igshid", "ig_rid", "ig_mid"]),
      dropPrefix: []
    },

    "linkedin.com": {
      standardKeep: new Set([]),
      strictKeep:   new Set([]),
      dropExact: new Set(["trackingid", "trk", "trkinfo", "lipi", "midtoken"]),
      dropPrefix: []
    },

    "reddit.com": {
      standardKeep: new Set([]),
      strictKeep:   new Set([]),
      dropExact: new Set(["context", "rdt", "correlation_id"]),
      dropPrefix: []
    },

    "tiktok.com": {
      standardKeep: new Set([]),
      strictKeep:   new Set([]),
      dropExact: new Set(["_r", "checksum", "is_copy_url", "is_from_webapp", "sender_device"]),
      dropPrefix: []
    },

    // WhatsApp Deep Links
    "whatsapp.com": {
      standardKeep: new Set(["text", "phone"]), // text ist Nutzinhalt
      strictKeep:   new Set(["phone"]),         // strict kann text entfernen
      dropExact: new Set([]),
      dropPrefix: []
    },

    "wa.me": {
      standardKeep: new Set(["text"]),
      strictKeep:   new Set([]),
      dropExact: new Set([]),
      dropPrefix: []
    }
  };

  // =========================
  // Redirect unwrapping rules
  // =========================
  // Liefert eine Ziel-URL aus Redirect-Parametern zurück
  function extractRedirectTarget(urlObj) {
    const host = normalizeHost(urlObj.hostname);

    // Facebook Redirector
    if (host === "facebook.com") {
      const u = urlObj.searchParams.get("u");
      if (u) return safeDecode(u);
    }

    // Reddit out redirect
    if (host === "reddit.com") {
      const u = urlObj.searchParams.get("url");
      if (u) return safeDecode(u);
    }

    // Generische redirect-Muster (vorsichtig)
    const path = (urlObj.pathname || "").toLowerCase();
    const genericRedirectPaths = ["/redirect", "/redir", "/out", "/link"];
    if (genericRedirectPaths.some(p => path.includes(p))) {
      const candidateKeys = ["url", "u", "target", "dest", "destination", "redirect"];
      for (const key of candidateKeys) {
        const v = urlObj.searchParams.get(key);
        if (v) return safeDecode(v);
      }
    }

    return null;
  }

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function normalizeHost(hostname) {
    return String(hostname || "")
      .toLowerCase()
      .replace(/^m\./, "")
      .replace(/^www\./, "");
  }

  function getHostRule(hostname) {
    const h = normalizeHost(hostname);
    return HOST_RULES[h] || null;
  }

  function shouldDropGlobal(lk) {
    if (GLOBAL_DROP_EXACT.has(lk)) return true;
    for (const p of GLOBAL_DROP_PREFIX) {
      if (lk.startsWith(p)) return true;
    }
    return false;
  }

  function shouldDropHost(rule, lk) {
    if (!rule) return false;
    if (rule.dropExact && rule.dropExact.has(lk)) return true;
    if (rule.dropPrefix) {
      for (const p of rule.dropPrefix) {
        if (lk.startsWith(p)) return true;
      }
    }
    return false;
  }

  function parseInputUrl(input) {
    const raw = String(input || "").trim();
    if (!raw) throw new Error("empty");
    try {
      return new URL(raw);
    } catch {
      return new URL(`https://${raw}`);
    }
  }

  function dedupe(arr) {
    return Array.from(new Set(arr));
  }

  /**
   * cleanUrl(input, mode)
   * mode: "standard" | "strict"
   */
  function cleanUrl(input, mode = "standard") {
    const parsed = parseInputUrl(input);

    // 1) optional redirect unwrap (1 hop)
    const redirectTarget = extractRedirectTarget(parsed);
    if (redirectTarget) {
      try {
        const targetUrl = parseInputUrl(redirectTarget);
        return cleanParsedUrl(targetUrl, mode, {
          unwrappedFrom: parsed.toString()
        });
      } catch {
        // falls kaputt decodiert: normal mit Original weiter
      }
    }

    // 2) normal cleaning
    return cleanParsedUrl(parsed, mode, { unwrappedFrom: null });
  }

  function cleanParsedUrl(parsed, mode, meta) {
    const rule = getHostRule(parsed.hostname);
    const removed = [];
    const kept = [];

    const hostKeep = new Set(
      rule
        ? Array.from(mode === "strict" ? rule.strictKeep : rule.standardKeep)
        : []
    );

    const entries = Array.from(parsed.searchParams.entries());
    parsed.search = "";

    for (const [key, value] of entries) {
      const lk = key.toLowerCase();

      if (shouldDropGlobal(lk) || shouldDropHost(rule, lk)) {
        removed.push(key);
        continue;
      }

      if (rule) {
        if (mode === "strict") {
          if (hostKeep.has(lk) || GLOBAL_ESSENTIAL_KEEP.has(lk)) {
            parsed.searchParams.append(key, value);
            kept.push(key);
          } else {
            removed.push(key);
          }
        } else {
          // standard: host-aware + unknowns bleiben
          parsed.searchParams.append(key, value);
          if (hostKeep.has(lk) || GLOBAL_ESSENTIAL_KEEP.has(lk)) kept.push(key);
        }
      } else {
        // Unknown host
        if (mode === "strict") {
          if (GLOBAL_ESSENTIAL_KEEP.has(lk)) {
            parsed.searchParams.append(key, value);
            kept.push(key);
          } else {
            removed.push(key);
          }
        } else {
          // standard: unknown non-tracking stays
          parsed.searchParams.append(key, value);
          if (GLOBAL_ESSENTIAL_KEEP.has(lk)) kept.push(key);
        }
      }
    }

    return {
      cleaned: parsed.toString(),
      removed: dedupe(removed),
      kept: dedupe(kept),
      meta: {
        mode,
        host: normalizeHost(parsed.hostname),
        unwrapped: Boolean(meta && meta.unwrappedFrom),
        unwrappedFrom: meta && meta.unwrappedFrom ? meta.unwrappedFrom : null
      }
    };
  }

  // Global API for non-module script usage
  window.SS_RULES = Object.freeze({
    cleanUrl,
    normalizeHost,
    getHostRule
  });
})();

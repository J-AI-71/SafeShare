// File: /js/app.js
// SafeShare App FINAL single-file (no module import)
// Works for /app/ (DE) and /en/app/ (EN)

(() => {
  "use strict";

  // ---------------------------
  // Rules (embedded)
  // ---------------------------

  const GLOBAL_DROP_EXACT = new Set([
    "fbclid",
    "gclid",
    "dclid",
    "msclkid",
    "mc_eid",
    "igshid",
    "si",
    "_hsenc",
    "_hsmi",
    "vero_id",
    "wickedid",
    "yclid",
    "ref",
    "ref_src"
  ]);

  const GLOBAL_DROP_PREFIX = [
    "utm_"
  ];

  // Keep set used in strict mode (generic essentials)
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
      dropExact: new Set(["tag", "pf_rd_r", "pf_rd_p", "psc", "smid", "ascsubtag"])
    },
    "www.amazon.de": {
      keep: new Set(["k", "i", "node", "page"]),
      dropExact: new Set(["tag", "pf_rd_r", "pf_rd_p", "psc", "smid", "ascsubtag"])
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
    return HOST_RULES[normalizeHost(hostname)] || null;
  }

  function parseUrlFlexible(input) {
    try {
      return new URL(input);
    } catch (_) {
      // Allow "example.com?a=1"
      return new URL("https://" + input);
    }
  }

  function cleanUrl(input, mode) {
    const parsed = parseUrlFlexible(input);
    const rule = getHostRule(parsed.hostname);

    const removed = [];
    const kept = [];

    const allowKeep = new Set([
      ...GLOBAL_ESSENTIAL_KEEP,
      ...(rule ? Array.from(rule.keep) : [])
    ]);

    // Rebuild search params deterministically
    const originalParams = Array.from(parsed.searchParams.entries());
    parsed.search = "";

    for (const [key, value] of originalParams) {
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
        // standard: remove only known tracking/session noise
        parsed.searchParams.append(key, value);
        if (allowKeep.has(lk)) kept.push(key);
      }
    }

    return {
      cleaned: parsed.toString(),
      removed: Array.from(new Set(removed)),
      kept: Array.from(new Set(kept))
    };
  }

  // ---------------------------
  // UI bindings
  // ---------------------------

  const $ = (sel) => document.querySelector(sel);

  const urlInput = $("#urlInput");
  const urlOutput = $("#urlOutput");
  const cleanBtn = $("#cleanBtn");
  const copyBtn = $("#copyBtn");
  const shareBtn = $("#shareBtn");
  const resetBtn = $("#resetBtn");
  const cleanMeta = $("#cleanMeta");

  // Fail-safe if page structure differs
  if (!urlInput || !urlOutput || !cleanBtn || !copyBtn || !shareBtn || !resetBtn || !cleanMeta) {
    return;
  }

  const isEN = (document.documentElement.lang || "").toLowerCase().startsWith("en");

  const TEXT = {
    invalid: isEN ? "Invalid URL. Please check the link." : "Ungültiger Link. Bitte URL prüfen.",
    copied: isEN ? "Cleaned link copied." : "Bereinigter Link kopiert.",
    sharedFallback: isEN ? "Share not available. Copied instead." : "Teilen nicht verfügbar. Stattdessen kopiert.",
    modeStandard: isEN
      ? "Standard mode active (tracking-light, target-stable)."
      : "Standard-Modus aktiv (trackingarm, zielstabil).",
    modeStrict: isEN
      ? "Strict mode active (may change destination behavior)."
      : "Strikt-Modus aktiv (kann Zielverhalten ändern).",
    removedLabel: isEN ? "Removed" : "Entfernt",
    keptLabel: isEN ? "Kept" : "Behalten"
  };

  function getMode() {
    return document.querySelector('input[name="mode"]:checked')?.value || "standard";
  }

  function setButtonsEnabled(hasOutput) {
    copyBtn.disabled = !hasOutput;
    shareBtn.disabled = !hasOutput;
  }

  function setMeta(removedArr, keptArr, mode) {
    const removed = removedArr.length ? removedArr.join(", ") : "–";
    const kept = keptArr.length ? keptArr.join(", ") : "–";
    const modeText = mode === "strict" ? TEXT.modeStrict : TEXT.modeStandard;
    cleanMeta.textContent = `${TEXT.removedLabel}: ${removed} • ${TEXT.keptLabel}: ${kept} • ${modeText}`;
  }

  function runClean() {
    const raw = urlInput.value.trim();

    if (!raw) {
      urlOutput.value = "";
      setButtonsEnabled(false);
      setMeta([], [], getMode());
      return;
    }

    try {
      const result = cleanUrl(raw, getMode());
      urlOutput.value = result.cleaned;
      setButtonsEnabled(true);
      setMeta(result.removed, result.kept, getMode());
    } catch (_) {
      urlOutput.value = "";
      setButtonsEnabled(false);
      cleanMeta.textContent = TEXT.invalid;
    }
  }

  async function copyCleaned() {
    const value = urlOutput.value.trim();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      cleanMeta.textContent = TEXT.copied;
    } catch (_) {
      // Legacy fallback
      urlOutput.focus();
      urlOutput.select();
      document.execCommand("copy");
      cleanMeta.textContent = TEXT.copied;
    }
  }

  async function shareCleaned() {
    const value = urlOutput.value.trim();
    if (!value) return;

    if (navigator.share) {
      try {
        await navigator.share({ url: value, title: "SafeShare" });
        return;
      } catch (_) {
        // user cancel or unavailable payload -> fallback copy
      }
    }

    await copyCleaned();
    cleanMeta.textContent = TEXT.sharedFallback;
  }

  function resetAll() {
    urlInput.value = "";
    urlOutput.value = "";
    setButtonsEnabled(false);
    setMeta([], [], getMode());
    urlInput.focus();
  }

  // Events
  cleanBtn.addEventListener("click", runClean);
  copyBtn.addEventListener("click", copyCleaned);
  shareBtn.addEventListener("click", shareCleaned);
  resetBtn.addEventListener("click", resetAll);

  urlInput.addEventListener("keydown", (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") {
      runClean();
    }
  });

  document.querySelectorAll('input[name="mode"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (urlInput.value.trim()) runClean();
      else setMeta([], [], getMode());
    });
  });

  // Init
  setButtonsEnabled(false);
  setMeta([], [], getMode());
})();
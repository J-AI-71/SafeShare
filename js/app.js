// File: /js/app.js
// SafeShare App SINGLE-FILE fallback v2026-02-10-02
(() => {
  "use strict";

  // ---------- Rules ----------
  const GLOBAL_DROP_EXACT = new Set([
    "fbclid", "gclid", "dclid", "msclkid", "mc_eid", "igshid", "si",
    "_hsenc", "_hsmi", "vero_id", "wickedid", "yclid", "ref", "ref_src"
  ]);

  const GLOBAL_DROP_PREFIX = ["utm_"];

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
    }
  };

  function normalizeHost(hostname) {
    return hostname.toLowerCase().replace(/^m\./, "");
  }

  function shouldDropGlobal(keyLower) {
    if (GLOBAL_DROP_EXACT.has(keyLower)) return true;
    for (const p of GLOBAL_DROP_PREFIX) {
      if (keyLower.startsWith(p)) return true;
    }
    return false;
  }

  function getHostRule(hostname) {
    return HOST_RULES[normalizeHost(hostname)] || null;
  }

  function cleanUrl(input, mode) {
    let parsed;
    try {
      parsed = new URL(input);
    } catch {
      parsed = new URL("https://" + input);
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

  // ---------- UI ----------
  const $ = (s) => document.querySelector(s);

  const urlInput = $("#urlInput");
  const urlOutput = $("#urlOutput");
  const cleanBtn = $("#cleanBtn");
  const copyBtn = $("#copyBtn");
  const shareBtn = $("#shareBtn");
  const resetBtn = $("#resetBtn");
  const cleanMeta = $("#cleanMeta");

  if (!urlInput || !urlOutput || !cleanBtn || !copyBtn || !shareBtn || !resetBtn || !cleanMeta) {
    return; // avoid hard crash if markup differs
  }

  function selectedMode() {
    return document.querySelector('input[name="mode"]:checked')?.value || "standard";
  }

  function setButtonsEnabled(hasOutput) {
    copyBtn.disabled = !hasOutput;
    shareBtn.disabled = !hasOutput;
  }

  function setMeta(removed, kept, mode) {
    const lang = document.documentElement.lang || "de";
    if (lang === "en") {
      const r = removed.length ? removed.join(", ") : "–";
      const k = kept.length ? kept.join(", ") : "–";
      const m = mode === "strict"
        ? "Strict mode active (may change destination behavior)."
        : "Standard mode active (tracking-light, target-stable).";
      cleanMeta.textContent = `Removed: ${r} • Kept: ${k} • ${m}`;
    } else {
      const r = removed.length ? removed.join(", ") : "–";
      const k = kept.length ? kept.join(", ") : "–";
      const m = mode === "strict"
        ? "Strikt-Modus aktiv (kann Zielverhalten ändern)."
        : "Standard-Modus aktiv (trackingarm, zielstabil).";
      cleanMeta.textContent = `Entfernt: ${r} • Behalten: ${k} • ${m}`;
    }
  }

  function handleClean() {
    const raw = urlInput.value.trim();
    if (!raw) {
      urlOutput.value = "";
      setButtonsEnabled(false);
      setMeta([], [], selectedMode());
      return;
    }

    try {
      const result = cleanUrl(raw, selectedMode());
      urlOutput.value = result.cleaned;
      setButtonsEnabled(true);
      setMeta(result.removed, result.kept, selectedMode());
    } catch {
      const lang = document.documentElement.lang || "de";
      cleanMeta.textContent = lang === "en"
        ? "Invalid URL. Please check the link."
        : "Ungültiger Link. Bitte URL prüfen.";
      urlOutput.value = "";
      setButtonsEnabled(false);
    }
  }

  async function handleCopy() {
    const val = urlOutput.value.trim();
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      urlOutput.focus();
      urlOutput.select();
      document.execCommand("copy");
    }
  }

  async function handleShare() {
    const val = urlOutput.value.trim();
    if (!val) return;
    if (navigator.share) {
      try {
        await navigator.share({ url: val, title: "SafeShare" });
        return;
      } catch {}
    }
    await handleCopy();
  }

  function handleReset() {
    urlInput.value = "";
    urlOutput.value = "";
    setButtonsEnabled(false);
    setMeta([], [], selectedMode());
    urlInput.focus();
  }

  cleanBtn.addEventListener("click", handleClean);
  copyBtn.addEventListener("click", handleCopy);
  shareBtn.addEventListener("click", handleShare);
  resetBtn.addEventListener("click", handleReset);

  urlInput.addEventListener("keydown", (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") handleClean();
  });

  document.querySelectorAll('input[name="mode"]').forEach((el) => {
    el.addEventListener("change", () => {
      if (urlInput.value.trim()) handleClean();
      else setMeta([], [], selectedMode());
    });
  });

  setButtonsEnabled(false);
  setMeta([], [], selectedMode());
})();
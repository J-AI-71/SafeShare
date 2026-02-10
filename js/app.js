/* File: /js/app.js */
/* SafeShare App logic – Standard vs Strict */

(() => {
  "use strict";

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);

  const elInput = $("urlInput");
  const elOutput = $("urlOutput");
  const elMeta = $("cleanMeta");

  const btnClean = $("cleanBtn");
  const btnCopy = $("copyBtn");
  const btnShare = $("shareBtn");
  const btnReset = $("resetBtn");

  const modeRadios = () => Array.from(document.querySelectorAll('input[name="mode"]'));

  if (!elInput || !elOutput || !btnClean || !btnCopy || !btnShare || !btnReset) {
    // Seite nicht vollständig vorhanden -> still beenden
    return;
  }

  // ---------- Parameterlisten ----------
  // Immer entfernen (klarer Tracking-Müll)
  const ALWAYS_REMOVE = new Set([
    "fbclid", "gclid", "dclid", "gbraid", "wbraid", "msclkid",
    "mc_cid", "mc_eid", "_hsenc", "_hsmi", "mkt_tok",
    "vero_id", "oly_anon_id", "oly_enc_id", "wickedid", "yclid"
  ]);

  // Prefixe, die immer raus sollen
  const ALWAYS_PREFIX = [
    "utm_",      // utm_source, utm_medium ...
    "pk_",       // Matomo Kampagnen-Parameter
    "mtm_"       // Matomo Tag Manager / Campaign
  ];

  // Standard-Modus: funktionale Keys je Host erhalten
  // (minimal, damit Zielstabilität hoch bleibt)
  const STANDARD_ALLOW_BY_HOST = [
    {
      host: /(^|\.)google\./i,
      keys: new Set([
        "q",       // Suchbegriff
        "kgmid",   // Knowledge graph entity
        "tbm",     // search type (images/news/...)
        "hl", "gl", "uule", "oq", "aq", "safe"
      ])
    },
    {
      host: /(^|\.)youtube\.com$/i,
      keys: new Set([
        "v", "list", "index", "t", "start"
      ])
    }
  ];

  // Strict-Modus: aggressiver -> nur sehr wenige funktionale Schlüssel pro Host
  const STRICT_ALLOW_BY_HOST = [
    {
      host: /(^|\.)google\./i,
      keys: new Set([
        "q" // absichtlich nur q, damit strict wirklich strenger ist
      ])
    },
    {
      host: /(^|\.)youtube\.com$/i,
      keys: new Set([
        "v" // nur Video-ID
      ])
    }
  ];

  // Globale "oft funktionale" Schlüssel (beide Modi)
  const GENERIC_FUNCTIONAL_KEYS = new Set([
    "id", "page", "lang", "hl", "ref", "sort", "filter", "query", "search"
  ]);

  // ---------- Helpers ----------
  function normalizeUrlInput(raw) {
    const s = (raw || "").trim();
    if (!s) return "";

    // Falls Nutzer ohne Schema einfügt
    if (!/^https?:\/\//i.test(s)) {
      return "https://" + s;
    }
    return s;
  }

  function getCurrentMode() {
    const checked = document.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : "standard";
  }

  function matchesPrefix(key, prefixes) {
    const k = key.toLowerCase();
    for (const p of prefixes) {
      if (k.startsWith(p)) return true;
    }
    return false;
  }

  function getHostAllowSet(hostname, mode) {
    const rules = mode === "strict" ? STRICT_ALLOW_BY_HOST : STANDARD_ALLOW_BY_HOST;
    for (const rule of rules) {
      if (rule.host.test(hostname)) return rule.keys;
    }
    return null;
  }

  function shouldRemoveKey({ key, hostname, mode, hostAllowSet }) {
    const k = key.toLowerCase();

    // Immer raus
    if (ALWAYS_REMOVE.has(k)) return true;
    if (matchesPrefix(k, ALWAYS_PREFIX)) return true;

    // Host-spezifische Regeln
    if (hostAllowSet) {
      // in Host-Regel enthalten -> behalten
      if (hostAllowSet.has(k)) return false;

      // strict: alles andere auf diesem Host raus
      if (mode === "strict") return true;

      // standard: auf bekannten Hosts generische funktionale keys behalten
      if (GENERIC_FUNCTIONAL_KEYS.has(k)) return false;

      // standard: unbekannte keys eher raus (tracking-arm)
      return true;
    }

    // Unbekannter Host:
    if (mode === "strict") {
      // strict auf unbekanntem Host: nur generische funktionale keys behalten
      return !GENERIC_FUNCTIONAL_KEYS.has(k);
    }

    // standard auf unbekanntem Host:
    // aggressive tracking keys raus, sonst behalten (zielstabil)
    return false;
  }

  function cleanUrl(rawUrl, mode = "standard") {
    const normalized = normalizeUrlInput(rawUrl);
    if (!normalized) {
      return {
        ok: false,
        error: "Bitte eine URL eingeben.",
        output: "",
        removed: [],
        kept: []
      };
    }

    let u;
    try {
      u = new URL(normalized);
    } catch {
      return {
        ok: false,
        error: "Ungültige URL. Bitte vollständigen Link einfügen.",
        output: "",
        removed: [],
        kept: []
      };
    }

    const hostAllowSet = getHostAllowSet(u.hostname, mode);

    const removed = [];
    const kept = [];

    // Iteration über Kopie, da wir löschen
    const entries = Array.from(u.searchParams.entries());
    for (const [key] of entries) {
      const remove = shouldRemoveKey({
        key,
        hostname: u.hostname,
        mode,
        hostAllowSet
      });

      if (remove) {
        removed.push(key);
        u.searchParams.delete(key);
      } else {
        kept.push(key);
      }
    }

    // Hash behalten
    const output = u.toString();

    return {
      ok: true,
      error: "",
      output,
      removed,
      kept
    };
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function updateMeta(removed, kept, mode, lang) {
    const r = removed.length ? uniq(removed).join(", ") : "–";
    const k = kept.length ? uniq(kept).join(", ") : "–";

    if (lang === "en") {
      const modeTxt = mode === "strict"
        ? "Strict mode active (more aggressive, may change destination behavior)."
        : "Standard mode active (tracking-light, destination-stable).";
      elMeta.textContent = `Removed: ${r} • Kept: ${k} • ${modeTxt}`;
    } else {
      const modeTxt = mode === "strict"
        ? "Strikt-Modus aktiv (aggressiver, kann Zielverhalten ändern)."
        : "Standard-Modus aktiv (trackingarm, zielstabil).";
      elMeta.textContent = `Entfernt: ${r} • Behalten: ${k} • ${modeTxt}`;
    }
  }

  async function doCopy() {
    const txt = elOutput.value.trim();
    if (!txt) return;
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      // Fallback
      elOutput.focus();
      elOutput.select();
      document.execCommand("copy");
    }
  }

  async function doShare() {
    const txt = elOutput.value.trim();
    if (!txt) return;
    if (navigator.share) {
      try {
        await navigator.share({ url: txt, text: txt });
      } catch {
        // user canceled -> ignore
      }
    } else {
      await doCopy();
    }
  }

  function doReset() {
    elInput.value = "";
    elOutput.value = "";
    btnCopy.disabled = true;
    btnShare.disabled = true;

    const lang = (document.body.dataset.lang || "de").toLowerCase();
    if (lang === "en") {
      elMeta.textContent = "Removed: – • Kept: – • Standard mode active (tracking-light, target-stable).";
    } else {
      elMeta.textContent = "Entfernt: – • Behalten: – • Standard-Modus aktiv (trackingarm, zielstabil).";
    }

    // auf Standard zurück
    const standard = document.querySelector('input[name="mode"][value="standard"]');
    if (standard) standard.checked = true;
  }

  function doClean() {
    const mode = getCurrentMode(); // <- wichtig
    const lang = (document.body.dataset.lang || "de").toLowerCase();

    const result = cleanUrl(elInput.value, mode);

    if (!result.ok) {
      elOutput.value = "";
      btnCopy.disabled = true;
      btnShare.disabled = true;
      elMeta.textContent = result.error;
      return;
    }

    elOutput.value = result.output;
    btnCopy.disabled = !result.output;
    btnShare.disabled = !result.output;
    updateMeta(result.removed, result.kept, mode, lang);
  }

  // ---------- Events ----------
  btnClean.addEventListener("click", doClean);
  btnCopy.addEventListener("click", doCopy);
  btnShare.addEventListener("click", doShare);
  btnReset.addEventListener("click", doReset);

  // Sofort neu berechnen, wenn Modus geändert wird und Input vorhanden ist
  modeRadios().forEach(r => {
    r.addEventListener("change", () => {
      if (elInput.value.trim()) doClean();
    });
  });

  // Enter/ctrl+enter optional
  elInput.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      doClean();
    }
  });
})();
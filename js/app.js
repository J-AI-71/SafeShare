/* File: /js/app.js */
/* SafeShare App controller – i18n text matrix (DE/EN), Master-Flow strict */

(() => {
  "use strict";

  const DOC = document;
  const WIN = window;

  const $ = (id) => DOC.getElementById(id);

  const elInput = $("urlInput");
  const elOutput = $("urlOutput");
  const elMeta = $("cleanMeta");

  const btnClean = $("cleanBtn");
  const btnCopy = $("copyBtn");
  const btnShare = $("shareBtn");
  const btnReset = $("resetBtn");

  const nudgeWrap = $("postCleanNudge");
  const nudgeCloseBtn = $("nudgeCloseBtn");
  const nudgeCompareBtn = $("nudgeCompareBtn");
  const proNudgeInline = $("postCleanProNudge");

  if (!elInput || !elOutput || !elMeta || !btnClean || !btnCopy || !btnShare || !btnReset) {
    console.error("[app] Missing required DOM nodes.");
    return;
  }

  /* =========================
     1) Language + Text matrix
     ========================= */
  const LANG = ((DOC.documentElement.lang || DOC.body?.dataset?.lang || "de").toLowerCase().startsWith("en"))
    ? "en"
    : "de";

  const I18N = {
    de: {
      buttons: {
        clean: "Bereinigen",
        copy: "Kopieren",
        copied: "Kopiert",
        share: "Teilen",
        reset: "Zurücksetzen"
      },
      mode: {
        standard: "Standard-Modus aktiv (trackingarm, zielstabil).",
        strict: "Strikt-Modus aktiv (kann Zielverhalten ändern)."
      },
      meta: {
        removed: "Entfernt",
        kept: "Behalten",
        none: "–"
      },
      status: {
        emptyInput: "Bitte zuerst eine URL eingeben.",
        invalidUrl: "Ungültige URL. Bitte vollständige URL eingeben (inkl. http/https).",
        noChanges: "Keine typischen Tracking-Parameter gefunden.",
        cleanedOk: "Link bereinigt.",
        copiedOk: "Bereinigte URL kopiert.",
        copiedFail: "Kopieren nicht möglich. Bitte manuell kopieren.",
        shareNoData: "Nichts zum Teilen vorhanden.",
        shareFail: "Teilen nicht verfügbar. Bitte kopieren und manuell teilen.",
        resetDone: "Zurückgesetzt."
      },
      labels: {
        nudgeCompare: "Pro vergleichen",
        nudgeLater: "Später"
      }
    },
    en: {
      buttons: {
        clean: "Clean",
        copy: "Copy",
        copied: "Copied",
        share: "Share",
        reset: "Reset"
      },
      mode: {
        standard: "Standard mode active (tracking-reduced, destination-stable).",
        strict: "Strict mode active (can change destination behavior)."
      },
      meta: {
        removed: "Removed",
        kept: "Kept",
        none: "–"
      },
      status: {
        emptyInput: "Please enter a URL first.",
        invalidUrl: "Invalid URL. Please enter a full URL (including http/https).",
        noChanges: "No common tracking parameters found.",
        cleanedOk: "Link cleaned.",
        copiedOk: "Cleaned URL copied.",
        copiedFail: "Copy not available. Please copy manually.",
        shareNoData: "Nothing to share yet.",
        shareFail: "Share not available. Please copy and share manually.",
        resetDone: "Reset complete."
      },
      labels: {
        nudgeCompare: "Compare Pro",
        nudgeLater: "Later"
      }
    }
  };

  const T = I18N[LANG];

  // Apply button labels once (safe even if already translated in HTML)
  btnClean.textContent = T.buttons.clean;
  btnCopy.textContent = T.buttons.copy;
  btnShare.textContent = T.buttons.share;
  btnReset.textContent = T.buttons.reset;
  if (nudgeCloseBtn) nudgeCloseBtn.textContent = T.labels.nudgeLater;
  if (nudgeCompareBtn) nudgeCompareBtn.textContent = T.labels.nudgeCompare;

  /* ==================================
     2) URL cleaning logic (standard/strict)
     ================================== */

  // If ss-rules.js exposes lists, use them; fallback otherwise
  const DEFAULT_DROP_EXACT = new Set([
    "fbclid", "gclid", "dclid", "msclkid", "ttclid", "li_fat_id", "mc_cid", "mc_eid",
    "igshid", "yclid", "gbraid", "wbraid", "_hsenc", "_hsmi", "mkt_tok"
  ]);

  const DEFAULT_DROP_PREFIX = [
    "utm_",
    "vero_",
    "oly_",
    "wickedid",
    "hsa_"
  ];

  const DEFAULT_KEEP_EXACT = new Set([
    "q", "query", "search", "s", "p", "id", "article", "story", "v", "t", "lang", "locale", "ref"
  ]);

  function getRules() {
    const ext = WIN.SS_RULES || {};
    const dropExact = new Set(
      Array.isArray(ext.dropExact) ? ext.dropExact.map(x => String(x).toLowerCase()) : [...DEFAULT_DROP_EXACT]
    );
    const dropPrefix = Array.isArray(ext.dropPrefix)
      ? ext.dropPrefix.map(x => String(x).toLowerCase())
      : [...DEFAULT_DROP_PREFIX];

    const keepExact = new Set(
      Array.isArray(ext.keepExact) ? ext.keepExact.map(x => String(x).toLowerCase()) : [...DEFAULT_KEEP_EXACT]
    );

    return { dropExact, dropPrefix, keepExact };
  }

  function currentMode() {
    const checked = DOC.querySelector('input[name="cleanMode"]:checked');
    return checked ? checked.value : "standard";
  }

  function shouldDropParam(paramName, mode, rules) {
    const key = String(paramName || "").toLowerCase();

    // strict: drop any tracking-like key + rule matches
    if (mode === "strict") {
      if (rules.dropExact.has(key)) return true;
      if (rules.dropPrefix.some(pref => key.startsWith(pref))) return true;

      // broad strict heuristics
      if (
        key.includes("utm") ||
        key.includes("clid") ||
        key.includes("fb_") ||
        key.includes("ga_") ||
        key.includes("gbraid") ||
        key.includes("wbraid")
      ) return true;

      return false;
    }

    // standard: keep destination-relevant keys if known, drop known tracking
    if (rules.keepExact.has(key)) return false;
    if (rules.dropExact.has(key)) return true;
    if (rules.dropPrefix.some(pref => key.startsWith(pref))) return true;
    return false;
  }

  function normalizeUrl(raw) {
    const text = String(raw || "").trim();
    if (!text) return null;
    try {
      return new URL(text);
    } catch {
      // try add https for user convenience
      try {
        return new URL(`https://${text}`);
      } catch {
        return null;
      }
    }
  }

  function cleanUrl(raw, mode) {
    const url = normalizeUrl(raw);
    if (!url) {
      return { ok: false, reason: "invalid", output: "", removed: [], kept: [] };
    }

    const rules = getRules();
    const params = new URLSearchParams(url.search);
    if (!params.toString()) {
      return { ok: true, output: url.toString(), removed: [], kept: [], unchanged: true };
    }

    const removed = [];
    const kept = [];

    // iterate copy to avoid mutation side effects
    const entries = [...params.entries()];
    const next = new URLSearchParams();

    for (const [k, v] of entries) {
      if (shouldDropParam(k, mode, rules)) {
        removed.push(k);
      } else {
        kept.push(k);
        next.append(k, v);
      }
    }

    url.search = next.toString();

    return {
      ok: true,
      output: url.toString(),
      removed,
      kept,
      unchanged: removed.length === 0
    };
  }

  /* =========================
     3) UI helpers
     ========================= */

  function uniq(arr) {
    return [...new Set(arr)];
  }

  function renderMeta(removed, kept, mode) {
    const r = uniq(removed);
    const k = uniq(kept);

    const removedTxt = r.length ? r.join(", ") : T.meta.none;
    const keptTxt = k.length ? k.join(", ") : T.meta.none;
    const modeTxt = mode === "strict" ? T.mode.strict : T.mode.standard;

    elMeta.textContent = `${T.meta.removed}: ${removedTxt} • ${T.meta.kept}: ${keptTxt} • ${modeTxt}`;
  }

  function setStatus(text) {
    // keeps one consistent feedback channel
    elMeta.dataset.status = text;
  }

  function showProNudge(show) {
    if (proNudgeInline) proNudgeInline.hidden = !show;
    if (nudgeWrap) nudgeWrap.hidden = !show;
  }

  function track(eventName, payload = {}) {
    if (typeof WIN.ssTrack === "function") {
      WIN.ssTrack(eventName, payload);
    }
  }

  /* =========================
     4) Actions
     ========================= */

  function onClean() {
    const raw = elInput.value.trim();
    const mode = currentMode();

    if (!raw) {
      setStatus(T.status.emptyInput);
      renderMeta([], [], mode);
      elOutput.value = "";
      showProNudge(false);
      track("ss_clean_attempt", { result: "empty_input", mode });
      return;
    }

    const res = cleanUrl(raw, mode);
    if (!res.ok) {
      setStatus(T.status.invalidUrl);
      renderMeta([], [], mode);
      elOutput.value = "";
      showProNudge(false);
      track("ss_clean_attempt", { result: "invalid_url", mode });
      return;
    }

    elOutput.value = res.output;
    renderMeta(res.removed, res.kept, mode);

    if (res.unchanged) {
      setStatus(T.status.noChanges);
      showProNudge(false);
      track("ss_clean_attempt", { result: "unchanged", mode });
    } else {
      setStatus(T.status.cleanedOk);
      showProNudge(true);
      track("ss_clean_attempt", {
        result: "cleaned",
        mode,
        removed_count: uniq(res.removed).length,
        kept_count: uniq(res.kept).length
      });
    }
  }

  async function onCopy() {
    const value = elOutput.value.trim();
    if (!value) {
      setStatus(T.status.shareNoData);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      const old = btnCopy.textContent;
      btnCopy.textContent = T.buttons.copied;
      setTimeout(() => { btnCopy.textContent = old || T.buttons.copy; }, 1200);
      setStatus(T.status.copiedOk);
      track("ss_copy", { source: "copy_button" });
    } catch {
      // fallback
      elOutput.focus();
      elOutput.select();
      const ok = DOC.execCommand && DOC.execCommand("copy");
      if (ok) {
        setStatus(T.status.copiedOk);
        track("ss_copy", { source: "copy_button_fallback" });
      } else {
        setStatus(T.status.copiedFail);
      }
    }
  }

  async function onShare() {
    const value = elOutput.value.trim();
    if (!value) {
      setStatus(T.status.shareNoData);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ url: value });
        track("ss_share", { source: "share_button" });
        return;
      } catch {
        // user cancel or unavailable path: continue fallback
      }
    }

    // fallback to copy
    try {
      await navigator.clipboard.writeText(value);
      setStatus(T.status.copiedOk);
      track("ss_share_fallback_copy", { source: "share_button" });
    } catch {
      setStatus(T.status.shareFail);
    }
  }

  function onReset() {
    elInput.value = "";
    elOutput.value = "";
    const mode = currentMode();
    renderMeta([], [], mode);
    setStatus(T.status.resetDone);
    showProNudge(false);
    track("ss_reset", { source: "reset_button" });
    elInput.focus();
  }

  /* =========================
     5) Bindings
     ========================= */

  btnClean.addEventListener("click", onClean);
  btnCopy.addEventListener("click", onCopy);
  btnShare.addEventListener("click", onShare);
  btnReset.addEventListener("click", onReset);

  DOC.querySelectorAll('input[name="cleanMode"]').forEach((el) => {
    el.addEventListener("change", () => {
      const mode = currentMode();
      // re-render current meta line with new mode text only
      const current = elMeta.textContent || "";
      if (!current.trim()) renderMeta([], [], mode);
      else {
        // keep counts from output state by re-cleaning if input exists
        const raw = elInput.value.trim();
        if (!raw) renderMeta([], [], mode);
        else {
          const res = cleanUrl(raw, mode);
          if (res.ok) renderMeta(res.removed, res.kept, mode);
          else renderMeta([], [], mode);
        }
      }
      track("ss_mode_change", { mode });
    });
  });

  if (nudgeCloseBtn) {
    nudgeCloseBtn.addEventListener("click", () => {
      showProNudge(false);
      track("ss_nudge_close", { source: "post_clean_nudge" });
    });
  }

  // Enter/Cmd+Enter convenience
  elInput.addEventListener("keydown", (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") {
      ev.preventDefault();
      onClean();
    }
  });

  // Initial state
  renderMeta([], [], currentMode());
})();

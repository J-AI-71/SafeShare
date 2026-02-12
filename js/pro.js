/* File: /js/pro.js */
/* SafeShare Pro controller + GTM events v2026-02-11-03
   - Event-Schema identisch zu app.js
   - DE/EN Meta-Texte lokalisiert
   - robust für optionale Pro-UI (falls einige Elemente fehlen)
*/

(() => {
  "use strict";

  /* =========================
     GTM / dataLayer helper
     ========================= */
  window.dataLayer = window.dataLayer || [];

  function pushDL(eventName, payload = {}) {
    window.dataLayer.push({
      event: eventName,
      lang: (document.documentElement.lang || document.body?.dataset?.lang || "de").toLowerCase(),
      page_type: document.body?.dataset?.pageType || document.body?.dataset?.page || "pro",
      source: "safeshare_web",
      ...payload
    });
  }

  /* =========================
     DOM helpers
     ========================= */
  const $ = (id) => document.getElementById(id);

  // Core IDs (gleiches Schema wie app.js)
  const elInput = $("urlInput");
  const elOutput = $("urlOutput");
  const elMeta = $("cleanMeta");

  const btnClean = $("cleanBtn");
  const btnCopy = $("copyBtn");
  const btnShare = $("shareBtn");
  const btnReset = $("resetBtn");

  // Optional mode controls
  const modeInputs = Array.from(document.querySelectorAll('input[name="cleanMode"]'));
  const modeSelect = $("cleanMode");
  const btnModeStandard = $("modeStandardBtn");
  const btnModeStrict = $("modeStrictBtn");

  // Optional nudge/upsell (kann in Pro fehlen, wird dann ignoriert)
  const nudge = $("postCleanNudge");
  const nudgeCloseBtn = $("nudgeCloseBtn");
  const nudgeCompareBtn = $("nudgeCompareBtn");

  if (!elInput || !elOutput || !btnClean || !btnCopy || !btnShare || !btnReset) {
    console.warn("[SafeShare Pro] Required DOM elements missing.");
    return;
  }

  /* =========================
     i18n
     ========================= */
  const isEN = String(document.documentElement.lang || document.body?.dataset?.lang || "de")
    .toLowerCase()
    .startsWith("en");

  const T = isEN
    ? {
        pasteFirst: "Please paste a link first.",
        invalidUrl: "Invalid URL. Please check it.",
        noOutput: "No cleaned link yet.",
        copied: "Cleaned link copied.",
        copyFailed: "Copy failed.",
        shareNotSupported: "Sharing is not supported on this device.",
        modeStandard: "standard",
        modeStrict: "strict",
        removedPrefix: "Removed",
        noTracking: "No tracking parameters found.",
      }
    : {
        pasteFirst: "Bitte zuerst einen Link einfügen.",
        invalidUrl: "Ungültige URL. Bitte prüfen.",
        noOutput: "Noch kein bereinigter Link vorhanden.",
        copied: "Bereinigter Link kopiert.",
        copyFailed: "Kopieren fehlgeschlagen.",
        shareNotSupported: "Teilen wird auf diesem Gerät nicht unterstützt.",
        modeStandard: "standard",
        modeStrict: "strict",
        removedPrefix: "Entfernt",
        noTracking: "Keine Tracking-Parameter gefunden.",
      };

  /* =========================
     URL cleaning logic
     ========================= */

  // Standard tracker keys
  const DROP_KEYS_EXACT_STANDARD = new Set([
    "fbclid",
    "gclid",
    "dclid",
    "gbraid",
    "wbraid",
    "mc_cid",
    "mc_eid",
    "igshid",
    "mkt_tok",
    "vero_id",
    "oly_anon_id",
    "oly_enc_id",
    "_hsenc",
    "_hsmi",
    "si",
    "spm",
    "yclid",
    "rb_clickid",
    "s_cid"
  ]);

  // Strict extra keys
  const DROP_KEYS_EXACT_STRICT_EXTRA = new Set([
    "ref",
    "ref_src",
    "ref_url",
    "src",
    "source",
    "campaign",
    "campaign_id",
    "cmpid",
    "cmp",
    "cid",
    "trk",
    "tracking_id",
    "pk_campaign",
    "pk_kwd",
    "mtm_campaign",
    "mtm_source",
    "mtm_medium",
    "mtm_content",
    "mtm_keyword",
    "ga_source",
    "ga_medium",
    "ga_term",
    "ga_content",
    "ga_campaign"
  ]);

  const DROP_PREFIXES_STANDARD = ["utm_"];
  const DROP_PREFIXES_STRICT_EXTRA = ["mtm_", "pk_"];

  function getCurrentMode() {
    if (modeInputs.length) {
      const checked = modeInputs.find((el) => el.checked);
      if (checked?.value) return checked.value === "strict" ? "strict" : "standard";
    }
    if (modeSelect?.value) {
      return modeSelect.value === "strict" ? "strict" : "standard";
    }
    const dsMode = document.body?.dataset?.cleanMode;
    if (dsMode) return dsMode === "strict" ? "strict" : "standard";
    return "standard";
  }

  function shouldDropParam(key, mode = "standard") {
    const k = String(key || "").toLowerCase();

    if (DROP_KEYS_EXACT_STANDARD.has(k)) return true;
    if (DROP_PREFIXES_STANDARD.some((p) => k.startsWith(p))) return true;

    if (mode === "strict") {
      if (DROP_KEYS_EXACT_STRICT_EXTRA.has(k)) return true;
      if (DROP_PREFIXES_STRICT_EXTRA.some((p) => k.startsWith(p))) return true;
    }
    return false;
  }

  function parseUrl(raw) {
    if (!raw) return null;
    const input = raw.trim();

    try {
      return new URL(input);
    } catch {
      try {
        return new URL(`https://${input}`);
      } catch {
        return null;
      }
    }
  }

  function cleanUrl(rawUrl, options = {}) {
    const mode = options.mode === "strict" ? "strict" : "standard";
    const u = parseUrl(rawUrl);

    if (!u) {
      return {
        ok: false,
        cleanedUrl: "",
        removedCount: 0,
        removedKeys: [],
        mode,
        error: "invalid_url"
      };
    }

    const removedKeys = [];
    const keys = [...u.searchParams.keys()];

    for (const key of keys) {
      if (shouldDropParam(key, mode)) {
        removedKeys.push(key);
        u.searchParams.delete(key);
      }
    }

    return {
      ok: true,
      cleanedUrl: u.toString(),
      removedCount: removedKeys.length,
      removedKeys,
      mode
    };
  }

  /* =========================
     Nudge tracking helpers
     ========================= */
  function trackNudgeViewOnce() {
    // eigener key für Pro, damit App/Pro Sessions getrennt sind
    const key = "ss_nudge_view_sent_compare_pro_propage";
    if (sessionStorage.getItem(key)) return;

    pushDL("ss_nudge_view", {
      nudge_id: "compare_pro",
      placement: "post_clean"
    });

    sessionStorage.setItem(key, "1");
  }

  function showNudgeIfAvailable() {
    if (!nudge) return;
    nudge.hidden = false;
    trackNudgeViewOnce();
  }

  function hideNudgeIfAvailable() {
    if (!nudge) return;
    nudge.hidden = true;
  }

  /* =========================
     UI state
     ========================= */
  function setMeta(text) {
    if (elMeta) elMeta.textContent = text || "";
  }

  function setOutputState(hasOutput) {
    btnCopy.disabled = !hasOutput;
    btnShare.disabled = !hasOutput;
    btnCopy.setAttribute("aria-disabled", String(!hasOutput));
    btnShare.setAttribute("aria-disabled", String(!hasOutput));
  }

  function initialState() {
    setOutputState(false);
    hideNudgeIfAvailable();
  }

  function renderCleanResult(res, original) {
    if (!res.ok) {
      setMeta(T.invalidUrl);
      setOutputState(false);
      return false;
    }

    elOutput.value = res.cleanedUrl;
    const modeLabel = res.mode === "strict" ? T.modeStrict : T.modeStandard;

    if (res.removedCount > 0) {
      setMeta(`[${modeLabel}] ${T.removedPrefix}: ${res.removedCount} (${res.removedKeys.join(", ")})`);
    } else {
      setMeta(`[${modeLabel}] ${T.noTracking}`);
    }

    setOutputState(Boolean(res.cleanedUrl));

    pushDL("ss_clean_success", {
      cleaned: true,
      mode: res.mode,
      had_tracking_params: res.removedCount > 0,
      removed_count: res.removedCount,
      output_length: res.cleanedUrl.length,
      input_length: (original || "").length
    });

    showNudgeIfAvailable();
    return true;
  }

  function runCleanFromInput() {
    const original = (elInput.value || "").trim();
    if (!original) {
      setMeta(T.pasteFirst);
      setOutputState(false);
      return false;
    }

    const mode = getCurrentMode();
    const res = cleanUrl(original, { mode });
    return renderCleanResult(res, original);
  }

  function recleanOnModeChange() {
    const original = (elInput.value || "").trim();
    if (!original) return;
    runCleanFromInput();
  }

  /* =========================
     Bind events
     ========================= */

  btnClean.addEventListener("click", () => {
    runCleanFromInput();
  });

  elInput.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runCleanFromInput();
    }
  });

  modeInputs.forEach((el) => el.addEventListener("change", recleanOnModeChange));
  modeSelect?.addEventListener("change", recleanOnModeChange);

  btnModeStandard?.addEventListener("click", () => {
    document.body.dataset.cleanMode = "standard";
    recleanOnModeChange();
  });

  btnModeStrict?.addEventListener("click", () => {
    document.body.dataset.cleanMode = "strict";
    recleanOnModeChange();
  });

  btnCopy.addEventListener("click", async () => {
    const out = (elOutput.value || "").trim();
    if (!out) {
      setMeta(T.noOutput);
      return;
    }

    try {
      await navigator.clipboard.writeText(out);
      setMeta(T.copied);

      pushDL("ss_copy_click", {
        action: "copy_clean_url",
        has_output: true,
        mode: getCurrentMode()
      });
    } catch (err) {
      console.error(err);
      setMeta(T.copyFailed);
    }
  });

  btnShare.addEventListener("click", async () => {
    const out = (elOutput.value || "").trim();
    if (!out) {
      setMeta(T.noOutput);
      return;
    }

    if (!navigator.share) {
      setMeta(T.shareNotSupported);
      return;
    }

    try {
      await navigator.share({ url: out });

      pushDL("ss_share_click", {
        action: "share_clean_url",
        has_output: true,
        share_supported: true,
        mode: getCurrentMode()
      });
    } catch (err) {
      console.debug("[SafeShare Pro] Share canceled/failed:", err);
    }
  });

  btnReset.addEventListener("click", () => {
    elInput.value = "";
    elOutput.value = "";
    setMeta("");
    hideNudgeIfAvailable();
    setOutputState(false);

    pushDL("ss_reset_click", {
      action: "reset_fields"
    });
  });

  nudgeCloseBtn?.addEventListener("click", () => {
    hideNudgeIfAvailable();

    pushDL("ss_nudge_dismiss", {
      nudge_id: "compare_pro",
      placement: "post_clean"
    });
  });

  nudgeCompareBtn?.addEventListener("click", () => {
    pushDL("ss_nudge_click_compare_pro", {
      action: "nudge_compare_pro_click",
      nudge_id: "compare_pro",
      placement: "post_clean"
    });
  });

  initialState();
})();

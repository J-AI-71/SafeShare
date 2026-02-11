/* File: /js/app.js */
/* SafeShare App controller + GTM events v2026-02-11-03 */

(() => {
  "use strict";

  /* =========================
     GTM / dataLayer helper
     ========================= */
  window.dataLayer = window.dataLayer || [];

  /**
   * Push event to GTM dataLayer
   * @param {string} eventName
   * @param {Record<string, any>} payload
   */
  function pushDL(eventName, payload = {}) {
    window.dataLayer.push({
      event: eventName,
      lang: document.documentElement.lang || "de",
      page_type: document.body?.dataset?.pageType || "app",
      source: "safeshare_web",
      ...payload
    });
  }

  /* =========================
     DOM helpers
     ========================= */
  const $ = (id) => document.getElementById(id);

  const elInput = $("urlInput");
  const elOutput = $("urlOutput");
  const elMeta = $("cleanMeta");

  const btnClean = $("cleanBtn");
  const btnCopy = $("copyBtn");
  const btnShare = $("shareBtn");
  const btnReset = $("resetBtn");

  // Optional nudge elements (falls vorhanden)
  const nudge = $("postCleanNudge");
  const nudgeCloseBtn = $("nudgeCloseBtn");
  const nudgeCompareBtn = $("nudgeCompareBtn");

  // Optional mode controls (radio/select/buttons)
  // Erwartet bevorzugt Radios: <input type="radio" name="cleanMode" value="standard|strict">
  const modeInputs = Array.from(document.querySelectorAll('input[name="cleanMode"]'));
  const modeSelect = $("cleanMode");
  const btnModeStandard = $("modeStandardBtn");
  const btnModeStrict = $("modeStrictBtn");

  if (!elInput || !elOutput || !btnClean || !btnCopy || !btnShare || !btnReset) {
    console.warn("[SafeShare] Required DOM elements missing.");
    return;
  }

  /* =========================
     URL cleaning logic
     ========================= */

  // Standard: klare Tracker
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

  // Strict: Standard + zusätzliche häufige Kampagnen-/Ref-Parameter
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
    // 1) Radio group
    if (modeInputs.length) {
      const checked = modeInputs.find((el) => el.checked);
      if (checked?.value) return checked.value === "strict" ? "strict" : "standard";
    }

    // 2) Select
    if (modeSelect && modeSelect.value) {
      return modeSelect.value === "strict" ? "strict" : "standard";
    }

    // 3) Fallback via body dataset (optional)
    const dsMode = document.body?.dataset?.cleanMode;
    if (dsMode) return dsMode === "strict" ? "strict" : "standard";

    // default
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

  /**
   * Safely parses URL. Adds https:// fallback when user enters bare domain.
   * @param {string} raw
   * @returns {URL|null}
   */
  function parseUrl(raw) {
    if (!raw) return null;
    const input = raw.trim();

    try {
      return new URL(input);
    } catch {
      // Fallback: try with https://
      try {
        return new URL(`https://${input}`);
      } catch {
        return null;
      }
    }
  }

  /**
   * Clean URL parameters
   * @param {string} rawUrl
   * @param {{mode?: "standard"|"strict"}} options
   * @returns {{
   *   ok: boolean,
   *   cleanedUrl: string,
   *   removedCount: number,
   *   removedKeys: string[],
   *   mode: "standard"|"strict",
   *   error?: string
   * }}
   */
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
        error: "Ungültige URL"
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
    const key = "ss_nudge_view_sent_compare_pro";
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
     Copy/Share robustness (iOS-safe)
     ========================= */

  function fallbackCopyText(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);

    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }

    document.body.removeChild(ta);
    return ok;
  }

  async function robustCopy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fallback below
      }
    }
    return fallbackCopyText(text);
  }

  async function robustShare(url) {
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return { ok: true, method: "native_share" };
      } catch (err) {
        // user canceled or blocked share
        if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) {
          return { ok: false, canceled: true, method: "native_share" };
        }
        // if share fails for other reasons, continue with copy fallback
      }
    }

    const copied = await robustCopy(url);
    if (copied) return { ok: true, method: "copy_fallback" };

    return { ok: false, method: "none" };
  }

  /* =========================
     UI actions
     ========================= */

  function setMeta(text) {
    if (!elMeta) return;
    elMeta.textContent = text || "";
  }

  function renderCleanResult(res, original) {
    if (!res.ok) {
      setMeta("Ungültige URL. Bitte prüfen.");
      return false;
    }

    elOutput.value = res.cleanedUrl;
    setMeta(
      res.removedCount > 0
        ? `[${res.mode}] Entfernt: ${res.removedCount} Parameter (${res.removedKeys.join(", ")})`
        : `[${res.mode}] Keine Tracking-Parameter gefunden.`
    );

    // ===== GTM EVENT: clean success =====
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
      setMeta("Bitte zuerst einen Link einfügen.");
      return false;
    }

    const mode = getCurrentMode();
    const res = cleanUrl(original, { mode });
    return renderCleanResult(res, original);
  }

  function recleanOnModeChange() {
    const original = (elInput.value || "").trim();
    if (!original) return; // kein Neu-Einfügen nötig
    runCleanFromInput();
  }

  btnClean.addEventListener("click", () => {
    runCleanFromInput();
  });

  // Re-clean when mode changes (radio/select/buttons)
  modeInputs.forEach((el) => {
    el.addEventListener("change", recleanOnModeChange);
  });

  if (modeSelect) {
    modeSelect.addEventListener("change", recleanOnModeChange);
  }

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
      setMeta("Noch kein bereinigter Link vorhanden.");
      return;
    }

    const ok = await robustCopy(out);

    if (ok) {
      setMeta("Bereinigter Link kopiert.");
      pushDL("ss_nudge_click_compare_p", {
        action: "copy_clean_url",
        has_output: true,
        mode: getCurrentMode()
      });
    } else {
      setMeta("Kopieren fehlgeschlagen. Bitte manuell kopieren.");
    }
  });

  btnShare.addEventListener("click", async () => {
    const out = (elOutput.value || "").trim();
    if (!out) {
      setMeta("Noch kein bereinigter Link vorhanden.");
      return;
    }

    const res = await robustShare(out);

    if (res.ok) {
      if (res.method === "native_share") {
        setMeta("Teilen geöffnet.");
      } else {
        setMeta("Teilen nicht verfügbar – Link wurde kopiert.");
      }

      pushDL("ss_nudge_click_compare_p", {
        action: res.method === "native_share" ? "share_clean_url" : "share_copy_fallback",
        share_supported: !!navigator.share,
        has_output: true,
        mode: getCurrentMode()
      });
    } else if (!res.canceled) {
      setMeta("Teilen nicht verfügbar.");
    }
  });

  btnReset.addEventListener("click", () => {
    elInput.value = "";
    elOutput.value = "";
    setMeta("");
    hideNudgeIfAvailable();
  });

  // Nudge dismiss event
  nudgeCloseBtn?.addEventListener("click", () => {
    hideNudgeIfAvailable();
    pushDL("ss_nudge_dismiss", {
      nudge_id: "compare_pro",
      placement: "post_clean"
    });
  });

  // Nudge CTA click event (compare pro)
  nudgeCompareBtn?.addEventListener("click", () => {
    pushDL("ss_nudge_click_compare_p", {
      action: "nudge_compare_pro_click",
      nudge_id: "compare_pro",
      placement: "post_clean"
    });
  });
})();

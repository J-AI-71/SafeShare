/* File: /js/app.js */
/* SafeShare App controller + GTM events v2026-02-11-01 */

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

  if (!elInput || !elOutput || !btnClean || !btnCopy || !btnShare || !btnReset) {
    console.warn("[SafeShare] Required DOM elements missing.");
    return;
  }

  /* =========================
     URL cleaning logic
     ========================= */

  // Tracking keys/prefixes you want to remove
  const DROP_KEYS_EXACT = new Set([
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

  const DROP_PREFIXES = [
    "utm_"
  ];

  function shouldDropParam(key) {
    const k = String(key || "").toLowerCase();
    if (DROP_KEYS_EXACT.has(k)) return true;
    return DROP_PREFIXES.some((p) => k.startsWith(p));
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
   * @returns {{
   *   ok: boolean,
   *   cleanedUrl: string,
   *   removedCount: number,
   *   removedKeys: string[],
   *   error?: string
   * }}
   */
  function cleanUrl(rawUrl) {
    const u = parseUrl(rawUrl);
    if (!u) {
      return {
        ok: false,
        cleanedUrl: "",
        removedCount: 0,
        removedKeys: [],
        error: "Ungültige URL"
      };
    }

    const removedKeys = [];
    const keys = [...u.searchParams.keys()];

    for (const key of keys) {
      if (shouldDropParam(key)) {
        removedKeys.push(key);
        u.searchParams.delete(key);
      }
    }

    // Optional: normalize hash-only tracking patterns if needed (currently untouched)

    return {
      ok: true,
      cleanedUrl: u.toString(),
      removedCount: removedKeys.length,
      removedKeys
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
     UI actions
     ========================= */

  function setMeta(text) {
    if (!elMeta) return;
    elMeta.textContent = text || "";
  }

  btnClean.addEventListener("click", () => {
    const original = (elInput.value || "").trim();
    if (!original) {
      setMeta("Bitte zuerst einen Link einfügen.");
      return;
    }

    const res = cleanUrl(original);

    if (!res.ok) {
      setMeta("Ungültige URL. Bitte prüfen.");
      return;
    }

    elOutput.value = res.cleanedUrl;
    setMeta(
      res.removedCount > 0
        ? `Entfernt: ${res.removedCount} Parameter (${res.removedKeys.join(", ")})`
        : "Keine Tracking-Parameter gefunden."
    );

    // ===== GTM EVENT: clean success =====
    pushDL("ss_clean_success", {
      cleaned: true,
      had_tracking_params: res.removedCount > 0,
      removed_count: res.removedCount,
      output_length: res.cleanedUrl.length
    });

    // Optional nudge view after clean
    showNudgeIfAvailable();
  });

  btnCopy.addEventListener("click", async () => {
    const out = (elOutput.value || "").trim();
    if (!out) {
      setMeta("Noch kein bereinigter Link vorhanden.");
      return;
    }

    try {
      await navigator.clipboard.writeText(out);
      setMeta("Bereinigter Link kopiert.");

      // ===== GTM EVENT: copy mapped to your existing event =====
      pushDL("ss_nudge_click_compare_p", {
        action: "copy_clean_url",
        has_output: true
      });
    } catch (err) {
      console.error(err);
      setMeta("Kopieren fehlgeschlagen.");
    }
  });

  btnShare.addEventListener("click", async () => {
    const out = (elOutput.value || "").trim();
    if (!out) {
      setMeta("Noch kein bereinigter Link vorhanden.");
      return;
    }

    if (!navigator.share) {
      setMeta("Teilen wird auf diesem Gerät nicht unterstützt.");
      return;
    }

    try {
      await navigator.share({ url: out });

      // ===== GTM EVENT: share mapped to your existing event =====
      pushDL("ss_nudge_click_compare_p", {
        action: "share_clean_url",
        share_supported: true,
        has_output: true
      });
    } catch (err) {
      // user canceled share -> silently ignore as technical error
      console.debug("[SafeShare] Share canceled or failed:", err);
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

    // ===== GTM EVENT: nudge dismiss =====
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

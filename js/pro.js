/* File: /js/pro.js */
/* SafeShare Pro controller + GTM events v2026-02-11-01 */

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
      page_type: document.body?.dataset?.pageType || "pro",
      source: "safeshare_web",
      ...payload
    });
  }

  /* =========================
     DOM helpers
     ========================= */
  const $ = (id) => document.getElementById(id);

  // Core fields (gleiches Muster wie app.js)
  const elInput = $("urlInput");
  const elOutput = $("urlOutput");
  const elMeta = $("cleanMeta");

  const btnClean = $("cleanBtn");
  const btnCopy = $("copyBtn");
  const btnShare = $("shareBtn");
  const btnReset = $("resetBtn");

  // Pro-spezifische optionale UI (wenn vorhanden)
  const nudge = $("postCleanNudge");
  const nudgeCloseBtn = $("nudgeCloseBtn");
  const nudgeCompareBtn = $("nudgeCompareBtn");

  // Optional: policy/advanced controls (falls vorhanden)
  const selPolicy = $("policySelect");
  const chkUnshorten = $("optUnshorten");
  const chkKeepFragment = $("optKeepFragment");

  if (!elInput || !elOutput || !btnClean || !btnCopy || !btnShare || !btnReset) {
    console.warn("[SafeShare Pro] Required DOM elements missing.");
    return;
  }

  /* =========================
     URL cleaning logic
     ========================= */

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

  const DROP_PREFIXES = ["utm_"];

  function shouldDropParam(key) {
    const k = String(key || "").toLowerCase();
    if (DROP_KEYS_EXACT.has(k)) return true;
    return DROP_PREFIXES.some((p) => k.startsWith(p));
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

  /**
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

    // Optional advanced toggle example: fragment behalten/entfernen
    if (chkKeepFragment && !chkKeepFragment.checked) {
      u.hash = "";
    }

    return {
      ok: true,
      cleanedUrl: u.toString(),
      removedCount: removedKeys.length,
      removedKeys
    };
  }

  /* =========================
     Nudge helpers
     ========================= */

  function getNudgeId() {
    return "compare_pro";
  }

  function trackNudgeViewOnce() {
    const key = "ss_nudge_view_sent_compare_pro";
    if (sessionStorage.getItem(key)) return;

    pushDL("ss_nudge_view", {
      nudge_id: getNudgeId(),
      placement: "post_clean",
      pro_context: true
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
     UI helpers
     ========================= */

  function setMeta(text) {
    if (!elMeta) return;
    elMeta.textContent = text || "";
  }

  function getPolicyName() {
    if (!selPolicy) return "default";
    return selPolicy.value || "default";
  }

  /* =========================
     Events
     ========================= */

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
      output_length: res.cleanedUrl.length,
      policy: getPolicyName(),
      unshorten_enabled: !!chkUnshorten?.checked,
      keep_fragment: !!chkKeepFragment?.checked
    });

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

      // ===== GTM EVENT: copy mapped to existing setup =====
      pushDL("ss_nudge_click_compare_p", {
        action: "copy_clean_url",
        has_output: true,
        policy: getPolicyName()
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

      // ===== GTM EVENT: share mapped to existing setup =====
      pushDL("ss_nudge_click_compare_p", {
        action: "share_clean_url",
        share_supported: true,
        has_output: true,
        policy: getPolicyName()
      });
    } catch (err) {
      console.debug("[SafeShare Pro] Share canceled or failed:", err);
    }
  });

  btnReset.addEventListener("click", () => {
    elInput.value = "";
    elOutput.value = "";
    setMeta("");
    hideNudgeIfAvailable();
  });

  nudgeCloseBtn?.addEventListener("click", () => {
    hideNudgeIfAvailable();

    // ===== GTM EVENT: nudge dismiss =====
    pushDL("ss_nudge_dismiss", {
      nudge_id: getNudgeId(),
      placement: "post_clean",
      pro_context: true
    });
  });

  nudgeCompareBtn?.addEventListener("click", () => {
    // ===== GTM EVENT: nudge compare click =====
    pushDL("ss_nudge_click_compare_p", {
      action: "nudge_compare_pro_click",
      nudge_id: getNudgeId(),
      placement: "post_clean",
      pro_context: true
    });
  });

  /* Optional: policy change tracking */
  selPolicy?.addEventListener("change", () => {
    pushDL("ss_nudge_view", {
      action: "policy_changed",
      policy: getPolicyName(),
      pro_context: true
    });
  });
})();

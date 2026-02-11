/* File: /js/app.js */
/* SafeShare App controller + GTM events v2026-02-11-03 */
/* DE+EN Meta-Texte sauber lokalisiert, Copy/Share-Events getrennt */

(() => {
  "use strict";

  /* =========================
     GTM / dataLayer helper
     ========================= */
  window.dataLayer = window.dataLayer || [];

  function getLang() {
    const b = (document.body?.dataset?.lang || "").toLowerCase();
    if (b === "de" || b === "en") return b;
    const d = (document.documentElement.lang || "").toLowerCase();
    if (d.startsWith("de")) return "de";
    return "en";
  }

  function t(deText, enText) {
    return getLang() === "de" ? deText : enText;
  }

  /**
   * Push event to GTM dataLayer
   * @param {string} eventName
   * @param {Record<string, any>} payload
   */
  function pushDL(eventName, payload = {}) {
    window.dataLayer.push({
      event: eventName,
      lang: getLang(),
      page_type: document.body?.dataset?.page || "app",
      source: "safeshare_web",
      ts: new Date().toISOString(),
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

  // Optional nudge elements (IDs auf DE+EN gleichgezogen)
  const nudge = $("postCleanNudge");
  const nudgeCloseBtn = $("nudgeCloseBtn");
  const nudgeCompareBtn = $("nudgeCompareBtn");

  // Mode controls
  // Erwartet: <input type="radio" name="cleanMode" value="standard|strict">
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

    // 2) Select fallback
    if (modeSelect?.value) {
      return modeSelect.value === "strict" ? "strict" : "standard";
    }

    // 3) Dataset fallback
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

  /**
   * Parse URL safely (with https fallback for bare domains)
   * @param {string} raw
   * @returns {URL|null}
   */
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
   * Clean URL parameters
   * @param {string} rawUrl
   * @param {{mode?: "standard"|"strict"}} options
   * @returns {{
   *   ok: boolean,
   *   cleanedUrl: string,
   *   removedCount: number,
   *   removedKeys: string[],
   *   keptKeys: string[],
   *   mode: "standard"|"strict",
   *   meta: { unwrapped: boolean },
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
        keptKeys: [],
        mode,
        meta: { unwrapped: false },
        error: "invalid_url"
      };
    }

    const removedKeys = [];
    const keptKeys = [];
    const keys = [...u.searchParams.keys()];

    for (const key of keys) {
      if (shouldDropParam(key, mode)) {
        removedKeys.push(key);
        u.searchParams.delete(key);
      } else {
        keptKeys.push(key);
      }
    }

    return {
      ok: true,
      cleanedUrl: u.toString(),
      removedCount: removedKeys.length,
      removedKeys,
      keptKeys,
      mode,
      meta: { unwrapped: false }
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
     UI helpers
     ========================= */

  function uniq(arr) {
    return Array.from(new Set(arr || []));
  }

  function setMeta(text) {
    if (!elMeta) return;
    elMeta.textContent = text || "";
  }

  function setDefaultMeta() {
    setMeta(
      t(
        "Entfernt: – • Behalten: – • Standard-Modus aktiv (trackingarm, zielstabil).",
        "Removed: – • Kept: – • Standard mode active (tracking-light, destination-stable)."
      )
    );
  }

  function renderMeta(result) {
    const removed = result.removedKeys?.length ? uniq(result.removedKeys).join(", ") : "–";
    const kept = result.keptKeys?.length ? uniq(result.keptKeys).join(", ") : "–";

    const modeText =
      getLang() === "de"
        ? (result.mode === "strict"
            ? "Strikt-Modus aktiv (aggressiver, kann Zielverhalten ändern)."
            : "Standard-Modus aktiv (trackingarm, zielstabil).")
        : (result.mode === "strict"
            ? "Strict mode active (more aggressive, may change destination behavior)."
            : "Standard mode active (tracking-light, destination-stable).");

    const unwrappedNote = result.meta?.unwrapped
      ? t(" Redirect entpackt.", " Redirect unwrapped.")
      : "";

    setMeta(
      getLang() === "de"
        ? `Entfernt: ${removed} • Behalten: ${kept} • ${modeText}${unwrappedNote}`
        : `Removed: ${removed} • Kept: ${kept} • ${modeText}${unwrappedNote}`
    );
  }

  function setButtonsEnabled(enabled) {
    btnCopy.disabled = !enabled;
    btnShare.disabled = !enabled;
  }

  /* =========================
     Actions
     ========================= */

  function runCleanFromInput() {
    const original = (elInput.value || "").trim();
    if (!original) {
      setMeta(t("Bitte zuerst einen Link einfügen.", "Please enter a URL first."));
      elOutput.value = "";
      setButtonsEnabled(false);
      return false;
    }

    const mode = getCurrentMode();
    const res = cleanUrl(original, { mode });

    if (!res.ok) {
      setMeta(t("Ungültige URL. Bitte prüfen.", "Invalid URL. Please check the link."));
      elOutput.value = "";
      setButtonsEnabled(false);
      return false;
    }

    elOutput.value = res.cleanedUrl;
    setButtonsEnabled(Boolean(res.cleanedUrl));
    renderMeta(res);

    // GTM: clean success
    pushDL("ss_clean_success", {
      cleaned: true,
      mode: res.mode,
      had_tracking_params: res.removedCount > 0,
      removed_count: res.removedCount,
      output_length: res.cleanedUrl.length,
      input_length: original.length
    });

    showNudgeIfAvailable();
    return true;
  }

  function recleanOnModeChange() {
    const original = (elInput.value || "").trim();
    if (!original) {
      setDefaultMeta();
      return;
    }
    runCleanFromInput(); // kein Neu-Einfügen nötig
  }

  async function copyNow() {
    const out = (elOutput.value || "").trim();
    if (!out) {
      setMeta(t("Noch kein bereinigter Link vorhanden.", "No cleaned link available yet."));
      return;
    }

    try {
      await navigator.clipboard.writeText(out);
      setMeta(t("Bereinigter Link kopiert.", "Cleaned link copied."));

      // GTM: COPY separat
      pushDL("ss_copy_click", {
        action: "copy_clean_url",
        has_output: true,
        mode: getCurrentMode(),
        output_length: out.length
      });
    } catch {
      // Fallback
      try {
        elOutput.focus();
        elOutput.select();
        const ok = document.execCommand("copy");
        if (ok) {
          setMeta(t("Bereinigter Link kopiert.", "Cleaned link copied."));
          pushDL("ss_copy_click", {
            action: "copy_clean_url_fallback",
            has_output: true,
            mode: getCurrentMode(),
            output_length: out.length
          });
        } else {
          setMeta(t("Kopieren fehlgeschlagen.", "Copy failed."));
        }
      } catch {
        setMeta(t("Kopieren fehlgeschlagen.", "Copy failed."));
      }
    }
  }

  async function shareNow() {
    const out = (elOutput.value || "").trim();
    if (!out) {
      setMeta(t("Noch kein bereinigter Link vorhanden.", "No cleaned link available yet."));
      return;
    }

    if (!navigator.share) {
      setMeta(t("Teilen wird auf diesem Gerät nicht unterstützt.", "Sharing is not supported on this device."));
      return;
    }

    try {
      await navigator.share({ url: out, text: out });

      // GTM: SHARE separat
      pushDL("ss_share_click", {
        action: "share_clean_url",
        share_supported: true,
        has_output: true,
        mode: getCurrentMode(),
        output_length: out.length
      });
    } catch {
      // Nutzer hat evtl. abgebrochen -> kein Error-Noise
    }
  }

  function resetNow() {
    elInput.value = "";
    elOutput.value = "";
    setButtonsEnabled(false);

    // Mode auf Standard zurücksetzen
    const standardRadio = modeInputs.find((el) => el.value === "standard");
    if (standardRadio) standardRadio.checked = true;
    if (modeSelect) modeSelect.value = "standard";
    document.body.dataset.cleanMode = "standard";

    hideNudgeIfAvailable();
    setDefaultMeta();

    pushDL("ss_reset_click", { page_type: "app" });
  }

  /* =========================
     Bind events
     ========================= */
  btnClean.addEventListener("click", runCleanFromInput);
  btnCopy.addEventListener("click", copyNow);
  btnShare.addEventListener("click", shareNow);
  btnReset.addEventListener("click", resetNow);

  // Mode switch re-clean
  modeInputs.forEach((el) => el.addEventListener("change", recleanOnModeChange));
  if (modeSelect) modeSelect.addEventListener("change", recleanOnModeChange);

  btnModeStandard?.addEventListener("click", () => {
    document.body.dataset.cleanMode = "standard";
    recleanOnModeChange();
  });

  btnModeStrict?.addEventListener("click", () => {
    document.body.dataset.cleanMode = "strict";
    recleanOnModeChange();
  });

  // Cmd/Ctrl+Enter = Clean
  elInput.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      runCleanFromInput();
    }
  });

  // Nudge dismiss
  nudgeCloseBtn?.addEventListener("click", () => {
    hideNudgeIfAvailable();
    pushDL("ss_nudge_dismiss", {
      nudge_id: "compare_pro",
      placement: "post_clean"
    });
  });

  // Nudge CTA
  nudgeCompareBtn?.addEventListener("click", () => {
    pushDL("ss_nudge_click_compare_pro", {
      action: "nudge_compare_pro_click",
      nudge_id: "compare_pro",
      placement: "post_clean"
    });
  });

  // Init state
  setButtonsEnabled(false);
  setDefaultMeta();
})();

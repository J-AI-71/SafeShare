/* File: /js/app.js */
/* SafeShare App controller + GTM events v2026-02-11-03 */
/* Master-Flow strict: one source of truth via /js/ss-rules.js */

(() => {
  "use strict";

  /* =========================
     dataLayer helper
     ========================= */
  window.dataLayer = window.dataLayer || [];

  function pushDL(eventName, payload = {}) {
    window.dataLayer.push({
      event: eventName,
      lang: document.documentElement.lang || (document.body?.dataset?.lang || "de"),
      page_type: document.body?.dataset?.page || "app",
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

  // Mode controls (expected in HTML)
  // <input type="radio" name="cleanMode" value="standard|strict">
  const modeInputs = Array.from(document.querySelectorAll('input[name="cleanMode"]'));

  // Optional nudge (use EXACT same IDs in DE+EN pages)
  const nudge = $("postCleanNudge");
  const nudgeCloseBtn = $("nudgeCloseBtn");
  const nudgeCompareBtn = $("nudgeCompareBtn");

  if (!elInput || !elOutput || !elMeta || !btnClean || !btnCopy || !btnShare || !btnReset) {
    console.warn("[SafeShare] Required DOM elements missing.");
    return;
  }

  /* =========================
     i18n helpers
     ========================= */
  function isEN() {
    const l = (document.body?.dataset?.lang || document.documentElement.lang || "de").toLowerCase();
    return l.startsWith("en");
  }

  function t(de, en) {
    return isEN() ? en : de;
  }

  function getMode() {
    if (!modeInputs.length) return "standard";
    const checked = modeInputs.find((r) => r.checked);
    return checked?.value === "strict" ? "strict" : "standard";
  }

  function setDefaultMeta() {
    elMeta.textContent = t(
      "Entfernt: – • Behalten: – • Standard-Modus aktiv (trackingarm, zielstabil).",
      "Removed: – • Kept: – • Standard mode active (tracking-light, destination-stable)."
    );
  }

  function setMetaInvalidUrl() {
    elMeta.textContent = t(
      "Ungültige URL. Bitte vollständigen Link einfügen.",
      "Invalid URL. Please paste a full link."
    );
  }

  function setMetaMissingInput() {
    elMeta.textContent = t(
      "Bitte zuerst einen Link einfügen.",
      "Please paste a link first."
    );
  }

  function setMetaNoOutput() {
    elMeta.textContent = t(
      "Noch kein bereinigter Link vorhanden.",
      "No cleaned link available yet."
    );
  }

  function setMetaCopied() {
    elMeta.textContent = t(
      "Bereinigter Link kopiert.",
      "Clean link copied."
    );
  }

  function setMetaCopyFailed() {
    elMeta.textContent = t(
      "Kopieren fehlgeschlagen.",
      "Copy failed."
    );
  }

  function setMetaShareUnsupported() {
    elMeta.textContent = t(
      "Teilen wird auf diesem Gerät nicht unterstützt.",
      "Share is not supported on this device."
    );
  }

  function renderMetaFromResult(result, mode) {
    const removed = (result.removed && result.removed.length) ? [...new Set(result.removed)] : [];
    const kept = (result.kept && result.kept.length) ? [...new Set(result.kept)] : [];

    const removedTxt = removed.length ? removed.join(", ") : "–";
    const keptTxt = kept.length ? kept.join(", ") : "–";

    const modeTxt = isEN()
      ? (mode === "strict"
          ? "Strict mode active (more aggressive, may change destination behavior)."
          : "Standard mode active (tracking-light, destination-stable).")
      : (mode === "strict"
          ? "Strikt-Modus aktiv (aggressiver, kann Zielverhalten ändern)."
          : "Standard-Modus aktiv (trackingarm, zielstabil).");

    const unwrappedNote = result.meta?.unwrapped
      ? (isEN() ? " Redirect unwrapped." : " Redirect entpackt.")
      : "";

    elMeta.textContent = isEN()
      ? `Removed: ${removedTxt} • Kept: ${keptTxt} • ${modeTxt}${unwrappedNote}`
      : `Entfernt: ${removedTxt} • Behalten: ${keptTxt} • ${modeTxt}${unwrappedNote}`;
  }

  function updateButtons(hasOutput) {
    btnCopy.disabled = !hasOutput;
    btnShare.disabled = !hasOutput;
  }

  /* =========================
     Nudge helpers
     ========================= */
  function showNudge() {
    if (!nudge) return;
    if (!nudge.hidden) return;
    nudge.hidden = false;

    // only once per session
    const key = "ss_nudge_view_sent_compare_pro";
    if (!sessionStorage.getItem(key)) {
      pushDL("ss_nudge_view", {
        nudge_id: "compare_pro",
        placement: "post_clean"
      });
      sessionStorage.setItem(key, "1");
    }
  }

  function hideNudge() {
    if (!nudge) return;
    nudge.hidden = true;
  }

  /* =========================
     Cleaning logic (single source: SS_RULES)
     ========================= */
  function cleanNow() {
    const raw = (elInput.value || "").trim();

    if (!raw) {
      setMetaMissingInput();
      elOutput.value = "";
      updateButtons(false);
      hideNudge();
      return;
    }

    if (!window.SS_RULES || typeof window.SS_RULES.cleanUrl !== "function") {
      elMeta.textContent = "Rules engine missing: /js/ss-rules.js";
      return;
    }

    const mode = getMode();

    try {
      const result = window.SS_RULES.cleanUrl(raw, mode);
      const cleaned = (result.cleaned || "").trim();

      if (!cleaned) {
        setMetaInvalidUrl();
        elOutput.value = "";
        updateButtons(false);
        hideNudge();
        return;
      }

      elOutput.value = cleaned;
      updateButtons(true);
      renderMetaFromResult(result, mode);

      // GTM: clean success
      pushDL("ss_clean_success", {
        mode,
        cleaned: true,
        had_tracking_params: (result.removed?.length || 0) > 0,
        removed_count: result.removed?.length || 0,
        removed_keys: (result.removed || []).join(","),
        kept_keys: (result.kept || []).join(","),
        output_length: cleaned.length,
        input_length: raw.length
      });

      showNudge();
    } catch (err) {
      console.debug("[SafeShare] clean error:", err);
      setMetaInvalidUrl();
      elOutput.value = "";
      updateButtons(false);
      hideNudge();
    }
  }

  async function copyNow() {
    const txt = (elOutput.value || "").trim();
    if (!txt) {
      setMetaNoOutput();
      return;
    }

    try {
      await navigator.clipboard.writeText(txt);
      setMetaCopied();

      // GTM: copy click
      pushDL("ss_copy_click", {
        mode: getMode(),
        has_output: true,
        output_length: txt.length
      });
    } catch {
      try {
        elOutput.focus();
        elOutput.select();
        const ok = document.execCommand("copy");
        if (ok) {
          setMetaCopied();
          pushDL("ss_copy_click", {
            mode: getMode(),
            has_output: true,
            output_length: txt.length,
            fallback: true
          });
        } else {
          setMetaCopyFailed();
        }
      } catch {
        setMetaCopyFailed();
      }
    }
  }

  async function shareNow() {
    const txt = (elOutput.value || "").trim();
    if (!txt) {
      setMetaNoOutput();
      return;
    }

    if (!navigator.share) {
      setMetaShareUnsupported();
      return;
    }

    try {
      await navigator.share({ url: txt, text: txt });

      // GTM: share click
      pushDL("ss_share_click", {
        mode: getMode(),
        has_output: true,
        share_supported: true,
        output_length: txt.length
      });
    } catch (err) {
      // user canceled: no error text needed
      console.debug("[SafeShare] share canceled/failed:", err);
    }
  }

  function resetNow() {
    elInput.value = "";
    elOutput.value = "";
    updateButtons(false);
    hideNudge();

    const standard = modeInputs.find((r) => r.value === "standard");
    if (standard) standard.checked = true;

    setDefaultMeta();
  }

  function recleanOnModeChange() {
    if (!(elInput.value || "").trim()) return;
    cleanNow();
  }

  /* =========================
     Bind events
     ========================= */
  btnClean.addEventListener("click", cleanNow);
  btnCopy.addEventListener("click", copyNow);
  btnShare.addEventListener("click", shareNow);
  btnReset.addEventListener("click", resetNow);

  modeInputs.forEach((r) => r.addEventListener("change", recleanOnModeChange));

  elInput.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      cleanNow();
    }
  });

  // Nudge buttons (optional)
  nudgeCloseBtn?.addEventListener("click", () => {
    hideNudge();
    pushDL("ss_nudge_dismiss", {
      nudge_id: "compare_pro",
      placement: "post_clean"
    });
  });

  nudgeCompareBtn?.addEventListener("click", () => {
    pushDL("ss_nudge_click_compare_pro", {
      action: "nudge_compare_pro_click",
      nudge_id: "compare_pro",
      placement: "post_clean",
      mode: getMode()
    });
  });

  /* =========================
     Init
     ========================= */
  updateButtons(false);
  hideNudge();
  setDefaultMeta();
})();

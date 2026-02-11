/* File: /js/app.js */
/* SafeShare App controller v2026-02-11-01 (Master-Flow strict + shell tracking core) */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const elInput = $("urlInput");
  const elOutput = $("urlOutput");
  const elMeta = $("cleanMeta");

  const btnClean = $("cleanBtn");
  const btnCopy = $("copyBtn");
  const btnShare = $("shareBtn");
  const btnReset = $("resetBtn");

  // Optional Nudge-Elemente (DE/EN)
  const nudgeDe = $("postCleanNudgeDe");
  const nudgeEn = $("postCleanNudgeEn");
  const nudgeCompareDe = $("nudgeCompareProDe");
  const nudgeCompareEn = $("nudgeCompareProEn");
  const nudgeLaterDe = $("nudgeLaterDe");
  const nudgeLaterEn = $("nudgeLaterEn");

  if (!elInput || !elOutput || !elMeta || !btnClean || !btnCopy || !btnShare || !btnReset) return;

  function track(eventName, payload) {
    if (typeof window.ssTrack === "function") {
      window.ssTrack(eventName, payload || {});
    }
  }

  function lang() {
    return (document.body?.dataset?.lang || document.documentElement.lang || "de").toLowerCase();
  }

  function isEn() {
    return lang().startsWith("en");
  }

  function mode() {
    const r = document.querySelector('input[name="mode"]:checked');
    return r ? r.value : "standard";
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function setDefaultMeta() {
    if (isEn()) {
      elMeta.textContent = "Removed: – • Kept: – • Standard mode active (tracking-light, target-stable).";
    } else {
      elMeta.textContent = "Entfernt: – • Behalten: – • Standard-Modus aktiv (trackingarm, zielstabil).";
    }
  }

  function renderMeta(result, currentMode) {
    const removed = result.removed && result.removed.length ? uniq(result.removed).join(", ") : "–";
    const kept = result.kept && result.kept.length ? uniq(result.kept).join(", ") : "–";

    const modeText = isEn()
      ? (currentMode === "strict"
          ? "Strict mode active (more aggressive, may change destination behavior)."
          : "Standard mode active (tracking-light, target-stable).")
      : (currentMode === "strict"
          ? "Strikt-Modus aktiv (aggressiver, kann Zielverhalten ändern)."
          : "Standard-Modus aktiv (trackingarm, zielstabil).");

    const unwrappedNote = result.meta && result.meta.unwrapped
      ? (isEn() ? " Redirect unwrapped." : " Redirect entpackt.")
      : "";

    if (isEn()) {
      elMeta.textContent = `Removed: ${removed} • Kept: ${kept} • ${modeText}${unwrappedNote}`;
    } else {
      elMeta.textContent = `Entfernt: ${removed} • Behalten: ${kept} • ${modeText}${unwrappedNote}`;
    }
  }

  function hideNudges() {
    if (nudgeDe) nudgeDe.hidden = true;
    if (nudgeEn) nudgeEn.hidden = true;
  }

  function showPostCleanNudge() {
    const target = isEn() ? nudgeEn : nudgeDe;
    const other = isEn() ? nudgeDe : nudgeEn;

    if (other) other.hidden = true;
    if (!target) return;

    if (target.hidden) {
      target.hidden = false;
      track("ss_nudge_view", {
        source: "post_clean_nudge",
        plan: "none",
        experiment_id: "nudge_copy_01",
        variant: "A"
      });
    }
  }

  function cleanNow() {
    const raw = (elInput.value || "").trim();

    if (!raw) {
      if (isEn()) {
        elMeta.textContent = "Please enter a URL.";
      } else {
        elMeta.textContent = "Bitte eine URL eingeben.";
      }
      elOutput.value = "";
      btnCopy.disabled = true;
      btnShare.disabled = true;
      hideNudges();
      return;
    }

    if (!window.SS_RULES || typeof window.SS_RULES.cleanUrl !== "function") {
      elMeta.textContent = "Rules engine missing: /js/ss-rules.js";
      return;
    }

    try {
      const currentMode = mode();
      const res = window.SS_RULES.cleanUrl(raw, currentMode);
      const cleaned = (res.cleaned || "").trim();

      elOutput.value = cleaned;
      btnCopy.disabled = !cleaned;
      btnShare.disabled = !cleaned;
      renderMeta(res, currentMode);

      if (cleaned) {
        track("ss_clean_success", {
          source: "app_clean_action",
          plan: "none",
          mode: currentMode,
          experiment_id: "baseline",
          variant: "control"
        });
        showPostCleanNudge();
      } else {
        hideNudges();
      }
    } catch (err) {
      elOutput.value = "";
      btnCopy.disabled = true;
      btnShare.disabled = true;
      hideNudges();

      if (isEn()) {
        elMeta.textContent = "Invalid URL. Please paste a full link.";
      } else {
        elMeta.textContent = "Ungültige URL. Bitte vollständigen Link einfügen.";
      }
    }
  }

  async function copyNow() {
    const txt = (elOutput.value || "").trim();
    if (!txt) return;

    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      elOutput.focus();
      elOutput.select();
      document.execCommand("copy");
    }

    track("ss_copy_click", {
      source: "app_output",
      plan: "none"
    });
  }

  async function shareNow() {
    const txt = (elOutput.value || "").trim();
    if (!txt) return;

    if (navigator.share) {
      try {
        await navigator.share({ url: txt, text: txt });
        track("ss_share_click", {
          source: "app_output",
          method: "native_share",
          plan: "none"
        });
      } catch {
        // user canceled
      }
    } else {
      await copyNow();
      track("ss_share_click", {
        source: "app_output",
        method: "fallback_copy",
        plan: "none"
      });
    }
  }

  function resetNow() {
    elInput.value = "";
    elOutput.value = "";
    btnCopy.disabled = true;
    btnShare.disabled = true;

    const standard = document.querySelector('input[name="mode"][value="standard"]');
    if (standard) standard.checked = true;

    setDefaultMeta();
    hideNudges();

    track("ss_reset_click", {
      source: "app_controls",
      plan: "none"
    });
  }

  function bindNudgeEvents() {
    if (nudgeCompareDe) {
      nudgeCompareDe.addEventListener("click", () => {
        track("ss_nudge_click_compare_pro", {
          source: "post_clean_nudge",
          plan: "none",
          experiment_id: "nudge_copy_01",
          variant: "A"
        });
      });
    }

    if (nudgeCompareEn) {
      nudgeCompareEn.addEventListener("click", () => {
        track("ss_nudge_click_compare_pro", {
          source: "post_clean_nudge",
          plan: "none",
          experiment_id: "nudge_copy_01",
          variant: "A"
        });
      });
    }

    if (nudgeLaterDe) {
      nudgeLaterDe.addEventListener("click", () => {
        if (nudgeDe) nudgeDe.hidden = true;
        track("ss_nudge_dismiss", {
          source: "post_clean_nudge",
          plan: "none",
          experiment_id: "nudge_copy_01",
          variant: "A"
        });
      });
    }

    if (nudgeLaterEn) {
      nudgeLaterEn.addEventListener("click", () => {
        if (nudgeEn) nudgeEn.hidden = true;
        track("ss_nudge_dismiss", {
          source: "post_clean_nudge",
          plan: "none",
          experiment_id: "nudge_copy_01",
          variant: "A"
        });
      });
    }
  }

  btnClean.addEventListener("click", cleanNow);
  btnCopy.addEventListener("click", copyNow);
  btnShare.addEventListener("click", shareNow);
  btnReset.addEventListener("click", resetNow);

  document.querySelectorAll('input[name="mode"]').forEach((r) => {
    r.addEventListener("change", () => {
      track("ss_mode_change", {
        source: "app_mode_toggle",
        mode: mode(),
        plan: "none"
      });
      if ((elInput.value || "").trim()) cleanNow();
    });
  });

  elInput.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      cleanNow();
    }
  });

  bindNudgeEvents();
  setDefaultMeta();
  hideNudges();
})();

/* File: /js/app.js */
/* SafeShare App controller v2026-02-10-03 */

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

  if (!elInput || !elOutput || !elMeta || !btnClean || !btnCopy || !btnShare || !btnReset) return;

  function lang() {
    return (document.body.dataset.lang || "de").toLowerCase();
  }

  function mode() {
    const r = document.querySelector('input[name="mode"]:checked');
    return r ? r.value : "standard";
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function setDefaultMeta() {
    if (lang() === "en") {
      elMeta.textContent = "Removed: – • Kept: – • Standard mode active (tracking-light, target-stable).";
    } else {
      elMeta.textContent = "Entfernt: – • Behalten: – • Standard-Modus aktiv (trackingarm, zielstabil).";
    }
  }

  function renderMeta(result, currentMode) {
    const removed = result.removed && result.removed.length ? uniq(result.removed).join(", ") : "–";
    const kept = result.kept && result.kept.length ? uniq(result.kept).join(", ") : "–";

    const isEn = lang() === "en";
    const modeText = isEn
      ? (currentMode === "strict"
          ? "Strict mode active (more aggressive, may change destination behavior)."
          : "Standard mode active (tracking-light, target-stable).")
      : (currentMode === "strict"
          ? "Strikt-Modus aktiv (aggressiver, kann Zielverhalten ändern)."
          : "Standard-Modus aktiv (trackingarm, zielstabil).");

    const unwrappedNote = result.meta && result.meta.unwrapped
      ? (isEn ? " Redirect unwrapped." : " Redirect entpackt.")
      : "";

    if (isEn) {
      elMeta.textContent = `Removed: ${removed} • Kept: ${kept} • ${modeText}${unwrappedNote}`;
    } else {
      elMeta.textContent = `Entfernt: ${removed} • Behalten: ${kept} • ${modeText}${unwrappedNote}`;
    }
  }

  function cleanNow() {
    const raw = (elInput.value || "").trim();
    if (!raw) {
      if (lang() === "en") {
        elMeta.textContent = "Please enter a URL.";
      } else {
        elMeta.textContent = "Bitte eine URL eingeben.";
      }
      elOutput.value = "";
      btnCopy.disabled = true;
      btnShare.disabled = true;
      return;
    }

    if (!window.SS_RULES || typeof window.SS_RULES.cleanUrl !== "function") {
      elMeta.textContent = "Rules engine missing: /js/ss-rules.js";
      return;
    }

    try {
      const res = window.SS_RULES.cleanUrl(raw, mode());
      elOutput.value = res.cleaned || "";
      btnCopy.disabled = !elOutput.value;
      btnShare.disabled = !elOutput.value;
      renderMeta(res, mode());
    } catch (err) {
      elOutput.value = "";
      btnCopy.disabled = true;
      btnShare.disabled = true;
      if (lang() === "en") {
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
  }

  async function shareNow() {
    const txt = (elOutput.value || "").trim();
    if (!txt) return;

    if (navigator.share) {
      try {
        await navigator.share({ url: txt, text: txt });
      } catch {
        // user canceled
      }
    } else {
      await copyNow();
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
  }

  btnClean.addEventListener("click", cleanNow);
  btnCopy.addEventListener("click", copyNow);
  btnShare.addEventListener("click", shareNow);
  btnReset.addEventListener("click", resetNow);

  document.querySelectorAll('input[name="mode"]').forEach((r) => {
    r.addEventListener("change", () => {
      if ((elInput.value || "").trim()) cleanNow();
    });
  });

  elInput.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      cleanNow();
    }
  });

  setDefaultMeta();
})();
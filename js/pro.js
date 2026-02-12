/* File: /js/pro.js */
/* SafeShare Pro page tracking v2026-02-12-01
   Purpose: Pricing/CTA tracking for /pro/ and /en/pro/
*/

(() => {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  const lang = (document.documentElement.lang || document.body?.dataset?.lang || "de").toLowerCase();
  const pageType = document.body?.dataset?.pageType || document.body?.dataset?.page || "pro";

  function pushDL(eventName, payload = {}) {
    window.dataLayer.push({
      event: eventName,
      lang,
      page_type: pageType,
      source: "safeshare_web",
      ...payload
    });
  }

  function euroToNumber(v) {
    if (v == null) return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  // ---------- track plan CTA clicks ----------
  function bindPlanSelectTracking() {
    const links = Array.from(document.querySelectorAll(".js-plan-select"));
    if (!links.length) return;

    links.forEach((a) => {
      a.addEventListener("click", () => {
        const plan = a.dataset.plan || "unknown";
        const value = euroToNumber(a.dataset.value);

        pushDL("ss_pro_plan_select", {
          plan,
          currency: "EUR",
          value,
          cta_text: (a.textContent || "").trim(),
          destination: a.getAttribute("href") || ""
        });
      });
    });
  }

  // ---------- optional: track FAQ open ----------
  function bindFaqTracking() {
    const details = Array.from(document.querySelectorAll("details.ss-details"));
    if (!details.length) return;

    details.forEach((d) => {
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        const summary = d.querySelector("summary");
        pushDL("ss_pro_faq_open", {
          question: summary ? summary.textContent.trim() : "unknown"
        });
      });
    });
  }

  // ---------- optional: basic scroll depth milestones ----------
  function bindScrollDepthTracking() {
    const sent = new Set();
    const marks = [25, 50, 75, 90];

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;

      const depth = Math.round((window.scrollY / max) * 100);

      for (const m of marks) {
        if (depth >= m && !sent.has(m)) {
          sent.add(m);
          pushDL("ss_pro_scroll_depth", { percent: m });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- page view marker ----------
  function trackProView() {
    pushDL("ss_pro_view", {
      path: location.pathname
    });
  }

  trackProView();
  bindPlanSelectTracking();
  bindFaqTracking();
  bindScrollDepthTracking();
})();

/* File: /js/pro.js */
/* SafeShare Pro page controller + GTM events v2026-02-12-02 */

(() => {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  function getLang() {
    return (document.documentElement.lang || document.body?.dataset?.lang || "de").toLowerCase();
  }

  function getPageType() {
    return (document.body?.dataset?.pageType || document.body?.dataset?.page || "pro").toLowerCase();
  }

  function pushDL(eventName, payload = {}) {
    window.dataLayer.push({
      event: eventName,
      lang: getLang(),
      page_type: getPageType(),
      source: "safeshare_web",
      ...payload
    });
  }

  function toNumberOrNull(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  function text(el) {
    return (el?.textContent || "").trim();
  }

  function oncePerSession(key, fn) {
    try {
      if (sessionStorage.getItem(key)) return false;
      fn();
      sessionStorage.setItem(key, "1");
      return true;
    } catch {
      fn();
      return true;
    }
  }

  function fireProView() {
    oncePerSession("ss_pro_view_sent", () => {
      pushDL("ss_pro_view", {
        page_title: document.title || "SafeShare Pro",
        page_path: location.pathname || "/pro/",
        page_location: location.href
      });
    });
  }

  // Plan CTAs (.js-plan-select)
  function bindPlanSelectTracking() {
    const planCtas = Array.from(document.querySelectorAll(".js-plan-select"));
    if (!planCtas.length) return;

    planCtas.forEach((el) => {
      el.addEventListener("click", () => {
        const plan =
          el.getAttribute("data-plan") ||
          el.dataset?.plan ||
          text(el).toLowerCase().replace(/\s+/g, "_") ||
          "unknown";

        const valueRaw = el.getAttribute("data-value") || el.dataset?.value || "";
        const value = toNumberOrNull(valueRaw);
        const currency = el.getAttribute("data-currency") || el.dataset?.currency || "EUR";
        const section = el.closest("section")?.getAttribute("aria-labelledby") || "unknown_section";

        pushDL("ss_pro_plan_click", {
          plan,
          value,
          currency,
          section,
          cta_text: text(el) || "select_plan",
          cta_href: el.getAttribute("href") || null,
          outbound: true
        });
      });
    });
  }

  // Non-plan CTAs (e.g. Try free app first)
  function bindSecondaryCtaTracking() {
    const ctas = Array.from(document.querySelectorAll(".ss-actions a.ss-btn:not(.js-plan-select)"));
    if (!ctas.length) return;

    ctas.forEach((el) => {
      el.addEventListener("click", () => {
        const section = el.closest("section")?.getAttribute("aria-labelledby") || "unknown_section";
        pushDL("ss_pro_secondary_cta_click", {
          cta_text: text(el),
          cta_href: el.getAttribute("href") || null,
          section
        });
      });
    });
  }

  // FAQ opens
  function bindFaqTracking() {
    const faqDetails = Array.from(document.querySelectorAll("section[aria-labelledby='faq-title'] details"));
    if (!faqDetails.length) return;

    faqDetails.forEach((el, idx) => {
      el.addEventListener("toggle", () => {
        if (!el.open) return;
        pushDL("ss_pro_faq_open", {
          index: idx + 1,
          question: text(el.querySelector("summary"))
        });
      });
    });
  }

  // Optional scroll depth
  function bindScrollDepthTracking() {
    let sent = false;

    function getScrollPercent() {
      const d = document.documentElement;
      const b = document.body;
      const scrollTop = window.pageYOffset || d.scrollTop || b.scrollTop || 0;
      const scrollHeight = Math.max(
        b.scrollHeight, d.scrollHeight,
        b.offsetHeight, d.offsetHeight,
        b.clientHeight, d.clientHeight
      );
      const clientHeight = d.clientHeight || window.innerHeight || 0;
      const denom = scrollHeight - clientHeight;
      if (denom <= 0) return 100;
      return Math.min(100, Math.max(0, (scrollTop / denom) * 100));
    }

    function onScroll() {
      if (sent) return;
      if (getScrollPercent() >= 75) {
        sent = true;
        pushDL("ss_pro_scroll_depth", { percent: 75 });
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function init() {
    fireProView();
    bindPlanSelectTracking();
    bindSecondaryCtaTracking();
    bindFaqTracking();
    bindScrollDepthTracking();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

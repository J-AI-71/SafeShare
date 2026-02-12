/* File: /js/pro.js */
/* SafeShare Pro page controller + GTM events v2026-02-12-01 */

(() => {
  "use strict";

  /* =========================
     dataLayer helper
     ========================= */
  window.dataLayer = window.dataLayer || [];

  function getLang() {
    // Priority: <html lang> -> body data-lang -> fallback "de"
    return (
      document.documentElement.lang ||
      document.body?.dataset?.lang ||
      "de"
    ).toLowerCase();
  }

  function getPageType() {
    // Priority: body data-page-type -> body data-page -> fallback "pro"
    return (
      document.body?.dataset?.pageType ||
      document.body?.dataset?.page ||
      "pro"
    ).toLowerCase();
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

  /* =========================
     Utilities
     ========================= */
  function toNumberOrNull(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  function text(el) {
    return (el?.textContent || "").trim();
  }

  // Session dedupe helper (prevents duplicate "view" fire in same tab session)
  function oncePerSession(key, fn) {
    try {
      if (sessionStorage.getItem(key)) return false;
      fn();
      sessionStorage.setItem(key, "1");
      return true;
    } catch {
      // If sessionStorage blocked, still execute once in this call
      fn();
      return true;
    }
  }

  /* =========================
     1) Pro page view event
     ========================= */
  function fireProView() {
    oncePerSession("ss_pro_view_sent", () => {
      pushDL("ss_pro_view", {
        page_title: document.title || "SafeShare Pro",
        page_path: location.pathname || "/pro/",
        page_location: location.href
      });
    });
  }

  /* =========================
     2) Plan select tracking
     =========================
     Expects buttons/links with class:
       .js-plan-select

     Recommended data attributes on each CTA:
       data-plan="supporter|pro_person|pro_team"
       data-value="9|49|249"
       data-currency="EUR" (optional, fallback EUR)
  */
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

        const valueRaw =
          el.getAttribute("data-value") ||
          el.dataset?.value ||
          "";

        const value = toNumberOrNull(valueRaw);
        const currency =
          el.getAttribute("data-currency") ||
          el.dataset?.currency ||
          "EUR";

        pushDL("ss_pro_plan_select", {
          plan,
          value,            // number | null
          currency,
          cta_text: text(el) || "select_plan",
          cta_href: el.getAttribute("href") || null,
          outbound: true
        });
      });
    });
  }

  /* =========================
     3) Scroll depth on Pro page
     =========================
     Fires once when reaching >= 75%
  */
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
      const pct = getScrollPercent();
      if (pct >= 75) {
        sent = true;
        pushDL("ss_pro_scroll_depth", {
          percent: 75
        });
        window.removeEventListener("scroll", onScroll, { passive: true });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once in case page is short
    onScroll();
  }

  /* =========================
     Init
     ========================= */
  function init() {
    fireProView();
    bindPlanSelectTracking();
    bindScrollDepthTracking();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

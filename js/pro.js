/* File: /js/pro.js */
/* SafeShare Pro page controller + GTM events v2026-02-12-02
   Events aligned to GTM triggers:
   - ss_pro_view
   - ss_pro_plan_click
   - ss_pro_secondary_cta_click
   - ss_pro_faq_open
   - ss_pro_scroll_depth
*/

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

  function text(el) {
    return (el?.textContent || "").trim();
  }

  function toNumberOrNull(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
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

  function nearestSectionId(el) {
    const sec = el?.closest("section[id], section[aria-labelledby]");
    if (!sec) return "unknown";
    if (sec.id) return sec.id;
    return sec.getAttribute("aria-labelledby") || "unknown";
  }

  /* 1) View */
  function fireProView() {
    oncePerSession("ss_pro_view_sent", () => {
      pushDL("ss_pro_view", {
        page_title: document.title || "SafeShare Pro",
        page_path: location.pathname || "/pro/",
        page_location: location.href
      });
    });
  }

  /* 2) Plan CTA clicks (PRIMARY) */
  function bindPlanClicks() {
    const planCtas = Array.from(document.querySelectorAll(".js-plan-select"));
    if (!planCtas.length) return;

    planCtas.forEach((el) => {
      el.addEventListener("click", () => {
        const plan =
          el.getAttribute("data-plan") ||
          el.dataset?.plan ||
          text(el).toLowerCase().replace(/\s+/g, "_") ||
          "unknown";

        const value = toNumberOrNull(el.getAttribute("data-value") || el.dataset?.value || "");
        const currency = el.getAttribute("data-currency") || el.dataset?.currency || "EUR";

        pushDL("ss_pro_plan_click", {
          plan,
          value,
          currency,
          cta_text: text(el) || "select_plan",
          cta_href: el.getAttribute("href") || null,
          section: nearestSectionId(el),
          outbound: true
        });
      });
    });
  }

  /* 3) Secondary CTAs (ghost/neutral links/buttons, not .js-plan-select) */
  function bindSecondaryCtas() {
    const allCtas = Array.from(document.querySelectorAll("a.ss-btn, button.ss-btn"));
    if (!allCtas.length) return;

    allCtas.forEach((el) => {
      // primary plan buttons are tracked in ss_pro_plan_click
      if (el.classList.contains("js-plan-select")) return;

      el.addEventListener("click", () => {
        const href = el.tagName.toLowerCase() === "a" ? (el.getAttribute("href") || null) : null;

        pushDL("ss_pro_secondary_cta_click", {
          cta_text: text(el) || "secondary_cta",
          cta_href: href,
          section: nearestSectionId(el)
        });
      });
    });
  }

  /* 4) FAQ open */
  function bindFaqOpen() {
    const details = Array.from(document.querySelectorAll(".ss-details"));
    if (!details.length) return;

    details.forEach((d) => {
      d.addEventListener("toggle", () => {
        if (!d.open) return; // only when opened
        const q = text(d.querySelector("summary")) || "unknown";
        pushDL("ss_pro_faq_open", {
          question: q
        });
      });
    });
  }

  /* 5) Scroll depth >=75% once */
  function bindScrollDepth() {
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
        pushDL("ss_pro_scroll_depth", { percent: 75 });
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function init() {
    fireProView();
    bindPlanClicks();
    bindSecondaryCtas();
    bindFaqOpen();
    bindScrollDepth();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

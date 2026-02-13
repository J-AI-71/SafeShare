/* File: /js/pro.js */
/* SafeShare Pro page controller + GTM events v2026-02-13-01
   Events:
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

  function getSectionFromEl(el) {
    const sectionEl = el?.closest?.("section[id], section[aria-labelledby], .ss-section");
    if (!sectionEl) return "unknown";

    if (sectionEl.dataset?.section) return String(sectionEl.dataset.section).toLowerCase();
    if (sectionEl.id) return String(sectionEl.id).toLowerCase();

    const labelledBy = sectionEl.getAttribute("aria-labelledby");
    if (labelledBy) return labelledBy.replace(/-title$/i, "").toLowerCase();

    return "unknown";
  }

  function normalizePlanFromEl(el) {
    const raw =
      el?.getAttribute?.("data-plan") ||
      el?.dataset?.plan ||
      "";

    const v = String(raw).toLowerCase().trim();

    if (!v) return "unknown";
    if (v === "pro_person" || v === "pro-person" || v === "pro_personal" || v === "personal") return "pro_person";
    if (v === "pro_team" || v === "pro-team" || v === "team") return "pro_team";
    if (v === "supporter") return "supporter";
    if (v === "free_app" || v === "free-app" || v === "app") return "free_app";
    return v;
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

  /* 2) Plan clicks: any CTA with data-plan on pro page */
  function bindPlanClicks() {
    const planCtas = Array.from(document.querySelectorAll("a.ss-btn[data-plan], button.ss-btn[data-plan], .js-plan-select[data-plan]"));
    if (!planCtas.length) return;

    planCtas.forEach((el) => {
      el.addEventListener("click", () => {
        const plan = normalizePlanFromEl(el);
        const value = toNumberOrNull(el.getAttribute("data-value") || el.dataset?.value || "");
        const currency = el.getAttribute("data-currency") || el.dataset?.currency || "EUR";
        const href = el.tagName.toLowerCase() === "a" ? (el.getAttribute("href") || null) : null;

        pushDL("ss_pro_plan_click", {
          plan,
          value,
          currency,
          cta_text: text(el) || "select_plan",
          cta_href: href,
          section: getSectionFromEl(el),
          outbound: !!(href && /^https?:\/\//i.test(href))
        });
      });
    });
  }

  /* 3) Secondary CTA clicks: all ss-btn without data-plan */
  function bindSecondaryCtas() {
    const allCtas = Array.from(document.querySelectorAll("a.ss-btn, button.ss-btn"));
    if (!allCtas.length) return;

    allCtas.forEach((el) => {
      if (el.hasAttribute("data-plan") || el.classList.contains("js-plan-select")) return;

      el.addEventListener("click", () => {
        const href = el.tagName.toLowerCase() === "a" ? (el.getAttribute("href") || null) : null;

        pushDL("ss_pro_secondary_cta_click", {
          cta_text: text(el) || "secondary_cta",
          cta_href: href,
          section: getSectionFromEl(el)
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
        if (!d.open) return;
        const q = text(d.querySelector("summary")) || "unknown";
        pushDL("ss_pro_faq_open", { question: q });
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

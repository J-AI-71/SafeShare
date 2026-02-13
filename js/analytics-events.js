/* File: /js/analytics-events.js */
/* SafeShare Analytics Events v2026-02-13-01 */
(() => {
  "use strict";

  // ---------- Helpers ----------
  function getLang() {
    const p = (location.pathname || "/").toLowerCase();
    return p.startsWith("/en/") ? "en" : "de";
  }

  function getPageType() {
    // 1) optional explicit marker on <body data-page-type="...">
    const explicit = document.body?.getAttribute("data-page-type");
    if (explicit) return explicit;

    // 2) infer from pathname
    const p = (location.pathname || "/").toLowerCase();

    if (p === "/" || p === "/en/" || p === "/index.html" || p === "/en/index.html") return "home";
    if (p.includes("/pro")) return "pro";
    if (p.includes("/app")) return "app";
    if (p.includes("/hilfe") || p.includes("/help")) return "help";
    if (p.includes("/schule") || p.includes("/school")) return "school";
    return "content";
  }

  function textOf(el) {
    return (el?.textContent || "").replace(/\s+/g, " ").trim();
  }

  function pushEvent(eventName, params = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      lang: getLang(),
      page_type: getPageType(),
      ...params
    });
  }

  // ---------- Click tracking ----------
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("a,button");
    if (!a) return;

    // A) Pro pricing plan click
    // Expected class: .js-plan-select
    if (a.matches(".js-plan-select")) {
      pushEvent("ss_pro_plan_click", {
        plan: a.getAttribute("data-plan") || "",
        value: a.getAttribute("data-value") || "",
        section: a.getAttribute("data-section") || "pricing",
        cta_text: textOf(a),
        cta_href: a.getAttribute("href") || ""
      });
      return;
    }

    // B) Pro secondary CTA
    // Expected class: .js-pro-secondary-cta
    if (a.matches(".js-pro-secondary-cta")) {
      pushEvent("ss_pro_secondary_cta_click", {
        section: a.getAttribute("data-section") || "",
        cta_text: textOf(a),
        cta_href: a.getAttribute("href") || ""
      });
      return;
    }

    // C) Generic CTA (optional broad tracking)
    // Add class .js-cta-track where needed
    if (a.matches(".js-cta-track")) {
      pushEvent("ss_cta_click", {
        section: a.getAttribute("data-section") || "",
        cta_text: textOf(a),
        cta_href: a.getAttribute("href") || "",
        cta_id: a.id || "",
        cta_class: a.className || ""
      });
      return;
    }

    // D) FAQ question click (works with details/summary or custom elements)
    // Add: data-faq-question="..."
    const faqEl = ev.target.closest("[data-faq-question]");
    if (faqEl) {
      pushEvent("ss_faq_click", {
        question: faqEl.getAttribute("data-faq-question") || textOf(faqEl),
        section: faqEl.getAttribute("data-section") || "faq"
      });
    }
  });

  // ---------- Scroll depth tracking ----------
  // Fires once per threshold
  const thresholds = [25, 50, 75, 90];
  const fired = new Set();

  function calcScrollPercent() {
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
    const scrollHeight = Math.max(
      body.scrollHeight, doc.scrollHeight,
      body.offsetHeight, doc.offsetHeight,
      body.clientHeight, doc.clientHeight
    );
    const viewport = window.innerHeight || doc.clientHeight || 0;
    const trackLen = Math.max(scrollHeight - viewport, 1);
    return Math.max(0, Math.min(100, Math.round((scrollTop / trackLen) * 100)));
  }

  function onScroll() {
    const p = calcScrollPercent();
    for (const t of thresholds) {
      if (p >= t && !fired.has(t)) {
        fired.add(t);
        pushEvent("ss_scroll_depth", {
          percent: String(t),
          section: "page"
        });
      }
    }
  }

  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      onScroll();
      scrollTicking = false;
    });
  }, { passive: true });

  // initial check (short pages can instantly hit thresholds)
  onScroll();

})();

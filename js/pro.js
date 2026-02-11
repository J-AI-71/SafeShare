/* File: /js/pro.js */
/* Zentrales Tracking für /pro/ und /en/pro/ */

(() => {
  "use strict";

  function track(eventName, payload) {
    if (typeof window.ssTrack === "function") {
      window.ssTrack(eventName, payload || {});
    }
  }

  function bindProEvents() {
    track("ss_pro_view", {
      source: "page_load",
      plan: "none",
      experiment_id: "pricing_anchor_01",
      variant: "A"
    });

    const links = document.querySelectorAll(".js-plan-select");
    if (!links.length) return;

    links.forEach((el) => {
      el.addEventListener("click", () => {
        const plan = el.getAttribute("data-plan") || "none";
        const value = Number(el.getAttribute("data-value") || 0);
        const target_href = el.getAttribute("href") || "";

        track("ss_plan_select", {
          source: "pro_table",
          plan,
          value,
          currency: "EUR",
          target_href,
          experiment_id: "pricing_anchor_01",
          variant: "A"
        });

        track("ss_checkout_click", {
          source: "pro_table",
          plan,
          value,
          currency: "EUR",
          target_href,
          experiment_id: "pricing_anchor_01",
          variant: "A"
        });
      }, { passive: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindProEvents, { once: true });
  } else {
    bindProEvents();
  }
})();

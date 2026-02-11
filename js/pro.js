/* File: /js/pro.js (neu, optional aber sauber) */
/* Zentrales Tracking für /pro/ und /en/pro/ */

(() => {
  "use strict";

  function bindProEvents() {
    ssTrack("ss_pro_view", {
      source: "page_load",
      plan: "none",
      experiment_id: "pricing_anchor_01",
      variant: "A"
    });

    document.querySelectorAll(".js-plan-select").forEach((el) => {
      el.addEventListener("click", () => {
        const plan = el.getAttribute("data-plan") || "none";
        const value = Number(el.getAttribute("data-value") || 0);

        ssTrack("ss_plan_select", {
          source: "pro_table",
          plan,
          value,
          currency: "EUR",
          experiment_id: "pricing_anchor_01",
          variant: "A"
        });

        ssTrack("ss_checkout_click", {
          source: "pro_table",
          plan,
          value,
          currency: "EUR",
          experiment_id: "pricing_anchor_01",
          variant: "A"
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindProEvents);
  } else {
    bindProEvents();
  }
})();

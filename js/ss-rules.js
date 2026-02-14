/* File: /js/ss-rules.js */
/* SafeShare cleaning rules – Master-Flow strict
   Used by /js/app.js via window.SS_RULES
*/

(() => {
  "use strict";

  const WIN = window;

  // ---- Exact params that are typically tracking-only ----
  const DROP_EXACT = [
    "fbclid",
    "gclid",
    "dclid",
    "msclkid",
    "ttclid",
    "twclid",
    "li_fat_id",
    "epik",
    "yclid",
    "mc_cid",
    "mc_eid",
    "_hsenc",
    "_hsmi",
    "mkt_tok",
    "vero_id",
    "vero_conv",
    "wickedid",
    "rb_clickid",
    "s_cid",
    "zanpid",
    "cmpid",
    "igshid",
    "gbraid",
    "wbraid"
  ];

  // ---- Prefix-based tracking params ----
  const DROP_PREFIX = [
    "utm_",      // utm_source, utm_medium, ...
    "pk_",       // Matomo campaign params
    "mtm_",      // Matomo Tag Manager params
    "hsa_",      // HubSpot ads params
    "icn_",      // campaign variants in some systems
    "ici_",      // campaign variants in some systems
    "oly_",      // Olytics params
    "vero_"      // Vero
  ];

  // ---- Keys that are often destination-relevant and should survive in STANDARD mode ----
  const KEEP_EXACT = [
    // generic search / state
    "q",
    "query",
    "search",
    "s",
    "p",
    "page",
    "lang",
    "locale",
    "ref",
    "v",
    "t",

    // ids often needed for content resolution
    "id",
    "story",
    "article",
    "item",
    "post",
    "video",
    "playlist",
    "list",
    "si",
    "spm",

    // commerce/navigation-ish
    "sku",
    "variant",
    "color",
    "size",
    "sort",
    "filter",

    // google/maps-ish real query context
    "kgmid",
    "tbm",
    "uule"
  ];

  // ---- Optional domain overrides for future extension ----
  // Pattern: host -> { keepExact: [], dropExact: [], dropPrefix: [] }
  // app.js can ignore this today; keeping structure ready for next phase.
  const DOMAIN_OVERRIDES = {
    "youtube.com": {
      keepExact: ["v", "t", "list", "si"],
      dropExact: [],
      dropPrefix: []
    },
    "www.youtube.com": {
      keepExact: ["v", "t", "list", "si"],
      dropExact: [],
      dropPrefix: []
    },
    "youtu.be": {
      keepExact: ["t", "si"],
      dropExact: [],
      dropPrefix: []
    },
    "google.com": {
      keepExact: ["q", "tbm", "kgmid", "uule"],
      dropExact: [],
      dropPrefix: []
    },
    "www.google.com": {
      keepExact: ["q", "tbm", "kgmid", "uule"],
      dropExact: [],
      dropPrefix: []
    }
  };

  // Publish one stable object
  WIN.SS_RULES = Object.freeze({
    version: "2026-02-14-ss-rules-01",
    dropExact: Object.freeze([...DROP_EXACT]),
    dropPrefix: Object.freeze([...DROP_PREFIX]),
    keepExact: Object.freeze([...KEEP_EXACT]),
    domainOverrides: Object.freeze(DOMAIN_OVERRIDES)
  });
})();

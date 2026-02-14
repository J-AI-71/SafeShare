/* File: /js/ss-shell.js */
/* SafeShare Master-Flow strict – single complete file (FINAL full-nav mobile+desktop + tracking core) */

(() => {
  "use strict";

  const DOC = document;
  const WIN = window;

  const SUPPORT_EMAIL = "listings@safesharepro.com";
  const LOGO_SRC = "/assets/brand/mark-192.png";
  const LOGO_ALT = "SafeShare Logo";
  const GTM_ID = "GTM-T86R3H7T";

  // ===== Tracking Core (central) =====
  WIN.SS_CONFIG = WIN.SS_CONFIG || {};
  if (!WIN.SS_CONFIG.gtmId) WIN.SS_CONFIG.gtmId = GTM_ID;
  if (!WIN.SS_CONFIG.brand) WIN.SS_CONFIG.brand = "SafeShare";

  WIN.dataLayer = WIN.dataLayer || [];

  const BLOCKED_TRACK_KEYS = new Set(["email", "name", "full_name", "phone", "address"]);
  let SHELL_READY_TRACKED = false;

  function getTrackLang() {
    return (
      DOC.documentElement.lang ||
      (DOC.body && DOC.body.dataset && DOC.body.dataset.lang) ||
      "de"
    ).toLowerCase();
  }

  function getTrackPageType() {
    return (
      (DOC.body && DOC.body.dataset && DOC.body.dataset.page) ||
      "unknown"
    ).toLowerCase();
  }

  function sanitizePayload(payload) {
    if (!payload || typeof payload !== "object") return {};
    const out = {};
    for (const [k, v] of Object.entries(payload)) {
      if (!BLOCKED_TRACK_KEYS.has(String(k).toLowerCase())) out[k] = v;
    }
    return out;
  }

  WIN.ssTrack = WIN.ssTrack || function ssTrack(eventName, payload) {
    if (!eventName || typeof eventName !== "string") return;
    WIN.dataLayer.push({
      event: eventName,
      lang: getTrackLang(),
      page_type: getTrackPageType(),
      path: WIN.location.pathname || "/",
      ts: new Date().toISOString(),
      ...sanitizePayload(payload)
    });
  };

  // Optional alias (falls in alten Dateien ssTrackSafe verwendet wird)
  WIN.ssTrackSafe = WIN.ssTrackSafe || function ssTrackSafe(eventName, payload) {
    WIN.ssTrack(eventName, payload);
  };

  function trackShellReadyOnce() {
    if (SHELL_READY_TRACKED) return;
    SHELL_READY_TRACKED = true;
    WIN.ssTrack("ss_shell_ready", { source: "shell_boot" });
  }

  // ===== Slug mapping DE <-> EN =====
  const DE_TO_EN = {
    "": "",
    "app": "app",
    "hilfe": "help",
    "pro": "pro",
    "schule": "school",
    "lesezeichen": "bookmarks",
    "datenschutz": "privacy",
    "nutzungsbedingungen": "terms",
    "impressum": "imprint",
    "tracking-parameter": "tracking-parameters",
    "utm-parameter-entfernen": "remove-utm-parameter",
    "url-cleaner-tool-vergleich": "url-cleaner-comparison",
    "email-links-bereinigen": "email-link-cleaning",
    "messenger-links-bereinigen": "messenger-link-cleaning",
    "social-links-bereinigen": "social-link-cleaning",
    "datenschutz-beim-link-teilen": "privacy-when-sharing-links",
    "shortcuts": "shortcuts",
    "show-share": "show-share"
  };

  const EN_TO_DE = Object.fromEntries(
    Object.entries(DE_TO_EN).map(([de, en]) => [en, de])
  );

  // ===== Full desktop/mobile nav (always full) =====
  const NAV_DE = [
    { label: "Start", href: "/" },
    { label: "App", href: "/app/" },
    { label: "Hilfe", href: "/hilfe/" },
    { label: "Pro", href: "/pro/" },
    { label: "Schule", href: "/schule/" },
    { label: "EN", action: "switchLang" }
  ];

  const NAV_EN = [
    { label: "Home", href: "/en/" },
    { label: "App", href: "/en/app/" },
    { label: "Help", href: "/en/help/" },
    { label: "Pro", href: "/en/pro/" },
    { label: "School", href: "/en/school/" },
    { label: "DE", action: "switchLang" }
  ];

  // ===== More menu groups =====
  const MORE_GROUPS_DE = [
    {
      title: "Produkt",
      items: [
        { label: "Lesezeichen", href: "/lesezeichen/", meta: "Tools" },
        { label: "Shortcuts", href: "/shortcuts/", meta: "Tool" },
        { label: "Show Share", href: "/show-share/", meta: "Tool" }
      ]
    },
    {
      title: "Guides",
      items: [
        { label: "Tracking-Parameter", href: "/tracking-parameter/", meta: "Guide" },
        { label: "UTM entfernen", href: "/utm-parameter-entfernen/", meta: "Guide" },
        { label: "Tool-Vergleich", href: "/url-cleaner-tool-vergleich/", meta: "Guide" },
        { label: "E-Mail-Links", href: "/email-links-bereinigen/", meta: "Use case" },
        { label: "Messenger-Links", href: "/messenger-links-bereinigen/", meta: "Use case" },
        { label: "Social-Links", href: "/social-links-bereinigen/", meta: "Use case" },
        { label: "Datenschutz beim Teilen", href: "/datenschutz-beim-link-teilen/", meta: "Guide" }
      ]
    },
    {
      title: "Recht & Kontakt",
      items: [
        { label: "Datenschutz", href: "/datenschutz/", meta: "Legal" },
        { label: "Nutzungsbedingungen", href: "/nutzungsbedingungen/", meta: "Legal" },
        { label: "Impressum", href: "/impressum/", meta: "Legal" },
        { label: "Support", href: `mailto:${SUPPORT_EMAIL}`, meta: "Kontakt" }
      ]
    }
  ];

  const MORE_GROUPS_EN = [
    {
      title: "Product",
      items: [
        { label: "Bookmarks", href: "/en/bookmarks/", meta: "Tools" },
        { label: "Shortcuts", href: "/en/shortcuts/", meta: "Tool" },
        { label: "Show Share", href: "/en/show-share/", meta: "Tool" }
      ]
    },
    {
      title: "Guides",
      items: [
        { label: "Tracking Parameters", href: "/en/tracking-parameters/", meta: "Guide" },
        { label: "Remove UTM Parameter", href: "/en/remove-utm-parameter/", meta: "Guide" },
        { label: "Cleaner Comparison", href: "/en/url-cleaner-comparison/", meta: "Guide" },
        { label: "Email Link Cleaning", href: "/en/email-link-cleaning/", meta: "Use case" },
        { label: "Messenger Link Cleaning", href: "/en/messenger-link-cleaning/", meta: "Use case" },
        { label: "Social Link Cleaning", href: "/en/social-link-cleaning/", meta: "Use case" },
        { label: "Privacy when Sharing Links", href: "/en/privacy-when-sharing-links/", meta: "Guide" }
      ]
    },
    {
      title: "Legal & Contact",
      items: [
        { label: "Privacy", href: "/en/privacy/", meta: "Legal" },
        { label: "Terms", href: "/en/terms/", meta: "Legal" },
        { label: "Imprint", href: "/en/imprint/", meta: "Legal" },
        { label: "Support", href: `mailto:${SUPPORT_EMAIL}`, meta: "Contact" }
      ]
    }
  ];

  // ===== compact footer =====
  const FOOTER_DE = [
    { label: "Start", href: "/" },
    { label: "App", href: "/app/" },
    { label: "Datenschutz", href: "/datenschutz/" },
    { label: "Impressum", href: "/impressum/" }
  ];

  const FOOTER_EN = [
    { label: "Home", href: "/en/" },
    { label: "App", href: "/en/app/" },
    { label: "Privacy", href: "/en/privacy/" },
    { label: "Imprint", href: "/en/imprint/" }
  ];

  // ===== utils =====
  const sanitizePath = (p) => {
    let s = p || "/";
    s = s.replace(/\/{2,}/g, "/");
    if (!s.endsWith("/")) s += "/";
    return s;
  };

  const currentPath = () => sanitizePath(WIN.location.pathname);
  const isEN = (p) => p === "/en/" || p.startsWith("/en/");
  const lang = () => (isEN(currentPath()) ? "en" : "de");
  const trim = (s) => (s || "").replace(/^\/+|\/+$/g, "");

  const getSlug = (path, l) => {
    const p = sanitizePath(path);
    return l === "en" ? trim(p.replace(/^\/en\//, "")) : trim(p);
  };

  const buildPath = (l, slug) => {
    const s = (slug || "").trim();
    return l === "en" ? (s ? `/en/${s}/` : "/en/") : (s ? `/${s}/` : "/");
  };

  const mapSlug = (slug, from) =>
    from === "de"
      ? (Object.prototype.hasOwnProperty.call(DE_TO_EN, slug) ? DE_TO_EN[slug] : slug)
      : (Object.prototype.hasOwnProperty.call(EN_TO_DE, slug) ? EN_TO_DE[slug] : slug);

  const esc = (str) => String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const findActive = (path, nav) => {
    let best = "/";
    for (const i of nav) {
      if (!i.href) continue;
      const h = sanitizePath(i.href);
      if (path === h || path.startsWith(h)) {
        if (h.length > best.length) best = h;
      }
    }
    return best;
  };

  function goTopImmediate() {
    WIN.scrollTo(0, 0);
    DOC.documentElement.scrollTop = 0;
    DOC.body.scrollTop = 0;
  }

  function ensureFooterSlot() {
    let slot = DOC.getElementById("ss-footer-slot");
    if (!slot) {
      slot = DOC.createElement("div");
      slot.id = "ss-footer-slot";
      DOC.body.appendChild(slot);
    } else {
      DOC.body.appendChild(slot);
    }
    return slot;
  }

  function switchLanguage() {
    const from = lang();
    const to = from === "de" ? "en" : "de";
    const fromSlug = getSlug(currentPath(), from);
    const toSlug = mapSlug(fromSlug, from);

    WIN.ssTrack("ss_lang_switch", {
      source: "header_nav",
      from_lang: from,
      to_lang: to,
      from_slug: fromSlug || "",
      to_slug: toSlug || ""
    });

    try { sessionStorage.setItem("ss_scroll_top_next", "1"); } catch (_) {}
    goTopImmediate();
    WIN.location.href = buildPath(to, toSlug);
  }

  function renderGroupedMore(groups) {
    return groups.map(group => `
      <section class="ss-group">
        <h3 class="ss-group__title">${esc(group.title)}</h3>
        <ul class="ss-list">
          ${group.items.map(item => `
            <li>
              <a href="${item.href}" class="ss-list__a">
                <span>${esc(item.label)}</span>
                <span class="ss-list__meta">${esc(item.meta || "")}</span>
              </a>
            </li>
          `).join("")}
        </ul>
      </section>
    `).join("");
  }

  function buildNavItems() {
    return lang() === "de" ? NAV_DE : NAV_EN;
  }

  function renderHeaderAndMore() {
    DOC.querySelectorAll("header.ss-shell, #ssBackdrop, #ssSheet").forEach(el => el.remove());

    const l = lang();
    const navItems = buildNavItems();
    const groups = l === "en" ? MORE_GROUPS_EN : MORE_GROUPS_DE;
    const active = findActive(currentPath(), navItems);

    const header = DOC.createElement("header");
    header.className = "ss-shell";
    header.innerHTML = `
      <div class="ss-shell__inner">
        <a class="ss-brand" href="${l === "en" ? "/en/" : "/"}" aria-label="SafeShare Home">
          <span class="ss-brand__mark" aria-hidden="true">
            <img src="${LOGO_SRC}" alt="${esc(LOGO_ALT)}" loading="eager" decoding="async">
          </span>
          <span class="ss-brand__txt">SafeShare</span>
        </a>

        <div class="ss-navLane">
          <nav class="ss-nav" aria-label="${l === "en" ? "Main navigation" : "Hauptnavigation"}">
            ${navItems.map(i => i.action === "switchLang"
              ? `<a class="ss-nav__link" href="#" data-action="switchLang">${esc(i.label)}</a>`
              : `<a class="ss-nav__link${sanitizePath(i.href) === active ? " is-active" : ""}" href="${i.href}">${esc(i.label)}</a>`
            ).join("")}
          </nav>
        </div>

        <div class="ss-actions ss-more">
          <button class="ss-iconBtn" id="ssMoreBtn" type="button"
            aria-haspopup="dialog" aria-controls="ssSheet" aria-expanded="false"
            aria-label="${l === "en" ? "Open menu" : "Menü öffnen"}">
            <svg class="ss-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    DOC.body.prepend(header);

    const backdrop = DOC.createElement("div");
    backdrop.id = "ssBackdrop";
    backdrop.className = "ss-backdrop";
    DOC.body.appendChild(backdrop);

    const sheet = DOC.createElement("section");
    sheet.id = "ssSheet";
    sheet.className = "ss-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-label", l === "en" ? "More menu" : "Mehr Menü");
    sheet.innerHTML = `
      <div class="ss-sheet__grip" aria-hidden="true"></div>
      <div class="ss-sheet__head">
        <h2 class="ss-sheet__title">${l === "en" ? "More" : "Mehr"}</h2>
        <button class="ss-iconBtn" id="ssCloseBtn" type="button"
          aria-label="${l === "en" ? "Close menu" : "Menü schließen"}">
          <svg class="ss-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.31z"></path>
          </svg>
        </button>
      </div>
      <div class="ss-sheet__body">
        ${renderGroupedMore(groups)}
      </div>
    `;
    DOC.body.appendChild(sheet);
  }

  function renderFooter() {
    const slot = ensureFooterSlot();
    slot.innerHTML = "";

    const l = lang();
    const links = l === "en" ? FOOTER_EN : FOOTER_DE;
    const year = new Date().getFullYear();

    const footer = DOC.createElement("footer");
    footer.className = "ss-siteFooter";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = `
      <div class="ss-siteFooter__top">
        <div class="ss-siteFooter__brand">
          <img src="${LOGO_SRC}" alt="${esc(LOGO_ALT)}" class="ss-siteFooter__brandMark">
          SafeShare
        </div>
        <nav class="ss-siteFooter__links" aria-label="${l === "en" ? "Footer navigation" : "Footer Navigation"}">
          ${links.map(i => `<a href="${i.href}">${esc(i.label)}</a>`).join("")}
        </nav>
      </div>
      <div class="ss-siteFooter__meta">© ${year} SafeShare</div>
    `;
    slot.appendChild(footer);
  }

  function renderFooterFallback() {
    let slot = DOC.getElementById("ss-footer-slot");
    if (!slot) {
      slot = DOC.createElement("div");
      slot.id = "ss-footer-slot";
      DOC.body.appendChild(slot);
    }
    if (slot.querySelector(".ss-siteFooter")) return;

    const year = new Date().getFullYear();
    const en = isEN(currentPath());
    slot.innerHTML = `
      <footer class="ss-siteFooter" role="contentinfo">
        <div class="ss-siteFooter__top">
          <div class="ss-siteFooter__brand">SafeShare</div>
          <nav class="ss-siteFooter__links" aria-label="Footer navigation">
            <a href="${en ? "/en/" : "/"}">${en ? "Home" : "Start"}</a>
            <a href="${en ? "/en/app/" : "/app/"}">App</a>
            <a href="${en ? "/en/privacy/" : "/datenschutz/"}">${en ? "Privacy" : "Datenschutz"}</a>
            <a href="${en ? "/en/imprint/" : "/impressum/"}">${en ? "Imprint" : "Impressum"}</a>
          </nav>
        </div>
        <div class="ss-siteFooter__meta">© ${year} SafeShare</div>
      </footer>
    `;
  }

  function bindEvents() {
    const moreBtn = DOC.getElementById("ssMoreBtn");
    const closeBtn = DOC.getElementById("ssCloseBtn");
    const backdrop = DOC.getElementById("ssBackdrop");
    const sheet = DOC.getElementById("ssSheet");

    if (moreBtn && closeBtn && backdrop && sheet) {
      let lastFocus = null;

      const openSheet = () => {
        lastFocus = DOC.activeElement;
        backdrop.classList.add("is-open");
        sheet.classList.add("is-open");
        DOC.body.classList.add("ss-no-scroll");
        moreBtn.setAttribute("aria-expanded", "true");
        closeBtn.focus();
        WIN.ssTrack("ss_more_open", { source: "header_more_button" });
      };

      const closeSheet = () => {
        backdrop.classList.remove("is-open");
        sheet.classList.remove("is-open");
        DOC.body.classList.remove("ss-no-scroll");
        moreBtn.setAttribute("aria-expanded", "false");
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
        WIN.ssTrack("ss_more_close", { source: "sheet_close" });
      };

      moreBtn.addEventListener("click", openSheet);
      closeBtn.addEventListener("click", closeSheet);
      backdrop.addEventListener("click", closeSheet);

      DOC.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape" && sheet.classList.contains("is-open")) {
          ev.preventDefault();
          closeSheet();
        }
      });
    }

    DOC.querySelectorAll('[data-action="switchLang"]').forEach(el => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        switchLanguage();
      });
    });

    DOC.querySelectorAll(".ss-nav a[href], .ss-list a[href], .ss-siteFooter a[href], .ss-brand[href]").forEach(a => {
      a.addEventListener("click", () => {
        const href = a.getAttribute("href") || "";
        WIN.ssTrack("ss_nav_click", {
          source: "shell_nav",
          target_href: href
        });

        if (
          href.startsWith("/") ||
          href.startsWith("./") ||
          href.startsWith("../") ||
          href.startsWith(WIN.location.origin)
        ) {
          try { sessionStorage.setItem("ss_scroll_top_next", "1"); } catch (_) {}
          goTopImmediate();
        }
      }, { passive: true });
    });

    const resetNavScroll = () => {
      const nav = DOC.querySelector(".ss-nav");
      if (!nav) return;
      nav.scrollLeft = 0;
    };

    // iOS-safe double tick
    requestAnimationFrame(() => {
      resetNavScroll();
      setTimeout(resetNavScroll, 60);
    });
    WIN.addEventListener("resize", resetNavScroll, { passive: true });
  }

  function boot() {
    try {
      DOC.documentElement.style.scrollBehavior = "auto";
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";

      try {
        if (sessionStorage.getItem("ss_scroll_top_next") === "1") {
          sessionStorage.removeItem("ss_scroll_top_next");
          goTopImmediate();
        }
      } catch (_) {}

      renderHeaderAndMore();
      renderFooter();
      bindEvents();
      trackShellReadyOnce();

      WIN.addEventListener("load", goTopImmediate, { once: true });
      WIN.addEventListener("pageshow", () => {
        try {
          if (sessionStorage.getItem("ss_scroll_top_next") === "1") {
            sessionStorage.removeItem("ss_scroll_top_next");
            goTopImmediate();
          }
        } catch (_) {}
      });
    } catch (err) {
      console.error("[ss-shell] boot failed:", err);
      renderFooterFallback();
    }
  }

  if (DOC.readyState === "loading") {
    DOC.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

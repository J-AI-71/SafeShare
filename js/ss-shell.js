/* File: /js/ss-shell.js */
/* SafeShare Master Shell — v2026-02-05-01
   - Zero inline
   - Deterministic DE/EN routing
   - EN schema: /en/<slug>/ (with *-cleaning slugs)
*/

(() => {
  "use strict";

  // -----------------------------
  // Version
  // -----------------------------
  const SHELL_VERSION = "v2026-02-05-01";

  // -----------------------------
  // Helpers
  // -----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);

  const normPath = (p) => {
    if (!p) return "/";
    let x = p.trim();
    if (!x.startsWith("/")) x = "/" + x;
    x = x.replace(/\/{2,}/g, "/");
    if (!x.endsWith("/")) x += "/";
    return x;
  };

  const currentPath = normPath(window.location.pathname);

  const isEnPath = (path) => normPath(path).startsWith("/en/");

  // -----------------------------
  // Route Map (single source of truth)
  // -----------------------------
  const ROUTES = {
    de: {
      home: "/",
      app: "/app/",
      pro: "/pro/",
      school: "/schule/",
      help: "/hilfe/",
      bookmarks: "/lesezeichen/",
      privacy: "/datenschutz/",
      terms: "/nutzungsbedingungen/",
      imprint: "/impressum/",

      trackingParameters: "/tracking-parameter/",
      removeUtm: "/utm-parameter-entfernen/",
      urlCleanerComparison: "/url-cleaner-tool-vergleich/",

      emailLinkCleaning: "/email-links-bereinigen/",
      messengerLinkCleaning: "/messenger-links-bereinigen/",
      socialLinkCleaning: "/social-links-bereinigen/"
    },

    en: {
      home: "/en/",
      app: "/en/app/",
      pro: "/en/pro/",
      school: "/en/school/",
      help: "/en/help/",
      bookmarks: "/en/bookmarks/",
      privacy: "/en/privacy/",
      terms: "/en/terms/",
      imprint: "/en/imprint/",

      trackingParameters: "/en/tracking-parameters/",
      removeUtm: "/en/remove-utm-parameter/",
      urlCleanerComparison: "/en/url-cleaner-comparison/",

      emailLinkCleaning: "/en/email-link-cleaning/",
      messengerLinkCleaning: "/en/messenger-link-cleaning/",
      socialLinkCleaning: "/en/social-link-cleaning/"
    }
  };

  const lang = isEnPath(currentPath) ? "en" : "de";
  const L = ROUTES[lang];

  // -----------------------------
  // Translation labels
  // -----------------------------
  const T = {
    de: {
      brand: "SafeShare",
      navStart: "Start",
      navApp: "App",
      navPro: "Pro",
      navSchool: "Schule",
      navHelp: "Hilfe",
      navMore: "Mehr",

      moreBookmarks: "Lesezeichen",
      morePrivacy: "Datenschutz",
      moreTerms: "Nutzungsbedingungen",
      moreImprint: "Impressum",
      moreEmail: "E-Mail-Links bereinigen",
      moreMessenger: "Messenger-Links bereinigen",
      moreSocial: "Social-Links bereinigen",
      moreTracking: "Tracking-Parameter erklärt",
      moreUtm: "UTM-Parameter entfernen",
      moreCompare: "Tool-Vergleich",

      switchLabel: "EN",
      footerText: "SafeShare — local-first Link-Hygiene."
    },

    en: {
      brand: "SafeShare",
      navStart: "Start",
      navApp: "App",
      navPro: "Pro",
      navSchool: "School",
      navHelp: "Help",
      navMore: "More",

      moreBookmarks: "Bookmarklets",
      morePrivacy: "Privacy",
      moreTerms: "Terms",
      moreImprint: "Imprint",
      moreEmail: "Email link cleaning",
      moreMessenger: "Messenger link cleaning",
      moreSocial: "Social link cleaning",
      moreTracking: "Tracking parameters",
      moreUtm: "Remove UTM parameters",
      moreCompare: "Cleaner tool comparison",

      switchLabel: "DE",
      footerText: "SafeShare — local-first link hygiene."
    }
  }[lang];

  // -----------------------------
  // Language switch target mapping
  // -----------------------------
  const SWITCH_MAP = {
    "/": "/en/",
    "/app/": "/en/app/",
    "/pro/": "/en/pro/",
    "/schule/": "/en/school/",
    "/hilfe/": "/en/help/",
    "/lesezeichen/": "/en/bookmarks/",
    "/datenschutz/": "/en/privacy/",
    "/nutzungsbedingungen/": "/en/terms/",
    "/impressum/": "/en/imprint/",
    "/tracking-parameter/": "/en/tracking-parameters/",
    "/utm-parameter-entfernen/": "/en/remove-utm-parameter/",
    "/url-cleaner-tool-vergleich/": "/en/url-cleaner-comparison/",
    "/email-links-bereinigen/": "/en/email-link-cleaning/",
    "/messenger-links-bereinigen/": "/en/messenger-link-cleaning/",
    "/social-links-bereinigen/": "/en/social-link-cleaning/",

    "/en/": "/",
    "/en/app/": "/app/",
    "/en/pro/": "/pro/",
    "/en/school/": "/schule/",
    "/en/help/": "/hilfe/",
    "/en/bookmarks/": "/lesezeichen/",
    "/en/privacy/": "/datenschutz/",
    "/en/terms/": "/nutzungsbedingungen/",
    "/en/imprint/": "/impressum/",
    "/en/tracking-parameters/": "/tracking-parameter/",
    "/en/remove-utm-parameter/": "/utm-parameter-entfernen/",
    "/en/url-cleaner-comparison/": "/url-cleaner-tool-vergleich/",
    "/en/email-link-cleaning/": "/email-links-bereinigen/",
    "/en/messenger-link-cleaning/": "/messenger-links-bereinigen/",
    "/en/social-link-cleaning/": "/social-links-bereinigen/"
  };

  const switchHref = SWITCH_MAP[currentPath] || (lang === "de" ? "/en/" : "/");

  // -----------------------------
  // Active link helper
  // -----------------------------
  const isActive = (href) => normPath(href) === currentPath ? " is-active" : "";

  // -----------------------------
  // Build shell DOM
  // -----------------------------
  const shellHost = $("#ss-shell");
  const footerHost = $("#ss-footer");
  if (!shellHost) return;

  shellHost.innerHTML = `
    <header class="ss-header" data-shell="${SHELL_VERSION}">
      <div class="ss-header__inner">
        <a class="ss-brand" href="${L.home}" aria-label="${T.brand}">
          <img class="ss-brand__logo" src="/assets/brand/mark.svg?v=2026-02-05-01" alt="" aria-hidden="true" />
          <span class="ss-brand__text">${T.brand}</span>
        </a>

        <nav class="ss-nav" aria-label="Primary">
          <a class="ss-nav__link${isActive(L.home)}" href="${L.home}">${T.navStart}</a>
          <a class="ss-nav__link${isActive(L.app)}" href="${L.app}">${T.navApp}</a>
          <a class="ss-nav__link${isActive(L.pro)}" href="${L.pro}">${T.navPro}</a>
          <a class="ss-nav__link${isActive(L.school)}" href="${L.school}">${T.navSchool}</a>
          <a class="ss-nav__link${isActive(L.help)}" href="${L.help}">${T.navHelp}</a>

          <button class="ss-moreBtn" id="ss-moreBtn" type="button" aria-expanded="false" aria-controls="ss-moreMenu">
            ${T.navMore}
          </button>
        </nav>
      </div>
    </header>

    <div class="ss-moreBackdrop" id="ss-moreBackdrop" hidden></div>

    <aside class="ss-moreMenu" id="ss-moreMenu" aria-hidden="true" hidden>
      <div class="ss-moreMenu__head">
        <strong>${T.navMore}</strong>
        <button class="ss-moreMenu__close" id="ss-moreClose" type="button" aria-label="Close">✕</button>
      </div>

      <div class="ss-moreMenu__list">
        <a class="ss-moreMenu__link${isActive(L.bookmarks)}" href="${L.bookmarks}">${T.moreBookmarks}</a>
        <a class="ss-moreMenu__link${isActive(L.emailLinkCleaning)}" href="${L.emailLinkCleaning}">${T.moreEmail}</a>
        <a class="ss-moreMenu__link${isActive(L.messengerLinkCleaning)}" href="${L.messengerLinkCleaning}">${T.moreMessenger}</a>
        <a class="ss-moreMenu__link${isActive(L.socialLinkCleaning)}" href="${L.socialLinkCleaning}">${T.moreSocial}</a>
        <a class="ss-moreMenu__link${isActive(L.trackingParameters)}" href="${L.trackingParameters}">${T.moreTracking}</a>
        <a class="ss-moreMenu__link${isActive(L.removeUtm)}" href="${L.removeUtm}">${T.moreUtm}</a>
        <a class="ss-moreMenu__link${isActive(L.urlCleanerComparison)}" href="${L.urlCleanerComparison}">${T.moreCompare}</a>
        <a class="ss-moreMenu__link${isActive(L.privacy)}" href="${L.privacy}">${T.morePrivacy}</a>
        <a class="ss-moreMenu__link${isActive(L.terms)}" href="${L.terms}">${T.moreTerms}</a>
        <a class="ss-moreMenu__link${isActive(L.imprint)}" href="${L.imprint}">${T.moreImprint}</a>
      </div>

      <div class="ss-moreMenu__foot">
        <a class="ss-btn ss-btn--ghost ss-langSwitch" href="${switchHref}" rel="alternate" hreflang="${lang === "de" ? "en" : "de"}">
          ${T.switchLabel}
        </a>
      </div>
    </aside>
  `;

  if (footerHost) {
    footerHost.innerHTML = `
      <footer class="ss-footer">
        <div class="ss-footer__inner">
          <p class="ss-footer__text">${T.footerText}</p>
          <div class="ss-footer__links">
            <a href="${L.privacy}">${T.morePrivacy}</a>
            <a href="${L.terms}">${T.moreTerms}</a>
            <a href="${L.imprint}">${T.moreImprint}</a>
          </div>
        </div>
      </footer>
    `;
  }

  // -----------------------------
  // More menu behavior
  // -----------------------------
  const btn = $("#ss-moreBtn");
  const menu = $("#ss-moreMenu");
  const backdrop = $("#ss-moreBackdrop");
  const closeBtn = $("#ss-moreClose");

  if (!btn || !menu || !backdrop || !closeBtn) return;

  const openMenu = () => {
    menu.hidden = false;
    backdrop.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("ss-noScroll");
  };

  const closeMenu = () => {
    menu.hidden = true;
    backdrop.hidden = true;
    menu.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("ss-noScroll");
  };

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu();
    else openMenu();
  });

  closeBtn.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // close on menu link click
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeMenu();
  });
})();

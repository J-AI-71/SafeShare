/* File: /js/ss-shell.js */
/* Known Good Baseline — Master-Flow strict — v2026-02-05-03 */

(() => {
  "use strict";

  const norm = (p) => {
    let x = (p || "/").trim();
    if (!x.startsWith("/")) x = "/" + x;
    x = x.replace(/\/{2,}/g, "/");
    if (!x.endsWith("/")) x += "/";
    return x;
  };

  const path = norm(window.location.pathname);
  const isEn = path.startsWith("/en/");
  const lang = isEn ? "en" : "de";

  const ROUTES = {
    de: {
      home: "/",
      app: "/app/",
      pro: "/pro/",
      school: "/schule/",
      help: "/hilfe/",
      more: {
        bookmarks: "/lesezeichen/",
        email: "/email-links-bereinigen/",
        messenger: "/messenger-links-bereinigen/",
        social: "/social-links-bereinigen/",
        tracking: "/tracking-parameter/",
        utm: "/utm-parameter-entfernen/",
        compare: "/url-cleaner-tool-vergleich/",
        privacy: "/datenschutz/",
        terms: "/nutzungsbedingungen/",
        imprint: "/impressum/"
      }
    },
    en: {
      home: "/en/",
      app: "/en/app/",
      pro: "/en/pro/",
      school: "/en/school/",
      help: "/en/help/",
      more: {
        bookmarks: "/en/bookmarks/",
        email: "/en/email-link-cleaning/",
        messenger: "/en/messenger-link-cleaning/",
        social: "/en/social-link-cleaning/",
        tracking: "/en/tracking-parameters/",
        utm: "/en/remove-utm-parameter/",
        compare: "/en/url-cleaner-comparison/",
        privacy: "/en/privacy/",
        terms: "/en/terms/",
        imprint: "/en/imprint/"
      }
    }
  };

  const T = {
    de: {
      brand: "SafeShare",
      start: "Start", app: "App", pro: "Pro", school: "Schule", help: "Hilfe", more: "Mehr",
      bookmarks: "Lesezeichen",
      email: "E-Mail-Links bereinigen",
      messenger: "Messenger-Links bereinigen",
      social: "Social-Links bereinigen",
      tracking: "Tracking-Parameter erklärt",
      utm: "UTM-Parameter entfernen",
      compare: "Tool-Vergleich",
      privacy: "Datenschutz", terms: "Nutzungsbedingungen", imprint: "Impressum",
      langSwitch: "EN",
      footer: "SafeShare — local-first Link-Hygiene."
    },
    en: {
      brand: "SafeShare",
      start: "Start", app: "App", pro: "Pro", school: "School", help: "Help", more: "More",
      bookmarks: "Bookmarklets",
      email: "Email link cleaning",
      messenger: "Messenger link cleaning",
      social: "Social link cleaning",
      tracking: "Tracking parameters",
      utm: "Remove UTM parameters",
      compare: "Tool comparison",
      privacy: "Privacy", terms: "Terms", imprint: "Imprint",
      langSwitch: "DE",
      footer: "SafeShare — local-first link hygiene."
    }
  }[lang];

  const R = ROUTES[lang];
  const active = (href) => (norm(href) === path ? " is-active" : "");

  const switchMap = {
    "/": "/en/",
    "/app/": "/en/app/",
    "/pro/": "/en/pro/",
    "/schule/": "/en/school/",
    "/hilfe/": "/en/help/",
    "/en/": "/",
    "/en/app/": "/app/",
    "/en/pro/": "/pro/",
    "/en/school/": "/schule/",
    "/en/help/": "/hilfe/"
  };
  const switchHref = switchMap[path] || (lang === "de" ? "/en/" : "/");

  const host = document.getElementById("ss-shell");
  if (!host) return;

  host.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__inner">
        <a class="ss-brand" href="${R.home}" aria-label="${T.brand}">
          <img class="ss-brand__logo" src="/assets/brand/mark.svg?v=2026-02-05-03" alt="" aria-hidden="true">
          <span class="ss-brand__text">${T.brand}</span>
        </a>
        <nav class="ss-nav" aria-label="Primary">
          <a class="ss-nav__link${active(R.home)}" href="${R.home}">${T.start}</a>
          <a class="ss-nav__link${active(R.app)}" href="${R.app}">${T.app}</a>
          <a class="ss-nav__link${active(R.pro)}" href="${R.pro}">${T.pro}</a>
          <a class="ss-nav__link${active(R.school)}" href="${R.school}">${T.school}</a>
          <a class="ss-nav__link${active(R.help)}" href="${R.help}">${T.help}</a>
          <button id="ss-moreBtn" class="ss-moreBtn" type="button" aria-expanded="false" aria-controls="ss-moreMenu">${T.more}</button>
        </nav>
      </div>
    </header>

    <div id="ss-moreBackdrop" class="ss-moreBackdrop" hidden></div>
    <aside id="ss-moreMenu" class="ss-moreMenu" hidden aria-hidden="true">
      <div class="ss-moreMenu__head">
        <strong>${T.more}</strong>
        <button id="ss-moreClose" class="ss-moreMenu__close" type="button" aria-label="Close">✕</button>
      </div>
      <div class="ss-moreMenu__list">
        <a class="ss-moreMenu__link${active(R.more.bookmarks)}" href="${R.more.bookmarks}">${T.bookmarks}</a>
        <a class="ss-moreMenu__link${active(R.more.email)}" href="${R.more.email}">${T.email}</a>
        <a class="ss-moreMenu__link${active(R.more.messenger)}" href="${R.more.messenger}">${T.messenger}</a>
        <a class="ss-moreMenu__link${active(R.more.social)}" href="${R.more.social}">${T.social}</a>
        <a class="ss-moreMenu__link${active(R.more.tracking)}" href="${R.more.tracking}">${T.tracking}</a>
        <a class="ss-moreMenu__link${active(R.more.utm)}" href="${R.more.utm}">${T.utm}</a>
        <a class="ss-moreMenu__link${active(R.more.compare)}" href="${R.more.compare}">${T.compare}</a>
        <a class="ss-moreMenu__link${active(R.more.privacy)}" href="${R.more.privacy}">${T.privacy}</a>
        <a class="ss-moreMenu__link${active(R.more.terms)}" href="${R.more.terms}">${T.terms}</a>
        <a class="ss-moreMenu__link${active(R.more.imprint)}" href="${R.more.imprint}">${T.imprint}</a>
      </div>
      <div class="ss-moreMenu__foot">
        <a class="ss-nav__link ss-langSwitch" href="${switchHref}" rel="alternate">${T.langSwitch}</a>
      </div>
    </aside>
  `;

  const footer = document.getElementById("ss-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="ss-footer">
        <div class="ss-footer__inner">
          <p class="ss-footer__text">${T.footer}</p>
          <div class="ss-footer__links">
            <a href="${R.more.privacy}">${T.privacy}</a>
            <a href="${R.more.terms}">${T.terms}</a>
            <a href="${R.more.imprint}">${T.imprint}</a>
          </div>
        </div>
      </footer>
    `;
  }

  const btn = document.getElementById("ss-moreBtn");
  const menu = document.getElementById("ss-moreMenu");
  const backdrop = document.getElementById("ss-moreBackdrop");
  const close = document.getElementById("ss-moreClose");

  if (!btn || !menu || !backdrop || !close) return;

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
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu(); else openMenu();
  });

  close.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
})();

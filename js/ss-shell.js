/* Datei: /js/shell.js
   SafeShare Master Shell
   - Rendert Header + Nav + More-Menü vollständig per JS
   - DE/EN Routing mit Schema /en/<slug>/
   - Aktive Seite automatisch
   - Language Switch bleibt auf "derselben" Seite (Mapped Slug)
   - Escape + Backdrop + Outside Click schließen Sheet
*/

(() => {
  "use strict";

  const DOC = document;
  const WIN = window;

  /* ---------------------------------------------------------
     Konfiguration
  --------------------------------------------------------- */

  // Slug-Mapping DE -> EN (Schema: /en/<slug>/)
  const DE_TO_EN = {
    "": "",                // Start
    "app": "app",
    "hilfe": "help",
    "pro": "pro",
    "schule": "school",

    "utm-parameter-entfernen": "remove-utm-parameters",
    "email-links-bereinigen": "clean-email-links",
    "messenger-links-bereinigen": "clean-messenger-links",
    "social-links-bereinigen": "clean-social-links",
    "datenschutz-ist-nicht-dasselbe-wie-privatheit": "privacy-is-not-the-same-as-secrecy"
  };

  // Auto-Reverse EN -> DE
  const EN_TO_DE = Object.fromEntries(
    Object.entries(DE_TO_EN).map(([de, en]) => [en, de])
  );

  // Hauptnavigation
  const NAV_DE = [
    { key: "start", label: "Start", href: "/" },
    { key: "app", label: "App", href: "/app/" },
    { key: "hilfe", label: "Hilfe", href: "/hilfe/" },
    { key: "pro", label: "Pro", href: "/pro/" },
    { key: "schule", label: "Schule", href: "/schule/" }
  ];

  const NAV_EN = [
    { key: "start", label: "Start", href: "/en/" },
    { key: "app", label: "App", href: "/en/app/" },
    { key: "help", label: "Help", href: "/en/help/" },
    { key: "pro", label: "Pro", href: "/en/pro/" },
    { key: "school", label: "School", href: "/en/school/" }
  ];

  // More-Menü
  const MORE_DE = [
    { label: "Support", href: "mailto:listings@safesharepro.com", meta: "Kontakt" },
    { label: "Datenschutz", href: "/privacy/", meta: "Info" },
    { label: "Impressum", href: "/impressum/", meta: "Legal" },
    { label: "EN wechseln", action: "switchLang", meta: "Sprache" }
  ];

  const MORE_EN = [
    { label: "Support", href: "mailto:listings@safesharepro.com", meta: "Contact" },
    { label: "Privacy", href: "/en/privacy/", meta: "Info" },
    { label: "Legal Notice", href: "/en/legal/", meta: "Legal" },
    { label: "Switch to DE", action: "switchLang", meta: "Language" }
  ];

  /* ---------------------------------------------------------
     Helper
  --------------------------------------------------------- */

  const sanitizePath = (path) => {
    if (!path) return "/";
    let p = path;
    p = p.replace(/\/{2,}/g, "/");
    if (!p.endsWith("/")) p += "/";
    return p;
  };

  const getCurrentPath = () => sanitizePath(WIN.location.pathname);

  const isEnglishPath = (path) => path === "/en/" || path.startsWith("/en/");

  const stripLeadingAndTrailingSlash = (str) =>
    str.replace(/^\/+|\/+$/g, "");

  const getSlug = (path, lang) => {
    const cleaned = sanitizePath(path);
    if (lang === "en") {
      const rest = cleaned.replace(/^\/en\//, "");
      return stripLeadingAndTrailingSlash(rest);
    }
    return stripLeadingAndTrailingSlash(cleaned);
  };

  const buildPath = (lang, slug) => {
    const s = (slug || "").trim();
    if (lang === "en") return s ? `/en/${s}/` : "/en/";
    return s ? `/${s}/` : "/";
  };

  const getLang = () => (isEnglishPath(getCurrentPath()) ? "en" : "de");

  const mapSlugToOtherLang = (slug, fromLang) => {
    if (fromLang === "de") return Object.prototype.hasOwnProperty.call(DE_TO_EN, slug) ? DE_TO_EN[slug] : slug;
    return Object.prototype.hasOwnProperty.call(EN_TO_DE, slug) ? EN_TO_DE[slug] : slug;
  };

  const getActiveHref = (path, navList) => {
    let match = navList[0]?.href || "/";
    for (const item of navList) {
      const href = sanitizePath(item.href);
      if (path === href || path.startsWith(href)) {
        if (href.length > match.length) match = href;
      }
    }
    return match;
  };

  const escapeHtml = (str) =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  /* ---------------------------------------------------------
     Render
  --------------------------------------------------------- */

  const renderShell = () => {
    const lang = getLang();
    const path = getCurrentPath();
    const nav = lang === "en" ? NAV_EN : NAV_DE;
    const more = lang === "en" ? MORE_EN : MORE_DE;
    const activeHref = getActiveHref(path, nav);

    const shell = DOC.createElement("header");
    shell.className = "ss-shell";
    shell.setAttribute("role", "banner");
    shell.innerHTML = `
      <div class="ss-shell__inner">
        <a class="ss-brand" href="${lang === "en" ? "/en/" : "/"}" aria-label="SafeShare Home">
          <span class="ss-brand__mark" aria-hidden="true">
            <img src="/assets/fav/icon-192.png" alt="" loading="eager" decoding="async" />
          </span>
          <span class="ss-brand__txt">SafeShare</span>
        </a>

        <nav class="ss-nav" aria-label="${lang === "en" ? "Main navigation" : "Hauptnavigation"}">
          ${nav.map(item => `
            <a class="ss-nav__link${sanitizePath(item.href) === activeHref ? " is-active" : ""}" href="${item.href}">
              ${escapeHtml(item.label)}
            </a>
          `).join("")}
        </nav>

        <div class="ss-actions">
          <button class="ss-iconBtn" id="ssLangBtn" type="button" aria-label="${lang === "en" ? "Switch language" : "Sprache wechseln"}">
            ${lang === "en" ? "DE" : "EN"}
          </button>
          <button class="ss-iconBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-controls="ssSheet" aria-expanded="false" aria-label="${lang === "en" ? "Open menu" : "Menü öffnen"}">
            <svg class="ss-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    const backdrop = DOC.createElement("div");
    backdrop.className = "ss-backdrop";
    backdrop.id = "ssBackdrop";
    backdrop.setAttribute("hidden", "");

    const sheet = DOC.createElement("section");
    sheet.className = "ss-sheet";
    sheet.id = "ssSheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-label", lang === "en" ? "More menu" : "Mehr Menü");
    sheet.setAttribute("hidden", "");
    sheet.innerHTML = `
      <div class="ss-sheet__grip" aria-hidden="true"></div>
      <div class="ss-sheet__head">
        <h2 class="ss-sheet__title">${lang === "en" ? "More" : "Mehr"}</h2>
        <button class="ss-iconBtn" id="ssCloseBtn" type="button" aria-label="${lang === "en" ? "Close menu" : "Menü schließen"}">
          <svg class="ss-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.31z"></path>
          </svg>
        </button>
      </div>
      <div class="ss-sheet__body">
        <ul class="ss-list">
          ${more.map((item, idx) => {
            if (item.action === "switchLang") {
              return `
                <li>
                  <a href="#" class="ss-list__a" data-action="switchLang" data-idx="${idx}">
                    <span>${escapeHtml(item.label)}</span>
                    <span class="ss-list__meta">${escapeHtml(item.meta || "")}</span>
                  </a>
                </li>
              `;
            }
            return `
              <li>
                <a href="${item.href}" class="ss-list__a">
                  <span>${escapeHtml(item.label)}</span>
                  <span class="ss-list__meta">${escapeHtml(item.meta || "")}</span>
                </a>
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    `;

    DOC.body.prepend(shell);
    DOC.body.append(backdrop, sheet);

    bindEvents({ lang, sheet, backdrop });
  };

  /* ---------------------------------------------------------
     Interaktionen
  --------------------------------------------------------- */

  const bindEvents = ({ lang, sheet, backdrop }) => {
    const moreBtn = DOC.getElementById("ssMoreBtn");
    const closeBtn = DOC.getElementById("ssCloseBtn");
    const langBtn = DOC.getElementById("ssLangBtn");

    let lastFocus = null;

    const openSheet = () => {
      lastFocus = DOC.activeElement;
      backdrop.hidden = false;
      sheet.hidden = false;

      requestAnimationFrame(() => {
        backdrop.classList.add("is-open");
        sheet.classList.add("is-open");
      });

      DOC.body.classList.add("ss-no-scroll");
      if (moreBtn) moreBtn.setAttribute("aria-expanded", "true");
      if (closeBtn) closeBtn.focus();
    };

    const closeSheet = () => {
      backdrop.classList.remove("is-open");
      sheet.classList.remove("is-open");
      DOC.body.classList.remove("ss-no-scroll");
      if (moreBtn) moreBtn.setAttribute("aria-expanded", "false");

      const onEnd = () => {
        sheet.hidden = true;
        backdrop.hidden = true;
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      };

      sheet.addEventListener("transitionend", onEnd, { once: true });
    };

    const switchLanguage = () => {
      const currentPath = getCurrentPath();
      const fromLang = lang;
      const toLang = fromLang === "de" ? "en" : "de";

      const fromSlug = getSlug(currentPath, fromLang);
      const toSlug = mapSlugToOtherLang(fromSlug, fromLang);

      WIN.location.href = buildPath(toLang, toSlug);
    };

    if (moreBtn) moreBtn.addEventListener("click", openSheet);
    if (closeBtn) closeBtn.addEventListener("click", closeSheet);
    backdrop.addEventListener("click", closeSheet);

    DOC.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && !sheet.hidden) {
        ev.preventDefault();
        closeSheet();
      }
    });

    if (langBtn) langBtn.addEventListener("click", switchLanguage);

    sheet.addEventListener("click", (ev) => {
      const target = ev.target instanceof Element ? ev.target.closest("[data-action='switchLang']") : null;
      if (!target) return;
      ev.preventDefault();
      closeSheet();
      setTimeout(() => switchLanguage(), 120);
    });
  };

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */

  const boot = () => {
    if (DOC.querySelector(".ss-shell")) return; // idempotent
    renderShell();
  };

  if (DOC.readyState === "loading") {
    DOC.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

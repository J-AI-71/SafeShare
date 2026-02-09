/* Datei: /js/shell.js */
/* SafeShare Master Shell v2026-02-09-02
   - Zero-Header/Zero-Footer in Seiten
   - Konsistente DE/EN Nav
   - Language toggle bleibt auf derselben Seite
   - More-Menü mit Escape/Outside-Close
*/

(function () {
  "use strict";

  const VERSION = "2026-02-09-02";

  const SITE = {
    de: "https://safesharepro.com",
    en: "https://safesharepro.com/en"
  };

  // Slug-Mapping (DE <-> EN)
  // Wichtig: EN-Schema bleibt /en/<slug>/
  const slugMap = {
    "": { de: "/", en: "/en/" },
    "app": { de: "/app/", en: "/en/app/" },
    "hilfe": { de: "/hilfe/", en: "/en/help/" },
    "help": { de: "/hilfe/", en: "/en/help/" },
    "schule": { de: "/schule/", en: "/en/school/" },
    "school": { de: "/schule/", en: "/en/school/" },
    "pro": { de: "/pro/", en: "/en/pro/" },

    "utm-parameter-entfernen": { de: "/utm-parameter-entfernen/", en: "/en/remove-utm-parameters/" },
    "remove-utm-parameters": { de: "/utm-parameter-entfernen/", en: "/en/remove-utm-parameters/" },

    "email-links-bereinigen": { de: "/email-links-bereinigen/", en: "/en/clean-email-links/" },
    "clean-email-links": { de: "/email-links-bereinigen/", en: "/en/clean-email-links/" },

    "messenger-links-bereinigen": { de: "/messenger-links-bereinigen/", en: "/en/clean-messenger-links/" },
    "clean-messenger-links": { de: "/messenger-links-bereinigen/", en: "/en/clean-messenger-links/" },

    "datenschutz-ist-nicht-dasselbe-wie-datenschutz": {
      de: "/datenschutz-ist-nicht-dasselbe-wie-datenschutz/",
      en: "/en/privacy-is-not-privacy/"
    },
    "privacy-is-not-privacy": {
      de: "/datenschutz-ist-nicht-dasselbe-wie-datenschutz/",
      en: "/en/privacy-is-not-privacy/"
    }
  };

  function getLangFromPage() {
    const v = (document.body?.dataset?.lang || "").toLowerCase();
    if (v === "de" || v === "en") return v;

    // Fallback über Pfad
    const p = window.location.pathname;
    return p.startsWith("/en/") ? "en" : "de";
  }

  function detectCurrentSlug(pathname) {
    const clean = pathname.replace(/^\/+|\/+$/g, ""); // trim slashes
    if (!clean) return "";
    if (clean.startsWith("en/")) return clean.slice(3);
    return clean;
  }

  function targetPathForLang(pathname, targetLang) {
    const slug = detectCurrentSlug(pathname);
    const row = slugMap[slug] || slugMap[""];
    return row[targetLang] || (targetLang === "en" ? "/en/" : "/");
  }

  function getPageKey() {
    const key = (document.body?.dataset?.page || "").toLowerCase();
    if (key) return key;

    // Fallback aus Slug ermitteln
    const slug = detectCurrentSlug(window.location.pathname);
    if (!slug) return "home";
    if (slug === "help") return "hilfe";
    if (slug === "school") return "schule";
    return slug;
  }

  function t(lang, de, en) {
    return lang === "de" ? de : en;
  }

  function navItems(lang) {
    if (lang === "de") {
      return [
        { key: "home", label: "Start", href: "/" },
        { key: "app", label: "App", href: "/app/" },
        { key: "hilfe", label: "Hilfe", href: "/hilfe/" },
        { key: "schule", label: "Schule", href: "/schule/" },
        { key: "pro", label: "Pro", href: "/pro/" }
      ];
    }
    return [
      { key: "home", label: "Start", href: "/en/" },
      { key: "app", label: "App", href: "/en/app/" },
      { key: "hilfe", label: "Help", href: "/en/help/" },
      { key: "schule", label: "School", href: "/en/school/" },
      { key: "pro", label: "Pro", href: "/en/pro/" }
    ];
  }

  function moreItems(lang) {
    if (lang === "de") {
      return [
        { label: "Support", href: "/support/" },
        { label: "Datenschutz", href: "/privacy/" },
        { label: "Impressum", href: "/impressum/" }
      ];
    }
    return [
      { label: "Support", href: "/en/support/" },
      { label: "Privacy", href: "/en/privacy/" },
      { label: "Imprint", href: "/en/imprint/" }
    ];
  }

  function renderHeader(lang, pageKey) {
    const headerRoot = document.getElementById("ss-shell-header");
    if (!headerRoot) return;

    const items = navItems(lang);
    const more = moreItems(lang);

    const navHtml = items
      .map((it) => {
        const active = it.key === pageKey ? " is-active" : "";
        return `<a class="ss-nav__link${active}" href="${it.href}">${it.label}</a>`;
      })
      .join("");

    const moreHtml = more
      .map((it) => `<a class="ss-more__link" href="${it.href}">${it.label}</a>`)
      .join("");

    headerRoot.innerHTML = `
      <header class="ss-header" data-shell-version="${VERSION}">
        <div class="ss-wrap ss-header__row">
          <a class="ss-brand" href="${lang === "de" ? "/" : "/en/"}" aria-label="SafeShare">
            <span class="ss-brand__mark" aria-hidden="true">🛡️</span>
            <span class="ss-brand__text">SafeShare</span>
          </a>

          <nav class="ss-nav" aria-label="${t(lang, "Hauptnavigation", "Main navigation")}">
            ${navHtml}
          </nav>

          <div class="ss-actions">
            <button id="ss-lang-toggle" class="ss-chip" type="button" aria-label="${t(lang, "Sprache wechseln", "Switch language")}">
              ${lang === "de" ? "EN" : "DE"}
            </button>
            <button id="ss-more-btn" class="ss-chip" type="button" aria-expanded="false" aria-controls="ss-more-menu">
              ${t(lang, "Mehr", "More")}
            </button>
          </div>
        </div>

        <div id="ss-more-menu" class="ss-more" hidden>
          <div class="ss-wrap ss-more__inner">
            ${moreHtml}
          </div>
        </div>
      </header>
    `;
  }

  function renderFooter(lang) {
    const footerRoot = document.getElementById("ss-shell-footer");
    if (!footerRoot) return;

    footerRoot.innerHTML = `
      <footer class="ss-footer">
        <div class="ss-wrap ss-footer__row">
          <p class="ss-footer__text">
            ${t(lang, "SafeShare · local-first Link-Hygiene", "SafeShare · local-first link hygiene")}
          </p>
          <a class="ss-footer__mail" href="mailto:listings@safesharepro.com">listings@safesharepro.com</a>
        </div>
      </footer>
    `;
  }

  function setupLanguageToggle(lang) {
    const btn = document.getElementById("ss-lang-toggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const nextLang = lang === "de" ? "en" : "de";
      const nextPath = targetPathForLang(window.location.pathname, nextLang);
      window.location.href = nextPath;
    });
  }

  function setupMoreMenu() {
    const btn = document.getElementById("ss-more-btn");
    const menu = document.getElementById("ss-more-menu");
    if (!btn || !menu) return;

    function closeMenu() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    document.addEventListener("click", function (e) {
      if (menu.hidden) return;
      const target = e.target;
      if (!menu.contains(target) && target !== btn) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) closeMenu();
    });

    menu.addEventListener("click", function (e) {
      const a = e.target.closest("a");
      if (a) closeMenu();
    });
  }

  function init() {
    const lang = getLangFromPage();
    const pageKey = getPageKey();

    renderHeader(lang, pageKey);
    renderFooter(lang);
    setupLanguageToggle(lang);
    setupMoreMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

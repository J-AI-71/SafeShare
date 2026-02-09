/* Datei: /js/shell.js
   SafeShare Master-Flow Strict
   - Rendert Header + Nav + More + Footer auf ALLEN Seiten
   - DE+EN mit /en/<slug>/
*/

(() => {
  "use strict";

  const DOC = document;
  const WIN = window;

  /* =========================
     Konfiguration
  ========================= */

  // Do-Not-Touch: Support-Kontakt bleibt fix
  const SUPPORT_EMAIL = "listings@safesharepro.com";

  // DE -> EN slug mapping
  const DE_TO_EN = {
    "": "",
    "app": "app",
    "hilfe": "help",
    "pro": "pro",
    "schule": "school",
    "privacy": "privacy",
    "impressum": "legal",

    "utm-parameter-entfernen": "remove-utm-parameters",
    "email-links-bereinigen": "clean-email-links",
    "messenger-links-bereinigen": "clean-messenger-links",
    "social-links-bereinigen": "clean-social-links",
    "datenschutz-ist-nicht-dasselbe-wie-privatheit": "privacy-is-not-the-same-as-secrecy"
  };
  const EN_TO_DE = Object.fromEntries(Object.entries(DE_TO_EN).map(([de, en]) => [en, de]));

  const NAV_DE = [
    { label: "Start", href: "/" },
    { label: "App", href: "/app/" },
    { label: "Hilfe", href: "/hilfe/" },
    { label: "Pro", href: "/pro/" },
    { label: "Schule", href: "/schule/" }
  ];
  const NAV_EN = [
    { label: "Start", href: "/en/" },
    { label: "App", href: "/en/app/" },
    { label: "Help", href: "/en/help/" },
    { label: "Pro", href: "/en/pro/" },
    { label: "School", href: "/en/school/" }
  ];

  const MORE_DE = [
    { label: "Support", href: `mailto:${SUPPORT_EMAIL}`, meta: "Kontakt" },
    { label: "Datenschutz", href: "/privacy/", meta: "Info" },
    { label: "Impressum", href: "/impressum/", meta: "Legal" },
    { label: "EN wechseln", action: "switchLang", meta: "Sprache" }
  ];
  const MORE_EN = [
    { label: "Support", href: `mailto:${SUPPORT_EMAIL}`, meta: "Contact" },
    { label: "Privacy", href: "/en/privacy/", meta: "Info" },
    { label: "Legal Notice", href: "/en/legal/", meta: "Legal" },
    { label: "Switch to DE", action: "switchLang", meta: "Language" }
  ];

  const FOOTER_DE = [
    { label: "App", href: "/app/" },
    { label: "Hilfe", href: "/hilfe/" },
    { label: "Pro", href: "/pro/" },
    { label: "Schule", href: "/schule/" },
    { label: "Datenschutz", href: "/privacy/" },
    { label: "Impressum", href: "/impressum/" }
  ];
  const FOOTER_EN = [
    { label: "App", href: "/en/app/" },
    { label: "Help", href: "/en/help/" },
    { label: "Pro", href: "/en/pro/" },
    { label: "School", href: "/en/school/" },
    { label: "Privacy", href: "/en/privacy/" },
    { label: "Legal", href: "/en/legal/" }
  ];

  /* =========================
     Helper
  ========================= */

  const sanitizePath = (path) => {
    let p = path || "/";
    p = p.replace(/\/{2,}/g, "/");
    if (!p.endsWith("/")) p += "/";
    return p;
  };

  const currentPath = () => sanitizePath(WIN.location.pathname);
  const isEN = (path) => path === "/en/" || path.startsWith("/en/");
  const lang = () => (isEN(currentPath()) ? "en" : "de");

  const trimSlashes = (s) => (s || "").replace(/^\/+|\/+$/g, "");

  const getSlug = (path, l) => {
    const p = sanitizePath(path);
    if (l === "en") return trimSlashes(p.replace(/^\/en\//, ""));
    return trimSlashes(p);
  };

  const mapSlug = (slug, from) => {
    if (from === "de") return Object.prototype.hasOwnProperty.call(DE_TO_EN, slug) ? DE_TO_EN[slug] : slug;
    return Object.prototype.hasOwnProperty.call(EN_TO_DE, slug) ? EN_TO_DE[slug] : slug;
  };

  const buildPath = (l, slug) => {
    const s = (slug || "").trim();
    if (l === "en") return s ? `/en/${s}/` : "/en/";
    return s ? `/${s}/` : "/";
  };

  const activeHref = (path, navList) => {
    let best = navList[0]?.href || "/";
    for (const item of navList) {
      const href = sanitizePath(item.href);
      if (path === href || path.startsWith(href)) {
        if (href.length > best.length) best = href;
      }
    }
    return best;
  };

  const esc = (str) =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  /* =========================
     Render Header + More
  ========================= */

  function renderHeader() {
    if (DOC.querySelector(".ss-shell")) return;

    const l = lang();
    const path = currentPath();
    const nav = l === "en" ? NAV_EN : NAV_DE;
    const more = l === "en" ? MORE_EN : MORE_DE;
    const act = activeHref(path, nav);

    const header = DOC.createElement("header");
    header.className = "ss-shell";
    header.innerHTML = `
      <div class="ss-shell__inner">
        <a class="ss-brand" href="${l === "en" ? "/en/" : "/"}" aria-label="SafeShare Home">
          <span class="ss-brand__mark" aria-hidden="true">
            <img src="/assets/fav/icon-192.png" alt="" loading="eager" decoding="async">
          </span>
          <span class="ss-brand__txt">SafeShare</span>
        </a>

        <nav class="ss-nav" aria-label="${l === "en" ? "Main navigation" : "Hauptnavigation"}">
          ${nav.map(i => `<a class="ss-nav__link${sanitizePath(i.href) === act ? " is-active" : ""}" href="${i.href}">${esc(i.label)}</a>`).join("")}
        </nav>

        <div class="ss-actions">
          <button class="ss-iconBtn" id="ssLangBtn" type="button" aria-label="${l === "en" ? "Switch language" : "Sprache wechseln"}">
            ${l === "en" ? "DE" : "EN"}
          </button>
          <button class="ss-iconBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-controls="ssSheet" aria-expanded="false" aria-label="${l === "en" ? "Open menu" : "Menü öffnen"}">
            <svg class="ss-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>
          </button>
        </div>
      </div>
    `;
    DOC.body.prepend(header);

    const backdrop = DOC.createElement("div");
    backdrop.className = "ss-backdrop";
    backdrop.id = "ssBackdrop";
    DOC.body.append(backdrop);

    const sheet = DOC.createElement("section");
    sheet.className = "ss-sheet";
    sheet.id = "ssSheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-label", l === "en" ? "More menu" : "Mehr Menü");
    sheet.innerHTML = `
      <div class="ss-sheet__grip" aria-hidden="true"></div>
      <div class="ss-sheet__head">
        <h2 class="ss-sheet__title">${l === "en" ? "More" : "Mehr"}</h2>
        <button class="ss-iconBtn" id="ssCloseBtn" type="button" aria-label="${l === "en" ? "Close menu" : "Menü schließen"}">
          <svg class="ss-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.31z"></path></svg>
        </button>
      </div>
      <div class="ss-sheet__body">
        <ul class="ss-list">
          ${more.map(item => item.action === "switchLang"
            ? `<li><a href="#" class="ss-list__a" data-action="switchLang"><span>${esc(item.label)}</span><span class="ss-list__meta">${esc(item.meta || "")}</span></a></li>`
            : `<li><a href="${item.href}" class="ss-list__a"><span>${esc(item.label)}</span><span class="ss-list__meta">${esc(item.meta || "")}</span></a></li>`
          ).join("")}
        </ul>
      </div>
    `;
    DOC.body.append(sheet);

    bindHeaderEvents();
  }

  function bindHeaderEvents() {
    const moreBtn = DOC.getElementById("ssMoreBtn");
    const closeBtn = DOC.getElementById("ssCloseBtn");
    const langBtn = DOC.getElementById("ssLangBtn");
    const backdrop = DOC.getElementById("ssBackdrop");
    const sheet = DOC.getElementById("ssSheet");

    let lastFocus = null;

    const openSheet = () => {
      lastFocus = DOC.activeElement;
      backdrop.classList.add("is-open");
      sheet.classList.add("is-open");
      DOC.body.classList.add("ss-no-scroll");
      moreBtn.setAttribute("aria-expanded", "true");
      closeBtn.focus();
    };

    const closeSheet = () => {
      backdrop.classList.remove("is-open");
      sheet.classList.remove("is-open");
      DOC.body.classList.remove("ss-no-scroll");
      moreBtn.setAttribute("aria-expanded", "false");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };

    const switchLanguage = () => {
      const from = lang();
      const to = from === "de" ? "en" : "de";
      const fromSlug = getSlug(currentPath(), from);
      const toSlug = mapSlug(fromSlug, from);
      WIN.location.href = buildPath(to, toSlug);
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

    langBtn.addEventListener("click", switchLanguage);

    sheet.addEventListener("click", (ev) => {
      const a = ev.target instanceof Element ? ev.target.closest("[data-action='switchLang']") : null;
      if (!a) return;
      ev.preventDefault();
      closeSheet();
      setTimeout(switchLanguage, 120);
    });
  }

  /* =========================
     Render Footer
  ========================= */

  function renderFooter() {
    if (DOC.querySelector(".ss-siteFooter")) return;

    const l = lang();
    const footerLinks = l === "en" ? FOOTER_EN : FOOTER_DE;

    const footer = DOC.createElement("footer");
    footer.className = "ss-siteFooter";
    footer.setAttribute("role", "contentinfo");

    const year = new Date().getFullYear();
    const meta = l === "en"
      ? `Local-first link hygiene. Support: ${SUPPORT_EMAIL}`
      : `Local-first Link-Hygiene. Support: ${SUPPORT_EMAIL}`;

    footer.innerHTML = `
      <div class="ss-siteFooter__top">
        <div class="ss-siteFooter__brand">SafeShare</div>
        <nav class="ss-siteFooter__links" aria-label="${l === "en" ? "Footer navigation" : "Footer Navigation"}">
          ${footerLinks.map(i => `<a href="${i.href}">${esc(i.label)}</a>`).join("")}
        </nav>
      </div>
      <div class="ss-siteFooter__meta">© ${year} SafeShare · ${esc(meta)}</div>
    `;

    DOC.body.append(footer);
  }

  /* =========================
     Boot
  ========================= */

  function boot() {
    renderHeader();
    renderFooter();
  }

  if (DOC.readyState === "loading") {
    DOC.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

/* /js/shell.js */
/* SafeShare Master-Flow FINAL */

(() => {
  "use strict";

  const DOC = document;
  const WIN = window;

  const SUPPORT_EMAIL = "listings@safesharepro.com";
  const LOGO_SRC = "/assets/brand/mark-192.png";
  const LOGO_ALT = "SafeShare Logo";

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
  const EN_TO_DE = Object.fromEntries(Object.entries(DE_TO_EN).map(([de, en]) => [en, de]));

  const NAV_DE = [
    { label: "Start", href: "/" },
    { label: "App", href: "/app/" },
    { label: "Hilfe", href: "/hilfe/" },
    { label: "Pro", href: "/pro/" },
    { label: "Schule", href: "/schule/" },
    { label: "EN", action: "switchLang" }
  ];
  const NAV_EN = [
    { label: "Start", href: "/en/" },
    { label: "App", href: "/en/app/" },
    { label: "Help", href: "/en/help/" },
    { label: "Pro", href: "/en/pro/" },
    { label: "School", href: "/en/school/" },
    { label: "DE", action: "switchLang" }
  ];

  const MORE_DE = [
    { label: "Lesezeichen", href: "/lesezeichen/", meta: "Tools" },
    { label: "Datenschutz", href: "/datenschutz/", meta: "Info" },
    { label: "Nutzungsbedingungen", href: "/nutzungsbedingungen/", meta: "Legal" },
    { label: "Impressum", href: "/impressum/", meta: "Legal" },
    { label: "Support", href: `mailto:${SUPPORT_EMAIL}`, meta: "Kontakt" }
  ];
  const MORE_EN = [
    { label: "Bookmarks", href: "/en/bookmarks/", meta: "Tools" },
    { label: "Privacy", href: "/en/privacy/", meta: "Info" },
    { label: "Terms", href: "/en/terms/", meta: "Legal" },
    { label: "Imprint", href: "/en/imprint/", meta: "Legal" },
    { label: "Support", href: `mailto:${SUPPORT_EMAIL}`, meta: "Contact" }
  ];

  const FOOTER_DE = [
    { label: "Start", href: "/" },
    { label: "App", href: "/app/" },
    { label: "Hilfe", href: "/hilfe/" },
    { label: "Pro", href: "/pro/" },
    { label: "Schule", href: "/schule/" },
    { label: "Lesezeichen", href: "/lesezeichen/" },
    { label: "Datenschutz", href: "/datenschutz/" },
    { label: "Nutzungsbedingungen", href: "/nutzungsbedingungen/" },
    { label: "Impressum", href: "/impressum/" }
  ];
  const FOOTER_EN = [
    { label: "Start", href: "/en/" },
    { label: "App", href: "/en/app/" },
    { label: "Help", href: "/en/help/" },
    { label: "Pro", href: "/en/pro/" },
    { label: "School", href: "/en/school/" },
    { label: "Bookmarks", href: "/en/bookmarks/" },
    { label: "Privacy", href: "/en/privacy/" },
    { label: "Terms", href: "/en/terms/" },
    { label: "Imprint", href: "/en/imprint/" }
  ];

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
  const mapSlug = (slug, from) =>
    from === "de"
      ? (Object.prototype.hasOwnProperty.call(DE_TO_EN, slug) ? DE_TO_EN[slug] : slug)
      : (Object.prototype.hasOwnProperty.call(EN_TO_DE, slug) ? EN_TO_DE[slug] : slug);

  const buildPath = (l, slug) => {
    const s = (slug || "").trim();
    if (l === "en") return s ? `/en/${s}/` : "/en/";
    return s ? `/${s}/` : "/";
  };

  const findActive = (path, nav) => {
    let best = "/";
    for (const i of nav) {
      if (!i.href) continue;
      const href = sanitizePath(i.href);
      if (path === href || path.startsWith(href)) {
        if (href.length > best.length) best = href;
      }
    }
    return best;
  };

  const esc = (str) => String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function switchLanguage() {
    const from = lang();
    const to = from === "de" ? "en" : "de";
    const fromSlug = getSlug(currentPath(), from);
    const toSlug = mapSlug(fromSlug, from);
    WIN.location.href = buildPath(to, toSlug);
  }

  function renderHeaderAndMore() {
    DOC.querySelectorAll("header.ss-shell, #ssBackdrop, #ssSheet").forEach(el => el.remove());

    const l = lang();
    const path = currentPath();
    const nav = l === "en" ? NAV_EN : NAV_DE;
    const more = l === "en" ? MORE_EN : MORE_DE;
    const active = findActive(path, nav);

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

        <nav class="ss-nav" aria-label="${l === "en" ? "Main navigation" : "Hauptnavigation"}">
          ${nav.map(i => i.action === "switchLang"
            ? `<a class="ss-nav__link" href="#" data-action="switchLang">${esc(i.label)}</a>`
            : `<a class="ss-nav__link${sanitizePath(i.href) === active ? " is-active" : ""}" href="${i.href}">${esc(i.label)}</a>`
          ).join("")}
        </nav>

        <div class="ss-actions">
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
    DOC.body.append(backdrop);

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
        <ul class="ss-list">
          ${more.map(item => `
            <li>
              <a href="${item.href}" class="ss-list__a">
                <span>${esc(item.label)}</span>
                <span class="ss-list__meta">${esc(item.meta || "")}</span>
              </a>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
    DOC.body.append(sheet);

    bindHeaderEvents();
  }

  function bindHeaderEvents() {
    const moreBtn = DOC.getElementById("ssMoreBtn");
    const closeBtn = DOC.getElementById("ssCloseBtn");
    const backdrop = DOC.getElementById("ssBackdrop");
    const sheet = DOC.getElementById("ssSheet");
    if (!moreBtn || !closeBtn || !backdrop || !sheet) return;

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

    moreBtn.addEventListener("click", openSheet);
    closeBtn.addEventListener("click", closeSheet);
    backdrop.addEventListener("click", closeSheet);

    DOC.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && sheet.classList.contains("is-open")) {
        ev.preventDefault();
        closeSheet();
      }
    });

    DOC.querySelectorAll('[data-action="switchLang"]').forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        switchLanguage();
      });
    });
  }

  function renderFooter() {
    const old = DOC.querySelector("footer.ss-siteFooter");
    if (old) old.remove();

    const l = lang();
    const links = l === "en" ? FOOTER_EN : FOOTER_DE;
    const year = new Date().getFullYear();
    const meta = l === "en"
      ? `Local-first link hygiene. Support: ${SUPPORT_EMAIL}`
      : `Local-first Link-Hygiene. Support: ${SUPPORT_EMAIL}`;

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
      <div class="ss-siteFooter__meta">© ${year} SafeShare · ${esc(meta)}</div>
    `;
    DOC.body.append(footer);
  }

  function boot() {
    renderHeaderAndMore();
    renderFooter();
  }

  if (DOC.readyState === "loading") {
    DOC.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
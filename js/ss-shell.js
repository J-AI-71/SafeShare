/* SafeShare Master-Flow Strict Shell */
/* Datei: /js/shell.js */

(function () {
  "use strict";

  // ---------- ROUTES (DE + EN Schema /en/<slug>/) ----------
  const ROUTES = {
    de: {
      home: "/",
      app: "/app/",
      pro: "/pro/",
      school: "/schule/",
      help: "/hilfe/",
      support: "/support/",
      privacy: "/datenschutz/",
      imprint: "/impressum/"
    },
    en: {
      home: "/en/",
      app: "/en/app/",
      pro: "/en/pro/",
      school: "/en/school/",
      help: "/en/help/",
      support: "/en/support/",
      privacy: "/en/privacy/",
      imprint: "/en/imprint/"
    }
  };

  const LABELS = {
    de: {
      brand: "SafeShare",
      home: "Start",
      app: "App",
      pro: "Pro",
      school: "Schule",
      help: "Hilfe",
      more: "Mehr",
      support: "Support",
      privacy: "Datenschutz",
      imprint: "Impressum",
      sheetTitle: "Mehr"
    },
    en: {
      brand: "SafeShare",
      home: "Home",
      app: "App",
      pro: "Pro",
      school: "School",
      help: "Help",
      more: "More",
      support: "Support",
      privacy: "Privacy",
      imprint: "Imprint",
      sheetTitle: "More"
    }
  };

  function getLangFromPath(pathname) {
    return pathname.startsWith("/en/") || pathname === "/en" ? "en" : "de";
  }

  function normalizePath(path) {
    if (!path) return "/";
    let p = path.split("?")[0].split("#")[0];
    if (!p.startsWith("/")) p = "/" + p;
    if (p !== "/" && !p.endsWith("/")) p += "/";
    return p;
  }

  function buildAltPath(targetLang, currentPath) {
    const p = normalizePath(currentPath);
    if (targetLang === "en") {
      if (p === "/") return "/en/";
      if (p.startsWith("/en/")) return p;
      return "/en" + p;
    }
    // target de
    if (p === "/en/" || p === "/en") return "/";
    if (p.startsWith("/en/")) return p.replace(/^\/en/, "") || "/";
    return p;
  }

  function currentKey(lang, path) {
    const r = ROUTES[lang];
    const p = normalizePath(path);
    const entries = [
      ["home", r.home], ["app", r.app], ["pro", r.pro],
      ["school", r.school], ["help", r.help]
    ];
    for (const [k, v] of entries) {
      if (normalizePath(v) === p) return k;
    }
    return "";
  }

  function link(href, label, active) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    a.className = "ss-nav__link";
    if (active) a.setAttribute("aria-current", "page");
    return a;
  }

  function tab(href, label, active) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    a.className = "ss-tab";
    if (active) a.setAttribute("aria-current", "page");
    return a;
  }

  function mountShell() {
    const root = document.getElementById("ss-shell");
    const content = document.getElementById("ss-content");
    if (!root || !content) return;

    const lang = getLangFromPath(window.location.pathname);
    const t = LABELS[lang];
    const r = ROUTES[lang];
    const active = currentKey(lang, window.location.pathname);

    // Header
    const header = document.createElement("header");
    header.className = "ss-header";
    header.innerHTML = `
      <div class="ss-header__inner">
        <a class="ss-brand" href="${r.home}" aria-label="${t.brand}">
          <span class="ss-brand__logo" aria-hidden="true"></span>
          <span class="ss-brand__text">${t.brand}</span>
        </a>
        <nav class="ss-nav" aria-label="Main"></nav>
        <div class="ss-header__actions">
          <button type="button" class="ss-lang" id="ss-lang-btn">${lang.toUpperCase()}</button>
          <button type="button" class="ss-more-btn" id="ss-more-btn">${t.more}</button>
        </div>
      </div>
    `;

    const nav = header.querySelector(".ss-nav");
    nav.append(
      link(r.home, t.home, active === "home"),
      link(r.app, t.app, active === "app"),
      link(r.pro, t.pro, active === "pro"),
      link(r.school, t.school, active === "school"),
      link(r.help, t.help, active === "help")
    );

    // Footer (desktop)
    const footer = document.createElement("footer");
    footer.className = "ss-footer";
    footer.innerHTML = `
      <div class="ss-footer__inner">
        <small class="ss-muted">© ${new Date().getFullYear()} SafeShare</small>
        <div class="ss-footer__links">
          <a class="ss-footer__link" href="${r.support}">${t.support}</a>
          <a class="ss-footer__link" href="${r.privacy}">${t.privacy}</a>
          <a class="ss-footer__link" href="${r.imprint}">${t.imprint}</a>
        </div>
      </div>
    `;

    // Mobile tabs
    const tabs = document.createElement("nav");
    tabs.className = "ss-tabs";
    tabs.setAttribute("aria-label", "Tabs");
    const tabsInner = document.createElement("div");
    tabsInner.className = "ss-tabs__inner";
    tabsInner.append(
      tab(r.home, t.home, active === "home"),
      tab(r.app, t.app, active === "app"),
      tab(r.pro, t.pro, active === "pro"),
      tab(r.school, t.school, active === "school"),
      tab(r.help, t.help, active === "help")
    );
    tabs.appendChild(tabsInner);

    // More sheet
    const sheet = document.createElement("div");
    sheet.className = "ss-sheet";
    sheet.id = "ss-sheet";
    sheet.innerHTML = `
      <div class="ss-sheet__backdrop" data-close="1"></div>
      <div class="ss-sheet__panel" role="dialog" aria-modal="true" aria-label="${t.sheetTitle}">
        <h3 class="ss-sheet__title">${t.sheetTitle}</h3>
        <div class="ss-sheet__list">
          <a class="ss-sheet__item" href="${r.support}">${t.support}</a>
          <a class="ss-sheet__item" href="${r.privacy}">${t.privacy}</a>
          <a class="ss-sheet__item" href="${r.imprint}">${t.imprint}</a>
        </div>
      </div>
    `;

    // Mount order
    root.innerHTML = "";
    root.appendChild(header);
    root.appendChild(content);
    root.appendChild(footer);
    root.appendChild(tabs);
    root.appendChild(sheet);

    // Actions
    const langBtn = root.querySelector("#ss-lang-btn");
    const moreBtn = root.querySelector("#ss-more-btn");
    const closeEls = sheet.querySelectorAll("[data-close='1']");

    langBtn.addEventListener("click", function () {
      const targetLang = lang === "de" ? "en" : "de";
      const targetPath = buildAltPath(targetLang, window.location.pathname);
      window.location.href = targetPath;
    });

    moreBtn.addEventListener("click", function () {
      sheet.setAttribute("open", "");
    });

    closeEls.forEach(el => el.addEventListener("click", () => {
      sheet.removeAttribute("open");
    }));

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") sheet.removeAttribute("open");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountShell);
  } else {
    mountShell();
  }
})();

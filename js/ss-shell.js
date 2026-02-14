/* File: /js/ss-shell.js */
/* SafeShare Master-Flow Strict – FINAL STABLE (single source of truth) */
/* Path must stay: /js/ss-shell.js */

(() => {
  "use strict";

  /* ----------------------------- */
  /* Boot guard (no double init)   */
  /* ----------------------------- */
  if (window.__SS_SHELL_BOOTED__) return;
  window.__SS_SHELL_BOOTED__ = true;

  const DOC = document;
  const WIN = window;

  /* ----------------------------- */
  /* Global constants              */
  /* ----------------------------- */
  const SUPPORT_EMAIL = "listings@safesharepro.com";
  const LOGO_SRC = "/assets/brand/mark-192.png";
  const LOGO_ALT = "SafeShare Logo";

  const ROOT = DOC.documentElement;
  const PATH = (WIN.location.pathname || "/").replace(/\/+$/, "") || "/";

  /* ----------------------------- */
  /* Language + route mapping      */
  /* EN schema strictly: /en/<slug>/ */
  /* ----------------------------- */
  const ROUTES = {
    home: { de: "/", en: "/en/" },
    app: { de: "/app/", en: "/en/app/" },
    schule: { de: "/schule/", en: "/en/school/" },
    pro: { de: "/pro/", en: "/en/pro/" },
    hilfe: { de: "/hilfe/", en: "/en/help/" },
    datenschutz: { de: "/datenschutz/", en: "/en/privacy/" },
    impressum: { de: "/impressum/", en: "/en/imprint/" },
    agb: { de: "/nutzungsbedingungen/", en: "/en/terms/" }
  };

  function isEnPath(pathname) {
    return pathname === "/en" || pathname.startsWith("/en/");
  }

  function normalizePath(p) {
    if (!p) return "/";
    let x = p.trim();
    if (!x.startsWith("/")) x = "/" + x;
    if (!x.endsWith("/")) x += "/";
    x = x.replace(/\/{2,}/g, "/");
    return x;
  }

  function detectLang() {
    return isEnPath(PATH) ? "en" : "de";
  }

  function getPageKeyFromPath(pathnameRaw) {
    const pathname = normalizePath(pathnameRaw);

    // exact matches first
    for (const [key, pair] of Object.entries(ROUTES)) {
      if (normalizePath(pair.de) === pathname || normalizePath(pair.en) === pathname) return key;
    }

    // fallback by first segment
    const segs = pathname.split("/").filter(Boolean);
    if (segs.length === 0) return "home";

    if (segs[0] === "en") {
      const s = segs[1] || "";
      if (s === "") return "home";
      if (s === "app") return "app";
      if (s === "school") return "schule";
      if (s === "pro") return "pro";
      if (s === "help") return "hilfe";
      if (s === "privacy") return "datenschutz";
      if (s === "imprint") return "impressum";
      if (s === "terms") return "agb";
      return null;
    } else {
      const s = segs[0] || "";
      if (s === "") return "home";
      if (s === "app") return "app";
      if (s === "schule") return "schule";
      if (s === "pro") return "pro";
      if (s === "hilfe") return "hilfe";
      if (s === "datenschutz") return "datenschutz";
      if (s === "impressum") return "impressum";
      if (s === "nutzungsbedingungen") return "agb";
      return null;
    }
  }

  function toLangPath(currentPath, targetLang) {
    const key = getPageKeyFromPath(currentPath);
    if (!key || !ROUTES[key]) {
      return targetLang === "en" ? "/en/" : "/";
    }
    return ROUTES[key][targetLang] || (targetLang === "en" ? "/en/" : "/");
  }

  /* ----------------------------- */
  /* i18n strings                  */
  /* ----------------------------- */
  const I18N = {
    de: {
      brand: "SafeShare",
      nav: {
        home: "Start",
        app: "App",
        schule: "Schule",
        pro: "Pro",
        hilfe: "Hilfe"
      },
      more: "Mehr",
      menu: {
        support: "Support",
        datenschutz: "Datenschutz",
        impressum: "Impressum",
        agb: "Nutzungsbedingungen"
      },
      footerNote: "Link-Hygiene lokal im Browser",
      lang: "EN",
      langAria: "Switch language to English"
    },
    en: {
      brand: "SafeShare",
      nav: {
        home: "Start",
        app: "App",
        schule: "School",
        pro: "Pro",
        hilfe: "Help"
      },
      more: "More",
      menu: {
        support: "Support",
        datenschutz: "Privacy",
        impressum: "Imprint",
        agb: "Terms"
      },
      footerNote: "Link hygiene locally in your browser",
      lang: "DE",
      langAria: "Sprache auf Deutsch wechseln"
    }
  };

  const LANG = detectLang();
  const T = I18N[LANG];

  /* ----------------------------- */
  /* Helpers                       */
  /* ----------------------------- */
  function qs(sel, root = DOC) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = DOC) {
    return Array.from(root.querySelectorAll(sel));
  }

  function el(tag, attrs = {}, html = "") {
    const node = DOC.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "dataset" && v && typeof v === "object") {
        Object.entries(v).forEach(([dk, dv]) => (node.dataset[dk] = String(dv)));
      } else if (k === "text") node.textContent = String(v);
      else if (v !== null && v !== undefined) node.setAttribute(k, String(v));
    }
    if (html) node.innerHTML = html;
    return node;
  }

  function ensureMainId() {
    let main = qs("main#ss-main");
    if (!main) {
      main = qs("main");
      if (main && !main.id) main.id = "ss-main";
      if (main && !main.classList.contains("ss-main")) main.classList.add("ss-main");
    }
  }

  function removeLegacyShellBlocks() {
    // Remove legacy static shell fragments if present (to avoid duplicates)
    qsa(".ss-header, header.ss-header").forEach((n) => n.remove());
    qsa(".ss-footer, footer.ss-footer").forEach((n) => n.remove());
    qsa(".ss-moreMenu").forEach((n) => n.remove());

    // Defensive: remove obvious legacy container IDs/classes
    qsa("#ss-shell-header, #ss-shell-footer, #ss-more-menu").forEach((n) => n.remove());
  }

  function pathEq(a, b) {
    return normalizePath(a) === normalizePath(b);
  }

  /* ----------------------------- */
  /* Build shell                   */
  /* ----------------------------- */
  function buildHeader() {
    const current = normalizePath(PATH);

    const navItems = [
      { key: "home", href: ROUTES.home[LANG], label: T.nav.home },
      { key: "app", href: ROUTES.app[LANG], label: T.nav.app },
      { key: "schule", href: ROUTES.schule[LANG], label: T.nav.schule },
      { key: "pro", href: ROUTES.pro[LANG], label: T.nav.pro },
      { key: "hilfe", href: ROUTES.hilfe[LANG], label: T.nav.hilfe }
    ];

    const header = el("header", { class: "ss-header", role: "banner" });
    const wrap = el("div", { class: "ss-wrap ss-header__inner" });

    const brand = el("a", {
      class: "ss-brand",
      href: ROUTES.home[LANG],
      "aria-label": "SafeShare"
    });
    const brandImg = el("img", {
      src: LOGO_SRC,
      alt: LOGO_ALT,
      class: "ss-brand__logo",
      width: "28",
      height: "28",
      loading: "eager",
      decoding: "async"
    });
    const brandText = el("span", { class: "ss-brand__text", text: T.brand });
    brand.appendChild(brandImg);
    brand.appendChild(brandText);

    const nav = el("nav", { class: "ss-nav", "aria-label": "Primary" });
    const navList = el("div", { class: "ss-nav__list", role: "list" });

    navItems.forEach((item) => {
      const link = el("a", {
        class: "ss-nav__link",
        href: item.href,
        text: item.label,
        role: "listitem",
        "data-key": item.key
      });
      if (pathEq(item.href, current)) {
        link.setAttribute("aria-current", "page");
        link.classList.add("is-active");
      }
      navList.appendChild(link);
    });

    nav.appendChild(navList);

    const actions = el("div", { class: "ss-header__actions" });

    const langTarget = toLangPath(PATH, LANG === "de" ? "en" : "de");
    const langBtn = el("a", {
      class: "ss-langBtn",
      href: langTarget,
      text: T.lang,
      "aria-label": T.langAria,
      title: T.langAria
    });

    const moreBtn = el("button", {
      class: "ss-moreBtn",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "ss-moreMenu",
      text: T.more
    });

    actions.appendChild(langBtn);
    actions.appendChild(moreBtn);

    wrap.appendChild(brand);
    wrap.appendChild(nav);
    wrap.appendChild(actions);
    header.appendChild(wrap);

    return header;
  }

  function buildMoreMenu() {
    const menu = el("div", {
      class: "ss-moreMenu",
      id: "ss-moreMenu",
      hidden: "hidden"
    });

    const panel = el("div", { class: "ss-moreMenu__panel", role: "dialog", "aria-modal": "false" });
    const close = el("button", { class: "ss-moreMenu__close", type: "button", "aria-label": "Close", text: "×" });

    const list = el("div", { class: "ss-moreMenu__list" });

    const items = [
      { href: `mailto:${SUPPORT_EMAIL}`, label: T.menu.support },
      { href: ROUTES.datenschutz[LANG], label: T.menu.datenschutz },
      { href: ROUTES.impressum[LANG], label: T.menu.impressum },
      { href: ROUTES.agb[LANG], label: T.menu.agb }
    ];

    items.forEach((it) => {
      const a = el("a", { class: "ss-moreMenu__link", href: it.href, text: it.label });
      list.appendChild(a);
    });

    panel.appendChild(close);
    panel.appendChild(list);
    menu.appendChild(panel);
    return menu;
  }

  function buildFooter() {
    const footer = el("footer", { class: "ss-footer" });
    const inner = el("div", { class: "ss-wrap ss-footer__inner" });
    inner.appendChild(el("span", { text: T.brand }));
    inner.appendChild(el("span", { class: "ss-dot", text: "•" }));
    inner.appendChild(el("span", { text: T.footerNote }));
    footer.appendChild(inner);
    return footer;
  }

  function mountShell() {
    ensureMainId();
    removeLegacyShellBlocks();

    const header = buildHeader();
    const menu = buildMoreMenu();
    const footer = buildFooter();

    const body = DOC.body;
    const main = qs("#ss-main") || qs("main");

    body.insertBefore(header, body.firstChild);
    body.appendChild(menu);
    body.appendChild(footer);

    if (main) main.classList.add("ss-main");
  }

  function wireMenu() {
    const btn = qs(".ss-moreBtn");
    const menu = qs("#ss-moreMenu");
    const panel = qs(".ss-moreMenu__panel", menu);
    const closeBtn = qs(".ss-moreMenu__close", menu);

    if (!btn || !menu || !panel || !closeBtn) return;

    const openMenu = () => {
      menu.hidden = false;
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      DOC.body.classList.add("ss-menu-open");
    };

    const closeMenu = () => {
      menu.classList.remove("is-open");
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      DOC.body.classList.remove("ss-menu-open");
    };

    btn.addEventListener("click", () => {
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    closeBtn.addEventListener("click", closeMenu);

    menu.addEventListener("click", (e) => {
      if (e.target === menu) closeMenu();
    });

    DOC.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) closeMenu();
    });

    qsa(".ss-moreMenu__link", menu).forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });
  }

  function fireReadyOnce() {
    if (window.__SS_SHELL_READY_FIRED__) return;
    window.__SS_SHELL_READY_FIRED__ = true;
    DOC.dispatchEvent(new CustomEvent("ss_shell_ready"));
  }

  function init() {
    mountShell();
    wireMenu();
    fireReadyOnce();
    ROOT.classList.add("ss-shell-ready");
  }

  if (DOC.readyState === "loading") {
    DOC.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

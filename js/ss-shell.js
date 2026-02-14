/* File: /js/ss-shell.js */
/* SafeShare Shell – STABLE RUNNING BUILD (DE/EN, More, Footer, single-boot) */

(() => {
  "use strict";
  if (window.__SS_SHELL_BOOTED__) return;
  window.__SS_SHELL_BOOTED__ = true;

  const d = document;
  const w = window;
  const path = (w.location.pathname || "/").replace(/\/+$/, "") || "/";

  const SUPPORT_EMAIL = "listings@safesharepro.com";
  const LOGO_SRC = "/assets/brand/mark-192.png";
  const LOGO_ALT = "SafeShare Logo";

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

  const isEn = path === "/en" || path.startsWith("/en/");
  const lang = isEn ? "en" : "de";

  const T = {
    de: {
      brand: "SafeShare",
      nav: { home: "Start", app: "App", schule: "Schule", pro: "Pro", hilfe: "Hilfe" },
      more: "Mehr",
      menu: { support: "Support", datenschutz: "Datenschutz", impressum: "Impressum", agb: "Nutzungsbedingungen" },
      footer: "Link-Hygiene lokal im Browser",
      langBtn: "EN",
      langAria: "Switch language to English"
    },
    en: {
      brand: "SafeShare",
      nav: { home: "Start", app: "App", schule: "School", pro: "Pro", hilfe: "Help" },
      more: "More",
      menu: { support: "Support", datenschutz: "Privacy", impressum: "Imprint", agb: "Terms" },
      footer: "Link hygiene locally in your browser",
      langBtn: "DE",
      langAria: "Sprache auf Deutsch wechseln"
    }
  }[lang];

  function norm(p) {
    if (!p) return "/";
    let x = p.trim();
    if (!x.startsWith("/")) x = "/" + x;
    if (!x.endsWith("/")) x += "/";
    return x.replace(/\/{2,}/g, "/");
  }

  function currentKey() {
    const p = norm(path);
    for (const [k, v] of Object.entries(ROUTES)) {
      if (norm(v.de) === p || norm(v.en) === p) return k;
    }
    const seg = p.split("/").filter(Boolean);
    if (!seg.length) return "home";
    if (seg[0] === "en") {
      const s = seg[1] || "";
      if (s === "") return "home";
      if (s === "app") return "app";
      if (s === "school") return "schule";
      if (s === "pro") return "pro";
      if (s === "help") return "hilfe";
      if (s === "privacy") return "datenschutz";
      if (s === "imprint") return "impressum";
      if (s === "terms") return "agb";
      return "home";
    }
    const s = seg[0] || "";
    if (s === "app") return "app";
    if (s === "schule") return "schule";
    if (s === "pro") return "pro";
    if (s === "hilfe") return "hilfe";
    if (s === "datenschutz") return "datenschutz";
    if (s === "impressum") return "impressum";
    if (s === "nutzungsbedingungen") return "agb";
    return "home";
  }

  function targetLangPath() {
    const key = currentKey();
    return lang === "de" ? ROUTES[key].en : ROUTES[key].de;
  }

  function el(tag, attrs = {}, text = "") {
    const n = d.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else n.setAttribute(k, v);
    }
    if (text) n.textContent = text;
    return n;
  }

  function removeLegacy() {
    d.querySelectorAll("header.ss-header, footer.ss-footer, .ss-moreMenu").forEach((n) => n.remove());
  }

  function ensureMain() {
    let m = d.querySelector("main#ss-main") || d.querySelector("main");
    if (!m) {
      m = el("main", { id: "ss-main", class: "ss-main" });
      d.body.appendChild(m);
    }
    if (!m.id) m.id = "ss-main";
    m.classList.add("ss-main");
  }

  function buildHeader() {
    const active = currentKey();
    const header = el("header", { class: "ss-header", role: "banner" });
    const inner = el("div", { class: "ss-wrap ss-header__inner" });

    const brand = el("a", { class: "ss-brand", href: ROUTES.home[lang], "aria-label": "SafeShare" });
    brand.appendChild(el("img", { class: "ss-brand__logo", src: LOGO_SRC, alt: LOGO_ALT, width: "28", height: "28" }));
    brand.appendChild(el("span", { class: "ss-brand__text" }, T.brand));

    const nav = el("nav", { class: "ss-nav", "aria-label": "Primary" });
    const list = el("div", { class: "ss-nav__list", role: "list" });

    const items = [
      ["home", T.nav.home],
      ["app", T.nav.app],
      ["schule", T.nav.schule],
      ["pro", T.nav.pro],
      ["hilfe", T.nav.hilfe]
    ];

    items.forEach(([key, label]) => {
      const a = el("a", { class: "ss-nav__link", href: ROUTES[key][lang], role: "listitem" }, label);
      if (key === active) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
      list.appendChild(a);
    });

    nav.appendChild(list);

    const actions = el("div", { class: "ss-header__actions" });
    actions.appendChild(el("a", { class: "ss-langBtn", href: targetLangPath(), "aria-label": T.langAria, title: T.langAria }, T.langBtn));
    actions.appendChild(el("button", { class: "ss-moreBtn", type: "button", "aria-expanded": "false", "aria-controls": "ss-moreMenu" }, T.more));

    inner.appendChild(brand);
    inner.appendChild(nav);
    inner.appendChild(actions);
    header.appendChild(inner);
    return header;
  }

  function buildMore() {
    const overlay = el("div", { class: "ss-moreMenu", id: "ss-moreMenu", hidden: "hidden" });
    const panel = el("div", { class: "ss-moreMenu__panel", role: "dialog", "aria-modal": "false" });
    const close = el("button", { class: "ss-moreMenu__close", type: "button", "aria-label": "Close" }, "×");
    const list = el("div", { class: "ss-moreMenu__list" });

    [
      [`mailto:${SUPPORT_EMAIL}`, T.menu.support],
      [ROUTES.datenschutz[lang], T.menu.datenschutz],
      [ROUTES.impressum[lang], T.menu.impressum],
      [ROUTES.agb[lang], T.menu.agb]
    ].forEach(([href, label]) => list.appendChild(el("a", { class: "ss-moreMenu__link", href }, label)));

    panel.appendChild(close);
    panel.appendChild(list);
    overlay.appendChild(panel);
    return overlay;
  }

  function buildFooter() {
    const f = el("footer", { class: "ss-footer" });
    const i = el("div", { class: "ss-wrap ss-footer__inner" });
    i.appendChild(el("span", {}, T.brand));
    i.appendChild(el("span", { class: "ss-dot" }, "•"));
    i.appendChild(el("span", {}, T.footer));
    f.appendChild(i);
    return f;
  }

  function wireMenu() {
    const btn = d.querySelector(".ss-moreBtn");
    const menu = d.querySelector("#ss-moreMenu");
    const panel = menu?.querySelector(".ss-moreMenu__panel");
    const close = menu?.querySelector(".ss-moreMenu__close");
    if (!btn || !menu || !panel || !close) return;

    const open = () => {
      menu.hidden = false;
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      d.body.classList.add("ss-menu-open");
    };
    const shut = () => {
      menu.classList.remove("is-open");
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      d.body.classList.remove("ss-menu-open");
    };

    btn.addEventListener("click", () => (menu.hidden ? open() : shut()));
    close.addEventListener("click", shut);
    menu.addEventListener("click", (e) => { if (e.target === menu) shut(); });
    d.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) shut(); });
    menu.querySelectorAll(".ss-moreMenu__link").forEach((a) => a.addEventListener("click", shut));
  }

  function mount() {
    ensureMain();
    removeLegacy();

    const header = buildHeader();
    const more = buildMore();
    const footer = buildFooter();

    d.body.insertBefore(header, d.body.firstChild);
    d.body.appendChild(more);
    d.body.appendChild(footer);

    wireMenu();

    if (!window.__SS_SHELL_READY_FIRED__) {
      window.__SS_SHELL_READY_FIRED__ = true;
      d.dispatchEvent(new CustomEvent("ss_shell_ready"));
    }
    d.documentElement.classList.add("ss-shell-ready");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();

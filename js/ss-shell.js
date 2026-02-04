/* SafeShare Shell — ss-shell.js v2026-02-03-01 */
(() => {
  "use strict";

  // ---- config: logo files ----
  const LOGO_SRC = "/assets/brand/mark-192.png?v=2026-02-03-02";
  const LOGO_FALLBACK = "/assets/brand/mark.svg?v=2026-02-03-02";

  const $ = (sel) => document.querySelector(sel);

  function norm(p) {
    if (!p) return "/";
    let s = String(p);
    if (!s.startsWith("/")) s = "/" + s;
    s = s.replace(/\/+$/, "/");
    return s;
  }

  function isENPath(pathname) {
    const p = norm(pathname);
    return p.startsWith("/en/");
  }

  function withLang(path, lang) {
    // path must be like "/pro/" or "/utm-parameter-entfernen/"
    const p = norm(path);
    if (lang === "en") return p.startsWith("/en/") ? p : norm("/en" + p);
    // de:
    return p.startsWith("/en/") ? norm(p.replace(/^\/en\//, "/")) : p;
  }

  function getSlugWithoutLang(pathname) {
    const p = norm(pathname);
    return p.startsWith("/en/") ? norm(p.replace(/^\/en\//, "/")) : p;
  }

  function linksFor(lang) {
    // Schema B: English under /en/<slug>/
    return {
      home: withLang("/", lang),
      app: withLang("/app/", lang),
      school: withLang("/schule/", lang),
      pro: withLang("/pro/", lang),
      help: withLang("/hilfe/", lang),
      bookmarks: withLang("/bookmarklets/", lang),

      // Learn (use your existing slugs; adjust if needed)
      tracking: lang === "en" ? "/en/tracking-parameters/" : "/tracking-parameter/",
      utm:      lang === "en" ? "/en/remove-utm/"          : "/utm-parameter-entfernen/",
      comparison: lang === "en" ? "/en/compare/"           : "/vergleich/",
      email:    lang === "en" ? "/en/email-links/"         : "/email-links-bereinigen/",
      messenger:lang === "en" ? "/en/messenger-links/"     : "/messenger-links-bereinigen/",
      social:   lang === "en" ? "/en/social-links/"        : "/social-links-bereinigen/",

      privacy:  lang === "en" ? "/en/privacy/"             : "/datenschutz/",
      imprint:  lang === "en" ? "/en/imprint/"             : "/impressum/",
      terms:    lang === "en" ? "/en/terms/"               : "/nutzungsbedingungen/",
    };
  }

  function labels(lang) {
    if (lang === "en") {
      return {
        start: "Start",
        app: "App",
        pro: "Pro",
        school: "School",
        help: "Help",
        more: "More",
        close: "Close",
        learn: "Learn",
        legal: "Legal",
        language: "Language",
        support: "Support",
        top: "Top",
        tagline: "Local-first. No account. No tracking.",
      };
    }
    return {
      start: "Start",
      app: "App",
      pro: "Pro",
      school: "Schule",
      help: "Hilfe",
      more: "Mehr",
      close: "Schließen",
      learn: "Wissen",
      legal: "Rechtliches",
      language: "Sprache",
      support: "Support",
      top: "Nach oben",
      tagline: "Local-first. Kein Konto. Kein Tracking.",
    };
  }

  function safeText(s) {
    return String(s || "").replace(/[&<>"]/g, (c) => (
      c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"
    ));
  }

  function init() {
    try {
      const lang = isENPath(location.pathname) ? "en" : "de";
      const L = labels(lang);
      const LINKS = linksFor(lang);

      // ---- ensure mounts ----
      let mount = $("#ss-shell");
      if (!mount) {
        mount = document.createElement("div");
        mount.id = "ss-shell";
        (document.body || document.documentElement).insertBefore(
          mount,
          document.body ? document.body.firstChild : null
        );
      }

      let fmount = $("#ss-footer");
      if (!fmount) {
        fmount = document.createElement("div");
        fmount.id = "ss-footer";
        document.body.appendChild(fmount);
      }

      // ---- language toggle (keep same slug) ----
      const currentSlug = getSlugWithoutLang(location.pathname); // "/pro/" etc.
      const otherLang = lang === "en" ? "de" : "en";
      const otherHref = withLang(currentSlug, otherLang);

      // ---- shell html ----
      const shellHTML = `
<header class="ss-header" role="banner">
  <div class="ss-header__inner">
    <a class="ss-brand" href="${safeText(LINKS.home)}" aria-label="SafeShare Home">
      <img class="ss-brand__logo" src="${safeText(LOGO_SRC)}" alt="" width="22" height="22" loading="eager" decoding="async"
        onerror="this.onerror=null; this.src='${safeText(LOGO_FALLBACK)}';">
      <span class="ss-brand__name">SafeShare</span>
    </a>

    <div class="ss-navWrap">
      <nav class="ss-nav" aria-label="Primary">
        <div class="ss-nav__links">
          <a class="ss-nav__link" data-ss-nav="home" href="${safeText(LINKS.home)}">${safeText(L.start)}</a>
          <a class="ss-nav__link" data-ss-nav="app" href="${safeText(LINKS.app)}">${safeText(L.app)}</a>
          <a class="ss-nav__link" data-ss-nav="pro" href="${safeText(LINKS.pro)}">${safeText(L.pro)}</a>
          <a class="ss-nav__link" data-ss-nav="school" href="${safeText(LINKS.school)}">${safeText(L.school)}</a>
          <a class="ss-nav__link" data-ss-nav="help" href="${safeText(LINKS.help)}">${safeText(L.help)}</a>
        </div>

        <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-expanded="false" aria-controls="ssMoreOverlay" data-ss-nav="more">
          ${safeText(L.more)}
        </button>
      </nav>
    </div>
  </div>
</header>

<div class="ss-moreOverlay" id="ssMoreOverlay" hidden>
  <div class="ss-morePanel" role="dialog" aria-modal="true" aria-label="${safeText(L.more)}">
    <div class="ss-moreTop">
      <div class="ss-moreTitle">${safeText(L.more)}</div>
      <button class="ss-moreClose" type="button" data-ss-close>${safeText(L.close)}</button>
    </div>

    <div class="ss-moreGrid">
      <section class="ss-moreGroup" aria-label="${safeText(L.learn)}">
        <h3>${safeText(L.learn)}</h3>
        <div class="ss-moreLinks">
          <a href="${safeText(LINKS.tracking)}">Tracking parameters</a>
          <a href="${safeText(LINKS.utm)}">Remove UTM</a>
          <a href="${safeText(LINKS.comparison)}">Compare</a>
          <a href="${safeText(LINKS.email)}">Email links</a>
          <a href="${safeText(LINKS.messenger)}">Messenger links</a>
          <a href="${safeText(LINKS.social)}">Social links</a>
        </div>
      </section>

      <section class="ss-moreGroup" aria-label="${safeText(L.legal)}">
        <h3>${safeText(L.legal)}</h3>
        <div class="ss-moreLinks">
          <a href="${safeText(LINKS.privacy)}">${lang === "en" ? "Privacy" : "Datenschutz"}</a>
          <a href="${safeText(LINKS.imprint)}">${lang === "en" ? "Imprint" : "Impressum"}</a>
          <a href="${safeText(LINKS.terms)}">${lang === "en" ? "Terms" : "Nutzungsbedingungen"}</a>
        </div>
      </section>

      <section class="ss-moreGroup" aria-label="${safeText(L.language)}">
        <h3>${safeText(L.language)}</h3>
        <div class="ss-moreLinks">
          <a href="${safeText(otherHref)}">${otherLang === "en" ? "English" : "Deutsch"}</a>
          <a href="#top" data-ss-close>${safeText(L.top)}</a>
        </div>
      </section>

      <section class="ss-moreGroup" aria-label="${safeText(L.support)}">
        <h3>${safeText(L.support)}</h3>
        <div class="ss-moreLinks">
          <a href="mailto:listings@safesharepro.com">listings@safesharepro.com</a>
        </div>
      </section>
    </div>
  </div>
</div>
`;

      mount.innerHTML = shellHTML;

      // ---- footer html ----
      const footerHTML = `
<div class="ss-footerInner">
  <div class="ss-footerTop">
    <div class="ss-footerBrand">
      <img class="ss-brand__logo" src="${safeText(LOGO_SRC)}" alt="" width="22" height="22" loading="eager" decoding="async"
        onerror="this.onerror=null; this.src='${safeText(LOGO_FALLBACK)}';">
      <div>
        <div class="ss-footerTitle">SafeShare</div>
        <div class="ss-footerTagline">${safeText(L.tagline)}</div>
      </div>
    </div>
  </div>

  <div class="ss-footerCols">
    <div class="ss-footerCol">
      <h4>${lang === "en" ? "Pages" : "Seiten"}</h4>
      <div class="ss-footerPills">
        <a href="${safeText(LINKS.app)}">${safeText(L.app)}</a>
        <a href="${safeText(LINKS.pro)}">${safeText(L.pro)}</a>
        <a href="${safeText(LINKS.help)}">${safeText(L.help)}</a>
        <a href="${safeText(LINKS.school)}">${safeText(L.school)}</a>
      </div>
    </div>

    <div class="ss-footerCol">
      <h4>${safeText(L.legal)}</h4>
      <div class="ss-footerPills">
        <a href="${safeText(LINKS.privacy)}">${lang === "en" ? "Privacy" : "Datenschutz"}</a>
        <a href="${safeText(LINKS.imprint)}">${lang === "en" ? "Imprint" : "Impressum"}</a>
        <a href="${safeText(LINKS.terms)}">${lang === "en" ? "Terms" : "Nutzungsbedingungen"}</a>
      </div>
    </div>

    <div class="ss-footerCol">
      <h4>${safeText(L.language)}</h4>
      <div class="ss-footerPills">
        <a href="${safeText(otherHref)}">${otherLang === "en" ? "English" : "Deutsch"}</a>
        <a href="#top">${safeText(L.top)}</a>
      </div>
    </div>
  </div>
</div>
`;
      fmount.innerHTML = footerHTML;

      // ---- Active state ----
      function setActive() {
        const p = norm(location.pathname);

        const map = [
          { key: "home", match: [norm(LINKS.home)] },
          { key: "app", match: [norm(LINKS.app)] },
          { key: "school", match: [norm(LINKS.school)] },
          { key: "pro", match: [norm(LINKS.pro)] },
          { key: "help", match: [norm(LINKS.help)] },
          { key: "bookmarks", match: [norm(LINKS.bookmarks)] },
        ];

        let activeKey = "home";
        for (const item of map) {
          if (item.match.some((m) => p.startsWith(m))) activeKey = item.key;
        }

        document.querySelectorAll("[data-ss-nav]").forEach((a) => {
          const isActive = a.getAttribute("data-ss-nav") === activeKey;
          a.classList.toggle("is-active", isActive);
          if (isActive) a.setAttribute("aria-current", "page");
          else a.removeAttribute("aria-current");
        });

        const btn = $("#ssMoreBtn");
        if (btn) {
          const moreMatches = [
            norm(LINKS.school),
            norm(LINKS.pro),
            norm(LINKS.help),
            norm(LINKS.bookmarks),
            norm(LINKS.tracking),
            norm(LINKS.utm),
            norm(LINKS.comparison),
            norm(LINKS.email),
            norm(LINKS.messenger),
            norm(LINKS.social),
            norm(LINKS.privacy),
            norm(LINKS.imprint),
            norm(LINKS.terms),
          ];
          const moreActive = moreMatches.some((m) => p.startsWith(m));
          btn.classList.toggle("is-active", moreActive);
          if (moreActive) btn.setAttribute("aria-current", "page");
          else btn.removeAttribute("aria-current");
        }
      }
      setActive();

      // ---- More menu open/close ----
      const btn = $("#ssMoreBtn");
      const overlay = $("#ssMoreOverlay");

      function hardCloseOverlay() {
        if (overlay) overlay.hidden = true;
        if (btn) btn.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("ss-noScroll");
      }

      function openMenu() {
        if (!overlay || !btn) return;
        overlay.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("ss-noScroll");
        const closeBtn = overlay.querySelector("[data-ss-close]");
        if (closeBtn) closeBtn.focus();
      }

      function closeMenu() {
        if (!overlay || !btn) return;
        overlay.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("ss-noScroll");
        btn.focus();
      }

      hardCloseOverlay();

      if (btn && overlay) {
        btn.addEventListener("click", () => {
          if (overlay.hidden) openMenu();
          else closeMenu();
        });

        overlay.addEventListener("click", (e) => {
          const t = e.target;
          if (t && t.closest && t.closest("[data-ss-close]")) closeMenu();
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && overlay && !overlay.hidden) closeMenu();
        });

        window.addEventListener("pageshow", () => hardCloseOverlay());
        window.addEventListener("pagehide", () => hardCloseOverlay());
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) hardCloseOverlay();
        });
      }
    } catch (e) {
      console.error("ss-shell.js failed:", e);
    }
  }

  // DOM-sicher starten
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* /js/ss-shell.js — SafeShare Shell v2026-02-03-02
   Schema B: EN unter /en/<slug>/
*/
(function () {
  "use strict";

  if (window.__SS_SHELL_BOOTSTRAPPED__) return;
  window.__SS_SHELL_BOOTSTRAPPED__ = true;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function norm(p) {
    p = String(p || "/");
    // sicherstellen: leading slash, trailing slash
    if (!p.startsWith("/")) p = "/" + p;
    if (!p.endsWith("/")) p = p + "/";
    return p;
  }

  function isENPath() {
    return norm(location.pathname).startsWith("/en/");
  }

  const V = "2026-02-03-02";
  const LOGO_SRC = "/assets/brand/mark-192.png?v=" + V;
  const LOGO_FALLBACK = "/assets/brand/mark.svg?v=" + V;

  const LINKS = (function () {
    const en = isENPath();
    return {
      home: en ? "/en/" : "/",
      app: en ? "/en/app/" : "/app/",
      pro: en ? "/en/pro/" : "/pro/",
      school: en ? "/en/schule/" : "/schule/",
      help: en ? "/en/hilfe/" : "/hilfe/",
      // Learn (optional – wenn du Seiten hast, sonst rausnehmen)
      tracking: en ? "/en/tracking/" : "/tracking/",
      utm: en ? "/en/utm-parameter-remove/" : "/utm-parameter-entfernen/",
      comparison: en ? "/en/compare/" : "/vergleich/",
      email: en ? "/en/email/" : "/email/",
      messenger: en ? "/en/messenger/" : "/messenger/",
      social: en ? "/en/social/" : "/social/",
      // Legal
      privacy: en ? "/en/privacy/" : "/datenschutz/",
      imprint: en ? "/en/imprint/" : "/impressum/",
      terms: en ? "/en/terms/" : "/nutzungsbedingungen/",
      // Language toggle
      lang: en ? "/" : "/en/",
      langLabel: en ? "Deutsch" : "English",
      // Support
      support: en ? "/en/support/" : "/support/"
    };
  })();

  function init() {
    try {
      // Mounts sicherstellen
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

      // ---------- Shell HTML ----------
      const t = isENPath();
      const txt = {
        start: t ? "Start" : "Start",
        app: "App",
        pro: "Pro",
        school: t ? "School" : "Schule",
        help: t ? "Help" : "Hilfe",
        more: t ? "More" : "Mehr",
        learn: t ? "Learn" : "Lernen",
        legal: t ? "Legal" : "Rechtliches",
        support: t ? "Support" : "Support",
        top: t ? "Top" : "Nach oben",
        close: t ? "Close" : "Schließen"
      };

      const shellHTML = `
<header class="ss-header" role="banner">
  <div class="ss-header__inner">
    <a class="ss-brand" href="${LINKS.home}" aria-label="SafeShare Home">
      <img class="ss-brand__logo" src="${LOGO_SRC}" alt="" aria-hidden="true"
           width="20" height="20" loading="eager" decoding="async"
           onerror="this.onerror=null;this.src='${LOGO_FALLBACK}';" />
      <span class="ss-brand__name">SafeShare</span>
    </a>

    <nav class="ss-nav" aria-label="Primary">
      <a class="ss-nav__link" data-ss-nav="home" href="${LINKS.home}">${txt.start}</a>
      <a class="ss-nav__link" data-ss-nav="app" href="${LINKS.app}">${txt.app}</a>
      <a class="ss-nav__link" data-ss-nav="pro" href="${LINKS.pro}">${txt.pro}</a>
      <a class="ss-nav__link" data-ss-nav="school" href="${LINKS.school}">${txt.school}</a>
      <a class="ss-nav__link" data-ss-nav="help" href="${LINKS.help}">${txt.help}</a>

      <button class="ss-nav__link ss-moreBtn" id="ssMoreBtn"
              aria-haspopup="dialog" aria-expanded="false">
        ${txt.more}
      </button>
    </nav>
  </div>
</header>

<div class="ss-moreOverlay" id="ssMoreOverlay" hidden>
  <div class="ss-moreSheet" role="dialog" aria-modal="true" aria-label="${txt.more}">
    <div class="ss-moreHead">
      <div class="ss-moreTitle">${txt.more}</div>
      <button class="ss-moreClose" type="button" data-ss-close>${txt.close}</button>
    </div>

    <div class="ss-moreGrid">
      <div class="ss-moreCol">
        <div class="ss-moreSection">${txt.learn}</div>
        <a class="ss-moreLink" href="${LINKS.tracking}">Tracking</a>
        <a class="ss-moreLink" href="${LINKS.utm}">UTM</a>
        <a class="ss-moreLink" href="${LINKS.comparison}">${t ? "Compare" : "Vergleich"}</a>
        <a class="ss-moreLink" href="${LINKS.email}">Email</a>
        <a class="ss-moreLink" href="${LINKS.messenger}">Messenger</a>
        <a class="ss-moreLink" href="${LINKS.social}">Social</a>
      </div>

      <div class="ss-moreCol">
        <div class="ss-moreSection">${txt.legal}</div>
        <a class="ss-moreLink" href="${LINKS.privacy}">${t ? "Privacy" : "Datenschutz"}</a>
        <a class="ss-moreLink" href="${LINKS.imprint}">${t ? "Imprint" : "Impressum"}</a>
        <a class="ss-moreLink" href="${LINKS.terms}">${t ? "Terms" : "Nutzungsbedingungen"}</a>

        <div class="ss-moreSection" style="margin-top:12px">${txt.support}</div>
        <a class="ss-moreLink" href="${LINKS.support}">${txt.support}</a>

        <div class="ss-moreSection" style="margin-top:12px">${t ? "Language" : "Sprache"}</div>
        <a class="ss-moreLink" href="${LINKS.lang}">${LINKS.langLabel}</a>

        <div class="ss-moreSection" style="margin-top:12px">${txt.top}</div>
        <a class="ss-moreLink" href="#top">${txt.top}</a>
      </div>
    </div>
  </div>
</div>
`;

      const footerHTML = `
<footer class="ss-footer" role="contentinfo">
  <div class="ss-footer__inner">
    <div class="ss-footerBrand">
      <img class="ss-footerLogo" src="${LOGO_SRC}" alt="" aria-hidden="true"
           width="20" height="20" loading="lazy" decoding="async"
           onerror="this.onerror=null;this.src='${LOGO_FALLBACK}';" />
      <div>
        <div class="ss-footerTitle">SafeShare</div>
        <div class="ss-footerTagline">${t ? "Local-first. No account. No tracking." : "Local-first. Kein Konto. Kein Tracking."}</div>
      </div>
    </div>

    <div class="ss-footerLinks">
      <a href="${LINKS.app}">${txt.app}</a>
      <a href="${LINKS.pro}">${txt.pro}</a>
      <a href="${LINKS.help}">${txt.help}</a>
      <a href="${LINKS.privacy}">${t ? "Privacy" : "Datenschutz"}</a>
      <a href="${LINKS.imprint}">${t ? "Imprint" : "Impressum"}</a>
      <a href="${LINKS.terms}">${t ? "Terms" : "Nutzungsbedingungen"}</a>
      <a href="${LINKS.lang}">${LINKS.langLabel}</a>
      <a href="#top">${txt.top}</a>
    </div>
  </div>
</footer>
`;

      mount.innerHTML = shellHTML;
      fmount.innerHTML = footerHTML;

      // ---------- Active State ----------
      function setActive() {
        const p = norm(location.pathname);

        const map = [
          { key: "home", match: [norm(LINKS.home)] },
          { key: "app", match: [norm(LINKS.app)] },
          { key: "school", match: [norm(LINKS.school)] },
          { key: "pro", match: [norm(LINKS.pro)] },
          { key: "help", match: [norm(LINKS.help)] }
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
            norm(LINKS.tracking), norm(LINKS.utm), norm(LINKS.comparison),
            norm(LINKS.email), norm(LINKS.messenger), norm(LINKS.social),
            norm(LINKS.privacy), norm(LINKS.imprint), norm(LINKS.terms),
            norm(LINKS.support)
          ];
          const moreActive = moreMatches.some((m) => p.startsWith(m));
          btn.classList.toggle("is-active", moreActive);
          if (moreActive) btn.setAttribute("aria-current", "page");
          else btn.removeAttribute("aria-current");
        }
      }
      setActive();

      // ---------- More menu ----------
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
        const closeBtn = overlay.querySelector(".ss-moreClose");
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
          // Click außerhalb Sheet schließt
          if (t === overlay) closeMenu();
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && overlay && !overlay.hidden) closeMenu();
        });

        window.addEventListener("pageshow", hardCloseOverlay);
        window.addEventListener("pagehide", hardCloseOverlay);
        document.addEventListener("visibilitychange", () => { if (document.hidden) hardCloseOverlay(); });
      }
    } catch (e) {
      console.error("ss-shell.js failed:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

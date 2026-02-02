/*! Datei: /js/ss-shell.js */
/*! SafeShare Shell v2026-02-02-02 (Schema: EN under /en/<slug>/) */
(function () {
  "use strict";

  function init() {
    try {
      const $ = (sel, root = document) => root.querySelector(sel);

      // 1) Locale bestimmen: /en/ am Anfang ODER <html lang="en">
      const path = (location.pathname || "/");
      const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
      const isEN = path.startsWith("/en/") || htmlLang.startsWith("en");

      // 2) Links (Schema: EN unter /en/<slug>/)
      const LINKS = isEN
        ? {
            home: "/en/",
            app: "/en/app/",
            school: "/en/school/",
            pro: "/en/pro/",
            help: "/en/help/",
            bookmarks: "/en/bookmarks/",

            // Learn (EN folders in repo)
            tracking: "/en/tracking-parameters/",
            utm: "/en/remove-utm-parameter/",
            comparison: "/en/url-cleaner-comparison/",
            email: "/en/email-link-cleaning/",
            messenger: "/en/messenger-link-cleaning/",
            social: "/en/social-link-cleaning/",

            // Legal
            support: "mailto:listings@safesharepro.com",
            privacy: "/en/privacy/",
            imprint: "/en/imprint/",
            terms: "/en/terms/",
          }
        : {
            home: "/",
            app: "/app/",
            school: "/schule/",
            pro: "/pro/",
            help: "/hilfe/",
            bookmarks: "/lesezeichen/",

            // Learn (DE folders in repo)
            tracking: "/tracking-parameter/",
            utm: "/utm-parameter-entfernen/",
            comparison: "/url-cleaner-tool-vergleich/",
            email: "/email-links-bereinigen/",
            messenger: "/messenger-links-bereinigen/",
            social: "/social-links-bereinigen/",

            // Legal
            support: "mailto:listings@safesharepro.com",
            privacy: "/datenschutz/",
            imprint: "/impressum/",
            terms: "/nutzungsbedingungen/",
          };

      // 3) Texte
      const T = isEN
        ? {
            start: "Home",
            app: "App",
            school: "School",
            pro: "Pro",
            help: "Help",
            bookmarks: "Bookmarks",
            more: "More",

            // Learn
            tracking: "Tracking",
            utm: "UTM",
            comparison: "Comparison",
            email: "Email links",
            messenger: "Messenger",
            social: "Social",

            // Legal
            support: "Support",
            privacy: "Privacy",
            imprint: "Imprint",
            terms: "Terms",
            close: "Close",
            langSwitch: "Deutsch",

            // Footer
            footerNote: "Local-first. No account. No tracking.",
            footerMade: "Made for clean sharing.",
            footerTop: "Top",
          }
        : {
            start: "Start",
            app: "App",
            school: "Schule",
            pro: "Pro",
            help: "Hilfe",
            bookmarks: "Lesezeichen",
            more: "Mehr",

            // Learn
            tracking: "Tracking",
            utm: "UTM",
            comparison: "Vergleich",
            email: "E-Mail-Links",
            messenger: "Messenger",
            social: "Social",

            // Legal
            support: "Support",
            privacy: "Datenschutz",
            imprint: "Impressum",
            terms: "Nutzungsbedingungen",
            close: "Schließen",
            langSwitch: "English",

            // Footer
            footerNote: "Local-first. Kein Konto. Kein Tracking.",
            footerMade: "Gemacht für sauberes Teilen.",
            footerTop: "Nach oben",
          };

      // 4) Logo
      const LOGO_SRC = "/assets/brand/logo-glyph-mint-512.png";

      // 5) Helper: trailing slash normalisieren
      function norm(p) {
        let s = String(p || "/");
        if (!s.startsWith("/")) s = "/" + s;
        s = s.replace(/\/+$/, "/");
        return s;
      }

      // 6) Sprach-Gegenstück (DE <-> EN), inkl. Learn-Seiten
      function toCounterpartUrl() {
        const p = norm(location.pathname);

        if (isEN) {
          if (p === "/en/") return "/";
          if (p.startsWith("/en/app/")) return "/app/";
          if (p.startsWith("/en/school/")) return "/schule/";
          if (p.startsWith("/en/pro/")) return "/pro/";
          if (p.startsWith("/en/help/")) return "/hilfe/";
          if (p.startsWith("/en/bookmarks/")) return "/lesezeichen/";

          // Learn (EN -> DE)
          if (p.startsWith("/en/tracking-parameters/")) return "/tracking-parameter/";
          if (p.startsWith("/en/remove-utm-parameter/")) return "/utm-parameter-entfernen/";
          if (p.startsWith("/en/url-cleaner-comparison/")) return "/url-cleaner-tool-vergleich/";
          if (p.startsWith("/en/email-link-cleaning/")) return "/email-links-bereinigen/";
          if (p.startsWith("/en/messenger-link-cleaning/")) return "/messenger-links-bereinigen/";
          if (p.startsWith("/en/social-link-cleaning/")) return "/social-links-bereinigen/";

          // Legal (EN -> DE)
          if (p.startsWith("/en/privacy/")) return "/datenschutz/";
          if (p.startsWith("/en/imprint/")) return "/impressum/";
          if (p.startsWith("/en/terms/")) return "/nutzungsbedingungen/";

          return "/";
        }

        // DE -> EN
        if (p === "/") return "/en/";
        if (p.startsWith("/app/")) return "/en/app/";
        if (p.startsWith("/schule/")) return "/en/school/";
        if (p.startsWith("/pro/")) return "/en/pro/";
        if (p.startsWith("/hilfe/")) return "/en/help/";
        if (p.startsWith("/lesezeichen/")) return "/en/bookmarks/";

        // Learn (DE -> EN)
        if (p.startsWith("/tracking-parameter/")) return "/en/tracking-parameters/";
        if (p.startsWith("/utm-parameter-entfernen/")) return "/en/remove-utm-parameter/";
        if (p.startsWith("/url-cleaner-tool-vergleich/")) return "/en/url-cleaner-comparison/";
        if (p.startsWith("/email-links-bereinigen/")) return "/en/email-link-cleaning/";
        if (p.startsWith("/messenger-links-bereinigen/")) return "/en/messenger-link-cleaning/";
        if (p.startsWith("/social-links-bereinigen/")) return "/en/social-link-cleaning/";

        // Legal (DE -> EN)
        if (p.startsWith("/datenschutz/")) return "/en/privacy/";
        if (p.startsWith("/impressum/")) return "/en/imprint/";
        if (p.startsWith("/nutzungsbedingungen/")) return "/en/terms/";

        return "/en/";
      }

      // 7) Shell-Markup (Header + More)
      const shellHTML = `
<header class="ss-header" role="banner">
  <a class="ss-brand" href="${LINKS.home}" aria-label="SafeShare">
    <span class="ss-brand__mark">
      <img class="ss-brand__img" src="${LOGO_SRC}" alt="" aria-hidden="true" width="20" height="20" loading="eager" decoding="async">
    </span>
    <span class="ss-brand__name">SafeShare</span>
  </a>

  <nav class="ss-nav" aria-label="Primary">
    <a class="ss-nav__link" data-ss-nav="home" href="${LINKS.home}">${T.start}</a>
    <a class="ss-nav__link" data-ss-nav="app" href="${LINKS.app}">${T.app}</a>

    <a class="ss-nav__link ss-nav__link--extra" data-ss-nav="school" href="${LINKS.school}">${T.school}</a>
    <a class="ss-nav__link ss-nav__link--extra" data-ss-nav="pro" href="${LINKS.pro}">${T.pro}</a>
    <a class="ss-nav__link ss-nav__link--extra" data-ss-nav="help" href="${LINKS.help}">${T.help}</a>
  </nav>

  <button class="ss-moreBtn" type="button" id="ssMoreBtn"
          aria-haspopup="dialog" aria-expanded="false" aria-controls="ssMoreMenu">
    ${T.more}
  </button>
</header>

<div class="ss-moreOverlay" id="ssMoreOverlay" hidden>
  <div class="ss-moreBackdrop" data-ss-close></div>

  <div class="ss-moreMenu" id="ssMoreMenu" role="dialog" aria-modal="true" aria-label="${T.more}">
    <div class="ss-moreTop">
      <div class="ss-moreTitle">${T.more}</div>
      <button class="ss-moreClose" type="button" data-ss-close aria-label="${T.close}">&times;</button>
    </div>

    <div class="ss-moreList" role="navigation" aria-label="${T.more}">
      <a class="ss-moreLink" href="${LINKS.school}">${T.school}</a>
      <a class="ss-moreLink" href="${LINKS.pro}">${T.pro}</a>
      <a class="ss-moreLink" href="${LINKS.help}">${T.help}</a>
      <a class="ss-moreLink" href="${LINKS.bookmarks}">${T.bookmarks}</a>

      <div class="ss-moreSep" aria-hidden="true"></div>

      <!-- Learn -->
      <a class="ss-moreLink" href="${LINKS.tracking}">${T.tracking}</a>
      <a class="ss-moreLink" href="${LINKS.utm}">${T.utm}</a>
      <a class="ss-moreLink" href="${LINKS.comparison}">${T.comparison}</a>
      <a class="ss-moreLink" href="${LINKS.email}">${T.email}</a>
      <a class="ss-moreLink" href="${LINKS.messenger}">${T.messenger}</a>
      <a class="ss-moreLink" href="${LINKS.social}">${T.social}</a>

      <div class="ss-moreSep" aria-hidden="true"></div>

      <!-- Legal -->
      <a class="ss-moreLink" href="${LINKS.support}">${T.support}</a>
      <a class="ss-moreLink" href="${LINKS.privacy}">${T.privacy}</a>
      <a class="ss-moreLink" href="${LINKS.imprint}">${T.imprint}</a>
      <a class="ss-moreLink" href="${LINKS.terms}">${T.terms}</a>
      <a class="ss-moreLink" href="${toCounterpartUrl()}">${T.langSwitch}</a>
    </div>
  </div>
</div>
      `.trim();

      // 8) Footer-Markup
   const footerHTML = `
<footer class="ss-footer" role="contentinfo">
  <div class="ss-footer__inner">
    <div class="ss-footer__brand">
      <div class="ss-footer__name">SafeShare</div>
      <div class="ss-footer__note">${T.footerNote}</div>
      <div class="ss-footer__made">${T.footerMade}</div>
    </div>

    <nav class="ss-footer__links" aria-label="Footer">
      <a class="ss-footer__link" href="${LINKS.app}">${T.app}</a>
      <a class="ss-footer__link" href="${LINKS.pro}">${T.pro}</a>
      <a class="ss-footer__link" href="${LINKS.help}">${T.help}</a>
      <a class="ss-footer__link" href="${LINKS.privacy}">${T.privacy}</a>
      <a class="ss-footer__link" href="${LINKS.imprint}">${T.imprint}</a>
      <a class="ss-footer__link" href="${LINKS.terms}">${T.terms}</a>
      <a class="ss-footer__link" href="${LINKS.support}">${T.support}</a>
      <a class="ss-footer__link" href="${toCounterpartUrl()}">${T.langSwitch}</a>
      <a class="ss-footer__link" href="#top">${T.footerTop}</a>
    </nav>

    <div class="ss-footer__meta"></div>
  </div>
</footer>
`.trim();

      // 9) Mount sicherstellen (Header-Shell)
      let mount = $("#ss-shell");
      if (!mount) {
        mount = document.createElement("div");
        mount.id = "ss-shell";
        (document.body || document.documentElement).insertBefore(
          mount,
          document.body ? document.body.firstChild : null
        );
      }
      mount.innerHTML = shellHTML;

      // 10) Footer mount sicherstellen
      let fmount = $("#ss-footer");
      if (!fmount) {
        fmount = document.createElement("div");
        fmount.id = "ss-footer";
        document.body.appendChild(fmount);
      }
      fmount.innerHTML = footerHTML;

      // 11) Active-State
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

        // More active auf: School/Pro/Help/Bookmarks + Learn + Legal
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

      // 12) Mehr-Menü open/close
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

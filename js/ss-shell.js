/* /js/ss-shell.js */
/* SafeShare Shell v2026-02-03-01 */
/* Mounts: #ss-shell (nav) + #ss-footer (footer) */

(function () {
  "use strict";

  function $(sel) {
    return document.querySelector(sel);
  }

  function norm(p) {
    return (p || "/").replace(/\/+$/, "/");
  }

  const isEN = location.pathname.startsWith("/en/");

  const LINKS = {
    home: isEN ? "/en/" : "/",
    app: isEN ? "/en/app/" : "/app/",
    pro: isEN ? "/en/pro/" : "/pro/",
    school: isEN ? "/en/schule/" : "/schule/",
    help: isEN ? "/en/hilfe/" : "/hilfe/",
    privacy: "/privacy/",
    imprint: "/imprint/",
    terms: "/terms/",
    langSwitch: isEN ? "/" : "/en/pro/"
  };

  /* ---------- NAV ---------- */

  const shellHTML = `
<header class="ss-header">
  <a class="ss-brand" href="${LINKS.home}">
    <span class="ss-brand__mark">
      <img src="/assets/glyph.svg" alt="" class="ss-brand__img">
    </span>
    <span class="ss-brand__name">SafeShare</span>
  </a>

  <nav class="ss-nav" aria-label="Primary">
    <a href="${LINKS.home}" class="ss-nav__link" data-ss-nav="home">Start</a>
    <a href="${LINKS.app}" class="ss-nav__link" data-ss-nav="app">App</a>
    <a href="${LINKS.pro}" class="ss-nav__link" data-ss-nav="pro">Pro</a>
    <a href="${LINKS.school}" class="ss-nav__link ss-nav__link--extra" data-ss-nav="school">Schule</a>
    <a href="${LINKS.help}" class="ss-nav__link ss-nav__link--extra" data-ss-nav="help">Hilfe</a>

    <button
      id="ssMoreBtn"
      class="ss-moreBtn"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="ssMoreOverlay">
      Mehr
    </button>
  </nav>
</header>

<div id="ssMoreOverlay" class="ss-moreOverlay" hidden>
  <div class="ss-moreBackdrop" data-ss-close></div>
  <div class="ss-moreMenu" role="dialog" aria-modal="true">
    <div class="ss-moreTop">
      <div class="ss-moreTitle">Mehr</div>
      <button class="ss-moreClose" data-ss-close aria-label="Schließen">×</button>
    </div>

    <div class="ss-moreList">
      <a class="ss-moreLink" href="${LINKS.school}">Schule</a>
      <a class="ss-moreLink" href="${LINKS.help}">Hilfe</a>
      <span class="ss-moreSep"></span>
      <a class="ss-moreLink" href="${LINKS.privacy}">Datenschutz</a>
      <a class="ss-moreLink" href="${LINKS.imprint}">Impressum</a>
      <a class="ss-moreLink" href="${LINKS.langSwitch}">${isEN ? "Deutsch" : "English"}</a>
    </div>
  </div>
</div>
`;

  /* ---------- FOOTER ---------- */

  const footerHTML = `
<footer class="ss-footer">
  <div class="ss-footerInner">
    <div class="ss-footerCol">
      <strong>SafeShare</strong><br>
      Links teilen ohne Ballast.<br>
      Local-first. Ohne Tracking.
    </div>

    <nav class="ss-footerLinks" aria-label="Footer">
      <a href="${LINKS.home}">Start</a>
      <a href="${LINKS.app}">App</a>
      <a href="${LINKS.pro}">Pro</a>
      <a href="${LINKS.school}">Schule</a>
      <a href="${LINKS.help}">Hilfe</a>
      <a href="${LINKS.privacy}">Datenschutz</a>
      <a href="${LINKS.imprint}">Impressum</a>
    </nav>
  </div>
</footer>
`;

  function init() {
    try {
      /* --- Mount Nav --- */
      let mount = $("#ss-shell");
      if (!mount) {
        mount = document.createElement("div");
        mount.id = "ss-shell";
        document.body.prepend(mount);
      }
      mount.innerHTML = shellHTML;

      /* --- Mount Footer --- */
      let fmount = $("#ss-footer");
      if (!fmount) {
        fmount = document.createElement("div");
        fmount.id = "ss-footer";
        document.body.appendChild(fmount);
      }
      fmount.innerHTML = footerHTML;

      /* ---------- Active State ---------- */

      function setActive() {
        const p = norm(location.pathname);

        const map = [
          { key: "home", match: [norm(LINKS.home)] },
          { key: "app", match: [norm(LINKS.app)] },
          { key: "pro", match: [norm(LINKS.pro)] },
          { key: "school", match: [norm(LINKS.school)] },
          { key: "help", match: [norm(LINKS.help)] }
        ];

        let activeKey = "home";
        for (const item of map) {
          if (item.match.some(m => p.startsWith(m))) activeKey = item.key;
        }

        document.querySelectorAll("[data-ss-nav]").forEach(a => {
          const isActive = a.getAttribute("data-ss-nav") === activeKey;
          a.classList.toggle("is-active", isActive);
          if (isActive) a.setAttribute("aria-current", "page");
          else a.removeAttribute("aria-current");
        });

        const btn = $("#ssMoreBtn");
        if (btn) {
          const moreMatches = [
            norm(LINKS.school),
            norm(LINKS.help),
            norm(LINKS.privacy),
            norm(LINKS.imprint)
          ];
          const moreActive = moreMatches.some(m => p.startsWith(m));
          btn.classList.toggle("is-active", moreActive);
        }
      }

      setActive();

      /* ---------- More Menu ---------- */

      const btn = $("#ssMoreBtn");
      const overlay = $("#ssMoreOverlay");

      function closeMenu() {
        if (!overlay || !btn) return;
        overlay.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("ss-noScroll");
        btn.focus();
      }

      function openMenu() {
        if (!overlay || !btn) return;
        overlay.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("ss-noScroll");
        const closeBtn = overlay.querySelector(".ss-moreClose");
        if (closeBtn) closeBtn.focus();
      }

      if (btn && overlay) {
        btn.addEventListener("click", () => {
          overlay.hidden ? openMenu() : closeMenu();
        });

        overlay.addEventListener("click", (e) => {
          if (e.target.closest("[data-ss-close]")) closeMenu();
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && !overlay.hidden) closeMenu();
        });

        window.addEventListener("pagehide", closeMenu);
        window.addEventListener("pageshow", closeMenu);
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

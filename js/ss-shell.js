/* File: /js/ss-shell.js */
/* SafeShare Shell — Master-Flow strict, Zero inline */
/* Version: v2026-02-05-13 */

(function () {
  "use strict";

  const d = document;
  const body = d.body;

  const SHELL_MOUNT_ID = "ss-shell";
  const FOOTER_MOUNT_ID = "ss-footer";

  const shellMount = d.getElementById(SHELL_MOUNT_ID);
  const footerMount = d.getElementById(FOOTER_MOUNT_ID);

  if (!shellMount) return;

  const rawPath = window.location.pathname;
  const pathNoIndex = rawPath.replace(/index\.html$/i, "");
  const currentPath = pathNoIndex.endsWith("/") ? pathNoIndex : pathNoIndex + "/";

  const isEn = currentPath.startsWith("/en/");

  const NAV_DE = [
    { href: "/", label: "Start" },
    { href: "/app/", label: "App" },
    { href: "/schule/", label: "Schule" },
    { href: "/pro/", label: "Pro" },
    { href: "/hilfe/", label: "Hilfe" }
  ];

  const NAV_EN = [
    { href: "/en/", label: "Home" },
    { href: "/en/app/", label: "App" },
    { href: "/en/school/", label: "School" },
    { href: "/en/pro/", label: "Pro" },
    { href: "/en/help/", label: "Help" }
  ];

  const MORE_DE = [
    { href: "/tracking-parameter/", label: "Tracking-Parameter" },
    { href: "/utm-parameter-entfernen/", label: "UTM entfernen" },
    { href: "/url-cleaner-tool-vergleich/", label: "Tool-Vergleich" },
    { href: "/social-links-bereinigen/", label: "Social-Links bereinigen" },
    { href: "/email-links-bereinigen/", label: "E-Mail-Links bereinigen" },
    { href: "/messenger-links-bereinigen/", label: "Messenger-Links bereinigen" },
    { href: "/lesezeichen/", label: "Lesezeichen" },
    { href: "/hilfe/#prostart", label: "Pro-Start" },
    { href: "https://payhip.com/b/cFHy7", label: "Supporter", external: true },
    { href: "https://payhip.com/b/djqDz", label: "Pro Person", external: true },
    { href: "https://payhip.com/b/oXFsk", label: "Pro Team", external: true }
  ];

  const MORE_EN = [
    { href: "/en/tracking-parameters/", label: "Tracking parameters" },
    { href: "/en/remove-utm-parameter/", label: "Remove UTM" },
    { href: "/en/url-cleaner-comparison/", label: "Tool comparison" },
    { href: "/en/social-link-cleaning/", label: "Clean social links" },
    { href: "/en/email-link-cleaning/", label: "Clean email links" },
    { href: "/en/messenger-link-cleaning/", label: "Clean messenger links" },
    { href: "/en/bookmarks/", label: "Bookmarks" },
    { href: "/en/help/#prostart", label: "Pro start" },
    { href: "https://payhip.com/b/cFHy7", label: "Supporter", external: true },
    { href: "https://payhip.com/b/djqDz", label: "Pro Person", external: true },
    { href: "https://payhip.com/b/oXFsk", label: "Pro Team", external: true }
  ];

  const deToEn = {
    "/": "/en/",
    "/app/": "/en/app/",
    "/hilfe/": "/en/help/",
    "/pro/": "/en/pro/",
    "/schule/": "/en/school/",
    "/lesezeichen/": "/en/bookmarks/",
    "/tracking-parameter/": "/en/tracking-parameters/",
    "/utm-parameter-entfernen/": "/en/remove-utm-parameter/",
    "/url-cleaner-tool-vergleich/": "/en/url-cleaner-comparison/",
    "/social-links-bereinigen/": "/en/social-link-cleaning/",
    "/email-links-bereinigen/": "/en/email-link-cleaning/",
    "/messenger-links-bereinigen/": "/en/messenger-link-cleaning/",
    "/404.html": "/en/404/"
  };

  const enToDe = {
    "/en/": "/",
    "/en/app/": "/app/",
    "/en/help/": "/hilfe/",
    "/en/pro/": "/pro/",
    "/en/school/": "/schule/",
    "/en/bookmarks/": "/lesezeichen/",
    "/en/tracking-parameters/": "/tracking-parameter/",
    "/en/remove-utm-parameter/": "/utm-parameter-entfernen/",
    "/en/url-cleaner-comparison/": "/url-cleaner-tool-vergleich/",
    "/en/social-link-cleaning/": "/social-links-bereinigen/",
    "/en/email-link-cleaning/": "/email-links-bereinigen/",
    "/en/messenger-link-cleaning/": "/messenger-links-bereinigen/",
    "/en/404/": "/404.html"
  };

  function normalizePath(href) {
    if (!href) return "/";
    if (/^https?:\/\//i.test(href)) return href;
    const noIndex = href.replace(/index\.html$/i, "");
    return noIndex.endsWith("/") ? noIndex : noIndex + "/";
  }

  function isActive(href) {
    const n = normalizePath(href);
    if (/^https?:\/\//i.test(n)) return false;
    if (n === "/") return currentPath === "/";
    return currentPath === n;
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const navItems = isEn ? NAV_EN : NAV_DE;
  const moreItems = isEn ? MORE_EN : MORE_DE;

  const navHtml = navItems
    .map((item) => {
      const active = isActive(item.href) ? " is-active" : "";
      return `<a class="ss-nav__link${active}" href="${esc(item.href)}">${esc(item.label)}</a>`;
    })
    .join("");

  const moreHtml = moreItems
    .map((item) => {
      const ext = item.external === true;
      const active = !ext && isActive(item.href) ? " is-active" : "";
      const rel = ext ? ' rel="noopener nofollow" target="_blank"' : "";
      return `<a class="ss-moreMenu__link${active}" href="${esc(item.href)}"${rel}>${esc(item.label)}</a>`;
    })
    .join("");

  shellMount.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__inner">
        <nav class="ss-nav" aria-label="${isEn ? "Main navigation" : "Hauptnavigation"}">
          ${navHtml}
        </nav>

        <div class="ss-nav">
          <button class="ss-nav__link ss-langSwitch" type="button" aria-label="${isEn ? "Zur deutschen Seite wechseln" : "Switch to English page"}">
            ${isEn ? "DE" : "EN"}
          </button>
          <button class="ss-moreBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="ss-moreMenu">
            ${isEn ? "More" : "Mehr"}
          </button>
        </div>
      </div>
    </header>

    <div class="ss-moreBackdrop" id="ss-moreBackdrop" hidden></div>

    <aside class="ss-moreMenu" id="ss-moreMenu" role="dialog" aria-modal="true" aria-label="${isEn ? "More menu" : "Mehr-Menü"}" hidden>
      <div class="ss-moreMenu__head">
        <strong>${isEn ? "More" : "Mehr"}</strong>
        <button class="ss-moreMenu__close" type="button" aria-label="${isEn ? "Close menu" : "Menü schließen"}">×</button>
      </div>
      <div class="ss-moreMenu__list">
        ${moreHtml}
      </div>
      <div class="ss-moreMenu__foot">
        <button class="ss-moreMenu__close" type="button">${isEn ? "Close" : "Schließen"}</button>
      </div>
    </aside>
  `;

  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="ss-footer">
        <div class="ss-footer__inner">
          <p class="ss-small">© ${new Date().getFullYear()} SafeShare</p>
          <div class="ss-actions">
            <a class="ss-btn" href="${isEn ? "/en/help/" : "/hilfe/"}">${isEn ? "Help" : "Hilfe"}</a>
            <a class="ss-btn" href="${isEn ? "/en/pro/" : "/pro/"}">Pro</a>
          </div>
        </div>
      </footer>
    `;
  }

  const btnMore = d.querySelector(".ss-moreBtn");
  const panel = d.getElementById("ss-moreMenu");
  const backdrop = d.getElementById("ss-moreBackdrop");
  const closeBtns = d.querySelectorAll(".ss-moreMenu__close");
  const langBtn = d.querySelector(".ss-langSwitch");

  function openMenu() {
    if (!panel || !backdrop || !btnMore) return;
    panel.hidden = false;
    backdrop.hidden = false;
    btnMore.setAttribute("aria-expanded", "true");
    body.classList.add("ss-noScroll");
    const firstLink = panel.querySelector(".ss-moreMenu__link");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    if (!panel || !backdrop || !btnMore) return;
    panel.hidden = true;
    backdrop.hidden = true;
    btnMore.setAttribute("aria-expanded", "false");
    body.classList.remove("ss-noScroll");
    btnMore.focus();
  }

  if (btnMore) {
    btnMore.addEventListener("click", () => {
      if (!panel) return;
      if (panel.hidden) openMenu();
      else closeMenu();
    });
  }

  if (backdrop) backdrop.addEventListener("click", closeMenu);
  closeBtns.forEach((b) => b.addEventListener("click", closeMenu));

  d.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && panel && !panel.hidden) closeMenu();
  });

  if (panel) {
    panel.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".ss-moreMenu__link")) closeMenu();
    });
  }

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      let target;
      if (isEn) {
        target = enToDe[currentPath] || currentPath.replace(/^\/en\//, "/");
        if (!target.startsWith("/")) target = "/" + target;
      } else {
        target = deToEn[currentPath] || ("/en" + (currentPath === "/" ? "/" : currentPath));
      }
      window.location.href = target;
    });
  }
})();

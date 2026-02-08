/* File: /js/ss-shell.js */
/* SafeShare Master-Flow strict — Zero header/footer/menu HTML in pages */
/* Version: mf1-final */

(() => {
  "use strict";

  const d = document;
  const body = d.body;
  const shellMount = d.getElementById("ss-shell");
  if (!shellMount) return;

  const rawPath = window.location.pathname;
  const path = rawPath.replace(/index\.html$/i, "").replace(/\/?$/, "/");
  const isEn = path.startsWith("/en/");

  const NAV = isEn
    ? [
        ["/en/", "Start"],
        ["/en/app/", "App"],
        ["/en/pro/", "Pro"],
        ["/en/school/", "School"],
        ["/en/help/", "Help"]
      ]
    : [
        ["/", "Start"],
        ["/app/", "App"],
        ["/pro/", "Pro"],
        ["/schule/", "Schule"],
        ["/hilfe/", "Hilfe"]
      ];

  const MORE = isEn
    ? [
        ["/en/bookmarks/", "Bookmarks"],
        ["/en/email-link-cleaning/", "E-Mail links"],
        ["/en/messenger-link-cleaning/", "Messenger links"],
        ["/en/social-link-cleaning/", "Social links"],
        ["/en/tracking-parameters/", "Tracking parameters"],
        ["/en/remove-utm-parameter/", "Remove UTM"],
        ["/en/url-cleaner-comparison/", "Tool comparison"],
        ["/en/privacy-when-sharing-links/", "Privacy when sharing links"],
        ["/en/shortcuts/", "Shortcuts"],
        ["/en/privacy/", "Privacy"],
        ["/en/terms/", "Terms"],
        ["/en/imprint/", "Imprint"]
      ]
    : [
        ["/lesezeichen/", "Lesezeichen"],
        ["/email-links-bereinigen/", "E-Mail-Links bereinigen"],
        ["/messenger-links-bereinigen/", "Messenger-Links bereinigen"],
        ["/social-links-bereinigen/", "Social-Links bereinigen"],
        ["/tracking-parameter/", "Tracking-Parameter erklärt"],
        ["/utm-parameter-entfernen/", "UTM-Parameter entfernen"],
        ["/url-cleaner-tool-vergleich/", "Tool-Vergleich"],
        ["/datenschutz-beim-link-teilen/", "Datenschutz beim Link-Teilen"],
        ["/shortcuts/", "Shortcuts"],
        ["/datenschutz/", "Datenschutz"],
        ["/nutzungsbedingungen/", "Nutzungsbedingungen"],
        ["/impressum/", "Impressum"]
      ];

  const deToEn = {
    "/": "/en/",
    "/app/": "/en/app/",
    "/pro/": "/en/pro/",
    "/schule/": "/en/school/",
    "/hilfe/": "/en/help/",
    "/lesezeichen/": "/en/bookmarks/",
    "/email-links-bereinigen/": "/en/email-link-cleaning/",
    "/messenger-links-bereinigen/": "/en/messenger-link-cleaning/",
    "/social-links-bereinigen/": "/en/social-link-cleaning/",
    "/tracking-parameter/": "/en/tracking-parameters/",
    "/utm-parameter-entfernen/": "/en/remove-utm-parameter/",
    "/url-cleaner-tool-vergleich/": "/en/url-cleaner-comparison/",
    "/datenschutz-beim-link-teilen/": "/en/privacy-when-sharing-links/",
    "/shortcuts/": "/en/shortcuts/",
    "/datenschutz/": "/en/privacy/",
    "/nutzungsbedingungen/": "/en/terms/",
    "/impressum/": "/en/imprint/",
    "/404.html": "/en/404/"
  };

  const enToDe = {
    "/en/": "/",
    "/en/app/": "/app/",
    "/en/pro/": "/pro/",
    "/en/school/": "/schule/",
    "/en/help/": "/hilfe/",
    "/en/bookmarks/": "/lesezeichen/",
    "/en/email-link-cleaning/": "/email-links-bereinigen/",
    "/en/messenger-link-cleaning/": "/messenger-links-bereinigen/",
    "/en/social-link-cleaning/": "/social-links-bereinigen/",
    "/en/tracking-parameters/": "/tracking-parameter/",
    "/en/remove-utm-parameter/": "/utm-parameter-entfernen/",
    "/en/url-cleaner-comparison/": "/url-cleaner-tool-vergleich/",
    "/en/privacy-when-sharing-links/": "/datenschutz-beim-link-teilen/",
    "/en/shortcuts/": "/shortcuts/",
    "/en/privacy/": "/datenschutz/",
    "/en/terms/": "/nutzungsbedingungen/",
    "/en/imprint/": "/impressum/",
    "/en/404/": "/404.html"
  };

  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const isActive = (href) => (href === "/" ? path === "/" : path === href);

  const navHtml = NAV.map(
    ([href, label]) =>
      `<a class="ss-nav__link${isActive(href) ? " is-active" : ""}" href="${esc(href)}">${esc(label)}</a>`
  ).join("");

  const moreHtml = MORE.map(
    ([href, label]) =>
      `<a class="ss-morePanel__link${isActive(href) ? " is-active" : ""}" href="${esc(href)}">${esc(label)}</a>`
  ).join("");

  shellMount.innerHTML = `
<header class="ss-header">
  <div class="ss-header__inner">
    <a class="ss-brand" href="${isEn ? "/en/" : "/"}" aria-label="SafeShare home">SafeShare</a>

    <nav class="ss-nav" aria-label="${isEn ? "Main navigation" : "Hauptnavigation"}">
      ${navHtml}
    </nav>

    <div class="ss-headActions">
      <button class="ss-langSwitch" type="button" aria-label="${isEn ? "Zur deutschen Seite wechseln" : "Switch to English page"}">${isEn ? "DE" : "EN"}</button>
      <button class="ss-moreBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="ss-morePanel">${isEn ? "More" : "Mehr"}</button>
    </div>
  </div>
</header>

<div id="ss-moreOverlay" class="ss-moreOverlay" hidden></div>

<aside id="ss-morePanel" class="ss-morePanel" role="dialog" aria-modal="true" aria-label="${isEn ? "More menu" : "Mehr-Menü"}" hidden>
  <div class="ss-morePanel__head">
    <strong>${isEn ? "More" : "Mehr"}</strong>
    <button class="ss-morePanel__close" type="button" aria-label="${isEn ? "Close" : "Schließen"}">×</button>
  </div>
  <div class="ss-morePanel__body">
    ${moreHtml}
  </div>
  <div class="ss-morePanel__foot">
    <button class="ss-morePanel__close ss-btnClose" type="button">${isEn ? "Close" : "Schließen"}</button>
  </div>
</aside>
`;

  // Optional footer mount (only if page has #ss-footer)
  const footer = d.getElementById("ss-footer");
  if (footer) {
    footer.innerHTML = `
<footer class="ss-footer">
  <div class="ss-footer__inner">
    <p class="ss-small">© ${new Date().getFullYear()} SafeShare</p>
    <div class="ss-footerLinks">
      <a href="${isEn ? "/en/help/" : "/hilfe/"}">${isEn ? "Help" : "Hilfe"}</a>
      <a href="${isEn ? "/en/pro/" : "/pro/"}">Pro</a>
    </div>
  </div>
</footer>`;
  }

  const panel = d.getElementById("ss-morePanel");
  const overlay = d.getElementById("ss-moreOverlay");
  const btnMore = shellMount.querySelector(".ss-moreBtn");
  const btnLang = shellMount.querySelector(".ss-langSwitch");
  const closeBtns = shellMount.querySelectorAll(".ss-morePanel__close");

  if (!panel || !overlay || !btnMore || !btnLang) return;

  const openMenu = () => {
    panel.hidden = false;
    overlay.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    btnMore.setAttribute("aria-expanded", "true");
    body.classList.add("ss-noScroll");
  };

  const closeMenu = () => {
    panel.classList.remove("is-open");
    btnMore.setAttribute("aria-expanded", "false");
    body.classList.remove("ss-noScroll");
    window.setTimeout(() => {
      panel.hidden = true;
      overlay.hidden = true;
    }, 160);
  };

  btnMore.addEventListener("click", () => {
    const isOpen = btnMore.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else openMenu();
  });

  overlay.addEventListener("click", closeMenu);
  closeBtns.forEach((b) => b.addEventListener("click", closeMenu));

  d.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) closeMenu();
  });

  panel.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof Element && t.closest(".ss-morePanel__link")) closeMenu();
  });

  btnLang.addEventListener("click", () => {
    let target;
    if (isEn) {
      target = enToDe[path] || path.replace(/^\/en\//, "/");
    } else {
      target = deToEn[path] || ("/en" + (path === "/" ? "/" : path));
    }
    window.location.href = target;
  });
})();

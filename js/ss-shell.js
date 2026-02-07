/* File: /js/ss-shell.js */
/* Master-Flow strict — single source of truth */
/* Version: v2026-02-05-14 */

(() => {
  "use strict";

  const d = document;
  const body = d.body;
  const mount = d.getElementById("ss-shell");
  if (!mount) return;

  const raw = window.location.pathname;
  const path = raw.replace(/index\.html$/i, "").replace(/\/?$/, "/");
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
        ["/en/shortcuts/", "Shortcuts"],
        ["/en/email-link-cleaning/", "E-Mail links"],
        ["/en/messenger-link-cleaning/", "Messenger links"],
        ["/en/social-link-cleaning/", "Social links"],
        ["/en/tracking-parameters/", "Tracking parameters"],
        ["/en/remove-utm-parameter/", "Remove UTM"],
        ["/en/url-cleaner-comparison/", "Tool comparison"],
        ["/en/privacy/", "Privacy"],
        ["/en/terms/", "Terms"],
        ["/en/imprint/", "Imprint"]
      ]
    : [
        ["/lesezeichen/", "Lesezeichen"],
        ["/shortcuts/", "Shortcuts"],
        ["/email-links-bereinigen/", "E-Mail-Links bereinigen"],
        ["/messenger-links-bereinigen/", "Messenger-Links bereinigen"],
        ["/social-links-bereinigen/", "Social-Links bereinigen"],
        ["/tracking-parameter/", "Tracking-Parameter erklärt"],
        ["/utm-parameter-entfernen/", "UTM-Parameter entfernen"],
        ["/url-cleaner-tool-vergleich/", "Tool-Vergleich"],
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
    "/shortcuts/": "/en/shortcuts/",
    "/email-links-bereinigen/": "/en/email-link-cleaning/",
    "/messenger-links-bereinigen/": "/en/messenger-link-cleaning/",
    "/social-links-bereinigen/": "/en/social-link-cleaning/",
    "/tracking-parameter/": "/en/tracking-parameters/",
    "/utm-parameter-entfernen/": "/en/remove-utm-parameter/",
    "/url-cleaner-tool-vergleich/": "/en/url-cleaner-comparison/",
    "/datenschutz/": "/en/privacy/",
    "/nutzungsbedingungen/": "/en/terms/",
    "/impressum/": "/en/imprint/"
  };

  const enToDe = {
    "/en/": "/",
    "/en/app/": "/app/",
    "/en/pro/": "/pro/",
    "/en/school/": "/schule/",
    "/en/help/": "/hilfe/",
    "/en/bookmarks/": "/lesezeichen/",
    "/en/shortcuts/": "/shortcuts/",
    "/en/email-link-cleaning/": "/email-links-bereinigen/",
    "/en/messenger-link-cleaning/": "/messenger-links-bereinigen/",
    "/en/social-link-cleaning/": "/social-links-bereinigen/",
    "/en/tracking-parameters/": "/tracking-parameter/",
    "/en/remove-utm-parameter/": "/utm-parameter-entfernen/",
    "/en/url-cleaner-comparison/": "/url-cleaner-tool-vergleich/",
    "/en/privacy/": "/datenschutz/",
    "/en/terms/": "/nutzungsbedingungen/",
    "/en/imprint/": "/impressum/"
  };

  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const active = (href) => (href === "/" ? path === "/" : path === href);

  const navHtml = NAV.map(
    ([href, label]) =>
      `<a class="ss-nav__link${active(href) ? " is-active" : ""}" href="${esc(href)}">${esc(label)}</a>`
  ).join("");

  const moreHtml = MORE.map(
    ([href, label]) =>
      `<a class="ss-moreMenu__link${active(href) ? " is-active" : ""}" href="${esc(href)}">${esc(label)}</a>`
  ).join("");

  mount.innerHTML = `
<header class="ss-header">
  <div class="ss-header__inner">
    <div class="ss-brand"><a href="${isEn ? "/en/" : "/"}">SafeShare</a></div>

    <nav class="ss-nav" aria-label="${isEn ? "Main navigation" : "Hauptnavigation"}">
      ${navHtml}
    </nav>

    <div class="ss-headActions">
      <button class="ss-langSwitch" type="button" aria-label="${isEn ? "Zur deutschen Seite wechseln" : "Switch to English page"}">${isEn ? "DE" : "EN"}</button>
      <button class="ss-moreBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="ss-moreMenu">${isEn ? "More" : "Mehr"}</button>
    </div>
  </div>
</header>

<div class="ss-moreBackdrop" id="ss-moreBackdrop" hidden></div>

<aside class="ss-moreMenu" id="ss-moreMenu" role="dialog" aria-modal="true" aria-label="${isEn ? "More menu" : "Mehr-Menü"}" hidden>
  <div class="ss-moreMenu__head">
    <strong>${isEn ? "More" : "Mehr"}</strong>
    <button class="ss-moreMenu__close" type="button" aria-label="${isEn ? "Close" : "Schließen"}">×</button>
  </div>
  <div class="ss-moreMenu__list">
    ${moreHtml}
  </div>
  <div class="ss-moreMenu__foot">
    <button class="ss-moreMenu__close" type="button">${isEn ? "Close" : "Schließen"}</button>
  </div>
</aside>
`;

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

  const panel = d.getElementById("ss-moreMenu");
  const backdrop = d.getElementById("ss-moreBackdrop");
  const btnMore = d.querySelector(".ss-moreBtn");
  const btnLang = d.querySelector(".ss-langSwitch");
  const closers = d.querySelectorAll(".ss-moreMenu__close");

  const openMenu = () => {
    panel.hidden = false;
    backdrop.hidden = false;
    btnMore.setAttribute("aria-expanded", "true");
    body.classList.add("ss-noScroll");
  };

  const closeMenu = () => {
    panel.hidden = true;
    backdrop.hidden = true;
    btnMore.setAttribute("aria-expanded", "false");
    body.classList.remove("ss-noScroll");
  };

  btnMore?.addEventListener("click", () => (panel.hidden ? openMenu() : closeMenu()));
  backdrop?.addEventListener("click", closeMenu);
  closers.forEach((b) => b.addEventListener("click", closeMenu));
  d.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel && !panel.hidden) closeMenu();
  });
  panel?.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof Element && t.closest(".ss-moreMenu__link")) closeMenu();
  });

  btnLang?.addEventListener("click", () => {
    let target;
    if (isEn) target = enToDe[path] || path.replace(/^\/en\//, "/");
    else target = deToEn[path] || ("/en" + (path === "/" ? "/" : path));
    window.location.href = target;
  });
})();

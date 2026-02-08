/* File: /js/ss-shell.js */
/* SafeShare Shell — Master-Flow strict (single source of truth) */
/* Version: v=mf1 */

(() => {
  "use strict";

  const d = document;
  const body = d.body;
  const shellMount = d.getElementById("ss-shell");
  if (!shellMount) return;

  const rawPath = window.location.pathname || "/";
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

  const FOOTER_MAIN = isEn
    ? [
        ["/en/", "Start"],
        ["/en/app/", "App"],
        ["/en/school/", "School"],
        ["/en/pro/", "Pro"],
        ["/en/help/", "Help"]
      ]
    : [
        ["/", "Start"],
        ["/app/", "App"],
        ["/schule/", "Schule"],
        ["/pro/", "Pro"],
        ["/hilfe/", "Hilfe"]
      ];

  const FOOTER_LEGAL = isEn
    ? [
        ["/en/privacy/", "Privacy"],
        ["/en/imprint/", "Imprint"],
        ["/en/terms/", "Terms"]
      ]
    : [
        ["/datenschutz/", "Datenschutz"],
        ["/impressum/", "Impressum"],
        ["/nutzungsbedingungen/", "Nutzungsbedingungen"]
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
    "/404.html/": "/en/404/"
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

  const active = (href) => {
    if (href === "/") return path === "/";
    return path === href;
  };

  const linkHtml = (href, label, cls) =>
    `<a class="${cls}${active(href) ? " is-active" : ""}" href="${esc(href)}" ${
      active(href) ? 'aria-current="page"' : ""
    }>${esc(label)}</a>`;

  const navHtml = NAV.map(([href, label]) =>
    linkHtml(href, label, "ss-nav__link")
  ).join("");

  const moreHtml = MORE.map(([href, label]) =>
    linkHtml(href, label, "ss-moreMenu__link")
  ).join("");

  shellMount.innerHTML = `
<header class="ss-header">
  <div class="ss-header__inner">
    <div class="ss-brand"><a href="${isEn ? "/en/" : "/"}">SafeShare</a></div>

    <nav class="ss-nav" aria-label="${isEn ? "Main navigation" : "Hauptnavigation"}">
      ${navHtml}
    </nav>

    <div class="ss-headActions">
      <button class="ss-langSwitch" type="button" aria-label="${
        isEn ? "Zur deutschen Seite wechseln" : "Switch to English page"
      }">${isEn ? "DE" : "EN"}</button>
      <button class="ss-moreBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="ss-moreMenu">
        ${isEn ? "More" : "Mehr"}
      </button>
    </div>
  </div>
</header>

<div class="ss-moreBackdrop" id="ss-moreBackdrop" hidden></div>

<aside class="ss-moreMenu" id="ss-moreMenu" role="dialog" aria-modal="true" aria-label="${
    isEn ? "More menu" : "Mehr-Menü"
  }" hidden>
  <div class="ss-moreMenu__head">
    <strong>${isEn ? "More" : "Mehr"}</strong>
    <button class="ss-moreMenu__close" type="button" aria-label="${
      isEn ? "Close" : "Schließen"
    }">×</button>
  </div>
  <div class="ss-moreMenu__list">
    ${moreHtml}
  </div>
  <div class="ss-moreMenu__foot">
    <button class="ss-moreMenu__close" type="button">${isEn ? "Close" : "Schließen"}</button>
  </div>
</aside>
`;

  const footerMount = d.getElementById("ss-footer");
  if (footerMount) {
    const footerMainHtml = FOOTER_MAIN.map(([href, label]) =>
      linkHtml(href, label, "ss-footer__link")
    ).join("");

    const footerLegalHtml = FOOTER_LEGAL.map(([href, label]) =>
      linkHtml(href, label, "ss-footer__link ss-footer__link--muted")
    ).join("");

    footerMount.innerHTML = `
<footer class="ss-footer" role="contentinfo">
  <div class="ss-footer__inner">
    <p class="ss-small">© ${new Date().getFullYear()} SafeShare</p>
    <nav class="ss-footerLinks" aria-label="${isEn ? "Footer navigation" : "Footer-Navigation"}">
      ${footerMainHtml}
    </nav>
    <nav class="ss-footerLinks ss-footerLinks--legal" aria-label="${isEn ? "Legal navigation" : "Rechtliches"}">
      ${footerLegalHtml}
    </nav>
  </div>
</footer>`;
  }

  const panel = d.getElementById("ss-moreMenu");
  const backdrop = d.getElementById("ss-moreBackdrop");
  const btnMore = d.querySelector(".ss-moreBtn");
  const btnLang = d.querySelector(".ss-langSwitch");
  const closers = d.querySelectorAll(".ss-moreMenu__close");

  const openMenu = () => {
    if (!panel || !backdrop || !btnMore) return;
    panel.hidden = false;
    backdrop.hidden = false;
    btnMore.setAttribute("aria-expanded", "true");
    body.classList.add("ss-noScroll");
  };

  const closeMenu = () => {
    if (!panel || !backdrop || !btnMore) return;
    panel.hidden = true;
    backdrop.hidden = true;
    btnMore.setAttribute("aria-expanded", "false");
    body.classList.remove("ss-noScroll");
  };

  btnMore?.addEventListener("click", () => {
    if (!panel) return;
    panel.hidden ? openMenu() : closeMenu();
  });

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
    let target = "/";
    if (isEn) {
      target = enToDe[path] || path.replace(/^\/en\//, "/");
    } else {
      target = deToEn[path] || ("/en" + (path === "/" ? "/" : path));
    }
    window.location.href = target;
  });
// ... bestehender shell-code ...

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

function linkOrCurrent(item, currentPage){
  const isCurrent = item.key === currentPage;
  const cls = `ss-chip${isCurrent ? ' is-active is-current' : ''}`;
  const label = escapeHtml(item.label);
  if (isCurrent) return `<span class="${cls}" aria-current="page">${label}</span>`;
  return `<a class="${cls}" href="${item.href}" data-page="${item.key}">${label}</a>`;
}

function renderFooterShell({ lang = 'de', page = '' } = {}){
  const isEN = lang === 'en';
  const main = isEN
    ? [
        { key:'start',  label:'Start',  href:'/en/' },
        { key:'app',    label:'App',    href:'/en/app/' },
        { key:'schule', label:'School', href:'/en/school/' },
        { key:'pro',    label:'Pro',    href:'/en/pro/' },
        { key:'hilfe',  label:'Help',   href:'/en/help/' }
      ]
    : [
        { key:'start',  label:'Start',  href:'/' },
        { key:'app',    label:'App',    href:'/app/' },
        { key:'schule', label:'Schule', href:'/schule/' },
        { key:'pro',    label:'Pro',    href:'/pro/' },
        { key:'hilfe',  label:'Hilfe',  href:'/hilfe/' }
      ];

  const legal = isEN
    ? [
        { key:'datenschutz', label:'Privacy', href:'/en/privacy/' },
        { key:'impressum',   label:'Imprint', href:'/en/imprint/' },
        { key:'terms',       label:'Terms',   href:'/en/terms/' }
      ]
    : [
        { key:'datenschutz', label:'Datenschutz', href:'/datenschutz/' },
        { key:'impressum',   label:'Impressum', href:'/impressum/' },
        { key:'terms',       label:'Nutzungsbedingungen', href:'/nutzungsbedingungen/' }
      ];

  const year = new Date().getFullYear();

  return `
    <footer class="ss-footer" role="contentinfo">
      <div class="ss-wrap">
        <div class="ss-footer__copy">© ${year} SafeShare</div>
        <nav class="ss-footer__nav" aria-label="${isEN ? 'Main navigation' : 'Hauptnavigation'}">
          ${main.map(i => linkOrCurrent(i, page)).join('')}
        </nav>
        <nav class="ss-footer__legal" aria-label="${isEN ? 'Legal navigation' : 'Rechtliches'}">
          ${legal.map(i => linkOrCurrent(i, page)).join('')}
        </nav>
      </div>
    </footer>
  `;
}

// init / bootstrap
(function initShell(){
  const page = document.body.dataset.page || '';
  const lang = document.body.dataset.lang || 'de';

  // header render ... (dein bestehender code)

  const footerHost = document.getElementById('ss-footer');
  if (footerHost) footerHost.innerHTML = renderFooterShell({ lang, page });
})();
  
})();

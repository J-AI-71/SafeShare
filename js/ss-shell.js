/* File: /js/ss-shell.js */
/* SafeShare Shell — Master-Flow strict (single source of truth) */

(() => {
  "use strict";

  const d = document;
  const body = d.body;
  const shellMount = d.getElementById("ss-shell");
  const footerMount = d.getElementById("ss-footer");

  // Shell darf auch nur Footer rendern, falls ss-shell fehlt
  if (!shellMount && !footerMount) return;

  const rawPath = window.location.pathname || "/";
  const path = rawPath.replace(/\/index\.html$/i, "/").replace(/\/+$/, "/") || "/";
  const isEN = path.startsWith("/en/");

  const lang = (body?.dataset?.lang || (isEN ? "en" : "de")).toLowerCase() === "en" ? "en" : "de";
  const currentPage = (body?.dataset?.page || pageFromPath(path)).toLowerCase();

  const MAIN_DE = [
    { key: "start",  href: "/",         label: "Start" },
    { key: "app",    href: "/app/",     label: "App" },
    { key: "pro",    href: "/pro/",     label: "Pro" },
    { key: "schule", href: "/schule/",  label: "Schule" },
    { key: "hilfe",  href: "/hilfe/",   label: "Hilfe" }
  ];

  const MAIN_EN = [
    { key: "start",  href: "/en/",         label: "Start" },
    { key: "app",    href: "/en/app/",     label: "App" },
    { key: "pro",    href: "/en/pro/",     label: "Pro" },
    { key: "schule", href: "/en/school/",  label: "School" },
    { key: "hilfe",  href: "/en/help/",    label: "Help" }
  ];

  const MORE_DE = [
    { key: "lesezeichen", href: "/lesezeichen/", label: "Lesezeichen" },
    { key: "email-links", href: "/email-links-bereinigen/", label: "E-Mail-Links bereinigen" },
    { key: "messenger-links", href: "/messenger-links-bereinigen/", label: "Messenger-Links bereinigen" },
    { key: "social-links", href: "/social-links-bereinigen/", label: "Social-Links bereinigen" },
    { key: "tracking", href: "/tracking-parameter/", label: "Tracking-Parameter erklärt" },
    { key: "utm", href: "/utm-parameter-entfernen/", label: "UTM-Parameter entfernen" },
    { key: "vergleich", href: "/url-cleaner-tool-vergleich/", label: "Tool-Vergleich" },
    { key: "privacy-sharing", href: "/datenschutz-beim-link-teilen/", label: "Datenschutz beim Link-Teilen" },
    { key: "shortcuts", href: "/shortcuts/", label: "Shortcuts" },
    { key: "datenschutz", href: "/datenschutz/", label: "Datenschutz" },
    { key: "terms", href: "/nutzungsbedingungen/", label: "Nutzungsbedingungen" },
    { key: "impressum", href: "/impressum/", label: "Impressum" }
  ];

  const MORE_EN = [
    { key: "bookmarks", href: "/en/bookmarks/", label: "Bookmarks" },
    { key: "email-links", href: "/en/email-link-cleaning/", label: "E-Mail links" },
    { key: "messenger-links", href: "/en/messenger-link-cleaning/", label: "Messenger links" },
    { key: "social-links", href: "/en/social-link-cleaning/", label: "Social links" },
    { key: "tracking", href: "/en/tracking-parameters/", label: "Tracking parameters" },
    { key: "utm", href: "/en/remove-utm-parameter/", label: "Remove UTM" },
    { key: "vergleich", href: "/en/url-cleaner-comparison/", label: "Tool comparison" },
    { key: "privacy-sharing", href: "/en/privacy-when-sharing-links/", label: "Privacy when sharing links" },
    { key: "shortcuts", href: "/en/shortcuts/", label: "Shortcuts" },
    { key: "datenschutz", href: "/en/privacy/", label: "Privacy" },
    { key: "terms", href: "/en/terms/", label: "Terms" },
    { key: "impressum", href: "/en/imprint/", label: "Imprint" }
  ];

  const FOOTER_LEGAL_DE = [
    { key: "datenschutz", href: "/datenschutz/", label: "Datenschutz" },
    { key: "impressum", href: "/impressum/", label: "Impressum" },
    { key: "terms", href: "/nutzungsbedingungen/", label: "Nutzungsbedingungen" }
  ];

  const FOOTER_LEGAL_EN = [
    { key: "datenschutz", href: "/en/privacy/", label: "Privacy" },
    { key: "impressum", href: "/en/imprint/", label: "Imprint" },
    { key: "terms", href: "/en/terms/", label: "Terms" }
  ];

  const MAIN = lang === "en" ? MAIN_EN : MAIN_DE;
  const MORE = lang === "en" ? MORE_EN : MORE_DE;
  const FOOTER_LEGAL = lang === "en" ? FOOTER_LEGAL_EN : FOOTER_LEGAL_DE;

  function pageFromPath(p) {
    // EN
    if (p === "/en/" || p === "/en") return "start";
    if (p.startsWith("/en/app/")) return "app";
    if (p.startsWith("/en/pro/")) return "pro";
    if (p.startsWith("/en/school/")) return "schule";
    if (p.startsWith("/en/help/")) return "hilfe";
    if (p.startsWith("/en/bookmarks/")) return "bookmarks";
    if (p.startsWith("/en/email-link-cleaning/")) return "email-links";
    if (p.startsWith("/en/messenger-link-cleaning/")) return "messenger-links";
    if (p.startsWith("/en/social-link-cleaning/")) return "social-links";
    if (p.startsWith("/en/tracking-parameters/")) return "tracking";
    if (p.startsWith("/en/remove-utm-parameter/")) return "utm";
    if (p.startsWith("/en/url-cleaner-comparison/")) return "vergleich";
    if (p.startsWith("/en/privacy-when-sharing-links/")) return "privacy-sharing";
    if (p.startsWith("/en/shortcuts/")) return "shortcuts";
    if (p.startsWith("/en/privacy/")) return "datenschutz";
    if (p.startsWith("/en/terms/")) return "terms";
    if (p.startsWith("/en/imprint/")) return "impressum";

    // DE
    if (p === "/" || p === "") return "start";
    if (p.startsWith("/app/")) return "app";
    if (p.startsWith("/pro/")) return "pro";
    if (p.startsWith("/schule/")) return "schule";
    if (p.startsWith("/hilfe/")) return "hilfe";
    if (p.startsWith("/lesezeichen/")) return "lesezeichen";
    if (p.startsWith("/email-links-bereinigen/")) return "email-links";
    if (p.startsWith("/messenger-links-bereinigen/")) return "messenger-links";
    if (p.startsWith("/social-links-bereinigen/")) return "social-links";
    if (p.startsWith("/tracking-parameter/")) return "tracking";
    if (p.startsWith("/utm-parameter-entfernen/")) return "utm";
    if (p.startsWith("/url-cleaner-tool-vergleich/")) return "vergleich";
    if (p.startsWith("/datenschutz-beim-link-teilen/")) return "privacy-sharing";
    if (p.startsWith("/shortcuts/")) return "shortcuts";
    if (p.startsWith("/datenschutz/")) return "datenschutz";
    if (p.startsWith("/nutzungsbedingungen/")) return "terms";
    if (p.startsWith("/impressum/")) return "impressum";

    return "";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (m) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]
    ));
  }

  function makeLink(item, cls = "ss-chip") {
    const active = item.key === currentPage;
    if (active) {
      return `<span class="${cls} is-active is-current" aria-current="page">${esc(item.label)}</span>`;
    }
    return `<a class="${cls}" href="${item.href}" data-page="${item.key}">${esc(item.label)}</a>`;
  }

  function renderHeader() {
    const langSwitchHref = lang === "en" ? deFromEn(path) : enFromDe(path);
    const langSwitchLabel = lang === "en" ? "DE" : "EN";

    return `
<header class="ss-top" role="banner">
  <div class="ss-wrap ss-top__row">
    <a class="ss-brand" href="${lang === "en" ? "/en/" : "/"}" aria-label="SafeShare">SafeShare</a>
    <div class="ss-top__actions">
      <a class="ss-chip ss-lang" href="${langSwitchHref}" hreflang="${lang === "en" ? "de" : "en"}">${langSwitchLabel}</a>
      <button id="ss-more-open" class="ss-chip" type="button" aria-haspopup="dialog" aria-expanded="false">More</button>
    </div>
  </div>
  <nav class="ss-mainnav" aria-label="${lang === "en" ? "Main navigation" : "Hauptnavigation"}">
    <div class="ss-wrap ss-mainnav__row">
      ${MAIN.map((i) => makeLink(i, "ss-tab")).join("")}
    </div>
  </nav>
</header>
`;
  }

  function renderMore() {
    return `
<div id="ss-more-overlay" class="ss-more-overlay" hidden></div>
<section id="ss-more-panel" class="ss-more-panel" role="dialog" aria-modal="true" aria-label="More" hidden>
  <div class="ss-more-head">
    <strong>More</strong>
    <button id="ss-more-close" class="ss-more-close" type="button" aria-label="Close">×</button>
  </div>
  <nav class="ss-more-list" aria-label="More links">
    ${MORE.map((i) => makeLink(i, "ss-more-item")).join("")}
  </nav>
</section>
`;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `
<footer class="ss-footer" role="contentinfo">
  <div class="ss-wrap">
    <div class="ss-footer__copy">© ${year} SafeShare</div>
    <nav class="ss-footer__nav" aria-label="${lang === "en" ? "Main navigation" : "Hauptnavigation"}">
      ${MAIN.map((i) => makeLink(i, "ss-chip")).join("")}
    </nav>
    <nav class="ss-footer__legal" aria-label="${lang === "en" ? "Legal navigation" : "Rechtliches"}">
      ${FOOTER_LEGAL.map((i) => makeLink(i, "ss-chip")).join("")}
    </nav>
  </div>
</footer>
`;
  }

  function enFromDe(p) {
    const map = [
      ["/", "/en/"],
      ["/app/", "/en/app/"],
      ["/pro/", "/en/pro/"],
      ["/schule/", "/en/school/"],
      ["/hilfe/", "/en/help/"],
      ["/lesezeichen/", "/en/bookmarks/"],
      ["/email-links-bereinigen/", "/en/email-link-cleaning/"],
      ["/messenger-links-bereinigen/", "/en/messenger-link-cleaning/"],
      ["/social-links-bereinigen/", "/en/social-link-cleaning/"],
      ["/tracking-parameter/", "/en/tracking-parameters/"],
      ["/utm-parameter-entfernen/", "/en/remove-utm-parameter/"],
      ["/url-cleaner-tool-vergleich/", "/en/url-cleaner-comparison/"],
      ["/datenschutz-beim-link-teilen/", "/en/privacy-when-sharing-links/"],
      ["/shortcuts/", "/en/shortcuts/"],
      ["/datenschutz/", "/en/privacy/"],
      ["/nutzungsbedingungen/", "/en/terms/"],
      ["/impressum/", "/en/imprint/"]
    ];
    const found = map.find(([de]) => p.startsWith(de));
    return found ? found[1] : "/en/";
  }

  function deFromEn(p) {
    const map = [
      ["/en/", "/"],
      ["/en/app/", "/app/"],
      ["/en/pro/", "/pro/"],
      ["/en/school/", "/schule/"],
      ["/en/help/", "/hilfe/"],
      ["/en/bookmarks/", "/lesezeichen/"],
      ["/en/email-link-cleaning/", "/email-links-bereinigen/"],
      ["/en/messenger-link-cleaning/", "/messenger-links-bereinigen/"],
      ["/en/social-link-cleaning/", "/social-links-bereinigen/"],
      ["/en/tracking-parameters/", "/tracking-parameter/"],
      ["/en/remove-utm-parameter/", "/utm-parameter-entfernen/"],
      ["/en/url-cleaner-comparison/", "/url-cleaner-tool-vergleich/"],
      ["/en/privacy-when-sharing-links/", "/datenschutz-beim-link-teilen/"],
      ["/en/shortcuts/", "/shortcuts/"],
      ["/en/privacy/", "/datenschutz/"],
      ["/en/terms/", "/nutzungsbedingungen/"],
      ["/en/imprint/", "/impressum/"]
    ];
    const found = map.find(([en]) => p.startsWith(en));
    return found ? found[1] : "/";
  }

  // Render shell
  if (shellMount) {
    shellMount.innerHTML = renderHeader() + renderMore();
  }
  if (footerMount) {
    footerMount.innerHTML = renderFooter();
  }

  // More interactions
  const moreBtn = d.getElementById("ss-more-open");
  const moreOverlay = d.getElementById("ss-more-overlay");
  const morePanel = d.getElementById("ss-more-panel");
  const moreClose = d.getElementById("ss-more-close");

  if (moreBtn && moreOverlay && morePanel && moreClose) {
    const open = () => {
      moreOverlay.hidden = false;
      morePanel.hidden = false;
      body.classList.add("ss-no-scroll");
      moreBtn.setAttribute("aria-expanded", "true");
    };
    const close = () => {
      moreOverlay.hidden = true;
      morePanel.hidden = true;
      body.classList.remove("ss-no-scroll");
      moreBtn.setAttribute("aria-expanded", "false");
    };

    moreBtn.addEventListener("click", open);
    moreClose.addEventListener("click", close);
    moreOverlay.addEventListener("click", close);
    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !morePanel.hidden) close();
    });
  }
})();

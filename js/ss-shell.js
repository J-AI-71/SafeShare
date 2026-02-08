/* File: /js/ss-shell.js */
/* SafeShare Master-Flow Shell (stable baseline) */
(() => {
  "use strict";

  const d = document;
  const body = d.body;
  const shellHost = d.getElementById("ss-shell");
  if (!shellHost || !body) return;

  /* ---------- context ---------- */
  const lang = (body.dataset.lang || "").toLowerCase() === "en" ? "en" : "de";
  const page = (body.dataset.page || "").toLowerCase();

  /* ---------- routes ---------- */
  const MAIN_DE = [
    { key: "start",  label: "Start",  href: "/" },
    { key: "app",    label: "App",    href: "/app/" },
    { key: "pro",    label: "Pro",    href: "/pro/" },
    { key: "schule", label: "Schule", href: "/schule/" },
    { key: "hilfe",  label: "Hilfe",  href: "/hilfe/" }
  ];

  const MAIN_EN = [
    { key: "start",  label: "Start",  href: "/en/" },
    { key: "app",    label: "App",    href: "/en/app/" },
    { key: "pro",    label: "Pro",    href: "/en/pro/" },
    { key: "schule", label: "School", href: "/en/school/" },
    { key: "hilfe",  label: "Help",   href: "/en/help/" }
  ];

  const MORE_DE = [
    { key: "lesezeichen",      label: "Lesezeichen",                 href: "/lesezeichen/" },
    { key: "email-links",      label: "E-Mail-Links bereinigen",     href: "/email-links-bereinigen/" },
    { key: "messenger-links",  label: "Messenger-Links bereinigen",  href: "/messenger-links-bereinigen/" },
    { key: "social-links",     label: "Social-Links bereinigen",     href: "/social-links-bereinigen/" },
    { key: "tracking",         label: "Tracking-Parameter erklärt",  href: "/tracking-parameter/" },
    { key: "utm",              label: "UTM-Parameter entfernen",     href: "/utm-parameter-entfernen/" },
    { key: "vergleich",        label: "Tool-Vergleich",              href: "/url-cleaner-tool-vergleich/" },
    { key: "privacy-sharing",  label: "Datenschutz beim Link-Teilen",href: "/datenschutz-beim-link-teilen/" },
    { key: "shortcuts",        label: "Shortcuts",                   href: "/shortcuts/" }
  ];

  const MORE_EN = [
    { key: "bookmarks",        label: "Bookmarks",                   href: "/en/bookmarks/" },
    { key: "email-links",      label: "E-Mail links",                href: "/en/email-link-cleaning/" },
    { key: "messenger-links",  label: "Messenger links",             href: "/en/messenger-link-cleaning/" },
    { key: "social-links",     label: "Social links",                href: "/en/social-link-cleaning/" },
    { key: "tracking",         label: "Tracking parameters",         href: "/en/tracking-parameters/" },
    { key: "utm",              label: "Remove UTM",                  href: "/en/remove-utm-parameter/" },
    { key: "vergleich",        label: "Tool comparison",             href: "/en/url-cleaner-comparison/" },
    { key: "privacy-sharing",  label: "Privacy when sharing links",  href: "/en/privacy-when-sharing-links/" },
    { key: "shortcuts",        label: "Shortcuts",                   href: "/en/shortcuts/" }
  ];

  const LEGAL_DE = [
    { key: "datenschutz", label: "Datenschutz",         href: "/datenschutz/" },
    { key: "impressum",   label: "Impressum",           href: "/impressum/" },
    { key: "terms",       label: "Nutzungsbedingungen", href: "/nutzungsbedingungen/" }
  ];

  const LEGAL_EN = [
    { key: "datenschutz", label: "Privacy", href: "/en/privacy/" },
    { key: "impressum",   label: "Imprint", href: "/en/imprint/" },
    { key: "terms",       label: "Terms",   href: "/en/terms/" }
  ];

  const MAIN = lang === "en" ? MAIN_EN : MAIN_DE;
  const MORE = lang === "en" ? MORE_EN : MORE_DE;
  const LEGAL = lang === "en" ? LEGAL_EN : LEGAL_DE;

  /* ---------- helpers ---------- */
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));

  function chip(item, currentKey, withDataPage = true) {
    const active = item.key === currentKey;
    const cls = `ss-chip${active ? " is-active is-current" : ""}`;
    const dp = withDataPage ? ` data-page="${esc(item.key)}"` : "";
    if (active) return `<span class="${cls}" aria-current="page">${esc(item.label)}</span>`;
    return `<a class="${cls}" href="${esc(item.href)}"${dp}>${esc(item.label)}</a>`;
  }

  function navLink(item, currentKey) {
    const active = item.key === currentKey;
    const cls = `ss-navLink${active ? " is-active is-current" : ""}`;
    if (active) return `<span class="${cls}" aria-current="page">${esc(item.label)}</span>`;
    return `<a class="${cls}" href="${esc(item.href)}" data-page="${esc(item.key)}">${esc(item.label)}</a>`;
  }

  function switchHref() {
    if (lang === "en") {
      // EN -> DE
      const map = {
        "/en/": "/",
        "/en/app/": "/app/",
        "/en/pro/": "/pro/",
        "/en/school/": "/schule/",
        "/en/help/": "/hilfe/",
        "/en/privacy/": "/datenschutz/",
        "/en/imprint/": "/impressum/",
        "/en/terms/": "/nutzungsbedingungen/",
        "/en/privacy-when-sharing-links/": "/datenschutz-beim-link-teilen/"
      };
      return map[normalizePath(location.pathname)] || "/";
    } else {
      // DE -> EN
      const map = {
        "/": "/en/",
        "/app/": "/en/app/",
        "/pro/": "/en/pro/",
        "/schule/": "/en/school/",
        "/hilfe/": "/en/help/",
        "/datenschutz/": "/en/privacy/",
        "/impressum/": "/en/imprint/",
        "/nutzungsbedingungen/": "/en/terms/",
        "/datenschutz-beim-link-teilen/": "/en/privacy-when-sharing-links/"
      };
      return map[normalizePath(location.pathname)] || "/en/";
    }
  }

  function normalizePath(p) {
    let x = (p || "/").trim();
    if (!x.startsWith("/")) x = "/" + x;
    x = x.replace(/\/index\.html$/i, "/");
    x = x.replace(/\/+$/, "/");
    return x;
  }

  /* ---------- render ---------- */
  shellHost.innerHTML = `
    <header class="ss-top" role="banner">
      <div class="ss-wrap ss-topRow">
        <a class="ss-brand" href="${lang === "en" ? "/en/" : "/"}" aria-label="SafeShare">
          <span class="ss-brandText">SafeShare</span>
        </a>
        <div class="ss-topActions">
          <a class="ss-chip" href="${switchHref()}">${lang === "en" ? "DE" : "EN"}</a>
          <button class="ss-chip ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">
            ${lang === "en" ? "More" : "Mehr"}
          </button>
        </div>
      </div>
      <div class="ss-wrap ss-nav" role="navigation" aria-label="${lang === "en" ? "Main navigation" : "Hauptnavigation"}">
        ${MAIN.map((i) => navLink(i, page)).join("")}
      </div>
    </header>

    <div class="ss-moreOverlay" id="ssMoreOverlay" hidden></div>
    <aside class="ss-moreSheet" id="ssMoreSheet" role="dialog" aria-modal="true" aria-label="${lang === "en" ? "More" : "Mehr"}" hidden>
      <div class="ss-moreHead">
        <strong>${lang === "en" ? "More" : "Mehr"}</strong>
        <button class="ss-close" id="ssMoreClose" type="button" aria-label="${lang === "en" ? "Close" : "Schließen"}">×</button>
      </div>
      <div class="ss-moreList">
        ${MORE.map((i) => chip(i, page)).join("")}
        <div class="ss-divider"></div>
        ${LEGAL.map((i) => chip(i, page)).join("")}
      </div>
    </aside>
  `;

  const footerHost = d.getElementById("ss-footer");
  if (footerHost) {
    const year = new Date().getFullYear();
    footerHost.innerHTML = `
      <footer class="ss-footer" role="contentinfo">
        <div class="ss-wrap">
          <div class="ss-copy">© ${year} SafeShare</div>
          <nav class="ss-footerNav" aria-label="${lang === "en" ? "Main navigation" : "Hauptnavigation"}">
            ${MAIN.map((i) => chip(i, page, true)).join("")}
          </nav>
          <nav class="ss-footerLegal" aria-label="${lang === "en" ? "Legal navigation" : "Rechtliches"}">
            ${LEGAL.map((i) => chip(i, page, true)).join("")}
          </nav>
        </div>
      </footer>
    `;
  }

  /* ---------- interactions ---------- */
  const moreBtn = d.getElementById("ssMoreBtn");
  const overlay = d.getElementById("ssMoreOverlay");
  const sheet = d.getElementById("ssMoreSheet");
  const closeBtn = d.getElementById("ssMoreClose");

  if (moreBtn && overlay && sheet && closeBtn) {
    const open = () => {
      overlay.hidden = false;
      sheet.hidden = false;
      requestAnimationFrame(() => sheet.classList.add("is-open"));
      moreBtn.setAttribute("aria-expanded", "true");
      body.classList.add("ss-lock");
    };

    const close = () => {
      sheet.classList.remove("is-open");
      moreBtn.setAttribute("aria-expanded", "false");
      setTimeout(() => {
        overlay.hidden = true;
        sheet.hidden = true;
        body.classList.remove("ss-lock");
      }, 140);
    };

    moreBtn.addEventListener("click", () => {
      const expanded = moreBtn.getAttribute("aria-expanded") === "true";
      expanded ? close() : open();
    });

    overlay.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    sheet.addEventListener("click", (e) => {
      if (e.target.closest("a")) close();
    });

    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !sheet.hidden) close();
    });
  }

  // Debug marker
  d.documentElement.setAttribute("data-ss-shell-live", "1");
})();

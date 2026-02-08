/* File: /js/ss-shell.js */
/* SafeShare Master-Flow strict Shell v2 (Zero header/footer in HTML) */
(() => {
  "use strict";

  const d = document;
  const body = d.body;
  const mount = d.getElementById("ss-shell");
  if (!mount) return;

  const rawPath = window.location.pathname || "/";
  const path = rawPath.replace(/index\.html$/i, "").replace(/\/?$/, "/");
  const isEn = path.startsWith("/en/");

  // ---------- Navigation ----------
  const NAV = isEn
    ? [
        ["/en/", "Start", "start"],
        ["/en/app/", "App", "app"],
        ["/en/school/", "School", "schule"],
        ["/en/pro/", "Pro", "pro"],
        ["/en/help/", "Help", "hilfe"]
      ]
    : [
        ["/", "Start", "start"],
        ["/app/", "App", "app"],
        ["/schule/", "Schule", "schule"],
        ["/pro/", "Pro", "pro"],
        ["/hilfe/", "Hilfe", "hilfe"]
      ];

  // Top entries in "More" (contextual)
  const MORE_TOP = isEn
    ? [
        ["/en/privacy-when-sharing-links/", "Privacy when sharing links", "privacy-sharing"]
      ]
    : [
        ["/datenschutz-beim-link-teilen/", "Datenschutz beim Link-Teilen", "privacy-sharing"]
      ];

  // Remaining entries in "More"
  const MORE_REST = isEn
    ? [
        ["/en/bookmarks/", "Bookmarks", "lesezeichen"],
        ["/en/email-link-cleaning/", "E-Mail links", "email"],
        ["/en/messenger-link-cleaning/", "Messenger links", "messenger"],
        ["/en/social-link-cleaning/", "Social links", "social"],
        ["/en/tracking-parameters/", "Tracking parameters", "tracking"],
        ["/en/remove-utm-parameter/", "Remove UTM", "utm"],
        ["/en/url-cleaner-comparison/", "Tool comparison", "vergleich"],
        ["/en/privacy/", "Privacy", "datenschutz"],
        ["/en/terms/", "Terms", "terms"],
        ["/en/imprint/", "Imprint", "impressum"]
      ]
    : [
        ["/lesezeichen/", "Lesezeichen", "lesezeichen"],
        ["/email-links-bereinigen/", "E-Mail-Links bereinigen", "email"],
        ["/messenger-links-bereinigen/", "Messenger-Links bereinigen", "messenger"],
        ["/social-links-bereinigen/", "Social-Links bereinigen", "social"],
        ["/tracking-parameter/", "Tracking-Parameter erklärt", "tracking"],
        ["/utm-parameter-entfernen/", "UTM-Parameter entfernen", "utm"],
        ["/url-cleaner-tool-vergleich/", "Tool-Vergleich", "vergleich"],
        ["/datenschutz/", "Datenschutz", "datenschutz"],
        ["/nutzungsbedingungen/", "Nutzungsbedingungen", "terms"],
        ["/impressum/", "Impressum", "impressum"]
      ];

  // Language switch mapping
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
    "/datenschutz/": "/en/privacy/",
    "/nutzungsbedingungen/": "/en/terms/",
    "/impressum/": "/en/imprint/",
    "/datenschutz-beim-link-teilen/": "/en/privacy-when-sharing-links/",
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
    "/en/privacy/": "/datenschutz/",
    "/en/terms/": "/nutzungsbedingungen/",
    "/en/imprint/": "/impressum/",
    "/en/privacy-when-sharing-links/": "/datenschutz-beim-link-teilen/",
    "/en/404/": "/404.html"
  };

  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  function pageFromPath(p) {
    // DE
    if (p === "/" || p === "/index.html/") return "start";
    if (p.startsWith("/app/")) return "app";
    if (p.startsWith("/schule/")) return "schule";
    if (p.startsWith("/pro/")) return "pro";
    if (p.startsWith("/hilfe/")) return "hilfe";
    if (p.startsWith("/lesezeichen/")) return "lesezeichen";
    if (p.startsWith("/email-links-bereinigen/")) return "email";
    if (p.startsWith("/messenger-links-bereinigen/")) return "messenger";
    if (p.startsWith("/social-links-bereinigen/")) return "social";
    if (p.startsWith("/tracking-parameter/")) return "tracking";
    if (p.startsWith("/utm-parameter-entfernen/")) return "utm";
    if (p.startsWith("/url-cleaner-tool-vergleich/")) return "vergleich";
    if (p.startsWith("/datenschutz/")) return "datenschutz";
    if (p.startsWith("/nutzungsbedingungen/")) return "terms";
    if (p.startsWith("/impressum/")) return "impressum";
    if (p.startsWith("/datenschutz-beim-link-teilen/")) return "privacy-sharing";

    // EN
    if (p === "/en/" || p === "/en/index.html/") return "start";
    if (p.startsWith("/en/app/")) return "app";
    if (p.startsWith("/en/school/")) return "schule";
    if (p.startsWith("/en/pro/")) return "pro";
    if (p.startsWith("/en/help/")) return "hilfe";
    if (p.startsWith("/en/bookmarks/")) return "lesezeichen";
    if (p.startsWith("/en/email-link-cleaning/")) return "email";
    if (p.startsWith("/en/messenger-link-cleaning/")) return "messenger";
    if (p.startsWith("/en/social-link-cleaning/")) return "social";
    if (p.startsWith("/en/tracking-parameters/")) return "tracking";
    if (p.startsWith("/en/remove-utm-parameter/")) return "utm";
    if (p.startsWith("/en/url-cleaner-comparison/")) return "vergleich";
    if (p.startsWith("/en/privacy/")) return "datenschutz";
    if (p.startsWith("/en/terms/")) return "terms";
    if (p.startsWith("/en/imprint/")) return "impressum";
    if (p.startsWith("/en/privacy-when-sharing-links/")) return "privacy-sharing";

    return "";
  }

  const currentPage = body?.dataset?.page || pageFromPath(path);

  function linkOrCurrent(href, label, key, cls) {
    const isCurrent = key && key === currentPage;
    if (isCurrent) {
      return `<span class="${cls} is-active is-current" aria-current="page">${esc(label)}</span>`;
    }
    return `<a class="${cls}" href="${esc(href)}" data-page="${esc(key || "")}">${esc(label)}</a>`;
  }

  const navHtml = NAV.map(([href, label, key]) =>
    linkOrCurrent(href, label, key, "ss-nav__link")
  ).join("");

  const topDynamic = MORE_TOP.filter(([, , key]) => key !== currentPage);

  const moreHtml = [...topDynamic, ...MORE_REST]
    .map(([href, label, key]) => linkOrCurrent(href, label, key, "ss-moreMenu__link"))
    .join("");

  mount.innerHTML = `
<header class="ss-header">
  <div class="ss-header__inner">
    <div class="ss-brand">
      <a href="${isEn ? "/en/" : "/"}" aria-label="SafeShare">SafeShare</a>
    </div>

    <nav class="ss-nav" aria-label="${isEn ? "Main navigation" : "Hauptnavigation"}">
      ${navHtml}
    </nav>

    <div class="ss-headActions">
      <button class="ss-langSwitch" type="button" aria-label="${isEn ? "Zur deutschen Seite wechseln" : "Switch to English page"}">
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

  // Footer shell
  const footer = d.getElementById("ss-footer");
  if (footer) {
    const main = isEn
      ? [
          { key: "start", label: "Start", href: "/en/" },
          { key: "app", label: "App", href: "/en/app/" },
          { key: "schule", label: "School", href: "/en/school/" },
          { key: "pro", label: "Pro", href: "/en/pro/" },
          { key: "hilfe", label: "Help", href: "/en/help/" }
        ]
      : [
          { key: "start", label: "Start", href: "/" },
          { key: "app", label: "App", href: "/app/" },
          { key: "schule", label: "Schule", href: "/schule/" },
          { key: "pro", label: "Pro", href: "/pro/" },
          { key: "hilfe", label: "Hilfe", href: "/hilfe/" }
        ];

    const legal = isEn
      ? [
          { key: "datenschutz", label: "Privacy", href: "/en/privacy/" },
          { key: "impressum", label: "Imprint", href: "/en/imprint/" },
          { key: "terms", label: "Terms", href: "/en/terms/" }
        ]
      : [
          { key: "datenschutz", label: "Datenschutz", href: "/datenschutz/" },
          { key: "impressum", label: "Impressum", href: "/impressum/" },
          { key: "terms", label: "Nutzungsbedingungen", href: "/nutzungsbedingungen/" }
        ];

    const year = new Date().getFullYear();

    footer.innerHTML = `
<footer class="ss-footer" role="contentinfo">
  <div class="ss-footer__inner">
    <p class="ss-small">© ${year} SafeShare</p>

    <nav class="ss-footerLinks" aria-label="${isEn ? "Main navigation" : "Hauptnavigation"}">
      ${main
        .map((i) => linkOrCurrent(i.href, i.label, i.key, "ss-chip"))
        .join("")}
    </nav>

    <nav class="ss-footerLegal" aria-label="${isEn ? "Legal navigation" : "Rechtliches"}">
      ${legal
        .map((i) => linkOrCurrent(i.href, i.label, i.key, "ss-chip"))
        .join("")}
    </nav>
  </div>
</footer>`;
  }

  // ---------- Interactions ----------
  const panel = d.getElementById("ss-moreMenu");
  const backdrop = d.getElementById("ss-moreBackdrop");
  const btnMore = d.querySelector(".ss-moreBtn");
  const btnLang = d.querySelector(".ss-langSwitch");
  const closers = d.querySelectorAll(".ss-moreMenu__close");

  if (!panel || !backdrop || !btnMore || !btnLang) return;

  const openMenu = () => {
    panel.hidden = false;
    backdrop.hidden = false;
    btnMore.setAttribute("aria-expanded", "true");
    body.classList.add("ss-noScroll");
    requestAnimationFrame(() => panel.classList.add("is-open"));
  };

  const closeMenu = () => {
    panel.classList.remove("is-open");
    btnMore.setAttribute("aria-expanded", "false");
    body.classList.remove("ss-noScroll");
    setTimeout(() => {
      panel.hidden = true;
      backdrop.hidden = true;
    }, 160);
  };

  btnMore.addEventListener("click", () => {
    if (panel.hidden) openMenu();
    else closeMenu();
  });

  backdrop.addEventListener("click", closeMenu);
  closers.forEach((b) => b.addEventListener("click", closeMenu));

  d.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) closeMenu();
  });

  panel.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof Element && t.closest(".ss-moreMenu__link")) closeMenu();
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

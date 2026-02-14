/* /js/ss-shell.js */
/* SafeShare Shell FINAL – robust header/nav/footer injection */

(() => {
  "use strict";

  if (window.__SS_SHELL_BOOTED__) return;
  window.__SS_SHELL_BOOTED__ = true;

  const d = document;
  const body = d.body;
  if (!body) return;

  const lang = (body.dataset.lang || "de").toLowerCase();
  const page = (body.dataset.page || "").toLowerCase();

  const T = lang === "en" ? {
    brand: "SafeShare",
    nav: [
      { key: "start", label: "Start", href: "/en/" },
      { key: "app", label: "App", href: "/en/app/" },
      { key: "school", label: "School", href: "/en/school/" },
      { key: "pro", label: "Pro", href: "/en/pro/" },
      { key: "help", label: "Help", href: "/en/help/" }
    ],
    more: "More",
    moreLinks: [
      { label: "Bookmarks", href: "/en/bookmarks/" },
      { label: "Tracking parameters", href: "/en/tracking-parameters/" },
      { label: "Remove UTM parameters", href: "/en/remove-utm-parameter/" },
      { label: "URL cleaner comparison", href: "/en/url-cleaner-comparison/" },
      { label: "Support", href: "mailto:listings@safesharepro.com" }
    ],
    langLabel: "DE",
    langHref: switchToDE(),
    footerNote: "Clean links. Share clearly."
  } : {
    brand: "SafeShare",
    nav: [
      { key: "start", label: "Start", href: "/" },
      { key: "app", label: "App", href: "/app/" },
      { key: "schule", label: "Schule", href: "/schule/" },
      { key: "pro", label: "Pro", href: "/pro/" },
      { key: "hilfe", label: "Hilfe", href: "/hilfe/" }
    ],
    more: "Mehr",
    moreLinks: [
      { label: "Lesezeichen", href: "/lesezeichen/" },
      { label: "Tracking-Parameter", href: "/tracking-parameter/" },
      { label: "UTM entfernen", href: "/utm-parameter-entfernen/" },
      { label: "Tool-Vergleich", href: "/url-cleaner-tool-vergleich/" },
      { label: "Support", href: "mailto:listings@safesharepro.com" }
    ],
    langLabel: "EN",
    langHref: switchToEN(),
    footerNote: "Links säubern. Klar teilen."
  };

  function switchToEN() {
    const p = location.pathname;
    if (p.startsWith("/en/")) return p;
    if (p === "/") return "/en/";
    return "/en" + (p.endsWith("/") ? p : p + "/");
  }

  function switchToDE() {
    const p = location.pathname;
    if (!p.startsWith("/en/")) return p;
    const out = p.replace(/^\/en/, "");
    return out || "/";
  }

  function isActive(itemKey) {
    // normalize known page aliases
    const map = {
      school: "school",
      schule: "schule",
      help: "help",
      hilfe: "hilfe",
      start: "start",
      app: "app",
      pro: "pro"
    };
    return map[itemKey] === page;
  }

  function createHeader() {
    const header = d.createElement("header");
    header.className = "ss-shell-header";
    header.innerHTML = `
      <div class="ss-shell-header__inner">
        <a class="ss-brand" href="${lang === "en" ? "/en/" : "/"}" aria-label="SafeShare home">
          <img class="ss-brand__mark" src="/assets/brand/mark-192.png" alt="SafeShare Logo" />
          <span class="ss-brand__name">${T.brand}</span>
        </a>

        <div class="ss-nav-wrap">
          <nav class="ss-nav" aria-label="Primary">
            ${T.nav.map(n => `
              <a class="ss-nav__link" href="${n.href}" ${isActive(n.key) ? 'aria-current="page"' : ""}>${n.label}</a>
            `).join("")}
            <div class="ss-more">
              <button type="button" class="ss-more-btn" aria-expanded="false" aria-controls="ssMorePanel">${T.more}</button>
              <div id="ssMorePanel" class="ss-more-panel" role="menu" aria-label="${T.more}">
                ${T.moreLinks.map(l => `<a role="menuitem" href="${l.href}">${l.label}</a>`).join("")}
              </div>
            </div>
          </nav>
        </div>

        <a class="ss-lang" href="${T.langHref}" aria-label="Switch language">${T.langLabel}</a>
      </div>
    `;
    return header;
  }

  function createFooter() {
    const footer = d.createElement("footer");
    footer.className = "ss-shell-footer";
    footer.innerHTML = `
      <div class="ss-shell-footer__inner">
        <span>© ${new Date().getFullYear()} SafeShare</span>
        <span>•</span>
        <span>${T.footerNote}</span>
        <span>•</span>
        <a href="mailto:listings@safesharepro.com">listings@safesharepro.com</a>
      </div>
    `;
    return footer;
  }

  function mount() {
    if (!d.querySelector(".ss-shell-header")) body.prepend(createHeader());
    if (!d.querySelector(".ss-shell-footer")) body.appendChild(createFooter());

    const btn = d.querySelector(".ss-more-btn");
    const panel = d.getElementById("ssMorePanel");
    if (btn && panel) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = panel.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
      d.addEventListener("click", (e) => {
        if (!panel.contains(e.target) && e.target !== btn) {
          panel.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
      d.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          panel.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

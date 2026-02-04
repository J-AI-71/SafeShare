/* /js/ss-shell.js */
/* SafeShare Shell v2026-02-03-01 */

(() => {
  function $(sel, root = document) { return root.querySelector(sel); }
  function norm(p) {
    try {
      p = String(p || "");
      if (!p.startsWith("/")) p = "/" + p;
      return p.replace(/\/+$/, "/");
    } catch { return "/"; }
  }

  function isEN() {
    return location.pathname === "/en" || location.pathname.startsWith("/en/");
  }

  const DE = {
    home: "/",
    app: "/app/",
    pro: "/pro/",
    school: "/schule/",
    help: "/hilfe/",
    privacy: "/datenschutz/",
    imprint: "/impressum/",
    terms: "/nutzungsbedingungen/",
    tracking: "/tracking-parameter/",
    utm: "/utm-parameter-entfernen/",
    comparison: "/vergleich/",
    email: "/email-links-bereinigen/",
    messenger: "/messenger-links-bereinigen/",
    social: "/social-links-bereinigen/",
  };

  const EN = {
    home: "/en/",
    app: "/en/app/",
    pro: "/en/pro/",
    school: "/en/school/",
    help: "/en/help/",
    privacy: "/en/privacy/",
    imprint: "/en/imprint/",
    terms: "/en/terms/",
    tracking: "/en/tracking-parameters/",
    utm: "/en/remove-utm-parameters/",
    comparison: "/en/compare/",
    email: "/en/clean-email-links/",
    messenger: "/en/clean-messenger-links/",
    social: "/en/clean-social-links/",
  };

  const LINKS = isEN() ? EN : DE;

  const LOGO_PNG = "/assets/brand/mark-192.png?v=2026-02-03-02";
  const BRAND_NAME = "SafeShare";

  function shellHTML() {
    const t = isEN()
      ? { start:"Start", app:"App", pro:"Pro", school:"School", help:"Help", more:"More" }
      : { start:"Start", app:"App", pro:"Pro", school:"Schule", help:"Hilfe", more:"Mehr" };

    return `
      <div class="ss-shellWrap">
        <header class="ss-header">
          <a class="ss-brand" href="${LINKS.home}" aria-label="${BRAND_NAME}">
            <img class="ss-brand__logo" src="${LOGO_PNG}" alt="" aria-hidden="true" width="22" height="22" decoding="async" loading="eager">
            <span class="ss-brand__name">${BRAND_NAME}</span>
          </a>

          <nav class="ss-nav" aria-label="Primary">
            <div class="ss-navPill">
              <a class="ss-nav__link" data-ss-nav="home" href="${LINKS.home}">${t.start}</a>
              <a class="ss-nav__link" data-ss-nav="app" href="${LINKS.app}">${t.app}</a>
              <a class="ss-nav__link" data-ss-nav="pro" href="${LINKS.pro}">${t.pro}</a>
              <a class="ss-nav__link" data-ss-nav="school" href="${LINKS.school}">${t.school}</a>
              <a class="ss-nav__link" data-ss-nav="help" href="${LINKS.help}">${t.help}</a>

              <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-expanded="false" aria-controls="ssMoreOverlay">
                ${t.more}
              </button>
            </div>
          </nav>
        </header>

        <div class="ss-moreOverlay ss-moreOverlay" id="ssMoreOverlay" hidden>
          <div class="ss-morePanel" role="dialog" aria-modal="true" aria-label="${isEN() ? "More" : "Mehr"}">
            <div class="ss-moreTop">
              <div class="ss-moreTitle">${isEN() ? "More" : "Mehr"}</div>
              <button class="ss-moreClose" type="button" data-ss-close>${isEN() ? "Close" : "Schließen"}</button>
            </div>

            <div class="ss-moreGrid">
              <section class="ss-moreGroup">
                <h3>${isEN() ? "Learn" : "Lernen"}</h3>
                <div class="ss-moreLinks">
                  <a class="ss-chip" href="${LINKS.tracking}">${isEN() ? "Tracking parameters" : "Tracking-Parameter"}</a>
                  <a class="ss-chip" href="${LINKS.utm}">${isEN() ? "Remove UTM" : "UTM entfernen"}</a>
                  <a class="ss-chip" href="${LINKS.comparison}">${isEN() ? "Compare" : "Vergleich"}</a>
                  <a class="ss-chip" href="${LINKS.email}">${isEN() ? "Email links" : "E-Mail-Links"}</a>
                  <a class="ss-chip" href="${LINKS.messenger}">${isEN() ? "Messenger links" : "Messenger-Links"}</a>
                  <a class="ss-chip" href="${LINKS.social}">${isEN() ? "Social links" : "Social-Links"}</a>
                </div>
              </section>

              <section class="ss-moreGroup">
                <h3>${isEN() ? "Legal" : "Rechtliches"}</h3>
                <div class="ss-moreLinks">
                  <a class="ss-chip" href="${LINKS.privacy}">${isEN() ? "Privacy" : "Datenschutz"}</a>
                  <a class="ss-chip" href="${LINKS.imprint}">${isEN() ? "Imprint" : "Impressum"}</a>
                  <a class="ss-chip" href="${LINKS.terms}">${isEN() ? "Terms" : "Nutzungsbedingungen"}</a>
                </div>
              </section>

              <section class="ss-moreGroup">
                <h3>${isEN() ? "Language" : "Sprache"}</h3>
                <div class="ss-moreLinks">
                  ${
                    isEN()
                      ? `<a class="ss-chip" href="${DE.pro}">Deutsch</a>`
                      : `<a class="ss-chip" href="${EN.pro}">English</a>`
                  }
                  <a class="ss-chip" href="#top">${isEN() ? "Top" : "Nach oben"}</a>
                </div>
              </section>

              <section class="ss-moreGroup">
                <h3>${isEN() ? "Support" : "Support"}</h3>
                <div class="ss-moreLinks">
                  <a class="ss-chip" href="mailto:listings@safesharepro.com">listings@safesharepro.com</a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function footerHTML() {
    const t = isEN()
      ? {
          tagline: "Local-first. No account. No tracking.",
          about: "About",
          links: "Links",
          legal: "Legal",
          aboutText: "Made for clean sharing. Link cleaning happens locally in your browser.",
          home:"Home", app:"App", pro:"Pro", school:"School", help:"Help",
          privacy:"Privacy", imprint:"Imprint", terms:"Terms",
          top:"Top"
        }
      : {
          tagline: "Local-first. Kein Konto. Kein Tracking.",
          about: "Über",
          links: "Links",
          legal: "Rechtliches",
          aboutText: "Gemacht für sauberes Teilen. Link-Reinigung passiert lokal in deinem Browser.",
          home:"Start", app:"App", pro:"Pro", school:"Schule", help:"Hilfe",
          privacy:"Datenschutz", imprint:"Impressum", terms:"Nutzungsbedingungen",
          top:"Nach oben"
        };

    return `
      <div class="ss-footerWrap">
        <footer class="ss-footerCard">
          <div class="ss-footerBrand">
            <img class="ss-brand__logo" src="${LOGO_PNG}" alt="" aria-hidden="true" width="22" height="22" decoding="async" loading="lazy">
            <div>
              <div class="ss-footerTitle">${BRAND_NAME}</div>
              <div class="ss-footerTagline">${t.tagline}</div>
            </div>
          </div>

          <div class="ss-footerGrid">
            <div class="ss-footerCol">
              <h4>${t.about}</h4>
              <div class="ss-footerMeta">${t.aboutText}</div>
            </div>

            <div class="ss-footerCol">
              <h4>${t.links}</h4>
              <div class="ss-footerLinks">
                <a class="ss-chip" href="${LINKS.home}">${t.home}</a>
                <a class="ss-chip" href="${LINKS.app}">${t.app}</a>
                <a class="ss-chip" href="${LINKS.pro}">${t.pro}</a>
                <a class="ss-chip" href="${LINKS.school}">${t.school}</a>
                <a class="ss-chip" href="${LINKS.help}">${t.help}</a>
              </div>
            </div>

            <div class="ss-footerCol">
              <h4>${t.legal}</h4>
              <div class="ss-footerLinks">
                <a class="ss-chip" href="${LINKS.privacy}">${t.privacy}</a>
                <a class="ss-chip" href="${LINKS.imprint}">${t.imprint}</a>
                <a class="ss-chip" href="${LINKS.terms}">${t.terms}</a>
                <a class="ss-chip" href="#top">${t.top}</a>
              </div>
            </div>
          </div>

          <div class="ss-footerBottom">
            <span>© ${new Date().getFullYear()} ${BRAND_NAME}</span>
            <span>${isEN() ? "Support:" : "Support:"} <a href="mailto:listings@safesharepro.com" style="text-decoration:none; color:inherit">listings@safesharepro.com</a></span>
          </div>
        </footer>
      </div>
    `;
  }

  function setActive() {
    const p = norm(location.pathname);

    const map = [
      { key: "home", match: [norm(LINKS.home)] },
      { key: "app", match: [norm(LINKS.app)] },
      { key: "pro", match: [norm(LINKS.pro)] },
      { key: "school", match: [norm(LINKS.school)] },
      { key: "help", match: [norm(LINKS.help)] },
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
        norm(LINKS.school), norm(LINKS.pro), norm(LINKS.help),
        norm(LINKS.tracking), norm(LINKS.utm), norm(LINKS.comparison),
        norm(LINKS.email), norm(LINKS.messenger), norm(LINKS.social),
        norm(LINKS.privacy), norm(LINKS.imprint), norm(LINKS.terms),
      ];
      const moreActive = moreMatches.some(m => p.startsWith(m));
      btn.classList.toggle("is-active", moreActive);
      if (moreActive) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    }
  }

  function init() {
    // 1) Mounts sichern
    let mount = $("#ss-shell");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "ss-shell";
      (document.body || document.documentElement).insertBefore(mount, document.body ? document.body.firstChild : null);
    }
    mount.innerHTML = shellHTML();

    let fmount = $("#ss-footer");
    if (!fmount) {
      fmount = document.createElement("div");
      fmount.id = "ss-footer";
      document.body.appendChild(fmount);
    }
    fmount.innerHTML = footerHTML();

    // 2) Active
    setActive();

    // 3) More open/close
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
      btn.addEventListener("click", () => overlay.hidden ? openMenu() : closeMenu());

      overlay.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.closest && t.closest("[data-ss-close]")) closeMenu();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay && !overlay.hidden) closeMenu();
      });

      window.addEventListener("pageshow", hardCloseOverlay);
      window.addEventListener("pagehide", hardCloseOverlay);
      document.addEventListener("visibilitychange", () => { if (document.hidden) hardCloseOverlay(); });
    }
  }

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  } catch (e) {
    console.error("ss-shell.js failed:", e);
  }
})();

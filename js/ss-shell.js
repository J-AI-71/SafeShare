/* /js/ss-shell.js */
/* SafeShare Shell v2026-02-04-03 */

(function () {
  function ready(fn){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  }

  const LOGO_SRC = "/assets/brand/mark-192.png?v=2026-02-04-03";
  const LOGO_FALLBACK = "/assets/fav/favicon-32.png?v=2026-02-04-03";

  function isEN(){ return location.pathname.startsWith("/en/"); }
  function text(de, en){ return isEN() ? en : de; }

  // ✅ Slug-Mapping: DE ≠ EN (muss exakt deinen Ordnern entsprechen)
  const SLUG = {
    start:  { de: "/", en: "/en/" },
    app:    { de: "/app/", en: "/en/app/" },
    pro:    { de: "/pro/", en: "/en/pro/" },
    school: { de: "/schule/", en: "/en/school/" },
    help:   { de: "/hilfe/", en: "/en/help/" },

    privacy:{ de: "/datenschutz/", en: "/en/privacy/" },
    imprint:{ de: "/impressum/",  en: "/en/imprint/" },
    terms:  { de: "/nutzungsbedingungen/", en: "/en/terms/" },

    tracking: { de: "/tracking-parameter/", en: "/en/tracking-parameters/" },
    utm:      { de: "/utm-parameter-entfernen/", en: "/en/remove-utm-parameter/" },
    compare:  { de: "/url-cleaner-tool-vergleich/", en: "/en/url-cleaner-comparison/" },
    email:    { de: "/email-links-bereinigen/", en: "/en/email-link-cleaning/" },
    messenger:{ de: "/messenger-links-bereinigen/", en: "/en/messenger-link-cleaning/" },
    social:   { de: "/social-links-bereinigen/", en: "/en/social-link-cleaning/" }
  };

  function href(key){
    const item = SLUG[key];
    if (!item) return "#";
    return isEN() ? item.en : item.de;
  }

  function active(key){
    const p = location.pathname;
    if (key === "start") return (p === "/" || p === "/en/") ? " is-active" : "";
    const target = href(key);
    return p.startsWith(target) ? " is-active" : "";
  }

  // ✅ Language toggle über Mapping (robust bei DE≠EN Slugs)
  function langToggleHref(){
    const p = location.pathname;

    const pairs = [
      [SLUG.school.en, SLUG.school.de],
      [SLUG.help.en,   SLUG.help.de],

      [SLUG.tracking.en,  SLUG.tracking.de],
      [SLUG.utm.en,       SLUG.utm.de],
      [SLUG.compare.en,   SLUG.compare.de],
      [SLUG.email.en,     SLUG.email.de],
      [SLUG.messenger.en, SLUG.messenger.de],
      [SLUG.social.en,    SLUG.social.de],

      [SLUG.privacy.en, SLUG.privacy.de],
      [SLUG.imprint.en, SLUG.imprint.de],
      [SLUG.terms.en,   SLUG.terms.de],

      [SLUG.app.en, SLUG.app.de],
      [SLUG.pro.en, SLUG.pro.de],

      // Start zuletzt
      [SLUG.start.en, SLUG.start.de],
    ];

    for (const [en, de] of pairs){
      if (p.startsWith(en)) return de;
      if (p.startsWith(de)) return en;
    }

    // Fallback (nur wenn Seite nicht im Mapping ist)
    return isEN() ? p.replace(/^\/en\//, "/") : (p === "/" ? "/en/" : "/en" + p);
  }

  function injectShell(){
    // Mounts (failsafe)
    let shell = document.getElementById("ss-shell");
    if (!shell) {
      shell = document.createElement("div");
      shell.id = "ss-shell";
      (document.body || document.documentElement).insertBefore(shell, document.body.firstChild);
    }

    let footer = document.getElementById("ss-footer");
    if (!footer) {
      footer = document.createElement("div");
      footer.id = "ss-footer";
      document.body.appendChild(footer);
    }

    shell.innerHTML = `
      <header class="ss-header" role="banner">
        <div class="ss-header__inner">
          <a class="ss-brand" href="${href("start")}" aria-label="SafeShare Home">
            <img class="ss-brand__logo" src="${LOGO_SRC}" alt=""
              width="20" height="20" loading="eager" decoding="async"
              onerror="this.onerror=null;this.src='${LOGO_FALLBACK}';">
            <span class="ss-brand__name">SafeShare</span>
          </a>

          <nav class="ss-nav" aria-label="Primary">
            <a class="ss-nav__link${active("start")}" href="${href("start")}">${text("Start","Start")}</a>
            <a class="ss-nav__link${active("app")}" href="${href("app")}">App</a>
            <a class="ss-nav__link${active("pro")}" href="${href("pro")}">Pro</a>
            <a class="ss-nav__link${active("school")}" href="${href("school")}">${text("Schule","School")}</a>
            <a class="ss-nav__link${active("help")}" href="${href("help")}">${text("Hilfe","Help")}</a>

            <button class="ss-moreBtn" type="button"
              aria-haspopup="dialog" aria-controls="ss-more" aria-expanded="false">
              ${text("Mehr","More")}
            </button>
          </nav>
        </div>
      </header>

      <div class="ss-more" id="ss-more" role="dialog" aria-modal="true"
        aria-label="${text("Mehr-Menü","More menu")}" hidden>
        <div class="ss-more__panel">
          <div class="ss-more__top">
            <div class="ss-more__title">${text("Mehr","More")}</div>
            <button class="ss-more__close" type="button">${text("Schließen","Close")}</button>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Lernen","Learn")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="${href("tracking")}">${text("Tracking-Parameter","Tracking parameters")}</a>
              <a class="ss-pill" href="${href("utm")}">${text("UTM entfernen","Remove UTM")}</a>
              <a class="ss-pill" href="${href("compare")}">${text("Vergleich","Compare")}</a>
              <a class="ss-pill" href="${href("email")}">${text("E-Mail-Links","Email links")}</a>
              <a class="ss-pill" href="${href("messenger")}">${text("Messenger-Links","Messenger links")}</a>
              <a class="ss-pill" href="${href("social")}">${text("Social-Links","Social links")}</a>
            </div>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Rechtliches","Legal")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="${href("privacy")}">${text("Datenschutz","Privacy")}</a>
              <a class="ss-pill" href="${href("imprint")}">${text("Impressum","Imprint")}</a>
              <a class="ss-pill" href="${href("terms")}">${text("Nutzungsbedingungen","Terms")}</a>
            </div>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label ss-more__labelRow">
              <span>${text("Sprache","Language")}</span>
              <a class="ss-langLink" href="${langToggleHref()}">${isEN() ? "DE" : "EN"}</a>
            </div>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Support","Support")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="mailto:listings@safesharepro.com">listings@safesharepro.com</a>
            </div>
          </div>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <footer class="ss-footer" role="contentinfo">
        <div class="ss-footer__inner">
          <div class="ss-footerBrand">
            <img class="ss-brand__logo" src="${LOGO_SRC}" alt=""
              width="20" height="20" loading="lazy" decoding="async"
              onerror="this.onerror=null;this.src='${LOGO_FALLBACK}';">
            <div>
              <div class="ss-footerTitle">SafeShare</div>
              <div class="ss-footerTagline">${text("Local-first. Kein Konto. Kein Tracking.","Local-first. No account. No tracking.")}</div>
            </div>
          </div>

          <div class="ss-footerLinks">
            <a href="${href("start")}">${text("Start","Start")}</a>
            <a href="${href("app")}">App</a>
            <a href="${href("pro")}">Pro</a>
            <a href="${href("help")}">${text("Hilfe","Help")}</a>
            <a href="${href("privacy")}">${text("Datenschutz","Privacy")}</a>
            <a href="${href("imprint")}">${text("Impressum","Imprint")}</a>
          </div>
        </div>
      </footer>
    `;

    wireMore();
  }

  function wireMore(){
    const btn = document.querySelector(".ss-moreBtn");
    const modal = document.getElementById("ss-more");
    const closeBtn = modal ? modal.querySelector(".ss-more__close") : null;
    if (!btn || !modal || !closeBtn) return;

    const open = () => {
      modal.hidden = false;
      btn.setAttribute("aria-expanded","true");
      document.documentElement.classList.add("ss-modalOpen");
      closeBtn.focus({ preventScroll:true });
    };

    const close = () => {
      modal.hidden = true;
      btn.setAttribute("aria-expanded","false");
      document.documentElement.classList.remove("ss-modalOpen");
      btn.focus({ preventScroll:true });
    };

    btn.addEventListener("click", () => (modal.hidden ? open() : close()));
    closeBtn.addEventListener("click", close);

    modal.addEventListener("click", (e) => {
      // click outside panel closes
      if (e.target === modal) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });

    // ✅ Overlay Auto-Close bei Navigation (nur Links im Modal)
    modal.querySelectorAll('a.ss-pill, a.ss-langLink').forEach(a => {
      a.addEventListener("click", () => {
        if (!modal.hidden) close();
      });
    });
  }

  ready(injectShell);
})();

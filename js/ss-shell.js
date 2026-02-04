/* /js/ss-shell.js */
/* SafeShare Shell v2026-02-04-02 */

(function () {
  function ready(fn){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  }

  // Logo: nimm PNG (stabil). Wenn nicht vorhanden, fallback auf favicon.
  const LOGO_SRC = "/assets/brand/mark-192.png?v=2026-02-04-02";
  const LOGO_FALLBACK = "/assets/fav/favicon-32.png?v=2026-02-04-02";

  function isEN(){ return location.pathname.startsWith("/en/"); }
  function text(de, en){ return isEN() ? en : de; }

  // Primary pages
  function hrefFor(key){
    const mapDE = { start:"/", app:"/app/", pro:"/pro/", schule:"/schule/", hilfe:"/hilfe/" };
    const mapEN = { start:"/en/", app:"/en/app/", pro:"/en/pro/", schule:"/en/school/", hilfe:"/en/help/" };
    return (isEN() ? mapEN : mapDE)[key] || (isEN()?"/en/":"/");
  }

  // Learn pages (match your repo folders)
  function learnHref(key){
    const mapDE = {
      tracking:"/tracking-parameter/",
      utm:"/utm-parameter-entfernen/",
      compare:"/url-cleaner-tool-vergleich/",
      email:"/email-links-bereinigen/",
      messenger:"/messenger-links-bereinigen/",
      social:"/social-links-bereinigen/"
    };
    const mapEN = {
      tracking:"/en/tracking-parameters/",
      utm:"/en/remove-utm-parameter/",
      compare:"/en/url-cleaner-comparison/",
      email:"/en/email-link-cleaning/",
      messenger:"/en/messenger-link-cleaning/",
      social:"/en/social-link-cleaning/"
    };
    return (isEN() ? mapEN : mapDE)[key];
  }

  // Legal pages
  function legalHref(key){
    const mapDE = { privacy:"/datenschutz/", imprint:"/impressum/", terms:"/nutzungsbedingungen/" };
    const mapEN = { privacy:"/en/privacy/", imprint:"/en/imprint/", terms:"/en/terms/" };
    return (isEN() ? mapEN : mapDE)[key];
  }

  function normalizePath(p){
    // ensure trailing slash
    if (!p.endsWith("/")) p += "/";
    return p;
  }

  function active(key){
    const p = normalizePath(location.pathname);
    const a = normalizePath(hrefFor(key));
    if (key === "start") return (p === "/" || p === "/en/") ? " is-active" : "";
    return p.startsWith(a) ? " is-active" : "";
  }

  function langToggleHref(){
    const p = normalizePath(location.pathname);

    if (isEN()){
      // /en/... -> /...
      const dePath = p.replace(/^\/en\//, "/");
      return dePath;
    }
    // /... -> /en/...
    if (p === "/") return "/en/";
    return "/en" + p;
  }

  function ensureMount(id, where){
    let el = document.getElementById(id);
    if (el) return el;
    el = document.createElement("div");
    el.id = id;
    if (where === "top"){
      (document.body || document.documentElement).insertBefore(el, document.body.firstChild);
    } else {
      document.body.appendChild(el);
    }
    return el;
  }

  function injectShell(){
    // hard failsafe mounts
    const shell = ensureMount("ss-shell", "top");
    const footer = ensureMount("ss-footer", "bottom");

    shell.innerHTML = `
      <header class="ss-header" role="banner">
        <div class="ss-header__inner">
          <a class="ss-brand" href="${hrefFor("start")}" aria-label="SafeShare Home">
            <img class="ss-brand__logo" src="${LOGO_SRC}" alt=""
              width="20" height="20" loading="eager" decoding="async"
              onerror="this.onerror=null;this.src='${LOGO_FALLBACK}';">
            <span class="ss-brand__name">SafeShare</span>
          </a>

          <nav class="ss-nav" aria-label="Primary">
            <a class="ss-nav__link${active("start")}" href="${hrefFor("start")}">${text("Start","Start")}</a>
            <a class="ss-nav__link${active("app")}" href="${hrefFor("app")}">App</a>
            <a class="ss-nav__link${active("pro")}" href="${hrefFor("pro")}">Pro</a>
            <a class="ss-nav__link${active("schule")}" href="${hrefFor("schule")}">${text("Schule","School")}</a>
            <a class="ss-nav__link${active("hilfe")}" href="${hrefFor("hilfe")}">${text("Hilfe","Help")}</a>

            <button class="ss-moreBtn" type="button" aria-haspopup="dialog" aria-controls="ss-more" aria-expanded="false">
              ${text("Mehr","More")}
            </button>
          </nav>
        </div>
      </header>

      <div class="ss-more" id="ss-more" role="dialog" aria-modal="true" aria-label="${text("Mehr-Menü","More menu")}" hidden>
        <div class="ss-more__panel">
          <div class="ss-more__top">
            <div class="ss-more__title">${text("Mehr","More")}</div>
            <button class="ss-more__close" type="button">${text("Schließen","Close")}</button>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Lernen","Learn")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="${learnHref("tracking")}">${text("Tracking-Parameter","Tracking parameters")}</a>
              <a class="ss-pill" href="${learnHref("utm")}">${text("UTM entfernen","Remove UTM")}</a>
              <a class="ss-pill" href="${learnHref("compare")}">${text("Vergleich","Compare")}</a>
              <a class="ss-pill" href="${learnHref("email")}">${text("E-Mail-Links","Email links")}</a>
              <a class="ss-pill" href="${learnHref("messenger")}">${text("Messenger-Links","Messenger links")}</a>
              <a class="ss-pill" href="${learnHref("social")}">${text("Social-Links","Social links")}</a>
            </div>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Rechtliches","Legal")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="${legalHref("privacy")}">${text("Datenschutz","Privacy")}</a>
              <a class="ss-pill" href="${legalHref("imprint")}">${text("Impressum","Imprint")}</a>
              <a class="ss-pill" href="${legalHref("terms")}">${text("Nutzungsbedingungen","Terms")}</a>
            </div>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Sprache","Language")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="${langToggleHref()}">${text("English","Deutsch")}</a>
              <a class="ss-pill" href="#top">${text("Nach oben","Top")}</a>
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
            <a href="${hrefFor("start")}">${text("Start","Start")}</a>
            <a href="${hrefFor("app")}">App</a>
            <a href="${hrefFor("pro")}">Pro</a>
            <a href="${hrefFor("hilfe")}">${text("Hilfe","Help")}</a>
            <a href="${legalHref("privacy")}">${text("Datenschutz","Privacy")}</a>
            <a href="${legalHref("imprint")}">${text("Impressum","Imprint")}</a>
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

    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });
  }

  ready(injectShell);
})();

/* /js/ss-shell.js */
/* SafeShare Shell v2026-02-04-01 */

(function () {
  function ready(fn){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  }

  const LOGO_SRC = "/assets/brand/mark-192.png?v=2026-02-04-01";
  const LOGO_FALLBACK = "/assets/fav/favicon-32.png?v=2026-02-04-01";

  function isEN(){
    return location.pathname.startsWith("/en/");
  }

  function hrefFor(slug){
    // slug like "app", "pro", "schule", "hilfe"
    return isEN() ? `/en/${slug}/` : `/${slug}/`;
  }

  function text(tDe, tEn){ return isEN() ? tEn : tDe; }

  function injectShell(){
    // Ensure mounts exist (hard-failsafe)
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

    const active = (key) => {
      const p = location.pathname;
      const a = isEN() ? `/en/${key}/` : `/${key}/`;
      if (key === "start") return p === "/" || p === "/en/";
      return p.startsWith(a) ? " is-active" : "";
    };

    // Top nav
    shell.innerHTML = `
      <header class="ss-header" role="banner">
        <div class="ss-header__inner">
          <a class="ss-brand" href="${isEN()?"/en/":"/"}" aria-label="SafeShare Home">
            <img class="ss-brand__logo" src="${LOGO_SRC}" alt=""
              width="20" height="20" loading="eager" decoding="async"
              onerror="this.onerror=null;this.src='${LOGO_FALLBACK}';">
            <span class="ss-brand__name">SafeShare</span>
          </a>

          <nav class="ss-nav" aria-label="Primary">
            <a class="ss-nav__link${active("start")}" href="${isEN()?"/en/":"/"}">${text("Start","Start")}</a>
            <a class="ss-nav__link${active("app")}" href="${hrefFor("app")}">${text("App","App")}</a>
            <a class="ss-nav__link${active("pro")}" href="${hrefFor("pro")}">${text("Pro","Pro")}</a>
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
              <a class="ss-pill" href="${isEN()?"/en/tracking-parameter/":"/tracking-parameter/"}">${text("Tracking-Parameter","Tracking parameters")}</a>
              <a class="ss-pill" href="${isEN()?"/en/utm-remove/":"/utm-parameter-entfernen/"}">${text("UTM entfernen","Remove UTM")}</a>
              <a class="ss-pill" href="${isEN()?"/en/compare/":"/vergleich/"}">${text("Vergleich","Compare")}</a>
              <a class="ss-pill" href="${isEN()?"/en/email-links/":"/email-links/"}">${text("E-Mail-Links","Email links")}</a>
              <a class="ss-pill" href="${isEN()?"/en/messenger-links/":"/messenger-links/"}">${text("Messenger-Links","Messenger links")}</a>
              <a class="ss-pill" href="${isEN()?"/en/social-links/":"/social-links/"}">${text("Social-Links","Social links")}</a>
            </div>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Rechtliches","Legal")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="${isEN()?"/en/privacy/":"/datenschutz/"}">${text("Datenschutz","Privacy")}</a>
              <a class="ss-pill" href="${isEN()?"/en/imprint/":"/impressum/"}">${text("Impressum","Imprint")}</a>
              <a class="ss-pill" href="${isEN()?"/en/terms/":"/nutzungsbedingungen/"}">${text("Nutzungsbedingungen","Terms")}</a>
            </div>
          </div>

          <div class="ss-more__section">
            <div class="ss-more__label">${text("Sprache","Language")}</div>
            <div class="ss-more__grid">
              <a class="ss-pill" href="${isEN()? location.pathname.replace(/^\/en\//, "/") : ("/en" + location.pathname)}">${text("English","Deutsch")}</a>
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

    // Footer
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
            <a href="${isEN()?"/en/":"/"}">${text("Start","Start")}</a>
            <a href="${hrefFor("app")}">${text("App","App")}</a>
            <a href="${hrefFor("pro")}">${text("Pro","Pro")}</a>
            <a href="${hrefFor("hilfe")}">${text("Hilfe","Help")}</a>
            <a href="${isEN()?"/en/privacy/":"/datenschutz/"}">${text("Datenschutz","Privacy")}</a>
            <a href="${isEN()?"/en/imprint/":"/impressum/"}">${text("Impressum","Imprint")}</a>
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
  }

  ready(injectShell);
})();

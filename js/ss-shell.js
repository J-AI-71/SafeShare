// /js/ss-shell.js
(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const body = document.body;
  const lang = body?.dataset?.lang === 'de' ? 'de' : 'en';
  const page = body?.dataset?.page || '';

  // ---------- Locale dictionaries ----------
  const I18N = {
    de: {
      brand: 'SafeShare',
      start: 'Start',
      app: 'App',
      school: 'Schule',
      pro: 'Pro',
      help: 'Hilfe',
      more: 'Mehr',
      close: 'Schließen',
      footerNote: 'Local-first Link-Hygiene.',
      langLabel: 'Sprache',
      switchTo: 'EN',
      links: {
        start: '/',
        app: '/app/',
        school: '/schule/',
        pro: '/pro/',
        help: '/hilfe/',
        privacySharing: '/datenschutz-beim-link-teilen/',
        bookmarks: '/lesezeichen/',
        email: '/email-links-bereinigen/',
        messenger: '/messenger-links-bereinigen/',
        social: '/social-links-bereinigen/',
        tracking: '/tracking-parameter/',
        removeUtm: '/utm-parameter-entfernen/',
        compare: '/url-cleaner-tool-vergleich/',
        shortcuts: '/shortcuts/',
        privacy: '/datenschutz/',
        terms: '/nutzungsbedingungen/',
        imprint: '/impressum/'
      },
      morePrimary: [
        ['Datenschutz beim Link-Teilen', 'privacySharing'],
        ['Lesezeichen', 'bookmarks'],
        ['E-Mail-Links', 'email'],
        ['Messenger-Links', 'messenger'],
        ['Social-Links', 'social'],
        ['Tracking-Parameter', 'tracking'],
        ['UTM entfernen', 'removeUtm'],
        ['Tool-Vergleich', 'compare'],
        ['Shortcuts', 'shortcuts']
      ],
      moreSecondary: [
        ['Datenschutz', 'privacy'],
        ['Nutzungsbedingungen', 'terms'],
        ['Impressum', 'imprint']
      ]
    },

    en: {
      brand: 'SafeShare',
      start: 'Start',
      app: 'App',
      school: 'School',
      pro: 'Pro',
      help: 'Help',
      more: 'More',
      close: 'Close',
      footerNote: 'Local-first link hygiene.',
      langLabel: 'Language',
      switchTo: 'DE',
      links: {
        start: '/en/',
        app: '/en/app/',
        school: '/en/school/',
        pro: '/en/pro/',
        help: '/en/help/',
        privacySharing: '/en/privacy-when-sharing-links/',
        bookmarks: '/en/bookmarks/',
        email: '/en/email-link-cleaning/',
        messenger: '/en/messenger-link-cleaning/',
        social: '/en/social-link-cleaning/',
        tracking: '/en/tracking-parameters/',
        removeUtm: '/en/remove-utm-parameter/',
        compare: '/en/url-cleaner-comparison/',
        shortcuts: '/en/shortcuts/',
        privacy: '/en/privacy/',
        terms: '/en/terms/',
        imprint: '/en/imprint/'
      },
      morePrimary: [
        ['Privacy when sharing links', 'privacySharing'],
        ['Bookmarks', 'bookmarks'],
        ['Email links', 'email'],
        ['Messenger links', 'messenger'],
        ['Social links', 'social'],
        ['Tracking parameters', 'tracking'],
        ['Remove UTM', 'removeUtm'],
        ['Tool comparison', 'compare'],
        ['Shortcuts', 'shortcuts']
      ],
      moreSecondary: [
        ['Privacy', 'privacy'],
        ['Terms', 'terms'],
        ['Imprint', 'imprint']
      ]
    }
  };

  const T = I18N[lang];

  // ---------- Canonical page-key mapping for language switch ----------
  // body[data-page] must use one of these keys on each page.
  const pageMap = {
    home: { de: '/', en: '/en/' },
    app: { de: '/app/', en: '/en/app/' },
    school: { de: '/schule/', en: '/en/school/' },
    pro: { de: '/pro/', en: '/en/pro/' },
    help: { de: '/hilfe/', en: '/en/help/' },

    'email-links': { de: '/email-links-bereinigen/', en: '/en/email-link-cleaning/' },
    'messenger-links': { de: '/messenger-links-bereinigen/', en: '/en/messenger-link-cleaning/' },
    'social-links': { de: '/social-links-bereinigen/', en: '/en/social-link-cleaning/' },

    'tracking-parameters': { de: '/tracking-parameter/', en: '/en/tracking-parameters/' },
    'remove-utm': { de: '/utm-parameter-entfernen/', en: '/en/remove-utm-parameter/' },
    'tool-comparison': { de: '/url-cleaner-tool-vergleich/', en: '/en/url-cleaner-comparison/' },
    shortcuts: { de: '/shortcuts/', en: '/en/shortcuts/' },

    privacy: { de: '/datenschutz/', en: '/en/privacy/' },
    terms: { de: '/nutzungsbedingungen/', en: '/en/terms/' },
    imprint: { de: '/impressum/', en: '/en/imprint/' },

    'privacy-sharing': { de: '/datenschutz-beim-link-teilen/', en: '/en/privacy-when-sharing-links/' },

    '404': { de: '/404.html', en: '/en/404/' },
    offline: { de: '/offline/', en: '/en/offline/' }
  };

  function pathNormalize(p) {
    if (!p) return '/';
    return p.endsWith('/') || p.endsWith('.html') ? p : `${p}/`;
  }

  function isActive(href) {
    const cur = pathNormalize(location.pathname);
    const tgt = pathNormalize(href);
    return cur === tgt;
  }

  function resolveLanguageSwitchHref() {
    const targetLang = lang === 'de' ? 'en' : 'de';

    // 1) Strict by data-page key
    if (page && pageMap[page] && pageMap[page][targetLang]) {
      return pageMap[page][targetLang];
    }

    // 2) Fallback by current pathname known in map
    const cur = pathNormalize(location.pathname);
    for (const key of Object.keys(pageMap)) {
      const pair = pageMap[key];
      if (pathNormalize(pair.de) === cur) return pair[targetLang];
      if (pathNormalize(pair.en) === cur) return pair[targetLang];
    }

    // 3) Final fallback home
    return targetLang === 'de' ? '/' : '/en/';
  }

  const topNav = [
    ['start', T.links.start],
    ['app', T.links.app],
    ['school', T.links.school],
    ['pro', T.links.pro],
    ['help', T.links.help]
  ];

  const navHtml = topNav.map(([k, href]) => {
    const label = T[k];
    return `
      <a class="ss-nav__link${isActive(href) ? ' is-active' : ''}" href="${href}">
        ${label}
      </a>
    `;
  }).join('');

  const primaryMoreHtml = T.morePrimary.map(([label, key]) => {
    const href = T.links[key];
    return `<a class="ss-more__item${isActive(href) ? ' is-active' : ''}" href="${href}">${label}</a>`;
  }).join('');

  const secondaryMoreHtml = T.moreSecondary.map(([label, key]) => {
    const href = T.links[key];
    return `<a class="ss-more__item${isActive(href) ? ' is-active' : ''}" href="${href}">${label}</a>`;
  }).join('');

  const langSwitchHref = resolveLanguageSwitchHref();

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${T.links.start}" aria-label="${T.brand}">${T.brand}</a>

        <div class="ss-headActions">
          <a class="ss-langSwitch" href="${langSwitchHref}" aria-label="${T.langLabel}: ${T.switchTo}">
            ${T.switchTo}
          </a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">
            ${T.more}
          </button>
        </div>
      </div>

      <nav class="ss-nav" aria-label="Primary">
        ${navHtml}
      </nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <button class="ss-more__backdrop" id="ssMoreBackdrop" type="button" aria-label="${T.close}"></button>
      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${T.more}">
        <div class="ss-more__head">
          <strong>${T.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${T.close}">×</button>
        </div>

        <div class="ss-more__list">
          ${primaryMoreHtml}
        </div>

        <div class="ss-more__divider"></div>

        <div class="ss-more__list ss-more__list--secondary">
          ${secondaryMoreHtml}
        </div>
      </div>
    </div>

    <footer class="ss-footer" role="contentinfo" aria-label="Footer">
      <div class="ss-footer__inner">
        <span>${T.brand}</span>
        <span>•</span>
        <span>${T.footerNote}</span>
      </div>
    </footer>
  `;

  // ---------- More interactions ----------
  const more = root.querySelector('#ssMore');
  const moreBtn = root.querySelector('#ssMoreBtn');
  const closeBtn = root.querySelector('#ssMoreClose');
  const backdrop = root.querySelector('#ssMoreBackdrop');

  const openMore = () => {
    if (!more) return;
    more.hidden = false;
    moreBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ss-noScroll');
  };

  const closeMore = () => {
    if (!more) return;
    more.hidden = true;
    moreBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ss-noScroll');
  };

  moreBtn?.addEventListener('click', openMore);
  closeBtn?.addEventListener('click', closeMore);
  backdrop?.addEventListener('click', closeMore);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && more && !more.hidden) closeMore();
  });
})();

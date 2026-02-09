// File: /js/ss-shell.js
(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const body = document.body || document.documentElement;
  const lang = body.dataset.lang === 'de' ? 'de' : 'en';
  const page = body.dataset.page || '';

  const CFG = {
    de: {
      code: 'DE',
      brand: 'SafeShare',
      start: 'Start',
      app: 'App',
      school: 'Schule',
      pro: 'Pro',
      help: 'Hilfe',
      more: 'Mehr',
      close: 'Schließen',
      footerNote: 'Local-first Link-Hygiene.',
      links: {
        start: '/',
        app: '/app/',
        school: '/schule/',
        pro: '/pro/',
        help: '/hilfe/',
        privacy: '/datenschutz/',
        terms: '/nutzungsbedingungen/',
        imprint: '/impressum/',
        privacySharing: '/datenschutz-beim-link-teilen/',
        bookmarks: '/lesezeichen/',
        email: '/email-links-bereinigen/',
        messenger: '/messenger-links-bereinigen/',
        social: '/social-links-bereinigen/',
        tracking: '/tracking-parameter/',
        removeUtm: '/utm-parameter-entfernen/',
        compare: '/url-cleaner-tool-vergleich/',
        shortcuts: '/shortcuts/'
      },
      morePrimary: [
        ['Datenschutz beim Link-Teilen', 'privacySharing'],
        ['Lesezeichen', 'bookmarks'],
        ['E-Mail-Links', 'email'],
        ['Messenger-Links', 'messenger'],
        ['Social-Links', 'social'],
        ['Tracking-Parameter', 'tracking'],
        ['UTM entfernen', 'removeUtm'],
        ['Tool-Vergleich', 'compare']
      ],
      moreSecondary: [
        ['Shortcuts', 'shortcuts'],
        ['Datenschutz', 'privacy'],
        ['Nutzungsbedingungen', 'terms'],
        ['Impressum', 'imprint']
      ]
    },
    en: {
      code: 'EN',
      brand: 'SafeShare',
      start: 'Start',
      app: 'App',
      school: 'School',
      pro: 'Pro',
      help: 'Help',
      more: 'More',
      close: 'Close',
      footerNote: 'Local-first link hygiene.',
      links: {
        start: '/en/',
        app: '/en/app/',
        school: '/en/school/',
        pro: '/en/pro/',
        help: '/en/help/',
        privacy: '/en/privacy/',
        terms: '/en/terms/',
        imprint: '/en/imprint/',
        privacySharing: '/en/privacy-when-sharing-links/',
        bookmarks: '/en/bookmarks/',
        email: '/en/email-link-cleaning/',
        messenger: '/en/messenger-link-cleaning/',
        social: '/en/social-link-cleaning/',
        tracking: '/en/tracking-parameters/',
        removeUtm: '/en/remove-utm-parameter/',
        compare: '/en/url-cleaner-comparison/',
        shortcuts: '/en/shortcuts/'
      },
      morePrimary: [
        ['Privacy when sharing links', 'privacySharing'],
        ['Bookmarks', 'bookmarks'],
        ['Email links', 'email'],
        ['Messenger links', 'messenger'],
        ['Social links', 'social'],
        ['Tracking parameters', 'tracking'],
        ['Remove UTM', 'removeUtm'],
        ['Tool comparison', 'compare']
      ],
      moreSecondary: [
        ['Shortcuts', 'shortcuts'],
        ['Privacy', 'privacy'],
        ['Terms', 'terms'],
        ['Imprint', 'imprint']
      ]
    }
  };

  const T = CFG[lang];
  const ALT = CFG[lang === 'de' ? 'en' : 'de'];

  const normalize = (p) => (p || '/').replace(/\/+$/, '') || '/';
  const currentPath = normalize(location.pathname);

  const samePageMap = {
    // core
    '/': '/en/',
    '/app/': '/en/app/',
    '/schule/': '/en/school/',
    '/pro/': '/en/pro/',
    '/hilfe/': '/en/help/',

    // content
    '/email-links-bereinigen/': '/en/email-link-cleaning/',
    '/messenger-links-bereinigen/': '/en/messenger-link-cleaning/',
    '/social-links-bereinigen/': '/en/social-link-cleaning/',
    '/tracking-parameter/': '/en/tracking-parameters/',
    '/utm-parameter-entfernen/': '/en/remove-utm-parameter/',
    '/url-cleaner-tool-vergleich/': '/en/url-cleaner-comparison/',
    '/shortcuts/': '/en/shortcuts/',
    '/datenschutz/': '/en/privacy/',
    '/nutzungsbedingungen/': '/en/terms/',
    '/impressum/': '/en/imprint/',
    '/datenschutz-beim-link-teilen/': '/en/privacy-when-sharing-links/',
    '/lesezeichen/': '/en/bookmarks/',
    '/404.html': '/en/404/',

    // reverse
    '/en/': '/',
    '/en/app/': '/app/',
    '/en/school/': '/schule/',
    '/en/pro/': '/pro/',
    '/en/help/': '/hilfe/',

    '/en/email-link-cleaning/': '/email-links-bereinigen/',
    '/en/messenger-link-cleaning/': '/messenger-links-bereinigen/',
    '/en/social-link-cleaning/': '/social-links-bereinigen/',
    '/en/tracking-parameters/': '/tracking-parameter/',
    '/en/remove-utm-parameter/': '/utm-parameter-entfernen/',
    '/en/url-cleaner-comparison/': '/url-cleaner-tool-vergleich/',
    '/en/shortcuts/': '/shortcuts/',
    '/en/privacy/': '/datenschutz/',
    '/en/terms/': '/nutzungsbedingungen/',
    '/en/imprint/': '/impressum/',
    '/en/privacy-when-sharing-links/': '/datenschutz-beim-link-teilen/',
    '/en/bookmarks/': '/lesezeichen/',
    '/en/404/': '/404.html'
  };

  const switchHref = samePageMap[currentPath] || ALT.links.start;

  const isActive = (href) => {
    const n = normalize(href);
    return currentPath === n;
  };

  const topNav = [
    ['start', T.links.start],
    ['app', T.links.app],
    ['school', T.links.school],
    ['pro', T.links.pro],
    ['help', T.links.help]
  ];

  const navHtml = topNav.map(([k, href]) => `
    <a class="ss-nav__link${isActive(href) ? ' is-active' : ''}" href="${href}">${T[k]}</a>
  `).join('');

  const primaryHtml = T.morePrimary.map(([label, key]) => `
    <a class="ss-more__item${isActive(T.links[key]) ? ' is-active' : ''}" href="${T.links[key]}">${label}</a>
  `).join('');

  const secondaryHtml = T.moreSecondary.map(([label, key]) => `
    <a class="ss-more__item${isActive(T.links[key]) ? ' is-active' : ''}" href="${T.links[key]}">${label}</a>
  `).join('');

  // inline SVG glyph (robust: kein externer Dateipfad nötig)
  const glyph = `
    <svg class="ss-brand__logo" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ssg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2fe3b7"></stop>
          <stop offset="100%" stop-color="#15b79a"></stop>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#ssg)"></rect>
      <path d="M32 18c-6 0-11 5-11 11v6c0 6 5 11 11 11s11-5 11-11v-6c0-6-5-11-11-11zm0 5c3.4 0 6 2.6 6 6v6c0 3.4-2.6 6-6 6s-6-2.6-6-6v-6c0-3.4 2.6-6 6-6z" fill="#0b1a1a"></path>
    </svg>
  `;

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${T.links.start}" aria-label="${T.brand}">
          ${glyph}
          <span class="ss-brand__text">${T.brand}</span>
        </a>

        <div class="ss-headActions">
          <a class="ss-langSwitch" href="${switchHref}" hreflang="${ALT.code.toLowerCase()}" lang="${ALT.code.toLowerCase()}" aria-label="${ALT.code}">
            ${ALT.code}
          </a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">
            ${T.more}
          </button>
        </div>
      </div>

      <nav class="ss-nav" aria-label="Primary">${navHtml}</nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${T.more}">
        <div class="ss-more__head">
          <strong>${T.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${T.close}">×</button>
        </div>

        <div class="ss-more__list ss-more__list--primary">${primaryHtml}</div>
        <div class="ss-more__divider" role="separator" aria-hidden="true"></div>
        <div class="ss-more__list ss-more__list--secondary">${secondaryHtml}</div>
      </div>

      <button class="ss-more__backdrop" id="ssMoreBackdrop" type="button" aria-label="${T.close}"></button>
    </div>

    <footer class="ss-footer">
      <div class="ss-footer__inner">
        <span>${T.brand}</span><span>•</span><span>${T.footerNote}</span>
      </div>
    </footer>
  `;

  const more = root.querySelector('#ssMore');
  const moreBtn = root.querySelector('#ssMoreBtn');
  const closeBtn = root.querySelector('#ssMoreClose');
  const backdrop = root.querySelector('#ssMoreBackdrop');

  const openMore = () => {
    more.hidden = false;
    moreBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ss-noScroll');
  };
  const closeMore = () => {
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

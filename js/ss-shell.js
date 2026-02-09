/* File: /js/ss-shell.js */
/* SafeShare Shell JS — stable final */

(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const body = document.body || {};
  const lang = body.dataset?.lang === 'de' ? 'de' : 'en';
  const rawPage = (body.dataset?.page || '').trim();

  const CFG = {
    de: {
      brand: 'SafeShare',
      labels: { start: 'Start', app: 'App', school: 'Schule', pro: 'Pro', help: 'Hilfe', more: 'Mehr', close: 'Schließen', lang: 'EN' },
      footer: 'Local-first Link-Hygiene.',
      links: {
        start: '/',
        app: '/app/',
        school: '/schule/',
        pro: '/pro/',
        help: '/hilfe/',
        privacy: '/datenschutz/',
        terms: '/nutzungsbedingungen/',
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
        ['Datenschutz', 'privacy'],
        ['Nutzungsbedingungen', 'terms']
      ],
      langHomeFallback: '/en/'
    },

    en: {
      brand: 'SafeShare',
      labels: { start: 'Start', app: 'App', school: 'School', pro: 'Pro', help: 'Help', more: 'More', close: 'Close', lang: 'DE' },
      footer: 'Local-first link hygiene.',
      links: {
        start: '/en/',
        app: '/en/app/',
        school: '/en/school/',
        pro: '/en/pro/',
        help: '/en/help/',
        privacy: '/en/privacy/',
        terms: '/en/terms/',
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
        ['Privacy', 'privacy'],
        ['Terms', 'terms']
      ],
      langHomeFallback: '/'
    }
  }[lang];

  /* Semantic page aliases */
  const alias = {
    // main
    start: 'start', index: 'start',
    app: 'app',
    schule: 'school', school: 'school',
    pro: 'pro',
    hilfe: 'help', help: 'help',
    // content
    'datenschutz-beim-link-teilen': 'privacySharing',
    'privacy-when-sharing-links': 'privacySharing',
    lesezeichen: 'bookmarks', bookmarks: 'bookmarks',
    'email-links-bereinigen': 'email', 'email-link-cleaning': 'email',
    'messenger-links-bereinigen': 'messenger', 'messenger-link-cleaning': 'messenger',
    'social-links-bereinigen': 'social', 'social-link-cleaning': 'social',
    'tracking-parameter': 'tracking', 'tracking-parameters': 'tracking',
    'utm-parameter-entfernen': 'removeUtm', 'remove-utm-parameter': 'removeUtm',
    'url-cleaner-tool-vergleich': 'compare', 'url-cleaner-comparison': 'compare',
    shortcuts: 'shortcuts',
    datenschutz: 'privacy', privacy: 'privacy',
    nutzungsbedingungen: 'terms', terms: 'terms'
  };

  const pageKey = alias[rawPage] || '';

  function norm(p) {
    if (!p) return '/';
    return p.endsWith('/') ? p : p + '/';
  }

  const currentPath = norm(location.pathname);

  function isActiveByHref(href) {
    return currentPath === norm(href);
  }

  function isActive(key, href) {
    if (pageKey && pageKey === key) return true;
    return isActiveByHref(href);
  }

  const pair = {
    start: { de: '/', en: '/en/' },
    app: { de: '/app/', en: '/en/app/' },
    school: { de: '/schule/', en: '/en/school/' },
    pro: { de: '/pro/', en: '/en/pro/' },
    help: { de: '/hilfe/', en: '/en/help/' },
    privacySharing: { de: '/datenschutz-beim-link-teilen/', en: '/en/privacy-when-sharing-links/' },
    bookmarks: { de: '/lesezeichen/', en: '/en/bookmarks/' },
    email: { de: '/email-links-bereinigen/', en: '/en/email-link-cleaning/' },
    messenger: { de: '/messenger-links-bereinigen/', en: '/en/messenger-link-cleaning/' },
    social: { de: '/social-links-bereinigen/', en: '/en/social-link-cleaning/' },
    tracking: { de: '/tracking-parameter/', en: '/en/tracking-parameters/' },
    removeUtm: { de: '/utm-parameter-entfernen/', en: '/en/remove-utm-parameter/' },
    compare: { de: '/url-cleaner-tool-vergleich/', en: '/en/url-cleaner-comparison/' },
    shortcuts: { de: '/shortcuts/', en: '/en/shortcuts/' },
    privacy: { de: '/datenschutz/', en: '/en/privacy/' },
    terms: { de: '/nutzungsbedingungen/', en: '/en/terms/' }
  };

  const semantic = pageKey || 'start';
  const switchHref = (pair[semantic]?.[lang === 'de' ? 'en' : 'de']) || CFG.langHomeFallback;

  const topNav = [
    ['start', CFG.links.start, CFG.labels.start],
    ['app', CFG.links.app, CFG.labels.app],
    ['school', CFG.links.school, CFG.labels.school],
    ['pro', CFG.links.pro, CFG.labels.pro],
    ['help', CFG.links.help, CFG.labels.help]
  ];

  const navHtml = topNav.map(([key, href, label]) => {
    return `<a class="ss-nav__link${isActive(key, href) ? ' is-active' : ''}" href="${href}">${label}</a>`;
  }).join('');

  const moreList = (arr) => arr.map(([label, key]) => {
    const href = CFG.links[key];
    return `<a class="ss-more__item${isActive(key, href) ? ' is-active' : ''}" href="${href}">${label}</a>`;
  }).join('');

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${CFG.links.start}" aria-label="${CFG.brand}">${CFG.brand}</a>

        <div class="ss-headActions">
          <a class="ss-langBtn" href="${switchHref}" hreflang="${lang === 'de' ? 'en' : 'de'}" lang="${lang === 'de' ? 'en' : 'de'}" aria-label="Switch language">
            ${CFG.labels.lang}
          </a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">
            ${CFG.labels.more}
          </button>
        </div>
      </div>

      <nav class="ss-nav" aria-label="Primary">
        ${navHtml}
      </nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <button class="ss-more__backdrop" id="ssMoreBackdrop" type="button" aria-label="${CFG.labels.close}"></button>

      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${CFG.labels.more}">
        <div class="ss-more__head">
          <strong>${CFG.labels.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${CFG.labels.close}">×</button>
        </div>

        <div class="ss-more__list ss-more__list--primary">
          ${moreList(CFG.morePrimary)}
        </div>

        <div class="ss-more__divider" aria-hidden="true"></div>

        <div class="ss-more__list ss-more__list--secondary">
          ${moreList(CFG.moreSecondary)}
        </div>
      </div>
    </div>

    <footer class="ss-footer" aria-label="Footer">
      <div class="ss-footer__inner">
        <span>${CFG.brand}</span>
        <span>•</span>
        <span>${CFG.footer}</span>
      </div>
    </footer>
  `;

  const more = root.querySelector('#ssMore');
  const btn = root.querySelector('#ssMoreBtn');
  const close = root.querySelector('#ssMoreClose');
  const backdrop = root.querySelector('#ssMoreBackdrop');

  function openMore() {
    if (!more) return;
    more.hidden = false;
    btn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ss-noScroll');
  }

  function closeMore() {
    if (!more) return;
    more.hidden = true;
    btn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ss-noScroll');
  }

  btn?.addEventListener('click', openMore);
  close?.addEventListener('click', closeMore);
  backdrop?.addEventListener('click', closeMore);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && more && !more.hidden) closeMore();
  });
})();

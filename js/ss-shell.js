// File: /js/ss-shell.js
(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const body = document.body || document.documentElement;
  const lang = body.dataset.lang === 'de' ? 'de' : 'en';
  const page = body.dataset.page || '';

  // ---------- page mapping DE <-> EN ----------
  // key = logical page id
  const MAP = {
    home:       { de: '/',                              en: '/en/' },
    app:        { de: '/app/',                          en: '/en/app/' },
    school:     { de: '/schule/',                       en: '/en/school/' },
    pro:        { de: '/pro/',                          en: '/en/pro/' },
    help:       { de: '/hilfe/',                        en: '/en/help/' },
    privacy:    { de: '/datenschutz/',                  en: '/en/privacy/' },
    terms:      { de: '/nutzungsbedingungen/',          en: '/en/terms/' },
    privacyShare:{de: '/datenschutz-beim-link-teilen/', en: '/en/privacy-when-sharing-links/' },
    bookmarks:  { de: '/lesezeichen/',                  en: '/en/bookmarks/' },
    email:      { de: '/email-links-bereinigen/',       en: '/en/email-link-cleaning/' },
    messenger:  { de: '/messenger-links-bereinigen/',   en: '/en/messenger-link-cleaning/' },
    social:     { de: '/social-links-bereinigen/',      en: '/en/social-link-cleaning/' },
    tracking:   { de: '/tracking-parameter/',           en: '/en/tracking-parameters/' },
    removeUtm:  { de: '/utm-parameter-entfernen/',      en: '/en/remove-utm-parameter/' },
    compare:    { de: '/url-cleaner-tool-vergleich/',   en: '/en/url-cleaner-comparison/' },
    shortcuts:  { de: '/shortcuts/',                    en: '/en/shortcuts/' },
    notfound:   { de: '/404.html',                      en: '/en/404/' },
    offline:    { de: '/offline/',                      en: '/en/offline/' },
    impressum:  { de: '/impressum/',                    en: '/en/imprint/' }
  };

  // reverse lookup by path -> key
  const pathNow = normalizePath(location.pathname);
  const keyFromPath = detectKeyFromPath(pathNow, MAP);
  const currentKey = pageToKey(page) || keyFromPath || (lang === 'de' ? 'home' : 'home');

  const T = {
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
      langLabel: 'EN',
      langAria: 'Switch to English',
      morePrimary: [
        ['Datenschutz beim Link-Teilen', 'privacyShare'],
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
        ['Impressum', 'impressum'],
        ['Datenschutz', 'privacy'],
        ['Nutzungsbedingungen', 'terms']
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
      langLabel: 'DE',
      langAria: 'Zu Deutsch wechseln',
      morePrimary: [
        ['Privacy when sharing links', 'privacyShare'],
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
        ['Imprint', 'impressum'],
        ['Privacy', 'privacy'],
        ['Terms', 'terms']
      ]
    }
  }[lang];

  // top nav
  const topNav = [
    [T.start, 'home'],
    [T.app, 'app'],
    [T.school, 'school'],
    [T.pro, 'pro'],
    [T.help, 'help']
  ];

  const navHtml = topNav.map(([label, key]) => {
    const href = MAP[key][lang];
    const isActive = isCurrentKey(key, currentKey);
    return `<a class="ss-nav__link${isActive ? ' is-active' : ''}" href="${href}">${label}</a>`;
  }).join('');

  // more lists
  const morePrimaryHtml = T.morePrimary.map(([label, key]) => {
    const href = MAP[key][lang];
    const activeCls = isCurrentKey(key, currentKey) ? ' is-active' : '';
    return `<a class="ss-more__item${activeCls}" href="${href}">${label}</a>`;
  }).join('');

  const moreSecondaryHtml = T.moreSecondary.map(([label, key]) => {
    const href = MAP[key][lang];
    const activeCls = isCurrentKey(key, currentKey) ? ' is-active' : '';
    return `<a class="ss-more__item${activeCls}" href="${href}">${label}</a>`;
  }).join('');

  // language target = same logical page, other language
  const targetLang = lang === 'de' ? 'en' : 'de';
  const langHref = (MAP[currentKey] && MAP[currentKey][targetLang]) || MAP.home[targetLang];

  // optional logo icon (falls du Datei hast)
  const logoIcon = '/assets/fav/favicon.svg';

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${MAP.home[lang]}" aria-label="${T.brand}">
          <img class="ss-brand__logo" src="${logoIcon}" alt="" width="18" height="18" loading="eager" decoding="async" onerror="this.style.display='none'">
          <span class="ss-brand__text">${T.brand}</span>
        </a>

        <div class="ss-headActions">
          <a class="ss-langSwitch" href="${langHref}" aria-label="${T.langAria}">${T.langLabel}</a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">${T.more}</button>
        </div>
      </div>

      <nav class="ss-nav" aria-label="Primary">
        ${navHtml}
      </nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <button class="ss-more__backdrop" id="ssMoreBackdrop" aria-label="${T.close}"></button>

      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${T.more}">
        <div class="ss-more__head">
          <strong>${T.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${T.close}">×</button>
        </div>

        <div class="ss-more__list">
          ${morePrimaryHtml}
        </div>

        <div class="ss-more__divider"></div>

        <div class="ss-more__list ss-more__list--secondary">
          ${moreSecondaryHtml}
        </div>
      </div>
    </div>

    <footer class="ss-footer">
      <div class="ss-footer__inner">
        <span>${T.brand}</span>
        <span>•</span>
        <span>${T.footerNote}</span>
      </div>
    </footer>
  `;

  // ---------- interactions ----------
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

  // close menu when clicking any link inside panel
  more?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMore));

  // ---------- helpers ----------
  function normalizePath(p) {
    if (!p) return '/';
    // keep /404.html exactly
    if (p === '/404.html') return p;
    // remove duplicate slashes
    p = p.replace(/\/{2,}/g, '/');
    // ensure trailing slash for directory-like paths
    if (!p.endsWith('/') && !p.includes('.')) p += '/';
    return p;
  }

  function detectKeyFromPath(path, map) {
    for (const key of Object.keys(map)) {
      if (normalizePath(map[key].de) === path || normalizePath(map[key].en) === path) {
        return key;
      }
    }
    return null;
  }

  function pageToKey(pageVal) {
    const p = (pageVal || '').trim().toLowerCase();
    const alias = {
      start: 'home',
      index: 'home',
      home: 'home',
      app: 'app',
      schule: 'school',
      school: 'school',
      pro: 'pro',
      hilfe: 'help',
      help: 'help',
      datenschutz: 'privacy',
      privacy: 'privacy',
      nutzungsbedingungen: 'terms',
      terms: 'terms',
      'datenschutz-beim-link-teilen': 'privacyShare',
      'privacy-when-sharing-links': 'privacyShare',
      lesezeichen: 'bookmarks',
      bookmarks: 'bookmarks',
      'email-links-bereinigen': 'email',
      'email-link-cleaning': 'email',
      'messenger-links-bereinigen': 'messenger',
      'messenger-link-cleaning': 'messenger',
      'social-links-bereinigen': 'social',
      'social-link-cleaning': 'social',
      'tracking-parameter': 'tracking',
      'tracking-parameters': 'tracking',
      'utm-parameter-entfernen': 'removeUtm',
      'remove-utm-parameter': 'removeUtm',
      'url-cleaner-tool-vergleich': 'compare',
      'url-cleaner-comparison': 'compare',
      shortcuts: 'shortcuts',
      offline: 'offline',
      '404': 'notfound',
      '404.html': 'notfound',
      impressum: 'impressum',
      imprint: 'impressum'
    };
    return alias[p] || null;
  }

  function isCurrentKey(a, b) {
    return a === b;
  }
})();

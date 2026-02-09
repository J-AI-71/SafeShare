/* File: /js/ss-shell.js */
/* SafeShare Shell JS — stable footer-at-bottom + robust lang switch */

(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const lang = document.body?.dataset?.lang === 'de' ? 'de' : 'en';
  const page = (document.body?.dataset?.page || '').trim();

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
      langLabel: 'EN',
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
        ['Kurzbefehle', 'shortcuts'],
        ['Datenschutz', 'privacy'],
        ['Impressum', 'imprint'],
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
        ['Imprint', 'imprint'],
        ['Terms', 'terms']
      ]
    }
  }[lang];

  const deToEnByPage = {
    start: '/en/', home: '/en/', app: '/en/app/', schule: '/en/school/', school: '/en/school/',
    pro: '/en/pro/', hilfe: '/en/help/', help: '/en/help/', datenschutz: '/en/privacy/',
    nutzungsbedingungen: '/en/terms/', impressum: '/en/imprint/',
    'datenschutz-beim-link-teilen': '/en/privacy-when-sharing-links/',
    lesezeichen: '/en/bookmarks/', 'email-links-bereinigen': '/en/email-link-cleaning/',
    'messenger-links-bereinigen': '/en/messenger-link-cleaning/', 'social-links-bereinigen': '/en/social-link-cleaning/',
    'tracking-parameter': '/en/tracking-parameters/', 'utm-parameter-entfernen': '/en/remove-utm-parameter/',
    'url-cleaner-tool-vergleich': '/en/url-cleaner-comparison/', shortcuts: '/en/shortcuts/',
    '404': '/en/404/', offline: '/en/offline/'
  };

  const enToDeByPage = {
    start: '/', home: '/', app: '/app/', school: '/schule/', pro: '/pro/', help: '/hilfe/',
    privacy: '/datenschutz/', terms: '/nutzungsbedingungen/', imprint: '/impressum/',
    'privacy-when-sharing-links': '/datenschutz-beim-link-teilen/', bookmarks: '/lesezeichen/',
    'email-link-cleaning': '/email-links-bereinigen/', 'messenger-link-cleaning': '/messenger-links-bereinigen/',
    'social-link-cleaning': '/social-links-bereinigen/', 'tracking-parameters': '/tracking-parameter/',
    'remove-utm-parameter': '/utm-parameter-entfernen/', 'url-cleaner-comparison': '/url-cleaner-tool-vergleich/',
    shortcuts: '/shortcuts/', '404': '/404.html', offline: '/offline/'
  };

  function computeLangHref() {
    if (lang === 'de') {
      if (deToEnByPage[page]) return deToEnByPage[page];
      const p = location.pathname.replace(/\/+$/, '') || '/';
      if (p === '/') return '/en/';
      return (`/en${p}/`).replace(/\/{2,}/g, '/');
    } else {
      if (enToDeByPage[page]) return enToDeByPage[page];
      const p = location.pathname.replace(/\/+$/, '') || '/';
      if (p === '/en') return '/';
      if (p.startsWith('/en/')) return (p.slice(3) || '/');
      return '/';
    }
  }

  function isActive(href) {
    const a = (location.pathname.replace(/\/+$/, '') || '/');
    const b = (href.replace(/\/+$/, '') || '/');
    return a === b;
  }

  const topNav = [
    ['start', I18N.links.start],
    ['app', I18N.links.app],
    ['school', I18N.links.school],
    ['pro', I18N.links.pro],
    ['help', I18N.links.help]
  ];

  const navHtml = topNav.map(([k, href]) =>
    `<a class="ss-nav__link${isActive(href) ? ' is-active' : ''}" href="${href}">${I18N[k]}</a>`
  ).join('');

  const morePrimary = I18N.morePrimary.map(([label, key]) =>
    `<a class="ss-more__item${isActive(I18N.links[key]) ? ' is-active' : ''}" href="${I18N.links[key]}">${label}</a>`
  ).join('');

  const moreSecondary = I18N.moreSecondary.map(([label, key]) =>
    `<a class="ss-more__item${isActive(I18N.links[key]) ? ' is-active' : ''}" href="${I18N.links[key]}">${label}</a>`
  ).join('');

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${I18N.links.start}" aria-label="${I18N.brand}">
          <span class="ss-brand__word">${I18N.brand}</span>
        </a>
        <div class="ss-headActions">
          <a class="ss-langSwitch" href="${computeLangHref()}" hreflang="${lang === 'de' ? 'en' : 'de'}">${I18N.langLabel}</a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">${I18N.more}</button>
        </div>
      </div>
      <nav class="ss-nav" aria-label="Primary">${navHtml}</nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <button class="ss-more__backdrop" id="ssMoreBackdrop" aria-label="${I18N.close}"></button>
      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${I18N.more}">
        <div class="ss-more__head">
          <strong>${I18N.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${I18N.close}">×</button>
        </div>
        <div class="ss-more__list">${morePrimary}</div>
        <div class="ss-more__divider"></div>
        <div class="ss-more__list ss-more__list--secondary">${moreSecondary}</div>
      </div>
    </div>
  `;

  // ---- Footer robust at page bottom (rendered by shell JS, not static HTML) ----
  const oldFooter = document.getElementById('ss-shell-footer');
  if (oldFooter) oldFooter.remove();

  const footer = document.createElement('footer');
  footer.id = 'ss-shell-footer';
  footer.className = 'ss-footer';
  footer.innerHTML = `
    <div class="ss-footer__inner">
      <span>${I18N.brand}</span><span>•</span><span>${I18N.footerNote}</span>
    </div>
  `;
  document.body.appendChild(footer);

  // More interactions
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

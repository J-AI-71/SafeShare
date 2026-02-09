/* File: /js/ss-shell.js */
/* SafeShare Shell JS — FINAL stable (DE/EN switch, nav, readable more, shell footer) */
(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const body = document.body || document.documentElement;
  const lang = (body.dataset.lang === 'de') ? 'de' : 'en';
  const page = (body.dataset.page || '').trim();

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
      langSwitch: 'EN',
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
      }
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
      langSwitch: 'DE',
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
      }
    }
  };

  const T = I18N[lang];
  const ALT = I18N[lang === 'de' ? 'en' : 'de'];

  const topNav = [
    ['start', T.links.start],
    ['app', T.links.app],
    ['school', T.links.school],
    ['pro', T.links.pro],
    ['help', T.links.help]
  ];

  // More: erst Top-8 + dann Basislinks
  const primaryMore = [
    [lang === 'de' ? 'Datenschutz beim Link-Teilen' : 'Privacy when sharing links', 'privacySharing'],
    [lang === 'de' ? 'Lesezeichen' : 'Bookmarks', 'bookmarks'],
    [lang === 'de' ? 'E-Mail-Links' : 'Email links', 'email'],
    [lang === 'de' ? 'Messenger-Links' : 'Messenger links', 'messenger'],
    [lang === 'de' ? 'Social-Links' : 'Social links', 'social'],
    [lang === 'de' ? 'Tracking-Parameter' : 'Tracking parameters', 'tracking'],
    [lang === 'de' ? 'UTM entfernen' : 'Remove UTM', 'removeUtm'],
    [lang === 'de' ? 'Tool-Vergleich' : 'Tool comparison', 'compare']
  ];

  const secondaryMore = [
    [lang === 'de' ? 'Shortcuts' : 'Shortcuts', 'shortcuts'],
    [lang === 'de' ? 'Datenschutz' : 'Privacy', 'privacy'],
    [lang === 'de' ? 'Impressum' : 'Imprint', 'imprint'],
    [lang === 'de' ? 'Nutzungsbedingungen' : 'Terms', 'terms'],
    [lang === 'de' ? 'Hilfe' : 'Help', 'help']
  ];

  const normalize = (p) => (p || '').replace(/\/+$/, '') || '/';
  const here = normalize(location.pathname);

  const isActive = (href) => {
    const target = normalize(href);
    return here === target;
  };

  const navHtml = topNav.map(([k, href]) => {
    const activeClass = isActive(href) ? ' is-active' : '';
    return `<a class="ss-nav__link${activeClass}" href="${href}">${T[k]}</a>`;
  }).join('');

  const renderMoreList = (arr, isSecondary = false) => {
    const listClass = isSecondary ? 'ss-more__list ss-more__list--secondary' : 'ss-more__list';
    const items = arr.map(([label, key]) => {
      const href = T.links[key];
      const activeClass = isActive(href) ? ' is-active' : '';
      return `<a class="ss-more__item${activeClass}" href="${href}">${label}</a>`;
    }).join('');
    return `<div class="${listClass}">${items}</div>`;
  };

  // Sprachwechsel: page-basiert, falls nicht vorhanden -> Start
  const pageMap = {
    // top pages
    'start': ['/', '/en/'],
    'app': ['/app/', '/en/app/'],
    'schule': ['/schule/', '/en/school/'],
    'school': ['/schule/', '/en/school/'],
    'pro': ['/pro/', '/en/pro/'],
    'hilfe': ['/hilfe/', '/en/help/'],
    'help': ['/hilfe/', '/en/help/'],

    // content pages
    'email-links-bereinigen': ['/email-links-bereinigen/', '/en/email-link-cleaning/'],
    'email-link-cleaning': ['/email-links-bereinigen/', '/en/email-link-cleaning/'],
    'messenger-links-bereinigen': ['/messenger-links-bereinigen/', '/en/messenger-link-cleaning/'],
    'messenger-link-cleaning': ['/messenger-links-bereinigen/', '/en/messenger-link-cleaning/'],
    'social-links-bereinigen': ['/social-links-bereinigen/', '/en/social-link-cleaning/'],
    'social-link-cleaning': ['/social-links-bereinigen/', '/en/social-link-cleaning/'],
    'tracking-parameter': ['/tracking-parameter/', '/en/tracking-parameters/'],
    'tracking-parameters': ['/tracking-parameter/', '/en/tracking-parameters/'],
    'utm-parameter-entfernen': ['/utm-parameter-entfernen/', '/en/remove-utm-parameter/'],
    'remove-utm-parameter': ['/utm-parameter-entfernen/', '/en/remove-utm-parameter/'],
    'url-cleaner-tool-vergleich': ['/url-cleaner-tool-vergleich/', '/en/url-cleaner-comparison/'],
    'url-cleaner-comparison': ['/url-cleaner-tool-vergleich/', '/en/url-cleaner-comparison/'],
    'shortcuts': ['/shortcuts/', '/en/shortcuts/'],

    // legal/support
    'datenschutz': ['/datenschutz/', '/en/privacy/'],
    'privacy': ['/datenschutz/', '/en/privacy/'],
    'nutzungsbedingungen': ['/nutzungsbedingungen/', '/en/terms/'],
    'terms': ['/nutzungsbedingungen/', '/en/terms/'],
    'impressum': ['/impressum/', '/en/imprint/'],
    'imprint': ['/impressum/', '/en/imprint/'],

    // 404
    '404': ['/404.html', '/en/404/']
  };

  const getLangSwitchHref = () => {
    const pair = pageMap[page];
    if (pair) return lang === 'de' ? pair[1] : pair[0];

    // fallback by pathname if page missing/incorrect
    const p = location.pathname;
    if (p.startsWith('/en/')) {
      const deGuess = p.replace(/^\/en\//, '/');
      return deGuess === '/' ? '/' : deGuess;
    }
    const enGuess = `/en${p.startsWith('/') ? '' : '/'}${p}`;
    return enGuess === '/en/404.html' ? '/en/404/' : enGuess;
  };

  const langHref = getLangSwitchHref();

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${T.links.start}" aria-label="${T.brand}">${T.brand}</a>

        <div class="ss-headActions">
          <a class="ss-langSwitch" href="${langHref}" hreflang="${lang === 'de' ? 'en' : 'de'}" lang="${lang === 'de' ? 'en' : 'de'}">${T.langSwitch}</a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-controls="ssMore" aria-expanded="false">${T.more}</button>
        </div>
      </div>

      <nav class="ss-nav" aria-label="Primary navigation">
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

        ${renderMoreList(primaryMore)}
        <div class="ss-more__divider"></div>
        ${renderMoreList(secondaryMore, true)}
      </div>
    </div>

    <footer class="ss-footer" role="contentinfo">
      <div class="ss-footer__inner">
        <span>${T.brand}</span>
        <span>•</span>
        <span>${T.footerNote}</span>
      </div>
    </footer>
  `;

  const more = root.querySelector('#ssMore');
  const moreBtn = root.querySelector('#ssMoreBtn');
  const closeBtn = root.querySelector('#ssMoreClose');
  const backdrop = root.querySelector('#ssMoreBackdrop');

  const openMore = () => {
    if (!more) return;
    more.hidden = false;
    moreBtn?.setAttribute('aria-expanded', 'true');
    body.classList.add('ss-noScroll');
  };

  const closeMore = () => {
    if (!more) return;
    more.hidden = true;
    moreBtn?.setAttribute('aria-expanded', 'false');
    body.classList.remove('ss-noScroll');
  };

  moreBtn?.addEventListener('click', openMore);
  closeBtn?.addEventListener('click', closeMore);
  backdrop?.addEventListener('click', closeMore);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && more && !more.hidden) closeMore();
  });
})();

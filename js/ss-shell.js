// /js/ss-shell.js
(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const lang = document.body?.dataset?.lang === 'de' ? 'de' : 'en';
  const page = document.body?.dataset?.page || '';

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
      moreLinks: [
        ['Datenschutz beim Link-Teilen', 'privacySharing'],
        ['Lesezeichen', 'bookmarks'],
        ['E-Mail-Links', 'email'],
        ['Messenger-Links', 'messenger'],
        ['Social-Links', 'social'],
        ['Tracking-Parameter', 'tracking'],
        ['UTM entfernen', 'removeUtm'],
        ['Tool-Vergleich', 'compare'],
        ['Shortcuts', 'shortcuts'],
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
      moreLinks: [
        ['Privacy when sharing links', 'privacySharing'],
        ['Bookmarks', 'bookmarks'],
        ['Email links', 'email'],
        ['Messenger links', 'messenger'],
        ['Social links', 'social'],
        ['Tracking parameters', 'tracking'],
        ['Remove UTM', 'removeUtm'],
        ['Tool comparison', 'compare'],
        ['Shortcuts', 'shortcuts'],
        ['Privacy', 'privacy'],
        ['Terms', 'terms']
      ]
    }
  }[lang];

  const active = (href) => {
    const p = location.pathname;
    return p === href || p === href.replace(/\/$/, '');
  };

  const topNav = [
    ['start', T.links.start],
    ['app', T.links.app],
    ['school', T.links.school],
    ['pro', T.links.pro],
    ['help', T.links.help]
  ];

  const navHtml = topNav.map(([k, href]) => `
    <a class="ss-nav__link${active(href) ? ' is-active' : ''}" href="${href}">
      ${T[k]}
    </a>
  `).join('');

  const moreHtml = T.moreLinks.map(([label, key]) => `
    <a class="ss-more__item" href="${T.links[key]}">${label}</a>
  `).join('');

  // footer in shell (kein statischer footer im HTML)
  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${T.links.start}" aria-label="${T.brand}">${T.brand}</a>
        <div class="ss-headActions">
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
        <div class="ss-more__list">${moreHtml}</div>
      </div>
      <button class="ss-more__backdrop" id="ssMoreBackdrop" aria-label="${T.close}"></button>
    </div>

    <footer class="ss-footer">
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
    if (e.key === 'Escape' && !more.hidden) closeMore();
  });
})();

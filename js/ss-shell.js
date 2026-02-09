// File: /js/ss-shell.js
// SafeShare Shell (DE/EN) — footer in shell, top-nav + readable more menu
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
      primaryNavAria: 'Hauptnavigation',
      moreAria: 'Mehr-Menü',
      allTopics: 'Alle Themen in Hilfe',
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
      moreLinksPrimary: [
        ['Datenschutz beim Link-Teilen', 'privacySharing'],
        ['Lesezeichen', 'bookmarks'],
        ['E-Mail-Links', 'email'],
        ['Messenger-Links', 'messenger'],
        ['Social-Links', 'social'],
        ['Tracking-Parameter', 'tracking'],
        ['UTM entfernen', 'removeUtm'],
        ['Tool-Vergleich', 'compare']
      ],
      moreLinksSecondary: [
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
      primaryNavAria: 'Primary navigation',
      moreAria: 'More menu',
      allTopics: 'All topics in Help',
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
      moreLinksPrimary: [
        ['Privacy when sharing links', 'privacySharing'],
        ['Bookmarks', 'bookmarks'],
        ['Email links', 'email'],
        ['Messenger links', 'messenger'],
        ['Social links', 'social'],
        ['Tracking parameters', 'tracking'],
        ['Remove UTM', 'removeUtm'],
        ['Tool comparison', 'compare']
      ],
      moreLinksSecondary: [
        ['Privacy', 'privacy'],
        ['Terms', 'terms']
      ]
    }
  };

  const T = I18N[lang];
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';

  const normalize = (href) => href.replace(/\/+$/, '') || '/';
  const isActive = (href) => normalize(currentPath) === normalize(href);

  // Optional: map data-page values to nav keys for robust active states
  const pageToNavKey = {
    // DE
    'start': 'start',
    'index': 'start',
    'app': 'app',
    'schule': 'school',
    'hilfe': 'help',
    'pro': 'pro',
    // EN
    'school': 'school',
    'help': 'help'
  };

  const topNav = [
    ['start', T.links.start],
    ['app', T.links.app],
    ['school', T.links.school],
    ['pro', T.links.pro],
    ['help', T.links.help]
  ];

  const activeByPageKey = pageToNavKey[page] || null;

  const topNavHtml = topNav
    .map(([key, href]) => {
      const active = isActive(href) || activeByPageKey === key;
      return `
        <a class="ss-nav__link${active ? ' is-active' : ''}" href="${href}">
          ${T[key]}
        </a>
      `;
    })
    .join('');

  const buildMoreLinks = (arr) =>
    arr.map(([label, key]) => {
      const href = T.links[key];
      const active = isActive(href);
      return `<a class="ss-more__item${active ? ' is-active' : ''}" href="${href}">${label}</a>`;
    }).join('');

  const morePrimaryHtml = buildMoreLinks(T.moreLinksPrimary || []);
  const moreSecondaryHtml = buildMoreLinks(T.moreLinksSecondary || []);

  root.innerHTML = `
    <header class="ss-header" role="banner">
      <div class="ss-header__row">
        <a class="ss-brand" href="${T.links.start}" aria-label="${T.brand}">${T.brand}</a>

        <div class="ss-headActions">
          <button
            class="ss-moreBtn"
            id="ssMoreBtn"
            type="button"
            aria-haspopup="dialog"
            aria-controls="ssMore"
            aria-expanded="false"
          >
            ${T.more}
          </button>
        </div>
      </div>

      <nav class="ss-nav" aria-label="${T.primaryNavAria}">
        ${topNavHtml}
      </nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${T.moreAria}">
        <div class="ss-more__head">
          <strong>${T.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${T.close}">×</button>
        </div>

        <div class="ss-more__list">${morePrimaryHtml}</div>

        <div class="ss-more__divider" aria-hidden="true"></div>

        <div class="ss-more__list ss-more__list--secondary">
          ${moreSecondaryHtml}
          <a class="ss-more__item ss-more__item--help" href="${T.links.help}">${T.allTopics}</a>
        </div>
      </div>

      <button class="ss-more__backdrop" id="ssMoreBackdrop" aria-label="${T.close}"></button>
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

  if (!more || !moreBtn || !closeBtn || !backdrop) return;

  const openMore = () => {
    more.hidden = false;
    moreBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ss-noScroll');
    closeBtn.focus();
  };

  const closeMore = () => {
    more.hidden = true;
    moreBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ss-noScroll');
    moreBtn.focus();
  };

  moreBtn.addEventListener('click', () => {
    if (more.hidden) openMore();
    else closeMore();
  });
  closeBtn.addEventListener('click', closeMore);
  backdrop.addEventListener('click', closeMore);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !more.hidden) closeMore();
  });

  // Close on link click in panel
  more.querySelectorAll('a.ss-more__item').forEach((a) => {
    a.addEventListener('click', () => closeMore());
  });
})();

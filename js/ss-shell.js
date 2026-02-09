// File: /js/ss-shell.js
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
      langSwitch: 'EN',
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
      // 8 primäre Links + sekundäre Rechtslinks
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
      brand: 'SafeShare',
      start: 'Start',
      app: 'App',
      school: 'School',
      pro: 'Pro',
      help: 'Help',
      more: 'More',
      close: 'Close',
      langSwitch: 'DE',
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

  const T = I18N[lang];

  // data-page -> counterpart mapping
  const PAGE_MAP = {
    // core
    'home': { de: '/', en: '/en/' },
    'start': { de: '/', en: '/en/' },
    'app': { de: '/app/', en: '/en/app/' },
    'schule': { de: '/schule/', en: '/en/school/' },
    'school': { de: '/schule/', en: '/en/school/' },
    'pro': { de: '/pro/', en: '/en/pro/' },
    'hilfe': { de: '/hilfe/', en: '/en/help/' },
    'help': { de: '/hilfe/', en: '/en/help/' },

    // content
    'email-links-bereinigen': { de: '/email-links-bereinigen/', en: '/en/email-link-cleaning/' },
    'email-link-cleaning': { de: '/email-links-bereinigen/', en: '/en/email-link-cleaning/' },

    'messenger-links-bereinigen': { de: '/messenger-links-bereinigen/', en: '/en/messenger-link-cleaning/' },
    'messenger-link-cleaning': { de: '/messenger-links-bereinigen/', en: '/en/messenger-link-cleaning/' },

    'social-links-bereinigen': { de: '/social-links-bereinigen/', en: '/en/social-link-cleaning/' },
    'social-link-cleaning': { de: '/social-links-bereinigen/', en: '/en/social-link-cleaning/' },

    'tracking-parameter': { de: '/tracking-parameter/', en: '/en/tracking-parameters/' },
    'tracking-parameters': { de: '/tracking-parameter/', en: '/en/tracking-parameters/' },

    'utm-parameter-entfernen': { de: '/utm-parameter-entfernen/', en: '/en/remove-utm-parameter/' },
    'remove-utm-parameter': { de: '/utm-parameter-entfernen/', en: '/en/remove-utm-parameter/' },

    'url-cleaner-tool-vergleich': { de: '/url-cleaner-tool-vergleich/', en: '/en/url-cleaner-comparison/' },
    'url-cleaner-comparison': { de: '/url-cleaner-tool-vergleich/', en: '/en/url-cleaner-comparison/' },

    'shortcuts': { de: '/shortcuts/', en: '/en/shortcuts/' },

    'datenschutz-beim-link-teilen': { de: '/datenschutz-beim-link-teilen/', en: '/en/privacy-when-sharing-links/' },
    'privacy-when-sharing-links': { de: '/datenschutz-beim-link-teilen/', en: '/en/privacy-when-sharing-links/' },

    'lesezeichen': { de: '/lesezeichen/', en: '/en/bookmarks/' },
    'bookmarks': { de: '/lesezeichen/', en: '/en/bookmarks/' },

    'datenschutz': { de: '/datenschutz/', en: '/en/privacy/' },
    'privacy': { de: '/datenschutz/', en: '/en/privacy/' },

    'nutzungsbedingungen': { de: '/nutzungsbedingungen/', en: '/en/terms/' },
    'terms': { de: '/nutzungsbedingungen/', en: '/en/terms/' },

    'impressum': { de: '/impressum/', en: '/en/imprint/' },
    'imprint': { de: '/impressum/', en: '/en/imprint/' },

    // error/offline
    '404': { de: '/404.html', en: '/en/404/' },
    'offline': { de: '/offline/', en: '/en/offline/' }
  };

  const normalize = (u) => (u || '').replace(/\/+$/, '') || '/';
  const pathNow = normalize(location.pathname);

  const isActive = (href) => pathNow === normalize(href);

  const topNav = [
    ['start', T.links.start],
    ['app', T.links.app],
    ['school', T.links.school],
    ['pro', T.links.pro],
    ['help', T.links.help]
  ];

  const navHtml = topNav.map(([key, href]) => {
    const active = isActive(href) ? ' is-active' : '';
    return `<a class="ss-nav__link${active}" href="${href}">${T[key]}</a>`;
  }).join('');

  const buildMoreItems = (items) => items.map(([label, key]) => {
    const href = T.links[key];
    const active = isActive(href) ? ' is-active' : '';
    return `<a class="ss-more__item${active}" href="${href}">${label}</a>`;
  }).join('');

  const morePrimary = buildMoreItems(T.morePrimary);
  const moreSecondary = buildMoreItems(T.moreSecondary);

  const counterpart = (() => {
    const p = PAGE_MAP[page];
    if (p) return lang === 'de' ? p.en : p.de;

    // Fallback: simple prefix switch
    const raw = location.pathname;
    if (lang === 'de') {
      return raw.startsWith('/en/') ? raw : `/en${raw === '/' ? '/' : raw}`;
    }
    return raw.startsWith('/en/') ? raw.slice(3) || '/' : raw;
  })();

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${T.links.start}" aria-label="${T.brand}">${T.brand}</a>

        <div class="ss-headActions">
          <a class="ss-langSwitch" href="${counterpart}" hreflang="${lang === 'de' ? 'en' : 'de'}" lang="${lang === 'de' ? 'en' : 'de'}">
            ${T.langSwitch}
          </a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">
            ${T.more}
          </button>
        </div>
      </div>

      <nav class="ss-nav" aria-label="Primary">${navHtml}</nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <button class="ss-more__backdrop" id="ssMoreBackdrop" aria-label="${T.close}"></button>

      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${T.more}">
        <div class="ss-more__head">
          <strong>${T.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${T.close}">×</button>
        </div>

        <div class="ss-more__list">${morePrimary}</div>
        <div class="ss-more__divider"></div>
        <div class="ss-more__list ss-more__list--secondary">${moreSecondary}</div>
      </div>
    </div>
  `;

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

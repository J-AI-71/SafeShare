// File: /js/ss-shell.js
(() => {
  const root = document.getElementById('ss-shell');
  if (!root) return;

  const isDE = document.body?.dataset?.lang === 'de';
  const lang = isDE ? 'de' : 'en';
  const page = (document.body?.dataset?.page || '').trim();
  const path = (location.pathname || '/').replace(/\/+$/, '') || '/';

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
      legalPrivacy: 'Datenschutz',
      legalTerms: 'Nutzungsbedingungen',
      langBtn: 'EN',
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
        shortcuts: '/shortcuts/',
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
        ['Tool-Vergleich', 'compare']
      ],
      moreSecondary: [
        ['Shortcuts', 'shortcuts'],
        ['Impressum', 'imprint'],
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
      legalPrivacy: 'Privacy',
      legalTerms: 'Terms',
      langBtn: 'DE',
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
        shortcuts: '/en/shortcuts/',
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
        ['Imprint', 'imprint'],
        ['Privacy', 'privacy'],
        ['Terms', 'terms']
      ]
    }
  };

  const T = I18N[lang];

  // Seite -> Sprach-Zielseite
  const SWITCH_MAP = {
    '404': { de: '/404.html', en: '/en/404/' },
    'help': { de: '/hilfe/', en: '/en/help/' },
    'hilfe': { de: '/hilfe/', en: '/en/help/' },

    'start': { de: '/', en: '/en/' },
    'home': { de: '/', en: '/en/' },

    'app': { de: '/app/', en: '/en/app/' },
    'pro': { de: '/pro/', en: '/en/pro/' },

    'school': { de: '/schule/', en: '/en/school/' },
    'schule': { de: '/schule/', en: '/en/school/' },

    'bookmarks': { de: '/lesezeichen/', en: '/en/bookmarks/' },
    'lesezeichen': { de: '/lesezeichen/', en: '/en/bookmarks/' },

    'social-links-bereinigen': { de: '/social-links-bereinigen/', en: '/en/social-link-cleaning/' },
    'social-link-cleaning': { de: '/social-links-bereinigen/', en: '/en/social-link-cleaning/' },

    'messenger-links-bereinigen': { de: '/messenger-links-bereinigen/', en: '/en/messenger-link-cleaning/' },
    'messenger-link-cleaning': { de: '/messenger-links-bereinigen/', en: '/en/messenger-link-cleaning/' },

    'email-links-bereinigen': { de: '/email-links-bereinigen/', en: '/en/email-link-cleaning/' },
    'email-link-cleaning': { de: '/email-links-bereinigen/', en: '/en/email-link-cleaning/' },

    'tracking-parameter': { de: '/tracking-parameter/', en: '/en/tracking-parameters/' },
    'tracking-parameters': { de: '/tracking-parameter/', en: '/en/tracking-parameters/' },

    'utm-parameter-entfernen': { de: '/utm-parameter-entfernen/', en: '/en/remove-utm-parameter/' },
    'remove-utm-parameter': { de: '/utm-parameter-entfernen/', en: '/en/remove-utm-parameter/' },

    'url-cleaner-tool-vergleich': { de: '/url-cleaner-tool-vergleich/', en: '/en/url-cleaner-comparison/' },
    'url-cleaner-comparison': { de: '/url-cleaner-tool-vergleich/', en: '/en/url-cleaner-comparison/' },

    'shortcuts': { de: '/shortcuts/', en: '/en/shortcuts/' },

    'privacy': { de: '/datenschutz/', en: '/en/privacy/' },
    'datenschutz': { de: '/datenschutz/', en: '/en/privacy/' },

    'terms': { de: '/nutzungsbedingungen/', en: '/en/terms/' },
    'nutzungsbedingungen': { de: '/nutzungsbedingungen/', en: '/en/terms/' },

    'imprint': { de: '/impressum/', en: '/en/imprint/' },
    'impressum': { de: '/impressum/', en: '/en/imprint/' }
  };

  function normalize(p) {
    return (p || '/').replace(/\/+$/, '') || '/';
  }

  function isActive(href) {
    return normalize(path) === normalize(href);
  }

  function oppositeLangHref() {
    const targetLang = lang === 'de' ? 'en' : 'de';

    // 1) data-page mapping
    if (page && SWITCH_MAP[page]?.[targetLang]) return SWITCH_MAP[page][targetLang];

    // 2) heuristische Fallbacks
    const p = normalize(path);

    // de -> en
    if (targetLang === 'en') {
      if (p === '/') return '/en/';
      if (!p.startsWith('/en')) return `/en${p === '/' ? '' : p}/`.replace(/\/{2,}/g, '/');
    }

    // en -> de
    if (targetLang === 'de') {
      if (p === '/en') return '/';
      if (p.startsWith('/en/')) return p.replace(/^\/en/, '') + (p.endsWith('/') ? '' : '/');
    }

    return targetLang === 'en' ? '/en/' : '/';
  }

  const topNav = [
    ['start', T.links.start],
    ['app', T.links.app],
    ['school', T.links.school],
    ['pro', T.links.pro],
    ['help', T.links.help]
  ];

  const navHtml = topNav.map(([k, href]) => {
    const cls = `ss-nav__link${isActive(href) ? ' is-active' : ''}`;
    return `<a class="${cls}" href="${href}">${T[k]}</a>`;
  }).join('');

  const makeMoreItems = (arr) =>
    arr.map(([label, key]) => {
      const href = T.links[key];
      const cls = `ss-more__item${isActive(href) ? ' is-active' : ''}`;
      return `<a class="${cls}" href="${href}">${label}</a>`;
    }).join('');

  const morePrimaryHtml = makeMoreItems(T.morePrimary);
  const moreSecondaryHtml = makeMoreItems(T.moreSecondary);

  root.innerHTML = `
    <header class="ss-header">
      <div class="ss-header__row">
        <a class="ss-brand" href="${T.links.start}" aria-label="${T.brand}">${T.brand}</a>
        <div class="ss-headActions">
          <a class="ss-langBtn" href="${oppositeLangHref()}" hreflang="${lang === 'de' ? 'en' : 'de'}" lang="${lang === 'de' ? 'en' : 'de'}">${T.langBtn}</a>
          <button class="ss-moreBtn" id="ssMoreBtn" type="button" aria-haspopup="dialog" aria-expanded="false">${T.more}</button>
        </div>
      </div>
      <nav class="ss-nav" aria-label="Primary">${navHtml}</nav>
    </header>

    <div class="ss-more" id="ssMore" hidden>
      <button class="ss-more__backdrop" id="ssMoreBackdrop" aria-label="${T.close}" type="button"></button>
      <div class="ss-more__panel" role="dialog" aria-modal="true" aria-label="${T.more}">
        <div class="ss-more__head">
          <strong>${T.more}</strong>
          <button class="ss-more__close" id="ssMoreClose" type="button" aria-label="${T.close}">×</button>
        </div>
        <div class="ss-more__list">${morePrimaryHtml}</div>
        <div class="ss-more__divider"></div>
        <div class="ss-more__list ss-more__list--secondary">${moreSecondaryHtml}</div>
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

  moreBtn?.addEventListener('click', () => {
    if (more?.hidden) openMore();
    else closeMore();
  });
  closeBtn?.addEventListener('click', closeMore);
  backdrop?.addEventListener('click', closeMore);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && more && !more.hidden) closeMore();
  });
})();

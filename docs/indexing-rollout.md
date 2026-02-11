# SafeShare – Indexing Rollout Protokoll

## Konstanten (Do-Not-Touch)
- Google Verification bleibt unverändert
- Bing Verification bleibt unverändert
- Support/Listings-Mail bleibt: listings@safesharepro.com
- EN-Schema bleibt: /en/<slug>/
- Canonical/hreflang nur zielseiten-konsistent ändern

---

## 2026-02-11 – Controlled Indexing Start

### Auf INDEX gestellt
- https://safesharepro.com/
- https://safesharepro.com/app/
- https://safesharepro.com/hilfe/
- https://safesharepro.com/en/
- https://safesharepro.com/en/app/
- https://safesharepro.com/en/help/

Meta:
- <meta name="robots" content="index,follow">

### Auf NOINDEX belassen
- /pro/
- /schule/
- weitere noch nicht finalisierte Content-/Landing-Seiten
- jeweilige EN-Pendants

Meta:
- <meta name="robots" content="noindex,follow">

### Technische Checks
- robots.txt: kein Disallow für noindex-Seiten
- sitemap.xml enthält nur indexierbare URLs
- Canonical pro Seite auf finale Ziel-URL
- hreflang nur bei echter DE/EN-Gegenstück-Seite

### GSC Aktionen
- Sitemap eingereicht
- URL-Prüfung + Indexierung beantragt für alle 6 freigegebenen URLs

### Nächster Review-Termin
- +7 Tage: nächste 1–3 Seiten freigeben, wenn Master-Flow + Content final

/* =====================================================================
   Standby Booth — consent layer (assets/consent.js)
   One shared, synchronous, dependency-free script for every page.

   Order of operations:
     1. Google Consent Mode v2 stub + defaults (granted for the world,
        denied for EEA/UK) — set before any gtag.js could load.
     2. Stored choice (localStorage "sb-consent", valid 365 days).
        A stored choice ALWAYS beats the geo heuristic.
     3. Geo heuristic — timezone + language region subtags; any
        exception fails closed (treated as EEA/UK).
     4. Decision: load trackers, show the banner, or do nothing.

   Trackers NEVER load on /privacy/ or /terms/ — any geo, any choice.
   Public API: window.sbConsent = { grant, deny, reset, status }.
   ===================================================================== */
(function () {

  /* The 27 EU member states + IS/LI/NO (EEA) + GB (UK GDPR). */
  var EEA_UK = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
                'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
                'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
                'GB'];

  /* -----------------------------------------------------------------
     1. Consent Mode v2 stub — FIRST, so defaults precede everything.
     ----------------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  /* Default for the world: granted. */
  gtag('consent', 'default', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted'
  });
  /* Regional override for EEA/UK: denied until the visitor accepts. */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    region: EEA_UK,
    wait_for_update: 500
  });

  /* -----------------------------------------------------------------
     2. Stored choice — {v:1, status:'granted'|'denied', ts:ISO}.
     Corrupt, unknown-shape, or >365-day-old records read as "no choice".
     ----------------------------------------------------------------- */
  var STORAGE_KEY = 'sb-consent';
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

  function readChoice() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 1) return null;
      if (parsed.status !== 'granted' && parsed.status !== 'denied') return null;
      var ts = Date.parse(parsed.ts);
      if (isNaN(ts) || Date.now() - ts > MAX_AGE_MS) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeChoice(status) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: 1,
        status: status,
        ts: new Date().toISOString()
      }));
    } catch (e) { /* storage blocked — session-only choice */ }
  }

  function clearChoice() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* -----------------------------------------------------------------
     3. Geo heuristic — client-side only (GitHub Pages has no server).
     Timezone: any Europe/* zone, plus the five EEA Atlantic zones.
     Language: BCP 47 REGION subtags only ("en-GB" → GB); a bare
     primary subtag ("de") is a language, not a region — never matched.
     Any exception → true (fail closed: when unsure, ask).
     ----------------------------------------------------------------- */
  var EEA_ATLANTIC_TZ = {
    'Atlantic/Reykjavik': 1,
    'Atlantic/Canary': 1,
    'Atlantic/Faroe': 1,
    'Atlantic/Madeira': 1,
    'Atlantic/Azores': 1
  };

  function isEEAUK() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      var tzMatch = tz.indexOf('Europe/') === 0 ||
        Object.prototype.hasOwnProperty.call(EEA_ATLANTIC_TZ, tz);

      var langMatch = false;
      var langs = navigator.languages ||
        (navigator.language ? [navigator.language] : []);
      for (var i = 0; i < langs.length && !langMatch; i++) {
        var parts = String(langs[i]).split('-');
        for (var j = 1; j < parts.length; j++) {
          /* A two-letter subtag after the primary subtag is the region. */
          if (/^[A-Za-z]{2}$/.test(parts[j]) &&
              EEA_UK.indexOf(parts[j].toUpperCase()) !== -1) {
            langMatch = true;
            break;
          }
        }
      }
      return tzMatch || langMatch;
    } catch (e) {
      return true;
    }
  }

  /* -----------------------------------------------------------------
     4. Tracker loaders — exact configs formerly inlined in the pages.
     loadAll() is idempotent and a hard NO-OP on the legal pages.
     ----------------------------------------------------------------- */
  var loaded = false;

  function isLegalPage() {
    var p = (window.location && window.location.pathname) || '';
    return p.indexOf('/privacy') === 0 || p.indexOf('/terms') === 0;
  }

  /* Google Analytics 4 (gtag.js) — measurement ID G-0J3B4JVSWR. */
  function loadGA4() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-0J3B4JVSWR';
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', 'G-0J3B4JVSWR');
  }

  /* Meta Pixel — bootstrap snippet verbatim, then init + PageView. */
  function loadMetaPixel() {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', '1280931707356419');
    window.fbq('track', 'PageView');
  }

  /* PostHog — snippet verbatim; anonymous pageview-only config:
     person_profiles "identified_only" (and we never call identify()),
     respect_dnt honors Do Not Track, disable_session_recording stops
     any DOM/keystroke capture. */
  function loadPostHog() {
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_session_recording opt_out_session_recording has_opted_in_session_recording has_opted_out_session_recording".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init('phc_yd62Nhs7z5GS3E5GsdxGrULMS57psKCa2NNpsDB5qZ7W', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        respect_dnt: true,
        disable_session_recording: true
    });
  }

  function loadAll() {
    if (loaded) return;
    if (isLegalPage()) return; /* zero trackers on legal pages, all geos */
    loaded = true;
    loadGA4();
    loadMetaPixel();
    loadPostHog();
  }

  /* -----------------------------------------------------------------
     5. Banner — plain DOM, styled from the site's CSS custom
     properties so [data-theme="dark"] is honored automatically.
     No pre-ticked anything; no dismiss-without-choosing "x".
     ----------------------------------------------------------------- */
  var BANNER_ID = 'sb-consent-banner';
  var STYLE_ID = 'sb-consent-style';

  var BANNER_CSS = [
    '.sb-consent{position:fixed;left:0;right:0;bottom:0;z-index:999;background:var(--paper);border-top:1px solid var(--rule);}',
    '.sb-consent-inner{max-width:var(--max);margin:0 auto;padding:18px var(--gutter);display:flex;align-items:center;justify-content:space-between;gap:24px;}',
    '.sb-consent-copy{min-width:0;}',
    '.sb-consent-hd{font-family:var(--serif);font-style:italic;font-size:20px;line-height:1.2;color:var(--ink);margin:0 0 4px;}',
    '.sb-consent-body{font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--ink-2);margin:0;}',
    '.sb-consent-body a{color:var(--tally);text-decoration:none;border-bottom:1px solid var(--tally);padding-bottom:1px;}',
    '.sb-consent-body a:hover{background:var(--tally);color:var(--paper);}',
    '.sb-consent-actions{display:flex;gap:10px;flex-shrink:0;}',
    '.sb-consent-btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 26px;font-family:var(--sans);font-size:14px;font-weight:500;line-height:1;color:var(--ink);background:transparent;border:1px solid var(--ink);border-radius:0;cursor:pointer;transition:background 0.18s ease,color 0.18s ease;}',
    '.sb-consent-btn:hover{background:var(--ink);color:var(--paper);}',
    '.sb-consent-btn:focus-visible{outline:2px solid var(--tally);outline-offset:3px;}',
    '@media (max-width:560px){.sb-consent-inner{flex-direction:column;align-items:stretch;gap:14px;}.sb-consent-actions{flex-direction:column;}.sb-consent-btn{width:100%;}}'
  ].join('\n');

  function removeBanner() {
    var el = document.getElementById(BANNER_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showBanner() {
    if (document.getElementById(BANNER_ID) || !document.body) return;

    if (!document.getElementById(STYLE_ID)) {
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = BANNER_CSS;
      document.head.appendChild(style);
    }

    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.className = 'sb-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Privacy consent');

    var inner = document.createElement('div');
    inner.className = 'sb-consent-inner';

    var copy = document.createElement('div');
    copy.className = 'sb-consent-copy';

    var hd = document.createElement('p');
    hd.className = 'sb-consent-hd';
    hd.textContent = 'Field notes on your visit.';
    copy.appendChild(hd);

    var body = document.createElement('p');
    body.className = 'sb-consent-body';
    body.appendChild(document.createTextNode(
      "We'd like to count pageviews and measure our ads. Nothing loads unless you accept — see the "
    ));
    var link = document.createElement('a');
    link.href = '/privacy/';
    link.textContent = 'privacy guide';
    body.appendChild(link);
    body.appendChild(document.createTextNode('.'));
    copy.appendChild(body);

    var actions = document.createElement('div');
    actions.className = 'sb-consent-actions';

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'sb-consent-btn';
    accept.textContent = 'Accept';
    accept.addEventListener('click', function () { api.grant(); });

    var decline = document.createElement('button');
    decline.type = 'button';
    decline.className = 'sb-consent-btn';
    decline.textContent = 'Decline';
    decline.addEventListener('click', function () { api.deny(); });

    actions.appendChild(accept);
    actions.appendChild(decline);

    inner.appendChild(copy);
    inner.appendChild(actions);
    banner.appendChild(inner);
    document.body.appendChild(banner);
  }

  function showBannerWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  /* -----------------------------------------------------------------
     6. Best-effort cleanup on deny — expire _ga* / _fbp cookies across
     domain + path variants, and drop PostHog's ph_* localStorage keys.
     ----------------------------------------------------------------- */
  function expireCookie(name, domain) {
    var base = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/';
    document.cookie = domain ? base + '; domain=' + domain : base;
  }

  function clearTrackingCookies() {
    try {
      var host = window.location.hostname;
      var domains = [null, host, '.' + host];
      var parts = host.split('.');
      if (parts.length > 2) {
        var root = parts.slice(-2).join('.');
        domains.push(root, '.' + root);
      }
      var cookies = document.cookie ? document.cookie.split(';') : [];
      for (var i = 0; i < cookies.length; i++) {
        var name = cookies[i].split('=')[0].replace(/^\s+|\s+$/g, '');
        if (name.indexOf('_ga') === 0 || name.indexOf('_fbp') === 0) {
          for (var d = 0; d < domains.length; d++) expireCookie(name, domains[d]);
        }
      }
    } catch (e) {}
  }

  function clearPostHogStorage() {
    try {
      var doomed = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf('ph_') === 0) doomed.push(key);
      }
      for (var j = 0; j < doomed.length; j++) localStorage.removeItem(doomed[j]);
    } catch (e) {}
  }

  /* -----------------------------------------------------------------
     7. Public API — powers the banner buttons and the footer
     "Privacy choices" link on every page.
     ----------------------------------------------------------------- */
  var api = {
    grant: function () {
      writeChoice('granted');
      gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
      loadAll();
      removeBanner();
    },
    deny: function () {
      writeChoice('denied');
      /* If anything already loaded this session, tell Google to stop. */
      gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      clearTrackingCookies();
      clearPostHogStorage();
      removeBanner();
    },
    reset: function () {
      clearChoice();
      showBannerWhenReady(); /* any geo — footer "Privacy choices" */
    },
    status: function () {
      var choice = readChoice();
      return choice ? choice.status : null;
    }
  };
  window.sbConsent = api;

  /* -----------------------------------------------------------------
     8. Decision matrix (stored choice always beats geo):
        — stored denied            → nothing loads, no banner
        — stored granted           → consent update + loadAll()
        — no choice, not EEA/UK    → loadAll() immediately, no banner
        — no choice, EEA/UK        → load NOTHING, banner on ready
     ----------------------------------------------------------------- */
  var choice = readChoice();
  if (choice && choice.status === 'denied') {
    /* Respect the denial everywhere. */
  } else if (choice && choice.status === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
    loadAll();
  } else if (isEEAUK()) {
    showBannerWhenReady();
  } else {
    loadAll();
  }

})();

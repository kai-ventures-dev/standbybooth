# Standby Booth website checks

Both suites run in a real browser and block external event requests.
Use the installed Playwright package and Chrome, or set CHROME to a compatible browser executable for the AEO suite.

Serve the repository root, then run:

```sh
python3 -m http.server 8712 --bind 127.0.0.1
node _tests/aeo.verify.js http://127.0.0.1:8712
node _tests/meta-tracking.verify.js http://127.0.0.1:8712
```

The AEO suite checks crawler files, structured data, all 13 visible FAQ answers against JSON-LD, local references, images, mobile and desktop layout, FAQ open/close, theme toggles, and admin demo tabs. Screenshots go to AEO_ARTIFACTS or /tmp/standbybooth-aeo-qa, never the published site. Set AEO_ROOT to test another checkout. The before-handoff red run against a060a8d is retained in fixtures/aeo-before-handoff.log.

## Handoff provenance and factual corrections

The 2026-10-29 rev 4 marketing handoff matched the original homepage byte for byte. Source ZIP SHA-256: c91f6e023db877a5006c1ce38a6a5dd9c41f6f327a3d1eaa985eca092f8998bf.

Two supplied facts were corrected against native-app commit 8e28571 (v1.3.3 build 21), rather than copying stale product documentation:

- QR sharing had been removed in a4d64af, an ancestor of the release. PaywallView.swift lists AirDrop for both Free and Pro; EntitlementService.swift confirms it is the only sharing path.
- Constants.swift permits 1...5 retakes. AfterRecordingTab.swift exposes the host setting, and the free entitlement cap preserves maxReRecords. Copy now says up to 5, as configured by the host.

Keep the visible FAQ and FAQPage JSON-LD identical when editing facts; update llms.txt and all pricing/feature references too. dateModified and sitemap lastmod should reflect the actual content release date.

The _tests folder is excluded by GitHub Pages/Jekyll.

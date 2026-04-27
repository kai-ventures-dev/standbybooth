# 06 · Features — full reference

## Quick map

```
RECORDING            BRANDING              SHARING
└── Camera           └── Logo              └── AirDrop
└── Quality          └── Colors            └── QR codes (Pro)
└── Duration         └── Fonts             └── Photos export
└── Countdown        └── CTA / Thank-you   
└── Extensions       └── Background        STORAGE
└── Mirror                                 └── Photos library
                     PROMPTS / SCRIPTS     └── Local (Pro)
TELEPROMPTER         └── Prompt bank       └── USB-C (Pro)
└── Auto-scroll      └── Auto-rotate       └── Google Drive (coming)
└── Guest scripts    └── Guest tap         
└── Auto pacing      └── Font size         AUTOMATION
                     └── Guest scripts     └── Idle reset
ADMIN                                      └── Re-record
└── PIN              ANALYTICS             └── Auto-save
└── Presets          └── Counters          
└── Test Mode        └── Storage usage     KIOSK
└── Setup Guide      └── Completion rate   └── Brightness lock
                     └── Avg duration      └── Idle disable
                                           └── Guided Access
```

---

## Recording engine

| Feature | Detail | Tier |
|---|---|---|
| **Camera** | AVFoundation. Front camera default. Switchable to rear. | Free |
| **Codec** | H.265/HEVC video, AAC 128kbps audio | Free |
| **Frame rate** | 30fps (60fps on Pro 1080p tier) | Both |
| **Aspect** | 16:9 portrait or landscape (admin-locked) | Both |
| **Quality tiers** | 720p · 1080p · 1080p@60 · 4K | 720p free; rest Pro |
| **Duration** | 10–300s | 60s free; full Pro |
| **Countdown** | 3 / 5 / 10s | 3s free; rest Pro |
| **Time extensions** | +30s × up to 5 | Pro only |
| **Mirror preview** | Selfie-style preview, non-mirrored save | Both |
| **Warning threshold** | 5–30s — when timer turns amber | Both, configurable on Pro |

### How recording actually works
1. `AVCaptureSession` configured at chosen quality.
2. Camera preview attached to a SwiftUI-bridged UIView.
3. On record start: `AVCaptureMovieFileOutput` writes to a **local temp file** in the app sandbox.
4. On record stop OR auto-stop at duration limit: temp file is closed, transitioned to Preview screen.
5. On "Keep It": temp file is **copied** to the configured destination, and metadata sidecar is written.
6. On "Try Again" or "Cancel": temp file is deleted.

**Key invariant:** recordings always write to local temp first, then copy
to external storage. Never write directly to USB / Drive during the
recording itself — the camera pipeline must not block on filesystem I/O
to network or removable media.

---

## Sharing

| Feature | Detail | Tier |
|---|---|---|
| **AirDrop** | Native iOS share sheet → AirDrop. Sends the .mp4 to the guest's phone. | Free |
| **QR code** | Local HTTP server (NWListener / Network framework). Guest scans QR → phone connects to iPad over local WiFi → downloads .mp4. **No internet required.** | Pro |
| **QR expiration** | 1hr / 24hr / 7 days / Never. After expiration the URL 404s. | Pro |

The QR server **only runs while the Thank You screen is active**. It does
not run in background, does not expose anything but the latest recording.
This keeps the iPad's role minimal and reduces attack surface during the
brief window the URL is live.

---

## Storage

See `07-storage.md` for full detail. Summary:

| Destination | Tier | Mechanism |
|---|---|---|
| Photos library | Free | `PHPhotoLibrary` save |
| Local (`/Documents/StandbyBooth/[Event]/[Date]/`) | Pro | `FileManager` |
| USB-C external drive | Pro | `UIDocumentPickerViewController` + security-scoped bookmark |
| Google Drive | 🚧 coming soon | Drive API v3 + Keychain refresh token |

---

## Branding

| Feature | Detail | Tier |
|---|---|---|
| Event Name | shown on Attract + Thank-You screens | Free |
| Event Logo | image upload, displayed on Attract + Thank-You | Pro |
| Background Color | full color picker | Free |
| Background Image | full-bleed image upload, applied across guest flow | Pro |
| Brand Font | 10 typefaces (system + 9 curated) | Free uses system; rest Pro |
| CTA Text | the "Tap to Share Your Story" line on Attract | Free uses default; Pro custom |
| Thank-You Text | the closing line on Screen 7 | Free uses default; Pro custom |

The brand stack is intentionally minimal — Standby Booth doesn't try to be
a full design tool. Picking a logo, a font, a color, and one or two
strings is enough to make a wedding feel branded vs. a corporate launch.

---

## Prompts & scripts

| Feature | Detail | Tier |
|---|---|---|
| Prompt Bank | admin types up to N prompts, ordered, stored in Core Data | Pro |
| Auto-Rotate | prompt fades to next every X seconds (5–60) | Pro |
| Guest-Tap Advance | guest taps the overlay to step prompts | Pro |
| Font Size | S / M / L | Pro |
| Guest Scripts | guest types / pastes / AirDrops their own script | Pro |
| Teleprompter | scrolls upward at speed = `script_length / remaining_seconds` | Pro |
| Pause / Resume | tap teleprompter to pause | Pro |
| Manual scrub | swipe up/down to adjust | Pro |
| Recompute on extension | when guest taps +30s, scroll speed recalculates | Pro |

The teleprompter is the only feature that requires a Pro tier specifically
for **technical reasons** beyond pure feature gating — the speed
calculation is non-trivial and the UI surface is substantial.

---

## Admin / management

| Feature | Detail | Tier |
|---|---|---|
| Admin PIN | 4-digit, default `0000`, must change on first launch | Free |
| Triple-tap entry | top-right corner of any guest screen | Free |
| 5-tab admin panel | Event Setup / Recording / Prompts / After / Storage | Free |
| Setup Guide | first-launch onboarding wizard | Free |
| Test Mode | run guest flow without saving files; includes audio level meter + camera grid overlay | Pro |
| **Presets** | save current config as named JSON; load / duplicate / export / import via Files / AirDrop | Pro |

Presets are the killer Pro feature for **recurring organizers**. A church
saves "Sunday Service," a wedding planner saves "Smith Wedding Reception,"
and switching between events takes 5 seconds.

---

## Analytics (local only)

All analytics are **local on the iPad**. We collect zero telemetry. The
admin sees:

| Metric | Free | Pro |
|---|---|---|
| Total recordings kept | ✓ | ✓ |
| Total recordings started (incl. abandoned) | hidden | ✓ |
| Completion rate (kept ÷ started) | hidden | ✓ |
| Total minutes recorded | hidden | ✓ |
| Average duration | hidden | ✓ |
| Storage used | hidden | ✓ |

The data lives in Core Data. Free users can upgrade and **see the full
history retroactively** — Core Data records every event, free tier just
filters the dashboard's *output*.

---

## Kiosk behavior

When the host taps **"Launch Booth"** in the admin menu:

1. `UIScreen.main.brightness = 1.0` — pegged to maximum
2. `UIApplication.shared.isIdleTimerDisabled = true` — never sleeps
3. `UIAccessibility.requestGuidedAccessSession(enabled: true)` — Guided Access mode (system-level lock)

The guest cannot:
- Swipe up to home
- Swipe down to Control Center
- Triple-tap-and-hold to Sleep
- Use the volume buttons to escape

The host exits Guided Access by triple-clicking the side button + entering
the system passcode → triple-tapping the corner of the app → entering the
admin PIN.

---

## Edge-case handling

| Situation | Behavior |
|---|---|
| Storage full mid-recording | Recording auto-stops, alert displayed, recording preserved as-is |
| USB-C drive disconnected during event | Falls back to local storage, alerts admin |
| Camera permission denied | Setup Guide blocks until granted |
| Microphone permission denied | Setup Guide blocks until granted |
| Local network permission denied | QR sharing degrades to "share via AirDrop" |
| Google Drive token expired *(post-launch)* | Recordings queue locally, retry on reconnect |
| App backgrounded mid-recording | Recording continues (audio session) until guest taps stop or duration hits |
| iPad rotated mid-recording | Recording preserves the orientation it started in (orientation lock advised) |

---

## What's deliberately not built

- **Cloud-hosted account / login.** No accounts. No password. No identity service. Zero PII collection.
- **Cross-iPad sync.** Configs are per-device. AirDrop a preset to share between iPads.
- **Editing / trimming.** Out of scope. Use iMovie or another tool post-event.
- **Watermarks on free.** Free tier is genuinely free; conversion happens via "I want polish," not "I want my watermark removed."
- **Subscription tiers.** $29.99 one-time. Done.
- **Multi-language UI.** English-only at launch. Localizable strings exist; translations don't ship yet.

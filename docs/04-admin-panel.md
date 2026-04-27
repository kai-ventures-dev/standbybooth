# 04 · Admin Panel — five tabs

## Access

The admin panel is hidden behind two gates:

1. **Triple-tap** the top-right corner of the Attract screen *(any screen if guest flow is paused)*.
2. **4-digit PIN** entry. Default `0000`. Forced to be changed on first launch.

Once authenticated, the admin sees a TabView with 5 tabs.

The PIN is stored in Core Data under the device's app sandbox. Lost PIN
recovery requires deleting + reinstalling the app (which clears all data).

## Visual structure

When the user is on the **free tier**, a persistent **"Standby Booth Pro"
upgrade banner** sits above the tab bar on every tab. Tapping it presents
the paywall.

```
┌──────────────────────────────────────────────────────────┐
│  ⓘ Menu          Admin Panel                      Done   │  ← chyron
├──────────────────────────────────────────────────────────┤
│  ▓ Standby Booth Pro · Unlock all features          ›    │  ← banner (free only)
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [tab content]                                           │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  📅 Event   🎥 Recording   💬 Prompts   ✓ After   📦 Storage  │
└──────────────────────────────────────────────────────────┘
```

The chyron menu (⋯) gives access to: **Upgrade to Pro** (free only), Presets, Analytics, Test Mode (Pro), Setup Guide, Privacy Policy, Terms of Use, Launch Booth.

---

## Tab 1 · Event Setup

Maps to the **Attract screen** (Screen 1).

| Field | Type | Free | Pro |
|---|---|---|---|
| Event Name | text | ✓ | ✓ |
| Event Logo | image upload | — | ✓ |
| Background Image | image upload | — | ✓ |
| Background Color | color picker | ✓ | ✓ |
| Brand Font | picker (10 fonts) | system only | ✓ |
| CTA Text | text | default only | ✓ |
| Idle Timeout | slider (15s–120s) | ✓ | ✓ |

`.premiumLocked()` badges with a "Pro" pill appear next to the locked
fields for free users. Tapping a locked field opens the paywall.

---

## Tab 2 · Recording

Maps to **Get Ready** (Screen 3) and **Recording** (Screen 5).

| Field | Type | Free | Pro |
|---|---|---|---|
| Recording Duration | stepper / preset (10–300s) | fixed 60s | ✓ |
| Quick-select duration buttons | 30s · 60s · 90s · 2min · 5min | — | ✓ |
| Video Quality | picker (720p / 1080p / 1080p@60 / 4K) | 720p only | ✓ |
| Camera Position | Front / Rear | ✓ | ✓ |
| Mirror Preview | toggle (default ON) | ✓ | ✓ |
| Countdown Length | 3 / 5 / 10s | 3s only | ✓ |
| Time Warning Threshold | slider (5–30s) | ✓ | ✓ |
| Allow Time Extension | toggle | — | ✓ |
| Max Extensions | stepper (1–5) | — | ✓ |
| Extension Prompt Threshold | slider (5–60s) | — | ✓ |
| Orientation Lock | Any / Portrait / Landscape | ✓ | ✓ |
| Noise Suppression | toggle (currently no-op, "coming soon") | — | 🚧 |

---

## Tab 3 · Prompts & Scripts

Maps to **Script Choice** (Screen 2) and **Recording overlay** (Screen 5).

The whole tab opens with a **free-tier banner** for free users:

> *"Prompt Bank, Guest Scripts, and Teleprompter are Pro features."*  
> [Upgrade to Pro]

| Field | Type | Free | Pro |
|---|---|---|---|
| Enable Prompt Bank | toggle | — | ✓ |
| Prompts | ordered list (add / remove / reorder) | — | ✓ |
| Prompt Advance Mode | Auto-Rotate / Guest Tap | — | ✓ |
| Prompt Interval | slider (5–60s for auto) | — | ✓ |
| Prompt Font Size | S / M / L | — | ✓ |
| Allow Guest Script | toggle | — | ✓ |
| Script Import Methods | multi-select (Type / AirDrop / Paste) | — | ✓ |

---

## Tab 4 · After Recording

Maps to **Preview** (Screen 6) and **Thank You** (Screen 7).

| Field | Type | Free | Pro |
|---|---|---|---|
| Allow Re-Record | toggle (default ON) | ✓ | ✓ |
| Max Re-Records | stepper (1–5, default 3) | ✓ | ✓ |
| Show QR Download | toggle | — | ✓ |
| QR Link Expiration | 1hr / 24hr / 7 days / Never | — | ✓ |
| Allow AirDrop Export | toggle | ✓ | ✓ |
| Thank-You Message | text | default only | ✓ |
| Auto-Reset Delay | slider (5–60s) | ✓ | ✓ |

AirDrop is intentionally **free** — it's the only sharing path the casual host can offer guests without paying.

---

## Tab 5 · Storage

| Field | Type | Free | Pro |
|---|---|---|---|
| Storage Destination | Photos / Local / USB-C / Google Drive (post-launch) | Photos only | ✓ (USB-C, Local) |
| File Naming Template | text with `{EventName}`, `{Date}`, `{Sequence}` tokens | default only | ✓ |
| Metadata Sidecar (.json) | toggle | — | ✓ |
| Storage Capacity Dashboard | view-only | ✓ | ✓ |
| Total Storage Used | computed | ✓ | ✓ |

**File naming template tokens:**
- `{EventName}` — sanitized event name
- `{Date}` — ISO-style date (YYYY-MM-DD)
- `{Sequence}` — zero-padded counter, increments per event
- Free tier locked to: `StandbyBooth_{Date}_{Sequence}.mp4`

---

## Menu (chyron ellipsis ⋯)

The "more" menu in the top-left of the admin chyron.

| Item | Free | Pro | Notes |
|---|---|---|---|
| 👑 Upgrade to Pro | shown | hidden | Only visible to free users. Top of menu, divider below. |
| Presets | — | ✓ | Save / load / duplicate / export / import event configurations |
| Analytics | metrics zeroed | ✓ | Full dashboard for Pro; free sees only "kept count" |
| Test Mode | — | ✓ | Run guest flow without saving files |
| Setup Guide | ✓ | ✓ | First-time onboarding flow |
| Privacy Policy | ✓ | ✓ | Hosted at standbybooth.app/privacy |
| Terms of Use | ✓ | ✓ | Hosted at standbybooth.app/terms |
| **Launch Booth** | ✓ | ✓ | Closes admin panel and configures kiosk (max brightness + Guided Access prompt) |

---

## What happens during "Launch Booth"

1. Admin panel closes.
2. `UIScreen.main.brightness = 1.0` — max brightness.
3. `UIApplication.shared.isIdleTimerDisabled = true` — never sleeps.
4. `UIAccessibility.requestGuidedAccessSession(enabled: true)` — Guided Access locks the iPad to the app.
5. The Attract screen is now the only thing the guest can interact with.
6. Triple-tap top-right → PIN → admin panel re-opens. Guided Access disables automatically when admin panel is shown.

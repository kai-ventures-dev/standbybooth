# 05 · Free vs Pro — every gate, every cap

## At a glance

```
        Free                                     Pro Unlock — $29.99
        Forever                                  One-time. No subscription.
```

The tier matrix below is the **single source of truth**. The same matrix
appears in three places in the codebase:

- `StandbyBooth/StandbyBooth/Views/Paywall/PaywallView.swift` — the in-app paywall view
- `StandbyBooth/StandbyBooth/Services/EntitlementService.swift` — `applyCaps(to:)` enforces every cap
- This file (`docs/05-tiers.md`) — design / marketing reference

Any change to tier definitions must update all three.

---

## The 10 comparison rows (verbatim from the paywall)

| Feature | Free | Pro |
|---|---|---|
| Recording length | 60s | Up to 5 min |
| Video quality | 720p | Up to 4K |
| Time extensions | — | +30s × 5 |
| Custom branding | — | Logo, fonts, colors |
| Storage | Photos library | + Local · USB-C |
| Sharing | AirDrop | + QR codes |
| Prompts & scripts | — | Full teleprompter |
| Analytics | Count only | Full dashboard |
| Presets | — | Save / load / share |
| Test mode | — | Included |

---

## Free tier — full spec

> Designed to be **fully usable for a single casual home event**. Nothing
> feels broken. There is no watermark.

### Recording
- 720p @ 30fps, fixed
- Duration: 60s, fixed
- Countdown: 3s, fixed
- Front OR rear camera (admin picks once)
- No time extensions
- Mirror Preview: toggleable

### Guest flow
- All 7 screens behave normally
- Up to 3 re-records per guest
- Script Choice screen auto-skipped (no prompts, no teleprompter, no script entry)

### Branding / event setup
- Event name (text)
- System font only
- Solid background color picker (no logo, no background image upload)
- Default CTA text (cannot customize)
- Default thank-you message (cannot customize)

### Storage
- Photos library only
- Default filename: `StandbyBooth_{Date}_{Sequence}.mp4`
- No metadata sidecar (`.json`)

### Sharing
- AirDrop only (intentional — AirDrop is the universal "send to my phone" path)

### Admin
- 4-digit PIN + admin panel (required, not gated — kiosk safety)
- Guided Access launch wizard
- Minimal analytics: total kept count only

---

## Pro Unlock — full spec ($29.99 one-time)

> Designed for organizers who run **multiple events** and care about
> brand consistency, scale, and reliability.

### Unlocked at launch

#### Recording
- ✓ All quality tiers: 720p, 1080p @ 30fps, 1080p @ 60fps, 4K @ 30fps
- ✓ Custom recording duration (10–300s, with quick-select buttons at 30 / 60 / 90s / 2min / 5min)
- ✓ Countdown: 3 / 5 / 10s
- ✓ Time extensions: +30s × up to 5 (admin-configurable max)
- ✓ Configurable warning threshold (5–30s)
- ✓ Configurable extension-prompt threshold (5–60s)
- ✓ Orientation lock (any / portrait / landscape)

#### Guest flow
- ✓ Script Choice screen (when toggled)
- ✓ Three script-entry methods: Type, AirDrop, Paste
- ✓ Prompt Bank with auto-rotate or guest-tap-advance
- ✓ Prompt font size (S / M / L)
- ✓ Teleprompter mode for guest scripts (auto-scrolls to fit remaining time)

#### Branding
- ✓ Logo upload
- ✓ Background image upload
- ✓ 10 brand fonts
- ✓ Custom CTA text
- ✓ Custom thank-you message

#### Storage
- ✓ Local Documents folder (visible in Files → On My iPad)
- ✓ USB-C external drive (security-scoped bookmarks)
- ✓ Custom file naming template with tokens
- ✓ Metadata sidecar (`.json` per recording with timestamp, duration, prompts shown, sequence number, extensions used, quality setting)

#### Sharing
- ✓ QR code download (local NWListener server, no internet required)
- ✓ QR expiration options (1hr / 24hr / 7 days / Never)

#### Admin
- ✓ Full analytics dashboard (total recordings, total minutes, completion rate, average duration, storage used)
- ✓ Presets — save / load / duplicate / export / import named configs as JSON
- ✓ Test Mode — run the guest flow end-to-end without saving files

#### Capacity
- ✓ Unlimited recordings per event

### Coming soon to Pro (post-launch)

These are marketed on the paywall as **"Coming Soon — included with Pro at no extra cost when released."**

- 🚧 **Google Drive** — admin links a folder, guests' "Keep It" auto-uploads with offline queue + retry
- 🚧 **Noise suppression** — proper Voice Processing wiring (the toggle exists but is currently a no-op until `CameraService` is updated)

---

## How tiering is enforced (technical)

The architecture uses a **single chokepoint** to prevent gating bugs:

```swift
// AdminViewModel
var effectiveConfig: EventConfigSnapshot {
    EntitlementService.shared.applyCaps(to: config)
}
```

Every non-admin consumer (RecordingViewModel, GuestFlowViewModel,
TeleprompterViewModel, storage services) reads `effectiveConfig`, never
the raw `config`. Admin panel reads raw `config` so it can show "upgrade
to unlock" cues; everywhere else the capping is automatic.

`applyCaps(to:)` is idempotent: applying it twice produces the same result.
Premium users pass through unchanged.

Behavior gates that aren't snapshot-driven (QR server start, preset
operations, test mode) check `EntitlementService.shared.isPremium` directly
and call `requestPaywall()` to surface the upgrade flow.

---

## Why $29.99 one-time

We considered:
- **$9.99 one-time** — too cheap to signal pro-grade quality. Race-to-bottom.
- **$49 one-time** — review data on similar event tools shows $30 is the upper bound for "buy without thinking" on event-utility apps.
- **$9/mo subscription** — usage is spiky (one event, then dormant 4 months). Subs churn brutally on that pattern.
- **$59/yr subscription** — same problem, plus subscription friction is high in the App Store.

$29.99 one-time:
- Sits below the "consider it" threshold for pros ($30)
- Feels generous to recurring organizers (one event recoups it)
- Skips subscription churn entirely
- Matches the spiky usage pattern

---

## Founding-user grandfather

**TestFlight users from before the IAP build are grandfathered into Pro
free.** A Keychain flag (`foundingUser=true`) is written by the pre-IAP
TestFlight build. The IAP build reads the flag and treats those devices
as Premium without a real StoreKit transaction.

This rewards early testers and gives us social currency in the indie
event-tech community.

The flag survives uninstall (Keychain persistence with
`kSecAttrAccessibleAfterFirstUnlock`).

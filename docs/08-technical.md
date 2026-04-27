# 08 · Technical — architecture & constraints

> This document is **architectural context for design**, not deployment
> docs. The goal is for a designer (human or AI) to understand what's
> easy, what's hard, and where flexibility actually lives.

## Stack

| Layer | Tech |
|---|---|
| **Language** | Swift 5.9+ |
| **UI** | SwiftUI |
| **Concurrency** | `@MainActor` default, `@Observable` for VMs, Swift 6.2 strict isolation |
| **Camera / Video** | AVFoundation (`AVCaptureSession`, `AVCaptureMovieFileOutput`) |
| **Persistence** | Core Data (`EventConfigEntity`, `RecordingRecordEntity`, `PresetEntity`, `AnalyticsRecordEntity`) |
| **IAP** | StoreKit 2 (`Transaction.updates`, `Product.products(for:)`) |
| **Local server** | `NWListener` from the Network framework (no third-party HTTP server) |
| **Sharing** | `UIActivityViewController` for AirDrop |
| **Storage (USB-C)** | `UIDocumentPickerViewController` + security-scoped bookmarks |
| **Storage (Drive, post-launch)** | GoogleSignIn SDK + GoogleAPIClientForREST |
| **Local-only telemetry** | Zero. No analytics SDK. |

## Pattern

**MVVM** — SwiftUI Views → `@Observable` ViewModels → Core Data Models.

- Views are dumb. They render state and dispatch user intent.
- ViewModels own state mutation.
- Models are Core Data entities with `+CoreData.swift` extensions for `toSnapshot()` / `apply(_:)` round-trips with plain Swift structs.
- Plain structs (`EventConfigSnapshot`, `Preset`, `RecordingMetadata`) flow through the app for type safety and Codable export.

## Target hardware

| Spec | Required | Recommended |
|---|---|---|
| Device | iPad (6th gen+) | iPad Air 5+ or iPad Pro |
| OS | iPadOS 17 | iPadOS 18 |
| Storage | 64 GB | 256 GB+ for 4K events |
| Camera | Front (TrueDepth optional) | Front + rear |

**Why iPad-only:** the app's lighting strategy (white margins as fill
light) requires a screen at least as large as a guest's face. iPhone is
too small. Mac is too large. iPad is the magic size.

## Critical constraints

These constraints drive UI/UX decisions; design must respect them.

### 1. The camera pipeline cannot block
- Recordings always write to **local temp file first**, then copy to the configured destination.
- Cloud uploads happen post-recording, never during.
- USB-C writes also happen post-recording (avoid stalled file system mid-record).

### 2. Audio session is fixed
- Audio category: `.playAndRecord` with `.videoRecording` mode.
- This intentionally precludes some features (e.g., the noise suppression toggle is currently a no-op until proper Voice Processing wiring lands; that's why it's marketed as "coming soon").

### 3. The screen brightness is part of the product
- `UIScreen.main.brightness = 1.0` is locked while in kiosk.
- Any UI that puts dark content in the Recording screen's white margins violates the lighting design.
- This is enforced in `WhiteMarginLayout` — the SwiftUI container for camera screens.

### 4. Guided Access is the kiosk
- We use Apple's system-level Guided Access, not a custom kiosk hack.
- Pro: rock-solid, built into iPadOS.
- Con: requires the host to enable Guided Access in iPadOS Settings once, and triple-click the side button + enter system passcode to exit.

### 5. The PIN gate is local-only
- 4-digit PIN, stored in Core Data on this device.
- No "forgot PIN" flow — by design, since there's no account / email / recovery email.
- Lost-PIN recovery = delete and reinstall the app.

### 6. StoreKit Test config in development
- The repo includes `StandbyBooth.storekit` for synthetic purchases during development.
- Wired into the shared Xcode scheme on Run + Test actions only. **ArchiveAction has no StoreKit config reference** — App Store builds query the real App Store.
- This is enforced via the scheme XML; see `RELEASE_CHECKLIST.md` in the iOS repo.

## Data model (high-level)

```
EventConfigEntity            ← persisted admin settings (1 row)
├── eventName, logo, font, colors, CTA…
├── recordingDuration, quality, countdown, extensions…
├── prompts (JSON), allowGuestScript, advanceMode…
├── allowReRecord, maxReRecords, showQRDownload, thankYouMessage…
├── storageDestination, fileNamingTemplate, metadataSidecarEnabled
├── adminPIN, pinHasBeenChanged
└── paywallDismissedAt   ← Date? · UX-state for re-engagement cooldown

PresetEntity                 ← saved configurations (N rows)
├── id, name, createdAt, updatedAt
└── configJSON (full EventConfigSnapshot serialized)

RecordingRecordEntity        ← 1 row per recording (kept or abandoned)
├── id, timestamp, eventName, duration
├── kept (Bool), uploaded (Bool)
├── qualitySetting, sequenceNumber, extensionsUsed
└── fileURL (path or remote URL)

AnalyticsRecordEntity        ← rolling counters
└── totalRecordings, totalStarted, totalMinutes,
    averageDuration, completionRate, storageUsedBytes
```

## State / entitlement model

```
EntitlementService.shared (@MainActor @Observable)
├── isPremium: Bool   ← derived from sources, in priority order:
│   1. Transaction.currentEntitlements (StoreKit)
│   2. Founding-user Keychain flag (grandfathered TestFlight users)
│   3. .none (free tier)
├── paywallRequested: Bool   ← gates flip this; AppCoordinator presents
├── refresh()         ← idempotent re-resolve
├── applyCaps(_:)     ← single chokepoint for Pro feature gating
└── shouldReEngageInAdmin(config:) → Bool   ← 24h re-engagement check
```

**Entitlement sources** (highest priority first):
1. `Transaction.currentEntitlements` for the Pro Unlock product
2. Founding-user Keychain flag (grandfather)
3. Default: `false`

State is cached to Keychain so cold launches resolve synchronously without
flicker. The `Transaction.updates` listener keeps state in sync with
refunds, family-sharing changes, and cross-device purchases.

## Paywall presentation

The paywall is a SwiftUI `.sheet` triggered by setting
`EntitlementService.shared.paywallRequested = true`. Two presentation
contexts:

1. **Guest-flow context** — sheet on AppCoordinator, fires on first-launch (after PIN setup).
2. **Admin context** — separate sheet inside the admin panel's NavigationStack (because `.fullScreenCover` for admin would otherwise occlude AppCoordinator's sheet).

Triggers:
- First-launch (after PIN setup, idempotent on `paywallDismissedAt`)
- 24-hour re-engagement when admin reopens
- Toolbar "Upgrade to Pro" button
- Persistent banner above admin tabs
- Ellipsis menu "Upgrade to Pro" entry
- Any `.premiumLocked()` Pro badge tap

`onDismiss` uniformly resets `paywallRequested` and writes
`paywallDismissedAt = .now` if still free.

## Test posture

- **93/93 sync tests pass** as of build 3
- 6 PaywallView tests deferred due to a Swift 6.2 toolchain malloc bug (`@Observable @MainActor` + async + singleton mutation = double-free at `0x2610eeb40`)
- Manual coverage via `IAP_PAYWALL_SMOKE.md` (paywall + admin-context triggers)
- All tests use in-memory Core Data store — no real DB or network in unit tests

## Known limitations

| Limitation | Reason | Plan |
|---|---|---|
| English-only UI | Translation cost > value at v1 | Localize post-launch if traction warrants |
| No iCloud config sync | No account system | AirDrop / Files preset import is the workaround |
| Noise suppression no-op | AVFoundation `AVAudioSessionMode.videoRecording` doesn't enable Voice Processing | Wire properly post-launch; marketed as "coming soon" |
| Google Drive not at launch | OAuth + offline queue + retry is its own product effort | Ship as Pro post-launch update, no upcharge |
| 6 PaywallView tests blocked | Swift 6.2 toolchain malloc bug | Re-enable when Apple ships toolchain fix |

---

## What design CAN move freely

- Visual design of every screen — no layout is hardcoded beyond the white-margin invariant on Recording.
- Copy on every string (see `10-copy.md`).
- Color palette, typography, motion (see `09-brand.md`).
- Onboarding flow (Setup Guide is replaceable).
- Paywall layout (the data — features, price, comparison rows — is fixed by `05-tiers.md`, but the visual treatment is open).
- Admin-panel chrome / tab styling.

## What design CANNOT change

- The 7 screens of the guest flow (the order is the product).
- The white-margin lighting on Recording.
- Mirrored preview / non-mirrored save.
- The "Keep It / Try Again / Cancel" three-button preview pattern.
- The PIN gate for admin entry.
- Storage destinations (Photos / Local / USB-C / Drive).
- The free-vs-Pro tier matrix without a product decision.

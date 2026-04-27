# Standby Booth — design & product reference

This `docs/` folder is the source of truth for what Standby Booth **is**,
who it's **for**, and how it **behaves**. Read top-to-bottom for full
context, or skip to the section you need.

It's structured for an AI design tool (Claude design / artifacts) to ingest
the full picture of the product before producing derivative designs.

## Reading order

| File | Purpose |
|---|---|
| [01-product.md](./01-product.md) | Vision, design principles, what it is, what it isn't |
| [02-personas.md](./02-personas.md) | Who pays, why, the "willingness-to-pay" framework |
| [03-guest-flow.md](./03-guest-flow.md) | The 7-screen guest experience, screen by screen |
| [04-admin-panel.md](./04-admin-panel.md) | The 5 admin tabs, every setting, every control |
| [05-tiers.md](./05-tiers.md) | Free vs Pro — every gate, every cap |
| [06-features.md](./06-features.md) | Full feature reference (sharing, presets, analytics, etc.) |
| [07-storage.md](./07-storage.md) | Storage destinations, file format, sidecar metadata |
| [08-technical.md](./08-technical.md) | Architecture, constraints, edge cases |
| [09-brand.md](./09-brand.md) | Voice, color, typography, motion language |
| [10-copy.md](./10-copy.md) | Every user-facing string in the app |

## At a glance

- **Product:** native iPadOS app that turns an iPad into a self-service video booth
- **Platform:** iPadOS 17+ (Swift / SwiftUI)
- **Backend:** none. Fully on-device. No cloud, no servers.
- **Pricing:** free tier + one-time **$29.99** Pro Unlock (non-consumable IAP)
- **Distribution:** App Store (currently TestFlight beta · build 3)
- **Bundle ID:** `VivariumFilm.ConfessionBooth` *(pre-rename, kept for TestFlight continuity)*
- **Display name:** Standby Booth
- **Status:** TestFlight beta as of 2026-04. App Store review pending.

## The one-paragraph version

Standby Booth runs entirely on an iPad. The host configures branding,
prompts, recording length, and storage destination once. They lock the
device into kiosk mode and walk away. Guests walk up, tap to record a
video, review it, and walk away — they never see settings or files. At the
end of the event, the host comes back to a folder full of clips on their
iPad, USB-C drive, or Photos library. Free tier handles a casual home
event. Pro tier ($29.99 one-time) unlocks branding, 4K, USB-C, presets,
analytics, and everything a professional vendor needs.

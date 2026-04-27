# 10 · Copy — every user-facing string

> Single source of truth for all user-facing copy. If a string here
> differs from the codebase, **the codebase is canonical** for the iOS
> app and **this file is canonical** for the website.

---

## Marketing site (the landing page)

### Top chyron

| Element | Copy |
|---|---|
| Brand | Standby Booth |
| Status pill | TESTFLIGHT BETA · BUILD 3 |
| CTA | Request access → |

### Hero

| Element | Copy |
|---|---|
| Tally label | ON AIR · STANDBY BOOTH |
| Headline (italics on the second clause) | Your event<br />*records itself.* |
| Lede | An iPad becomes a self-service video booth. Set it up in sixty seconds. Walk away. Let it run. |
| CTA primary | Request TestFlight access |
| CTA secondary | How it works |
| Foot | iPadOS 17+ · $29.99 one-time · No subscription |
| Art timecode (decorative) | REC 00:00:42:14 |

### Stats strip

`60s — Setup` · `1080p / 4K — Capture` · `7 — Guest screens` · `0 — Servers` · `100% — On-device`

### Section 01 · The product

| Element | Copy |
|---|---|
| Eyebrow | § 01 · The product |
| Display headline | It's a *recording booth* that doesn't need a person. |
| Body para 1 | Standby Booth runs entirely on the iPad. No backend. No cloud. No setup beyond plugging in. |
| Body para 2 | The host configures the event once — branding, prompts, recording length, storage destination — then locks the device into a kiosk and walks away. |
| Body para 3 | The guest tap-records-reviews. Files save to Photos, a local folder, a USB-C drive, or share over AirDrop and QR. The host comes back to a folder full of clips. |

### Section 02 · Guest flow

| Element | Copy |
|---|---|
| Eyebrow | § 02 · Guest flow |
| Headline | Seven screens. *One path.* |
| Sub | Designed so the guest never needs instructions, and the host never needs to intervene. |
| Step labels | 01 Attract · 02 Script choice · 03 Get ready · 04 Countdown · 05 Recording · 06 Preview · 07 Thank you |
| Step 01 microcopy | Tap to share your story |
| Step 02 microcopy | — or — / Use a prompt / Speak freely |
| Step 03 microcopy | Tap when ready |
| Step 04 microcopy | 3 (countdown numeral) |
| Step 05 microcopy | REC 00:42 |
| Step 06 microcopy | Keep · Retry · Cancel |
| Step 07 microcopy | Thank you. |

### Section 03 · Free vs Pro

| Element | Copy |
|---|---|
| Eyebrow | § 03 · Free & Pro |
| Display headline | *$29.99.* Once. |
| Sub | One-time purchase. No subscription. Yours forever. Free tier covers the basics; Pro covers events you charge for. |
| Coming soon footer | Coming soon to Pro · Google Drive · Noise suppression |

The 10 comparison rows are verbatim from `05-tiers.md`.

### Section 04 · Audience

| Element | Copy |
|---|---|
| Eyebrow | § 04 · Built for |
| Headline | People who run *real events.* |
| Event planners | Add a guest-message corner without booking a video crew. Configure once in the morning, walk away by lunch. |
| Wedding videographers | Sell it as an add-on. The iPad pays for itself by the third reception. |
| Brand activations | Branded UGC at conferences and pop-ups. Files land where you tell them — Photos, USB-C, your laptop. |

### Access CTA

| Element | Copy |
|---|---|
| Tally | STANDBY |
| Headline | Join the *TestFlight* beta. |
| Sub | We'll send the invite when build 3 is live. We read every reply. |
| Primary CTA | Email us |
| Secondary CTA | Copy address |
| Email | markintheloop@kaiventures.tech |

### Footer

| Element | Copy |
|---|---|
| Brand | Standby Booth |
| Meta | © 2026 Kai Ventures · Made on a Mac, with care. |
| Links | Privacy · Terms |

---

## iOS app — guest flow strings

### Screen 1 · Attract
| Element | Default copy |
|---|---|
| CTA | Tap to Share Your Story *(admin can override on Pro)* |
| Pulsing animation copy | (the CTA itself pulses) |

### Screen 2 · Script choice
| Element | Copy |
|---|---|
| Header | Choose how you'd like to share |
| Option 1 | Just Start Recording |
| Option 2 | Bring Your Own Script |
| Option 3 | Use Guided Prompts |

### Screen 2a · Script entry sub-screen
| Element | Copy |
|---|---|
| Header | Type, AirDrop, or paste your script |
| AirDrop instructions | This iPad is `[AirDropName]`. Send your script from your phone via AirDrop. |
| Paste button | Paste from clipboard |
| Continue button | Ready to Record |

### Screen 3 · Get ready
| Element | Copy |
|---|---|
| Top instruction | Tap the button when you're ready |

### Screen 4 · Countdown
| Element | Copy |
|---|---|
| Numerals | 3 · 2 · 1 |

### Screen 5 · Recording
| Element | Copy |
|---|---|
| Extension button | +30s |
| Stop button (icon-only) | (none — icon) |

### Screen 6 · Preview
| Element | Copy |
|---|---|
| Keep | Keep It ✓ |
| Retry | Try Again ↺ |
| Cancel | Cancel ✗ |
| Counter | Retakes remaining: `[N]` |

### Screen 7 · Thank you
| Element | Default copy |
|---|---|
| Message | Thank you! Your story has been saved. *(admin override on Pro)* |
| QR caption | Scan to download your video |
| AirDrop button | Send via AirDrop |
| Auto-reset hint | Returning to start in `[N]`s |

---

## iOS app — admin chrome

### Top chyron
| Element | Copy |
|---|---|
| Title | Admin Panel |
| Done button | Done |
| Upgrade button (free only) | Upgrade to Pro |

### Banner (free only)
| Element | Copy |
|---|---|
| Title | Standby Booth Pro |
| Sub | Unlock all features |

### Ellipsis menu
| Item | Copy |
|---|---|
| Upgrade (free only) | Upgrade to Pro |
| Presets | Presets |
| Analytics | Analytics |
| Test Mode | Test Mode |
| Setup Guide | Setup Guide |
| Privacy | Privacy Policy |
| Terms | Terms of Use |
| Launch | Launch Booth |

### Tabs
| Tab | Copy |
|---|---|
| 1 | Event Setup |
| 2 | Recording |
| 3 | Prompts |
| 4 | After Recording |
| 5 | Storage |

### Locked feature badges
| Element | Copy |
|---|---|
| Pill text | Pro |
| Pill icon | lock.fill |

---

## iOS app — paywall (PaywallView)

| Element | Copy |
|---|---|
| Title | Standby Booth Pro |
| Sub | Unlock the full event toolkit |
| Price | $29.99 (from StoreKit) |
| Price tagline | One-time purchase · No subscription |
| Comparison column 1 header | Feature |
| Comparison column 2 header | Free |
| Comparison column 3 header | Pro |
| Comparison rows | (verbatim 10 rows from `05-tiers.md`) |
| Coming soon header | Coming Soon |
| Coming soon item 1 | Google Drive — coming soon |
| Coming soon item 2 | Noise suppression — coming soon |
| Coming soon footer | Included with Pro at no extra cost when released. |
| Primary button | Unlock Pro · $29.99 |
| Secondary button | Continue with Free |
| Restore button | Restore Purchases |
| Legal links | Terms of Use · Privacy Policy |

### Paywall errors
| Trigger | Copy |
|---|---|
| Load failure | Couldn't load Pro Unlock. Check your connection and try again. |
| Purchase generic failure | Purchase didn't complete. Please try again. |
| Restore w/ no purchases | No previous purchases found on this Apple ID. |
| Purchase exception | Purchase failed: `[error.localizedDescription]` |
| Restore exception | Couldn't restore purchases: `[error.localizedDescription]` |

---

## Voice rules summary

- **No exclamation marks** outside the existing "Thank you!" string.
- **No emoji in user-facing copy** except the existing checkmark/circle/cross on Preview buttons.
- **Sentences end with periods.** Even short ones.
- **Use "you" sparingly.** Address the host or guest by their action ("tap," "record," "set up"), not as a person.
- **Numbers stay numerals.** "60s" not "sixty seconds" (one exception: hero lede uses "sixty seconds" for editorial cadence).

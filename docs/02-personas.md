# 02 · Personas — who pays, why

## The three archetypes

### A · Casual Host
**Context:** one party / wedding / birthday / housewarming. DIY-er. May
not own a tripod. Has an iPad.

**Willingness to pay:** $0–$10. Will spend hours configuring software for
free, will not pay $30 for a single use.

**What they need:** record, keep video, share easily. No branding. No
complicated setup.

**Quote (synthesized from research):** *"I just want guests to leave a
short message at our wedding without me having to ask them to film it on
their phone."*

**Tier match:** Free tier covers them. 60-second clips, 720p, AirDrop
out, save to Photos. Done.

---

### B · Recurring Organizer
**Context:** runs a church, club, school, small wedding-planning shop.
Hosts events monthly. Same iPad, different events.

**Willingness to pay:** $20–$50 one-time. Will pay if it saves them
re-configuring everything next time.

**What they need:** branding (their org logo), presets ("Sunday Service,"
"Youth Group Camp"), reliability across many events, longer recording for
testimonials.

**Quote:** *"Last quarter we did 14 events. I had a different volunteer
running the iPad each time. I need to set it up once and have it just
work."*

**Tier match:** Pro Unlock. Specifically wins on **presets**, branding,
and longer recording. The $29.99 amortizes across the first month of use.

---

### C · Pro / Rental Co.
**Context:** professional photo-booth rental, event production agency,
brand-activation team. Charges clients $1500+ per event. iPad is one of
their tools.

**Willingness to pay:** $30–$100 one-time, gladly. Will pay $79/month if
the value is real (we don't offer a subscription though).

**What they need:** **everything**. 4K, USB-C export to client laptops,
custom branding per client, analytics for client reports, file naming
templates for billing reconciliation.

**Quote:** *"Each client wants their own logo on the screen and the files
named with their event tag. I need to swap configs in 60 seconds between
load-in and doors."*

**Tier match:** Pro Unlock. Specifically wins on **branding**,
**USB-C**, **file naming templates**, **metadata sidecar**, and
**analytics dashboard** for client deliverables.

---

## The willingness-to-pay framework

The pricing decision (one-time $29.99 instead of subscription) was driven
by **usage shape**:

> Standby Booth is **spiky**. A user runs one event, then doesn't open
> the app for 4 months. Subscriptions churn brutally on that pattern.
> One-time IAP matches it.

The free tier is **genuinely useful**, not crippleware:
- 60-second recordings (enough for a guest message)
- 720p (looks fine on phones, which is how guests view their own clips)
- Photos library (the host can find them)
- AirDrop sharing (works on every iPhone)

We **deliberately don't watermark** free exports. A casual host who never
upgrades still gets clean videos. The reason is twofold:
1. Apple's review guidelines push back on overly crippled free tiers.
2. We'd rather convert via "I want the polish" than "I'm trapped."

---

## Anti-personas (people we are NOT building for)

- **Single-user content creator** — use the iPad's Camera app + iMovie.
- **Live broadcaster / streamer** — use Wirecast / OBS.
- **Privacy-paranoid event** — even though we're zero-backend, an event
  with explicit confidentiality requirements (HIPAA, attorney-client) is
  not our use case. The recordings live in cleartext on the host's iPad.
- **Multi-camera production** — single-iPad product. No director tools.
- **Photo-only events** — we capture audio + video. There's no
  still-photo mode.

---

## What the product does NOT optimize for

- **Onboarding speed for the guest.** The guest's first interaction is
  always supervised by the host (who set things up) or by physical
  affordances (tap-to-start screen). No 5-step tutorial.
- **Discoverability of advanced features.** The admin panel is dense on
  purpose. The host has time to read it. The guest never sees it.
- **Cross-device handoff.** No iCloud sync of configs. The host imports
  presets via Files / AirDrop if they own multiple iPads.
- **Multi-language UI.** English-only at launch. Localizable strings are
  in the codebase but no translations shipped yet.

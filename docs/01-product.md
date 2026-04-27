# 01 · Product — vision & principles

## What it is

A native iPadOS app that turns an iPad into a **self-service video booth
for events**. Think of an audio confession booth at a wedding, a guestbook
that records video instead of writing, or a brand-activation kiosk at a
conference — but designed so the iPad runs unattended for hours and the
host doesn't have to stand next to it.

## The two roles

| Role | Where they live | What they do |
|---|---|---|
| **Admin (host)** | The 5-tab admin panel | Configure once before the event. Walk away. Retrieve recordings after. |
| **Guest** | The 7-screen guest flow | Walk up. Record. Review. Walk away. Never sees settings, never sees files. |

The roles never overlap. There is no "guest mode" toggle the host has to
remember to flip. The guest physically cannot reach the admin without
triple-tapping a hidden corner and entering a 4-digit PIN.

## Three immovable design principles

### 1. Zero backend
No server, no cloud we operate, no telemetry. Storage is the host's iPad,
their USB-C drive, their Photos library, or *(post-launch)* their personal
Google Drive. We never see the videos. We don't even know the recordings
exist.

This is a privacy posture and a reliability posture. No outage on our side
can break someone's wedding.

### 2. The screen IS the lighting
During recording, the camera preview occupies the **center ~70% of the
screen**, and the **surrounding margins are solid white at maximum
brightness**. This isn't decoration — the iPad becomes a soft fill light
on the guest's face. A standard iPad Pro at full brightness is a usable
key light at 2–3 feet.

This is why the app refuses to put dark backgrounds, gradients, or chrome
in the margin during recording. The white border is functional, not
aesthetic.

### 3. Every guest feature is an admin toggle
If a guest can see it, the admin can disable, customize, or hide it.
Prompts, scripts, QR sharing, AirDrop, re-record, the thank-you message —
all toggleable. There is nothing the guest experiences that the admin
doesn't control.

This is enforced by routing every guest-facing read through
`AdminViewModel.effectiveConfig` — a Premium-aware capped snapshot. There
is no way for a guest to see an "unlocked" feature the host didn't pay for.

## What it isn't

- Not a generic camera app. The whole flow is event-context-bound.
- Not a creative video editor. Recording → preview → keep/discard. That's it.
- Not a livestream tool. Recordings are local files.
- Not a social network. We collect zero data, post nowhere.
- Not subscription software. One-time $29.99 IAP. No monthly anything.

## The "one event, one iPad" test

The product fits whenever one of these is true:
- A host has one iPad and an event with multiple guests.
- The host wants captured video without hiring a videographer.
- The host wants a turnkey setup they can deploy and walk away from.

It doesn't fit:
- Single-user filming (use the stock Camera app).
- Multi-camera productions (use a director's tool).
- Live broadcast (use Wirecast / OBS / Larix).

## What success looks like

- A wedding guest walks up to the iPad, taps once, sees themselves on the
  screen with a soft white glow, hits record, records a 30-second message
  for the bride and groom, taps "Keep It," and walks away.
- The host comes back at midnight, taps the corner three times, enters the
  PIN, opens Files → "On My iPad → Standby Booth → Smith-Wedding," and has
  ~80 video files ready to airdrop to their MacBook.
- The host closes the iPad and never thinks about the app until the next
  event four months later.

## Non-goals (deliberately not built)

- Cloud sync we operate (privacy + reliability)
- Account system (no signups, no login)
- Real-time collaboration (single-iPad product)
- Editing / trimming (use the host's normal tools)
- Watermarks on free-tier exports (free is not crippleware)
- Social-share features (e.g., post to Instagram). Would invite policy / data complexity for marginal value.

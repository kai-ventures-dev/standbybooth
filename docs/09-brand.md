# 09 · Brand — voice, color, type, motion

This is the **design system reference** for both the iOS app and the
landing page. The two should feel like the same brand without being
visually identical (an app is an app; a website is a website).

## Brand essence

> **Standby Booth is an instrument, not an app.**

It feels closer to a piece of pro audio gear or a film studio's
intercom panel than to a consumer-friendly SaaS. The aesthetic is
**editorial broadcast** — restrained, technical, slightly retro. It
references the visual language of:

- Audio post-production studios (TC Electronic, Universal Audio)
- Film slate / clapboard typography
- Broadcast lower-thirds and tally lights
- Editorial magazine layouts (Type Director's Club, Architectural Digest)

It explicitly avoids:

- The pastel-gradient SaaS look
- "Friendly app" rounded everything
- Glassmorphism / overproduced 3D
- Generic geometric sans + blue gradient combos
- Whatever Linear and Notion were doing in 2024

---

## Voice

**Calm, technical, confident, slightly understated.** Not playful.
Not corporate. Definitely not chirpy.

Compare:

> ❌ "Your event, beautifully captured! ✨"  
> ✅ "Your event records itself."

> ❌ "Hey there! Tap below to start your amazing video!"  
> ✅ "Tap to share your story."

> ❌ "Oh no, recording failed. Don't worry, try again!"  
> ✅ "Recording didn't save. Try again."

**Words to use:** event, host, guest, capture, record, preview, kiosk, booth, run, set up, ship, tally.

**Words to avoid:** awesome, magical, amazing, beautiful, simply, just, quickly, easily, leverage, unlock (except for "Unlock Pro").

**Sentences are short.** Most copy fits on one line. Periods, not exclamation marks. The product takes itself seriously because the host is taking a real event seriously.

---

## Logo / mark

The icon is a **dark metallic camera shutter with an audio waveform
overlay**. It exists at 1024 × 1024 in both the iOS app and the website.

When small, the icon should be paired with the wordmark **"Standby Booth"**
set in the body font (Geist on the website; system font in the iOS app).

Never:
- Crop the icon to a circle outside iOS's automatic round-rect mask
- Recolor the icon (it's deliberately desaturated)
- Place the icon on a non-dark background without padding

---

## Color system

### Primary palette (dark — the default)

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0E0F11` | Page background |
| `--steel` | `#1A1B1E` | Card / panel surface |
| `--steel-2` | `#26282C` | Hairline borders |
| `--steel-3` | `#34363B` | Pill outlines |
| `--smoke` | `#9A9B9F` | Secondary text |
| `--bone` | `#E8E4DA` | Primary text on dark |
| `--bone-2` | `#C9C4B8` | Body text on dark |

### Light spread (for the magazine moment)

| Token | Hex | Usage |
|---|---|---|
| `--paper` | `#F5F1E8` | Warm off-white background — the pricing section |
| `--ink` | `#0E0F11` | Primary text on light |
| `#4a4946` | — | Secondary text on light |

### The accent

| Token | Hex | Usage |
|---|---|---|
| `--tally` | `#E8503A` | THE accent. Used like a director's marker. |
| `--tally-2` | `#FF8463` | Hover state |
| `--tally-soft` | `rgba(232, 80, 58, 0.12)` | Subtle highlights |

**Tally red is sacred.** It only appears on:
- The pulsing tally dot ("ON AIR" indicator)
- The price ($29.99 in the pricing section)
- The Pro values in the comparison table
- The "Unlock Pro" button
- Hover/focus states

It never appears as decoration, gradient endpoint, or background fill.
If you find yourself reaching for tally red for "energy," you're using it wrong.

---

## Typography

### The pairing

**Three families, distinct roles:**

| Use | Family | Source | Notes |
|---|---|---|---|
| Display | **Instrument Serif** | Google Fonts | Used in italic, oversized, for hero + section headings. Has an opinionated personality. |
| Body / UI | **Geist** | Vercel font CDN | Modern grotesque with personality. Used for paragraphs, buttons, navigation. |
| Mono | **JetBrains Mono** | Google Fonts | Technical readouts, badges, timecodes, eyebrow labels. Always in caps, tight letter spacing. |

**No system fonts. No Inter. No Roboto.** Those reads as AI-generated.

### Type scale

| Token | Use | Size (desktop) |
|---|---|---|
| `display-xl` | Hero headline | clamp(44px, 7.4vw, 116px) |
| `display-lg` | Section heading | clamp(60px, 8vw, 124px) — used once, in pricing |
| `display-md` | Section heading | clamp(36px, 5.4vw, 78px) |
| `body-lg` | Lede paragraph | clamp(17px, 1.45vw, 21px) |
| `body` | Body | 17px (16 mobile) |
| `body-sm` | Captions / footer | 13–14px |
| `mono` | Eyebrows / badges | 11px, 0.12em letter-spacing, uppercase |

### Italics

Instrument Serif italic is a feature, not a decoration. It carries voice.
**Italicize only:**
- Section headings' "voice moments" (the noun the sentence is *about*)
- The price ($29.99 italic)

### Drop cap

The "What it is" section uses a single drop cap on the first paragraph
(serif, italic, 3.4em, color `--bone`). One drop cap on the page. Not
two. Editorial restraint.

---

## Motion

### Tally pulse
The pulsing red dot is the page's heartbeat. **Never remove it.**

```css
@keyframes tally-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.86); }
}
animation: tally-pulse 1.4s ease-in-out infinite;
```

Used in:
- Top-bar tally pill (subtle)
- Hero tally label
- Recording-screen visualization in the flow section
- Bottom-CTA "STANDBY" indicator

### Hero entrance
Once on initial paint. Five-step staggered rise, 60ms apart, ease-out.
Not on scroll.

### Hover micro-interactions
- Underlines draw left-to-right
- Border colors shift to tally red
- Buttons lift 1px on press

### NOT used
- Parallax scrolling
- Fade-in-on-scroll (every section)
- Background gradient blobs that move
- Scroll-tied 3D
- Any JS animation library

### Reduced motion
`@media (prefers-reduced-motion: reduce)` disables all animation.
The tally dot becomes a steady ring. Hero rises don't stagger.

---

## Spacing

CSS variables for consistency:

| Scale | Value | Use |
|---|---|---|
| `--gutter` | clamp(20px, 4vw, 56px) | Page-edge padding |
| `--max` | 1280px | Max content width |

Section padding: `clamp(80px, 12vh, 160px)` vertical. The page is generous with whitespace; density appears only in the comparison table and stat strip.

Hairline borders are `1px solid var(--steel-2)` on dark, `1px solid #1a1b1e22` on the paper section.

---

## Layout principles

1. **Asymmetric > centered.** Hero is left-weighted with the icon on the right. The two-column "what it is" spread is 1.25fr / 1fr, not 50/50.
2. **One light moment.** The pricing section is the only light-themed block on the page. It functions as a magazine spread interrupting the dark editorial.
3. **Hairline dividers.** Borders, not background fills, separate sections.
4. **Generous negative space.** Not for "minimalism" — for editorial breathing room.
5. **Mono for technical, serif for voice, sans for everything else.** Never mix.

---

## Anti-patterns (the AI-slop alarm bells)

- ⚠️ Purple gradient on white background
- ⚠️ Three-feature card grid with icon + title + description
- ⚠️ "Loved by 10,000 creators" social proof bar
- ⚠️ FAQ accordion at the bottom
- ⚠️ Newsletter signup with "Get our free guide" copy
- ⚠️ Glassmorphism floating cards
- ⚠️ Hero illustration of a person looking at a phone
- ⚠️ Subscribe-to-our-blog CTAs
- ⚠️ Gradient text (especially with rainbow accents)
- ⚠️ "AI-Powered" anywhere in copy
- ⚠️ Centered-everything page structure
- ⚠️ Inter / Roboto / Space Grotesk as the display font

If a design has any of these, it's drifted toward generic. Pull back.

---

## Brand consistency between iOS app and website

| Element | iOS app | Website |
|---|---|---|
| Color | Dark mode default; same tally red accent | Dark mode default; same tally red accent |
| Typography | System font (CFBundleDisplayName: Standby Booth) | Instrument Serif + Geist + JetBrains Mono |
| Voice | Same (calm, technical) | Same |
| Logo / icon | Yes — used on Attract screen + Thank You | Yes — hero icon + favicon + OG image |
| White margins | Critical UX — Recording screen | Not present (but referenced visually in section ornamentation) |

The iOS app uses the system font for accessibility / Dynamic Type
reasons. The website uses the editorial pairing because users on a
website expect designed type. The voice and color stay constant.

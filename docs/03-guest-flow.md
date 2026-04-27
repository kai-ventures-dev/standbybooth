# 03 · Guest flow — the seven screens

The guest experiences seven screens, in order. Some are conditional (Script
Choice only appears if the admin enabled it). The flow is designed so the
guest **never needs instructions** — every screen has one obvious action.

```
1. ATTRACT  →  2. SCRIPT CHOICE*  →  3. GET READY  →  4. COUNTDOWN
                                                          ↓
7. THANK YOU  ←  6. PREVIEW  ←  5. RECORDING  ←──────────┘
                       ↓ (Try Again)
                   back to 3
                       ↓ (Cancel)
                   back to 1
```
*conditional · only shown when admin's "Allow Guest Script" toggle is ON*

---

## Screen 1 · Attract / Idle

**What the guest sees:**
- Full-screen branded display
- Event logo (admin-uploaded, centered)
- Event name (large)
- Pulsing call-to-action text — default: *"Tap to Share Your Story"*
- Optional admin-set background (color or full-bleed image)
- Entire screen is one tap target

**Behavior:**
- Auto-lock disabled. Brightness pegged to max. Guided Access prevents exit.
- Tap anywhere → advance to Screen 2 (if scripts enabled) or Screen 3.
- After idle timeout (15s–120s, default 30s) the screen returns to its initial pulsing state.

**Visual identity:** This is the only screen the host's brand asserts
itself. The rest of the flow is functional.

**Admin controls:**
- Event Name (text)
- Event Logo (image upload — Pro)
- Background image OR background color (image upload is Pro; color picker is free)
- Brand Font (10 options — Pro; system font is free)
- CTA Text (free text — Pro can customize, free uses default)
- Idle Timeout slider

---

## Screen 2 · Script Choice (conditional)

**Only appears when admin "Allow Guest Script" = ON.** Otherwise skip
straight to Screen 3.

**What the guest sees:** three card-style options:

1. **"Just Start Recording"** → Screen 3, no script overlay
2. **"Bring Your Own Script"** → opens Script Entry sub-screen
3. **"Use Guided Prompts"** → Screen 3 with the admin's prompt bank queued
   *(only visible when admin "Enable Prompt Bank" = ON)*

### Script Entry sub-screen

When the guest picks "Bring Your Own Script":
- Large-font text editor (24pt minimum) for direct typing
- AirDrop receiver — visible instructions show this iPad's AirDrop name. Accepts `.txt`, `.rtf`, `.pdf`, Notes shares.
- Paste button (clipboard contents)
- "Ready to Record" button → Screen 3
- The script lives **in memory only**. Never persisted.

**Admin controls:**
- Allow Guest Script (toggle — Pro)
- Script Import Methods (multi-select: Type / AirDrop / Paste)
- Enable Prompt Bank (toggle — Pro)

**Free-tier behavior:** This screen doesn't appear at all. The flow is
Screen 1 → Screen 3.

---

## Screen 3 · Get Ready

**What the guest sees:**
- Live camera preview, **centered at ~70% of screen**, 16:9 aspect ratio, 12pt corner radius
- Surrounding margins: solid white (#FFFFFF) at maximum brightness
- Top margin: subtle instruction text — *"Tap the button when you're ready"*, 18pt gray
- Bottom margin: large red record button (60pt circle), centered

**Behavior:**
- Camera activates when this screen appears.
- Preview is **mirrored** (selfie-style) by default. Final recording is non-mirrored.
- Tap the record button → Screen 4 (Countdown).

**Why white margins:** the iPad becomes a soft fill light. See `01-product.md` § The screen IS the lighting.

**Admin controls:**
- Camera (Front / Rear)
- Mirror Preview toggle (default ON)
- Countdown Length (3 / 5 / 10s — 3s is the only free option; 5s and 10s are Pro)

---

## Screen 4 · Countdown

**What the guest sees:**
- Large animated numbers (3 … 2 … 1 …) overlaid on the live camera preview
- White margins remain active
- Haptic pulse on each tick (UIImpactFeedbackGenerator, .medium)

**Behavior:**
- Recording does **not** start until the countdown reaches zero.
- Camera was already active in Screen 3 — no cold-start delay.
- At zero, smooth transition to Screen 5.

**Admin controls:**
- Countdown Length (3 / 5 / 10s)

---

## Screen 5 · Recording

**The moment of truth.** Four zones on screen:

### Zone 1 · Camera Preview
Centered, ~70% of screen. White margins still active (lighting on).

### Zone 2 · Timer Bar (top-right of preview)
Semi-transparent pill with a circular countdown. Color states:
- **Green** — normal recording
- **Amber** — remaining time ≤ warning threshold. Gentle pulse animation.
- **Red** — remaining time ≤ 5 seconds.

### Zone 3 · Prompt / Script Overlay (bottom third of preview)
Semi-transparent dark background (#000000 @ 60% opacity).

Three modes:

| Source | Behavior |
|---|---|
| **Prompt bank (admin-configured)** | Current prompt fades in/out. Auto-rotate every X seconds OR guest-tap-advance. |
| **Guest script (typed, AirDropped, pasted)** | Teleprompter mode. Text scrolls upward at a speed calculated as `(script length / remaining time)`. Tap to pause/resume. Swipe to manually adjust. If the guest extends time, scroll speed recalculates. |
| **Neither** | Zone hidden entirely. |

### Zone 4 · Extension Button (bottom-right of preview)
Semi-transparent pill, *"+30s"* label.
- Only appears when remaining time ≤ warning threshold AND admin "Allow Time Extension" = ON.
- Each tap: +30 seconds added, timer resets to green, button hides until threshold is crossed again.
- After max extensions used (1–5, default 2): button never reappears.
- Teleprompter scroll speed recalculates on each extension.

**Stop button (top-left, small, unobtrusive):** guest can end early at any time.
**Auto-stop:** when timer reaches zero, smooth transition to Screen 6.

**Admin controls:**
- Recording Duration (10–300s — Pro · free is fixed 60s)
- Allow Time Extension (toggle — Pro)
- Max Extensions (1–5)
- Time Warning Threshold (5–30s, default 10s)
- Video Quality (720p / 1080p / 1080p@60 / 4K — only 720p is free)
- Prompt Bank (Pro · ordered text list)
- Prompt Advance Mode (Auto-Rotate / Guest Tap)
- Prompt Interval (5–60s for auto)
- Prompt Font Size (S / M / L)

---

## Screen 6 · Preview

**What the guest sees:**
- Playback of the recording (with audio) in the same centered preview area
- White margins still active (the playback feels continuous with recording)
- Three buttons below the preview:
  - **"Keep It ✓"** (green, large) — saves to configured storage destination → Screen 7
  - **"Try Again ↺"** (amber, medium) — discards, returns to Screen 3. Only visible if re-records remain.
  - **"Cancel ✗"** (gray, small) — discards, returns to Screen 1
- *"Retakes remaining: X"* counter shown when re-records are limited

**On Keep It:** writes `.mp4` + `.json` sidecar to the storage destination
(Photos / Local / USB-C / Drive).

**On Try Again:** deletes the temp file, decrements re-record counter,
returns to Screen 3.

**Admin controls:**
- Allow Re-Record (toggle, default ON)
- Max Re-Records (1–5, default 3)

---

## Screen 7 · Thank You / Share

**What the guest sees:**
- Event logo
- Admin-configured thank-you message — default: *"Thank you! Your story has been saved."*
- **QR Code** (optional): points to a local HTTP server on the iPad (NWListener). Guest's phone connects over local WiFi and downloads the video directly. **No internet required.**
- **AirDrop button** (optional): sends the video to the guest's phone.
- An auto-reset countdown indicator → returns to Screen 1.

**Admin controls:**
- Show QR Download (toggle — Pro · QR is paid sharing)
- QR Link Expiration (1hr / 24hr / 7 days / Never — Pro)
- Allow AirDrop Export (toggle — free, AirDrop is the free sharing path)
- Thank-You Message (text — Pro · free uses default)
- Auto-Reset Delay (5–60s, default 15s)

---

## Free-tier flow vs Pro-tier flow

| Aspect | Free | Pro |
|---|---|---|
| Screen 2 (Script Choice) | always skipped | shown if Allow Guest Script ON |
| Screen 3 countdown | 3s only | 3 / 5 / 10s |
| Screen 5 length | 60s hard cap | 10–300s |
| Screen 5 quality | 720p | up to 4K |
| Screen 5 prompts | hidden | full prompt bank + teleprompter |
| Screen 5 extensions | none | +30s × up to 5 |
| Screen 7 sharing | AirDrop only | + QR codes |
| Storage destination | Photos library | + Local · USB-C |
| Branding (logo, font, colors) | system font, color picker only | logo, 10 fonts, full custom |

// Admin tab data — pulled from the iOS admin panel screenshots.
window.SB_ADMIN_TABS = [
  {
    id: "event",
    label: "Event Setup",
    img: "assets/admin-event-setup.png",
    eyebrow: "Tab 01 · Event Setup",
    title: "The host's brand, in <em>sixty seconds</em>.",
    body: "Drop in a logo, pick a background, choose a font. The Attract screen instantly reflects the change. The whole admin panel never leaves the iPad.",
    rows: [
      { k: "Event Name", v: "Free text · used in file names" },
      { k: "Event Logo", v: "PNG / JPG upload", pro: true },
      { k: "Background", v: "Color · or full-bleed image", pro: "image" },
      { k: "Brand Font", v: "10 curated families", pro: true },
      { k: "CTA Text", v: "Default · or fully custom", pro: "custom" },
      { k: "Idle Timeout", v: "15s — 120s" }
    ]
  },
  {
    id: "recording",
    label: "Recording",
    img: "assets/admin-recording.png",
    eyebrow: "Tab 02 · Recording",
    title: "The shape of <em>the take.</em>",
    body: "Length, quality, camera, countdown. Mirror preview for selfie comfort, never for the saved file. Noise suppression rolls in for noisy receptions.",
    rows: [
      { k: "Duration", v: "30s · 60s · 90s · up to 5 min", pro: true },
      { k: "Quality", v: "720p · 1080p · 1080p60 · 4K", pro: "above 720p" },
      { k: "Camera", v: "Front / Rear" },
      { k: "Mirror", v: "Selfie-style preview · clean save" },
      { k: "Countdown", v: "3s · 5s · 10s", pro: "5/10s" },
      { k: "Audio", v: "Apple noise suppression", pro: true }
    ]
  },
  {
    id: "prompts",
    label: "Prompts",
    img: "assets/admin-prompts.png",
    eyebrow: "Tab 03 · Prompts & Scripts",
    title: "Give the guest <em>something to say.</em>",
    body: "Drop in a question bank — auto-rotate or guest-tap to advance. Or hand the mic over completely with the teleprompter — guests can type, paste, or AirDrop their own script.",
    rows: [
      { k: "Prompt Bank", v: "Ordered list, drag to reorder", pro: true },
      { k: "Advance", v: "Auto-rotate · Guest tap", pro: true },
      { k: "Interval", v: "5s — 60s", pro: true },
      { k: "Font Size", v: "S · M · L", pro: true },
      { k: "Guest Script", v: "Type · Paste · AirDrop", pro: true },
      { k: "Teleprompter", v: "Speed scales with time left", pro: true }
    ]
  },
  {
    id: "after",
    label: "After Recording",
    img: "assets/admin-after.png",
    eyebrow: "Tab 04 · After Recording",
    title: "What happens <em>after the take.</em>",
    body: "Let guests redo it. Hand the file off via AirDrop or QR. Set a thank-you that matches the brand. Then auto-reset for the next person in line.",
    rows: [
      { k: "Re-Record", v: "Up to 5 retakes" },
      { k: "QR Download", v: "Local server · no internet", pro: true },
      { k: "AirDrop", v: "Always free · the casual path" },
      { k: "Thank-You", v: "Default · or fully custom", pro: "custom" },
      { k: "Auto-Reset", v: "5s — 60s" }
    ]
  },
  {
    id: "storage",
    label: "Storage",
    img: "assets/admin-storage.png",
    eyebrow: "Tab 05 · Storage",
    title: "Your file. <em>Your folder.</em>",
    body: "Photos library on free. Local files or USB-C drive on Pro. File-naming tokens — {EventName}, {Date}, {Sequence} — keep the folder readable a year later.",
    rows: [
      { k: "Destination", v: "Photos · Local · USB-C", pro: "Local + USB-C" },
      { k: "Naming", v: "{EventName}_{Date}_{Sequence}", pro: "custom" },
      { k: "Sidecar", v: "JSON metadata per .mp4", pro: true },
      { k: "Capacity", v: "Live free-space readout" },
      { k: "Sync", v: "Zero. Nothing leaves the device." }
    ]
  }
];

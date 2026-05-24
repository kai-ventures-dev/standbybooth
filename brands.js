// 6 sample event brands. Each shows the same Attract screen template
// (logo · event name · cue) with a different brand world.
window.SB_BRANDS = [
  {
    id: "smith-wedding",
    kind: "Wedding · Pro",
    eventName: "Mara & Ines",
    cta: "Leave the newlyweds a note",
    bg: "#F4ECE0",
    fg: "#2A1F18",
    accent: "#9C6B3F",
    font: "'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
    weight: 500,
    nameStyle: { fontStyle: "italic", letterSpacing: "-0.01em" },
    logo: { kind: "monogram", text: "M&I", ring: true }
  },
  {
    id: "vellichor-conf",
    kind: "Brand activation · Pro",
    eventName: "VELLICHOR / 26",
    cta: "Tell us what you're building",
    bg: "#0E0F11",
    fg: "#E8E4DA",
    accent: "#E8503A",
    font: "'JetBrains Mono', ui-monospace, Menlo, monospace",
    weight: 600,
    dark: true,
    nameStyle: { letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.78em" },
    logo: { kind: "mark", text: "▍V", mono: true }
  },
  {
    id: "harlow-bday",
    kind: "Birthday · Free",
    eventName: "Harlow turns 30",
    cta: "Tap to share your story",
    bg: "#FBE9D7",
    fg: "#2C140B",
    accent: "#D9572B",
    font: "'Geist', -apple-system, sans-serif",
    weight: 700,
    nameStyle: { letterSpacing: "-0.02em" },
    logo: { kind: "icon" }
  },
  {
    id: "northwind-onsite",
    kind: "Corporate offsite · Pro",
    eventName: "Northwind All-Hands",
    cta: "Record your 30-second wrap",
    bg: "#0F1A24",
    fg: "#E6EEF5",
    accent: "#5DA9E0",
    font: "'Geist', -apple-system, sans-serif",
    weight: 600,
    dark: true,
    nameStyle: { letterSpacing: "-0.01em" },
    logo: { kind: "wordmark", text: "NW" }
  },
  {
    id: "fern-baby",
    kind: "Baby shower · Pro",
    eventName: "Welcome, Baby Fern",
    cta: "Send Fern a wish for the future",
    bg: "#E8EFE3",
    fg: "#1F2A1A",
    accent: "#5C7C3D",
    font: "'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
    weight: 500,
    nameStyle: { fontStyle: "italic", letterSpacing: "-0.01em" },
    logo: { kind: "leaf" }
  },
  {
    id: "atelier-popup",
    kind: "Pop-up retail · Pro",
    eventName: "ATELIER 14 — Soho Pop-Up",
    cta: "Show us your fit",
    bg: "#F0EFEC",
    fg: "#111111",
    accent: "#111111",
    font: "'Geist', sans-serif",
    weight: 700,
    nameStyle: { letterSpacing: "-0.01em", fontSize: "0.85em", textTransform: "uppercase" },
    logo: { kind: "circle", text: "A14" }
  }
];

// AttractScreen — renders a single Attract screen for a given brand.
// Reused by Cover (cycling), Gallery (each case study), and any other place
// the design wants to show "what an Attract looks like for this brand."
const AttractScreen = ({ brand, animateKey }) => {
  const isDark = !!brand.dark;
  return (
    <div
      className={"attract " + (isDark ? "dark " : "") + (animateKey ? "attract-fade" : "")}
      key={animateKey || brand.id}
      style={{
        background: brand.bg,
        color: brand.fg,
        fontFamily: brand.font
      }}
    >
      <BrandLogo brand={brand} />

      <p
        className="attract-name"
        style={{
          fontWeight: brand.weight,
          ...brand.nameStyle
        }}
      >
        {brand.eventName}
      </p>

      <p
        className="attract-cta"
        style={{
          color: brand.fg,
          opacity: 0.7,
          fontFamily: brand.font,
          fontWeight: 400
        }}
      >
        {brand.cta}
      </p>
    </div>
  );
};

const BrandLogo = ({ brand }) => {
  const { logo, accent, dark } = brand;
  const lightBg = !dark;
  const ring = lightBg ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";

  if (logo.kind === "icon") {
    return (
      <div className="attract-logo" style={{ background: "transparent" }}>
        <img src="assets/icon-1024.png" alt="" />
      </div>
    );
  }

  const baseStyle = {
    background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${ring}`,
    color: accent,
    fontFamily: brand.font,
    fontWeight: 700,
    fontSize: "44%",
    letterSpacing: "-0.01em",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  if (logo.kind === "monogram") {
    return (
      <div className="attract-logo" style={{ ...baseStyle, borderRadius: "50%", borderWidth: 1.5, fontStyle: "italic", fontFamily: "'Cormorant Garamond', 'Instrument Serif', serif", fontSize: "38%" }}>
        {logo.text}
      </div>
    );
  }
  if (logo.kind === "mark") {
    return (
      <div className="attract-logo" style={{ ...baseStyle, borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: "36%", letterSpacing: "0.05em" }}>
        {logo.text}
      </div>
    );
  }
  if (logo.kind === "wordmark") {
    return (
      <div className="attract-logo" style={{ ...baseStyle, borderRadius: "22%", fontSize: "40%", color: accent }}>
        {logo.text}
      </div>
    );
  }
  if (logo.kind === "circle") {
    return (
      <div className="attract-logo" style={{ ...baseStyle, borderRadius: "50%", borderWidth: 1, fontSize: "30%", letterSpacing: "0.02em" }}>
        {logo.text}
      </div>
    );
  }
  if (logo.kind === "leaf") {
    return (
      <div className="attract-logo" style={{ ...baseStyle, borderRadius: "50%", color: accent }}>
        <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19c5-1 11-4 14-13C13 7 7 11 6 17"/>
          <path d="M5 19c1-3 3-6 7-9"/>
        </svg>
      </div>
    );
  }
  return null;
};

window.AttractScreen = AttractScreen;
window.BrandLogo = BrandLogo;

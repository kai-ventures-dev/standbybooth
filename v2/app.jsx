// Standby Booth — Field Guide (v2 Catalog)
// Light editorial magazine. The same Attract screen, six brand worlds.
const { useState, useEffect } = React;

const BRANDS = window.SB_BRANDS;
const ADMIN_TABS = window.SB_ADMIN_TABS;

// Tiny safe parser for the only HTML our data uses: <em>...</em>.
// Avoids dangerouslySetInnerHTML — admin-data.js is static, but parsing
// keeps us safe if anyone ever pipes user content through this path.
const renderEm = (str) => {
  const parts = str.split(/(<em>[^<]*<\/em>)/g);
  return parts.map((p, i) => {
    const m = p.match(/^<em>([^<]*)<\/em>$/);
    return m ? <em key={i}>{m[1]}</em> : <React.Fragment key={i}>{p}</React.Fragment>;
  });
};

const App = () => (
  <React.Fragment>
    <Masthead />
    <Cover />
    <Ticker />
    <TOC />
    <Feature />
    <Gallery />
    <Admin />
    <Flow />
    <Price />
    <SignOff />
    <Colophon />
  </React.Fragment>
);

const Masthead = () => (
  <header className="masthead">
    <div className="mast-rule"></div>
    <div className="mast-inner">
      <span className="mast-issue">Vol. 01 · Issue 03 · Spring 2026</span>
      <span className="mast-title">Standby Booth</span>
      <a className="mast-cta" href="#access">Request access →</a>
    </div>
    <div className="mast-rule" style={{height: 1}}></div>
  </header>
);

const Cover = () => {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover) return;
    const t = setInterval(() => setI(x => (x + 1) % BRANDS.length), 3600);
    return () => clearInterval(t);
  }, [hover]);
  const brand = BRANDS[i];
  return (
    <section className="cover">
      <div className="cover-grid">
        <div>
          <p className="cover-eyebrow mono">
            <span>The Field Guide</span>
            <span className="rule"></span>
            <span>№ 01</span>
          </p>
          <h1 className="display cover-h1">An iPad,<br/>your <em>booth.</em></h1>
          <p className="cover-deck">
            A self-service video booth for events. Configure once, walk away,
            come back to a folder full of clips. No backend. No cloud. No staff.
          </p>
          <div className="cover-cta-row">
            <a className="btn btn-primary" href="#access">Request TestFlight</a>
            <a className="btn btn-ghost" href="#cases">See sample events</a>
          </div>
          <div className="cover-meta">
            <span>iPadOS 17+</span>
            <span>$29.99 one-time</span>
            <span>No subscription</span>
          </div>
          <div className="brand-rail" role="tablist">
            {BRANDS.map((b, idx) => (
              <button key={b.id} className={"brand-chip" + (idx === i ? " active" : "")} onClick={() => setI(idx)}>
                <span className="brand-chip-swatch" style={{ background: b.bg }}></span>
                {b.eventName.length > 18 ? b.eventName.slice(0, 16) + "…" : b.eventName}
              </button>
            ))}
          </div>
        </div>
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div className="cover-stage">
            <div className="ipad">
              <div className="ipad-screen">
                <AttractScreen brand={brand} animateKey={brand.id} />
              </div>
            </div>
          </div>
          <p className="cover-caption">
            <span className="num">{String(i+1).padStart(2,"0")}</span>
            <span>Plate {String(i+1).padStart(2,"0")}/{String(BRANDS.length).padStart(2,"0")} · {brand.kind}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const Ticker = () => {
  const items = [
    "ON AIR · STANDBY BOOTH",
    "TESTFLIGHT BETA · BUILD 03",
    "ZERO BACKEND",
    "ZERO TELEMETRY",
    "ZERO SUBSCRIPTION",
    "FILES STAY ON DEVICE",
    "AIRDROP · QR · USB-C",
    "iPadOS 17+",
  ];
  const all = [...items, ...items];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {all.map((t, i) => <span key={i}><span className="ticker-dot"></span>{t}</span>)}
      </div>
    </div>
  );
};

const TOC = () => (
  <section className="toc">
    <div className="toc-head">
      <h2 className="display">Inside this <em>guide.</em></h2>
      <p>A short tour of what Standby Booth is, who it's for, and how the host's iPad becomes a self-running video kiosk for an evening or a weekend.</p>
    </div>
    <ul className="toc-list">
      {[
        ["I",   "The Premise",   "What an unattended booth feels like.", "Editorial · pp. 04–05"],
        ["II",  "Six Events",    "The same template, six brand worlds.", "Plates · pp. 06–11"],
        ["III", "The Panel",     "Five tabs; every dial the host needs.", "Reference · pp. 12–18"],
        ["IV",  "The Flow",      "Seven screens guests never get lost in.", "Diagram · p. 19"],
        ["V",   "The Price",     "$29.99. Once. Free vs Pro.",            "Schedule · p. 20"],
      ].map(([n, name, desc, tag], i) => (
        <li key={i}>
          <span className="toc-num">{n}</span>
          <span className="toc-name">{name}</span>
          <span className="toc-desc">{desc}</span>
          <span className="toc-tag">{tag}</span>
        </li>
      ))}
    </ul>
  </section>
);

const Feature = () => (
  <section className="feature">
    <p className="feature-no">I · The premise</p>
    <h2 className="display feature-hd">A booth that <em>doesn't need a person.</em></h2>
    <div className="feature-cols">
      <p>Standby Booth runs entirely on the iPad. There is no backend, no cloud we operate, no telemetry. Storage is the host's iPad, their USB-C drive, their Photos library — never a server we own.</p>
      <p>The host configures the event once: branding, prompts, recording length, storage destination. Then the device is locked into kiosk mode and left to run. The Attract screen pulses, waiting.</p>
      <p>The guest walks up. They tap once. They see themselves on the screen, framed by white margins that turn the iPad into a soft fill light. They speak for thirty seconds, hit "Keep It," and walk away.</p>
      <p>The host comes back at midnight, taps a hidden corner three times, enters a four-digit PIN, and pulls the folder of clips off the device. There is nothing else to do. There never was.</p>
    </div>
  </section>
);

const Gallery = () => (
  <section className="gallery" id="cases">
    <p className="feature-no">II · Six events</p>
    <h2 className="display gallery-hd">The same screen. <em>Six brand worlds.</em></h2>
    <p className="gallery-deck">Every Standby Booth event begins on the same template — logo, name, cue. The format is fixed; the typography, color, and copy are the host's. Six examples, on the next pages.</p>
    {BRANDS.map((b, i) => (
      <article className="case" key={b.id}>
        <div className="case-text">
          <p className="case-num">Plate {String(i+1).padStart(2,"0")} · {b.kind}</p>
          <h3 className="display case-name">{b.eventName.split(" ").length > 2 ? <>{b.eventName.split(" ").slice(0,-1).join(" ")} <em>{b.eventName.split(" ").slice(-1)}</em></> : <em>{b.eventName}</em>}</h3>
          <p className="case-pull">"{b.cta}."</p>
          <div className="case-tokens">
            <span className="token"><span className="swatch" style={{background:b.bg}}></span>BG {b.bg}</span>
            <span className="token"><span className="swatch" style={{background:b.fg}}></span>FG {b.fg}</span>
            <span className="token"><span className="swatch" style={{background:b.accent}}></span>Accent</span>
            <span className="token">Type · {b.font.includes("Cormorant") ? "Cormorant" : b.font.includes("JetBrains") ? "Mono" : b.font.includes("Geist") ? "Geist" : "System"}</span>
          </div>
        </div>
        <div className="case-screen">
          <div className="case-screen-inner">
            <AttractScreen brand={b} />
          </div>
        </div>
      </article>
    ))}
  </section>
);

const Admin = () => {
  const [i, setI] = useState(0);
  const t = ADMIN_TABS[i];
  return (
    <section className="admin">
      <p className="feature-no">III · The panel</p>
      <h2 className="display admin-hd">Five tabs. <em>Every dial.</em></h2>
      <p className="admin-deck">Hidden behind a triple-tap and a four-digit PIN. Every guest-facing feature is a host-facing toggle.</p>
      <div className="admin-tabs">
        {ADMIN_TABS.map((tab, idx) => (
          <button key={tab.id} className={"admin-tab" + (idx === i ? " active" : "")} onClick={() => setI(idx)}>
            {String(idx + 1).padStart(2, "0")} · {tab.label}
          </button>
        ))}
      </div>
      <div className="admin-stage" key={t.id}>
        <div className="admin-shot">
          <span className="admin-shot-num">Fig. {String(i + 1).padStart(2, "0")}</span>
          <img src={t.img} alt={t.label} />
        </div>
        <div>
          <p className="admin-eb">{t.eyebrow}</p>
          <h3 className="admin-title">{renderEm(t.title)}</h3>
          <p className="admin-body">{t.body}</p>
          <ul className="admin-rows">
            {t.rows.map((r, idx) => (
              <li key={idx}>
                <span className="k">{r.k}</span>
                <span className="v">
                  {r.v}
                  {r.pro === true && <span className="pro">Pro</span>}
                  {typeof r.pro === "string" && <span className="pro">Pro · {r.pro}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Flow = () => (
  <section className="flow">
    <p className="feature-no">IV · The flow</p>
    <h2 className="display flow-hd">Seven screens. <em>One path.</em></h2>
    <p className="flow-deck">Designed so the guest never needs instructions, and the host never needs to intervene.</p>
    <ol className="flow-grid" role="list">
      {[
        {n:"01", name:"Attract", art:<span className="flow-name">Tap to share your story</span>},
        {n:"02", name:"Script choice", art:<><span className="flow-pill">Use a prompt</span><span className="flow-mini">— or —</span><span className="flow-pill">Speak freely</span></>},
        {n:"03", name:"Get ready", art:<><span className="flow-target"></span><span className="flow-mini">Tap when ready</span></>},
        {n:"04", name:"Countdown", art:<span className="flow-count">3</span>},
        {n:"05", name:"Recording", art:<><span className="flow-rec-dot"></span><span className="flow-rec-tc">REC 00:42</span></>, rec:true},
        {n:"06", name:"Preview", art:<span className="flow-mini">Keep · Retry · Cancel</span>},
        {n:"07", name:"Thank you", art:<span className="flow-mini">Thank you.</span>},
      ].map(s => (
        <li className="flow-cell" key={s.n}>
          <span className="flow-num">{s.n}</span>
          <div className={"flow-art" + (s.rec ? " flow-rec" : "")} style={{position:"relative"}}>{s.art}</div>
          <span className="flow-num">{s.name}</span>
        </li>
      ))}
    </ol>
  </section>
);

const Price = () => (
  <section className="price">
    <p className="price-eb">V · The schedule</p>
    <h1 className="price-h"><em>$29.99.</em></h1>
    <p className="price-deck">Once. Yours forever. Free covers the basics; Pro covers the events you charge for.</p>
    <div className="price-table">
      <div className="price-row head">
        <span className="col-h">Feature</span>
        <span className="col-h">Free</span>
        <span className="col-h pro">Pro</span>
      </div>
      {[
        ["Recording length", "60s", "Up to 5 min"],
        ["Video quality", "720p", "Up to 4K"],
        ["Custom branding", "—", "Logo, fonts, colors"],
        ["Storage", "Photos library", "+ Local · USB-C"],
        ["Sharing", "AirDrop", "+ QR codes"],
        ["Prompts & scripts", "—", "Full teleprompter"],
        ["Time extensions", "—", "+30s × 5"],
        ["Presets", "—", "Save / load / share"],
      ].map(([l,f,p],i)=>(
        <div className="price-row" key={i}>
          <span className="label">{l}</span>
          <span className="free">{f}</span>
          <span className="pro">{p}</span>
        </div>
      ))}
    </div>
  </section>
);

const SignOff = () => {
  const [copied, setCopied] = useState(false);
  const email = "markintheloop@kaiventures.tech";
  return (
    <section className="signoff" id="access">
      <h2 className="signoff-h">Join the <em>TestFlight</em> beta.</h2>
      <p className="signoff-p">We'll send the invite when build 3 ships. We read every reply.</p>
      <div className="signoff-cta">
        <a className="btn btn-primary" href={"mailto:" + email + "?subject=Standby%20Booth%20TestFlight%20beta"}>Email us</a>
        <button className="btn btn-ghost" onClick={async () => {
          try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(()=>setCopied(false), 1800); } catch(e){}
        }}>{copied ? "Copied ✓" : "Copy address"}</button>
      </div>
      <p style={{marginTop:24, fontFamily:"var(--mono)", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--ink-2)"}}>{email}</p>
    </section>
  );
};

const Colophon = () => (
  <footer className="colophon">
    <div className="colophon-inner">
      <span style={{fontFamily:"var(--serif)", fontStyle:"italic", fontSize:18}}>Standby Booth</span>
      <p className="colophon-meta">
        <span>© 2026 Kai Ventures</span>
        <span>·</span>
        <span>Made on a Mac, with care.</span>
      </p>
      <ul className="colophon-links">
        <li><a href="https://standbybooth.app/privacy">Privacy</a></li>
        <li><a href="https://standbybooth.app/terms">Terms</a></li>
      </ul>
    </div>
  </footer>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

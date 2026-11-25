/* BFCM 2026 promo. Inert after 2026-12-07T04:00Z; safe to remove with its script tag. */
(function () {
  "use strict";

  const APP_URL = "https://apps.apple.com/us/app/standby-booth/id6761357439";
  const BEFORE_BF = Date.parse("2026-11-27T04:00:00Z");
  const BEFORE_CM = Date.parse("2026-11-29T04:00:00Z");
  const AFTER_CM = Date.parse("2026-12-07T04:00:00Z");
  const BF = Object.freeze({
    name: "Black Friday", price: "$8.99", saving: "70% off",
    deadline: "Sat Nov 28, 8 PM PT"
  });
  const CM = Object.freeze({
    name: "Cyber Monday", price: "$14.99", saving: "50% off",
    deadline: "Sun Dec 6, 8 PM PT"
  });

  function selectPromo(now) {
    if (!Number.isFinite(now) || now < BEFORE_BF || now >= AFTER_CM) return null;
    return now < BEFORE_CM ? BF : CM;
  }

  // A clock value is injectable in the pure test only. Browser input cannot alter the schedule.
  if (typeof module === "object" && module.exports) {
    module.exports = { selectPromo };
    return;
  }

  function start() {
    if (Date.now() >= AFTER_CM) return;

    const header = document.querySelector("header.masthead");
    const hero = [...document.querySelectorAll(".cover-meta span")]
      .find(el => el.textContent.trim() === "Free · Pro $29.99 once");
    const pro = [...document.querySelectorAll("#pricing .price-row .p-v")]
      .find(el => el.textContent.trim() === "$29.99 once");
    if (!header || !hero || !pro || !document.querySelector('a[href="' + APP_URL + '"]')) return;

    let active;
    let reset;
    let timer;

    function make(tag, text, className) {
      const element = document.createElement(tag);
      if (text) element.textContent = text;
      if (className) element.className = className;
      return element;
    }

    function mount(promo) {
      const notice = make("aside", "", "sb-seasonal-promo");
      notice.setAttribute("aria-label", promo.name + " offer");
      const copy = make("p");
      copy.append(make("strong", promo.name + ": Standby Booth Pro is " + promo.price + " (" + promo.saving + ")"), " on the U.S. App Store until " + promo.deadline + ". One payment, no subscription.");
      const storefront = make("span", "Prices and availability vary by App Store storefront.", "sb-seasonal-storefront");
      copy.append(" ", storefront);
      const cta = make("a", "Get it on the App Store");
      cta.href = APP_URL;
      notice.append(copy, cta);

      const style = make("style");
      style.textContent = [
        ".sb-seasonal-promo{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.5rem 1.25rem;padding:.75rem clamp(1rem,4vw,2rem);border-bottom:1px solid var(--ink);color:var(--paper);background:var(--ink);font:400 .93rem/1.5 var(--sans);text-align:center}",
        ".sb-seasonal-promo p{margin:0;max-width:65ch}.sb-seasonal-promo .sb-seasonal-storefront{font-size:.86em}",
        ".sb-seasonal-promo a{color:inherit;text-decoration:underline;text-underline-offset:.18em;font-weight:700;padding:.2rem 0}",
        ".sb-seasonal-promo a:focus-visible{outline:2px solid currentColor;outline-offset:.25rem}",
        ".sb-seasonal-old{opacity:.73;font-size:.72em;white-space:nowrap}.sb-seasonal-terms{font:400 .875rem/1.4 var(--sans);color:var(--ink-2);margin:0 0 .7rem}",
        "@media(max-width:550px){.sb-seasonal-promo{gap:.2rem;padding:.65rem 1rem}.sb-seasonal-promo a{padding:.35rem 0}}"
      ].join("\n");

      const terms = make("p", promo.name + " U.S. App Store offer until " + promo.deadline + ". Prices vary by storefront.", "sb-seasonal-terms");
      const heroWas = Array.from(hero.childNodes);
      const proWas = Array.from(pro.childNodes);
      const oldHero = make("del", "$29.99", "sb-seasonal-old");
      oldHero.setAttribute("aria-label", "Regular U.S. price $29.99");
      const oldPro = oldHero.cloneNode(true);
      const regularLabels = [
        [".cover-define", "costs a one-time $29.99", "normally costs a one-time $29.99"],
        [".hooks .h-d", "Pro is one $29.99 purchase.", "Pro is normally one $29.99 purchase."],
        [".sec-note", "($29.99 once)", "(regular U.S. price $29.99 once)"],
        ["#pricing .sec-deck", "Pro is a one-time $29.99 purchase.", "The regular U.S. price for Pro is $29.99 once."],
        ["#pricing .tiers thead th", "Pro · $29.99 once", "Pro · regular U.S. price $29.99 once"],
        ["#compare .compare td", "Free; Pro $29.99 once", "Free; regular U.S. Pro price $29.99 once"]
      ];
      const originals = [];
      for (const [selector, old, replacement] of regularLabels) {
        for (const el of document.querySelectorAll(selector)) {
          for (const node of el.childNodes) {
            if (node.nodeType !== 3 || !node.data.includes(old)) continue;
            originals.push([node, node.data]);
            node.data = node.data.replace(old, replacement);
          }
        }
      }
      const faq = document.querySelector("#faq h2");
      const faqNote = faq ? make("p", "The FAQ lists the regular U.S. price. See the pricing section for the current offer.", "sb-seasonal-terms") : null;
      document.head.append(style);
      document.body.prepend(notice);
      hero.replaceChildren("Free · U.S. Pro ", oldHero, " ", make("strong", promo.price), " once");
      pro.replaceChildren(oldPro, " ", make("em", promo.price), " once");
      pro.after(terms);
      if (faqNote) faq.after(faqNote);
      return function restore() {
        hero.replaceChildren(...heroWas);
        pro.replaceChildren(...proWas);
        originals.forEach(([node, data]) => { node.data = data; });
        [notice, terms, style, faqNote].forEach(el => { if (el) el.remove(); });
      };
    }

    function update() {
      window.clearTimeout(timer);
      const now = Date.now();
      const next = selectPromo(now);
      if (next !== active) {
        if (reset) reset();
        reset = next ? mount(next) : null;
        active = next;
      }
      const boundary = [BEFORE_BF, BEFORE_CM, AFTER_CM].find(value => value > now);
      if (boundary) {
        // Clamp to setTimeout's signed 32-bit maximum for visitors opening well in advance.
        timer = window.setTimeout(update, Math.min(boundary - now, 2147483647));
      } else {
        document.removeEventListener("visibilitychange", update);
        window.removeEventListener("pageshow", update);
      }
    }

    document.addEventListener("visibilitychange", update);
    window.addEventListener("pageshow", update);
    update();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
